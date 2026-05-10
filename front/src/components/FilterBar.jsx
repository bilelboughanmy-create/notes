const FILTERS = [
  { value: 'all',     label: 'Toutes'    },
  { value: 'haute',   label: '🔴 Haute'  },
  { value: 'moyenne', label: '🟠 Moyenne'},
  { value: 'basse',   label: '🟢 Basse'  },
]

export default function FilterBar({ filter, onFilterChange, search, onSearchChange }) {
  return (
    <div className="flex flex-col sm:flex-row gap-3 mb-6">
      <input
        type="text"
        value={search}
        onChange={e => onSearchChange(e.target.value)}
        placeholder="Rechercher une note…"
        className="input-field flex-1"
      />
      <div className="flex gap-1.5">
        {FILTERS.map(f => (
          <button
            key={f.value}
            onClick={() => onFilterChange(f.value)}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors
              ${filter === f.value
                ? 'bg-gray-900 text-white'
                : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-100'
              }`}
          >
            {f.label}
          </button>
        ))}
      </div>
    </div>
  )
}
