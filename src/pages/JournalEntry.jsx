import { useParams, Link } from 'react-router-dom'
import { format, parseISO } from 'date-fns'
import ReactMarkdown from 'react-markdown'
import { getEntryById } from '../utils/parseEntries'

const TYPE_LABELS = {
  observation: 'Observation',
  burn:        'Burn',
  survey:      'Survey',
  meeting:     'Meeting',
  note:        'Note',
}

const AUTHOR_LABELS = {
  karl:  'Karl Dykema',
  emily: 'Emily Guyot',
}

export default function JournalEntry() {
  const { id } = useParams()
  const entry = getEntryById(id)

  if (!entry) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <h1 className="font-serif text-2xl text-pine-800 mb-4">Entry not found</h1>
        <Link to="/journal" className="btn-outline">Back to Journal</Link>
      </div>
    )
  }

  const dateStr = entry.date ? format(parseISO(entry.date), 'MMMM d, yyyy') : '—'

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <Link
        to="/journal"
        className="inline-flex items-center gap-1.5 text-sm font-sans text-pine-600 hover:text-pine-800 mb-6"
      >
        ← Back to Journal
      </Link>

      {/* Header */}
      <header className="mb-8 pb-6 border-b border-bark-200">
        <div className="flex flex-wrap gap-2 mb-3">
          <span className={`tag tag-type-${entry.type}`}>
            {TYPE_LABELS[entry.type] ?? entry.type}
          </span>
          {entry.tags?.map((t) => (
            <span key={t} className="tag">{t}</span>
          ))}
        </div>
        <h1 className="font-serif text-2xl sm:text-3xl font-semibold text-pine-900 leading-snug mb-3">
          {entry.title}
        </h1>
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-bark-500 font-sans">
          <span>{dateStr}</span>
          <span>&bull; {AUTHOR_LABELS[entry.author] ?? entry.author}</span>
          {entry.location?.name && <span>&bull; {entry.location.name}</span>}
        </div>
        {entry.species?.length > 0 && (
          <div className="mt-3">
            <span className="text-xs font-sans font-medium text-bark-500 uppercase tracking-wide mr-2">Species:</span>
            {entry.species.map((s) => (
              <span key={s} className="tag mr-1 italic">{s}</span>
            ))}
          </div>
        )}
      </header>

      {/* Body */}
      <article className="prose prose-bark max-w-none">
        <ReactMarkdown>{entry.body}</ReactMarkdown>
      </article>
    </div>
  )
}
