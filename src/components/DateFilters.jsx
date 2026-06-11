export default function DateFilters({ filters, setFilters }) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-[1fr_1fr_auto]">
      <label className="space-y-1">
        <span className="label">From</span>
        <input
          className="input"
          type="date"
          value={filters.from}
          onChange={(event) => setFilters((current) => ({ ...current, from: event.target.value }))}
        />
      </label>
      <label className="space-y-1">
        <span className="label">To</span>
        <input
          className="input"
          type="date"
          value={filters.to}
          onChange={(event) => setFilters((current) => ({ ...current, to: event.target.value }))}
        />
      </label>
      <button className="btn-secondary self-end" type="button" onClick={() => setFilters({ from: '', to: '' })}>
        Clear
      </button>
    </div>
  );
}
