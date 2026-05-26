import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { format, parseISO } from 'date-fns'

const AUTHOR_LABELS = { karl: 'Karl', emily: 'Emily' }

export default function Lightbox({ photo, onClose }) {
  useEffect(() => {
    function onKey(e) { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  if (!photo) return null

  const dateStr = photo.date ? format(parseISO(photo.date), 'MMMM d, yyyy') : '—'

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
      onClick={onClose}
    >
      <div
        className="relative bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto flex flex-col sm:flex-row"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-10 text-bark-400 hover:text-bark-700 text-2xl leading-none"
          aria-label="Close"
        >
          ×
        </button>

        {/* Image */}
        <div className="sm:w-3/5 bg-bark-100 flex items-center justify-center rounded-t-xl sm:rounded-l-xl sm:rounded-tr-none overflow-hidden min-h-48">
          <img
            src={`/photos/${photo.filename}`}
            alt={photo.title}
            className="object-contain max-h-[60vh] sm:max-h-[90vh] w-full"
            onError={(e) => {
              e.target.style.display = 'none'
              e.target.parentNode.classList.add('photo-placeholder')
            }}
          />
        </div>

        {/* Metadata */}
        <div className="sm:w-2/5 p-6 flex flex-col gap-3 overflow-y-auto">
          <h2 className="font-serif text-xl font-semibold text-pine-900 leading-snug pr-6">
            {photo.title}
          </h2>
          <div className="text-sm text-bark-500 font-sans">
            {dateStr} &bull; {AUTHOR_LABELS[photo.author] ?? photo.author}
          </div>

          {photo.notes && (
            <p className="text-sm text-bark-700 font-sans leading-relaxed">{photo.notes}</p>
          )}

          {photo.species?.length > 0 && (
            <div>
              <div className="text-xs font-sans font-semibold text-bark-400 uppercase tracking-wide mb-1">Species</div>
              <div className="flex flex-wrap gap-1">
                {photo.species.map((s) => (
                  <span key={s} className="tag italic">{s}</span>
                ))}
              </div>
            </div>
          )}

          {photo.tags?.length > 0 && (
            <div>
              <div className="text-xs font-sans font-semibold text-bark-400 uppercase tracking-wide mb-1">Tags</div>
              <div className="flex flex-wrap gap-1">
                {photo.tags.map((t) => (
                  <span key={t} className="tag">{t}</span>
                ))}
              </div>
            </div>
          )}

          {photo.location?.name && (
            <div className="text-sm text-bark-500 font-sans">
              📍 {photo.location.name}
            </div>
          )}

          {photo.entry_id && (
            <Link
              to={`/journal/${photo.entry_id}`}
              onClick={onClose}
              className="mt-auto text-sm text-pine-600 hover:text-pine-800 underline font-sans"
            >
              View journal entry →
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}
