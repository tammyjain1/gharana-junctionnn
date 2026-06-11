import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const anonKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const authHeader = req.headers.get('Authorization') ?? '';

    const userClient = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: authHeader } },
    });
    const adminClient = createClient(supabaseUrl, serviceRoleKey);

    const { data: authData, error: authError } = await userClient.auth.getUser();
    if (authError || !authData.user) throw new Error('Unauthorized');

    const { data: ownerProfile, error: ownerError } = await adminClient
      .from('profiles')
      .select('role')
      .eq('id', authData.user.id)
      .single();

    if (ownerError || ownerProfile?.role !== 'owner') throw new Error('Only owners can manage staff');

    const body = await req.json();

    if (body.action === 'create') {
      const { email, password, full_name, role = 'staff' } = body;
      if (!email || !password || !full_name) throw new Error('Email, password and full name are required');

      const { data, error } = await adminClient.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: { full_name, role },
      });
      if (error) throw error;

      const { error: profileError } = await adminClient.from('profiles').upsert({
        id: data.user.id,
        email,
        full_name,
        role,
      });
      if (profileError) throw profileError;

      return Response.json({ user: data.user }, { headers: corsHeaders });
    }

    if (body.action === 'update') {
      const { id, full_name, role = 'staff', password } = body;
      if (!id || !full_name) throw new Error('User ID and full name are required');

      const authUpdates: Record<string, unknown> = {
        user_metadata: { full_name, role },
      };
      if (password) authUpdates.password = password;

      const { error: userError } = await adminClient.auth.admin.updateUserById(id, authUpdates);
      if (userError) throw userError;

      const { data, error } = await adminClient
        .from('profiles')
        .update({ full_name, role })
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;

      return Response.json({ profile: data }, { headers: corsHeaders });
    }

    if (body.action === 'delete') {
      const { id } = body;
      if (!id) throw new Error('User ID is required');
      if (id === authData.user.id) throw new Error('Owner cannot delete their own account');

      const { error } = await adminClient.auth.admin.deleteUser(id);
      if (error) throw error;

      return Response.json({ success: true }, { headers: corsHeaders });
    }

    throw new Error('Unsupported action');
  } catch (error) {
    return Response.json({ error: error.message }, { status: 400, headers: corsHeaders });
  }
});
