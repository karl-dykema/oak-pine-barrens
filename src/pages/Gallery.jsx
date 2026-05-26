import { useState, lazy, Suspense } from 'react'
import { format, parseISO } from 'date-fns'
import { usePhotos } from '../hooks/usePhotos'
import { getAllTags, getAllSpecies } from '../utils/parsePhotos'
import Lightbox from '../components/Lightbox'

const PhotoUpload = lazy(() => import('../components/PhotoUpload'))

const AUTHOR_LABELS = { karl: 'Karl', emily: 'Emily' }

function PhotoCard({ photo, onClick }) {
  const [imgError, setImgError] = useState(false)
  const dateStr = photo.date ? format(parseISO(photo.date), 'MMM d, yyyy') : '—'

  return (
    <button
      type="button"
      onClick={() => onClick(photo)}
      className="group text-left rounded-lg overflow-hidden border border-bark-200 bg-white shadow-sm hover:shadow-md hover:border-pine-300 transition-all"
    >
      {/* Image */}
      <div className="aspect-[4/3] bg-bark-100 overflow-hidden relative">
        {!imgError ? (
          <img
            src={`/photos/${photo.filename}`}
            alt={photo.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-bark-300 gap-2">
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="text-xs font-sans">No image yet</span>
          </div>
        )}
        {/* Author badge */}
        <span className="absolute top-2 right-2 bg-black/50 text-white text-xs font-sans px-1.5 py-0.5 rounded">
          {AUTHOR_LABELS[photo.author] ?? photo.author}
        </span>
      </div>

      {/* Info */}
      <div className="p-3">
        <p className="font-serif text-sm font-semibold text-pine-900 leading-snug line-clamp-2 group-hover:text-pine-600 mb-1">
          {photo.title}
        </p>
        <p className="text-xs text-bark-500 font-sans mb-2">{dateStr}</p>
        <div className="flex flex-wrap gap-1">
          {photo.species?.slice(0, 1).map((s) => (
            <span key={s} className="tag italic text-xs">{s}</span>
          ))}
          {photo.tags?.slice(0, 2).map((t) => (
            <span key={t} className="tag text-xs">{t}</span>
          ))}
          {(photo.tags?.length ?? 0) + (photo.species?.length ?? 0) > 3 && (
            <span className="text-xs text-bark-400 font-sans">…</span>
          )}
        </div>
      </div>
    </button>
  )
}

export default function Gallery() {
  const [filters, setFilters] = useState({ author: '', tag: '', species: '', dateFrom: '', dateTo: '', search: '' })
  const [lightboxPhoto, setLightboxPhoto] = useState(null)
  const [showUpload, setShowUpload] = useState(false)

  const photos = usePhotos({
    author:   filters.author   || undefined,
    tag:      filters.tag      || undefined,
    species:  filters.species  || undefined,
    dateFrom: filters.dateFrom || undefined,
    dateTo:   filters.dateTo   || undefined,
    search:   filters.search   || undefined,
  })

  const allTags    = getAllTags()
  const allSpecies = getAllSpecies()

  function set(key) {
    return (e) => setFilters((f) => ({ ...f, [key]: e.target.value }))
  }

  function clearFilters() {
    setFilters({ author: '', tag: '', species: '', dateFrom: '', dateTo: '', search: '' })
  }

  const hasFilters = Object.values(filters).some(Boolean)

  const selectCls = 'rounded border border-bark-300 px-3 py-1.5 text-sm font-sans bg-white focus:outline-none focus:ring-1 focus:ring-pine-500'

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-semibold text-pine-900 mb-1">Photo Gallery</h1>
          <p className="text-bark-500 font-sans text-sm">{photos.length} {photos.length === 1 ? 'photo' : 'photos'}</p>
        </div>
        <button onClick={() => setShowUpload(true)} className="btn-primary">
          + Upload Photo
        </button>
      </div>

      {/* Filters */}
      <div className="bg-bark-50 border border-bark-200 rounded-lg p-4 mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <input
          type="search"
          placeholder="Search…"
          value={filters.search}
          onChange={set('search')}
          className={`${selectCls} col-span-full sm:col-span-2 lg:col-span-1`}
        />
        <select value={filters.author} onChange={set('author')} className={selectCls}>
          <option value="">All authors</option>
          <option value="karl">Karl</option>
          <option value="emily">Emily</option>
        </select>
        <select value={filters.tag} onChange={set('tag')} className={selectCls}>
          <option value="">All tags</option>
          {allTags.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
        <select value={filters.species} onChange={set('species')} className={selectCls}>
          <option value="">All species</option>
          {allSpecies.map((s) => <option key={s} value={s} className="italic">{s}</option>)}
        </select>
        <input type="date" value={filters.dateFrom} onChange={set('dateFrom')} className={selectCls} title="From date" />
        <input type="date" value={filters.dateTo}   onChange={set('dateTo')}   className={selectCls} title="To date" />
        {hasFilters && (
          <button onClick={clearFilters} className="text-sm font-sans text-pine-600 hover:text-pine-800 underline self-center">
            Clear filters
          </button>
        )}
      </div>

      {/* Grid */}
      {photos.length === 0 ? (
        <p className="text-bark-500 font-sans text-sm py-12 text-center">
          No photos match the current filters.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {photos.map((photo) => (
            <PhotoCard key={photo.id} photo={photo} onClick={setLightboxPhoto} />
          ))}
        </div>
      )}

      {/* Lightbox */}
      {lightboxPhoto && (
        <Lightbox photo={lightboxPhoto} onClose={() => setLightboxPhoto(null)} />
      )}

      {/* Upload modal — lazy loaded so compression libs don't hit initial bundle */}
      {showUpload && (
        <Suspense fallback={null}>
          <PhotoUpload onClose={() => setShowUpload(false)} />
        </Suspense>
      )}
    </div>
  )
}
