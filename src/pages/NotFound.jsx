import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-6 dark:bg-slate-950">
      <div className="card max-w-md p-6 text-center">
        <h1 className="text-2xl font-bold text-slate-950 dark:text-white">Page not found</h1>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">The page you opened does not exist.</p>
        <Link className="btn-primary mt-5" to="/">
          Back to dashboard
        </Link>
      </div>
    </div>
  );
}
