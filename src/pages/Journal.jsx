import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { format, parseISO } from 'date-fns'
import { useEntries } from '../hooks/useEntries'

const TYPE_LABELS = {
  observation: 'Observation',
  burn:        'Burn',
  survey:      'Survey',
  meeting:     'Meeting',
  note:        'Note',
}

const AUTHOR_LABELS = {
  karl:  'Karl',
  emily: 'Emily',
}

function TypeBadge({ type }) {
  return (
    <span className={`tag tag-type-${type}`}>
      {TYPE_LABELS[type] ?? type}
    </span>
  )
}

function EntryCard({ entry }) {
  const dateStr = entry.date
    ? format(parseISO(entry.date), 'MMM d, yyyy')
    : '—'

  return (
    <Link
      to={`/journal/${entry.id}`}
      className="group block rounded-lg border border-bark-200 bg-white p-5 shadow-sm hover:border-pine-400 hover:shadow-md transition-all"
    >
      <div className="flex flex-wrap items-center gap-2 mb-2">
        <TypeBadge type={entry.type} />
        {entry.tags?.slice(0, 3).map((t) => (
          <span key={t} className="tag">{t}</span>
        ))}
        {entry.tags?.length > 3 && (
          <span className="text-xs text-bark-400 font-sans">+{entry.tags.length - 3} more</span>
        )}
      </div>
      <h2 className="font-serif text-lg font-semibold text-pine-800 group-hover:text-pine-600 leading-snug mb-1">
        {entry.title}
      </h2>
      <div className="flex items-center gap-3 text-sm text-bark-500 font-sans">
        <span>{dateStr}</span>
        <span>&bull;</span>
        <span>{AUTHOR_LABELS[entry.author] ?? entry.author}</span>
        {entry.location?.name && (
          <>
            <span>&bull;</span>
            <span className="truncate">{entry.location.name}</span>
          </>
        )}
      </div>
      {entry.body && (
        <p className="mt-2 text-sm text-bark-600 font-sans leading-relaxed line-clamp-2">
          {entry.body.replace(/#+\s*/g, '').replace(/\*+/g, '').slice(0, 200)}
        </p>
      )}
    </Link>
  )
}

export default function Journal() {
  const [filters, setFilters] = useState({
    author:   '',
    type:     '',
    tag:      '',
    dateFrom: '',
    dateTo:   '',
    search:   '',
  })

  const entries = useEntries({
    author:   filters.author   || undefined,
    type:     filters.type     || undefined,
    tag:      filters.tag      || undefined,
    dateFrom: filters.dateFrom || undefined,
    dateTo:   filters.dateTo   || undefined,
    search:   filters.search   || undefined,
  })

  function set(key) {
    return (e) => setFilters((f) => ({ ...f, [key]: e.target.value }))
  }

  function clearFilters() {
    setFilters({ author: '', type: '', tag: '', dateFrom: '', dateTo: '', search: '' })
  }

  const hasFilters = Object.values(filters).some(Boolean)

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="font-serif text-2xl sm:text-3xl font-semibold text-pine-900 mb-1">
          Field Journal
        </h1>
        <p className="text-bark-500 font-sans text-sm">{entries.length} {entries.length === 1 ? 'entry' : 'entries'}</p>
      </div>

      {/* Filters */}
      <div className="bg-bark-50 border border-bark-200 rounded-lg p-4 mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <input
          type="search"
          placeholder="Search…"
          value={filters.search}
          onChange={set('search')}
          className="col-span-full sm:col-span-2 lg:col-span-1 rounded border border-bark-300 px-3 py-1.5 text-sm font-sans bg-white focus:outline-none focus:ring-1 focus:ring-pine-500"
        />
        <select
          value={filters.author}
          onChange={set('author')}
          className="rounded border border-bark-300 px-3 py-1.5 text-sm font-sans bg-white focus:outline-none focus:ring-1 focus:ring-pine-500"
        >
          <option value="">All authors</option>
          <option value="karl">Karl</option>
          <option value="emily">Emily</option>
        </select>
        <select
          value={filters.type}
          onChange={set('type')}
          className="rounded border border-bark-300 px-3 py-1.5 text-sm font-sans bg-white focus:outline-none focus:ring-1 focus:ring-pine-500"
        >
          <option value="">All types</option>
          {Object.entries(TYPE_LABELS).map(([v, l]) => (
            <option key={v} value={v}>{l}</option>
          ))}
        </select>
        <input
          type="date"
          value={filters.dateFrom}
          onChange={set('dateFrom')}
          className="rounded border border-bark-300 px-3 py-1.5 text-sm font-sans bg-white focus:outline-none focus:ring-1 focus:ring-pine-500"
          title="From date"
        />
        <input
          type="date"
          value={filters.dateTo}
          onChange={set('dateTo')}
          className="rounded border border-bark-300 px-3 py-1.5 text-sm font-sans bg-white focus:outline-none focus:ring-1 focus:ring-pine-500"
          title="To date"
        />
        {hasFilters && (
          <button
            onClick={clearFilters}
            className="text-sm font-sans text-pine-600 hover:text-pine-800 underline self-center"
          >
            Clear filters
          </button>
        )}
      </div>

      {/* Entry list */}
      {entries.length === 0 ? (
        <p className="text-bark-500 font-sans text-sm py-8 text-center">
          No entries match the current filters.
        </p>
      ) : (
        <div className="flex flex-col gap-4">
          {entries.map((entry) => (
            <EntryCard key={entry.id} entry={entry} />
          ))}
        </div>
      )}
    </div>
  )
}
