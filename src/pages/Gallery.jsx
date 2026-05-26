export default function Gallery() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <h1 className="font-serif text-2xl sm:text-3xl font-semibold text-pine-900 mb-2">
        Photo Gallery
      </h1>
      <p className="text-bark-500 font-sans text-sm mb-8">
        Filterable grid of field photos — coming in the next phase.
      </p>
      <div className="rounded-lg border-2 border-dashed border-bark-300 bg-bark-50 py-20 text-center">
        <p className="text-bark-400 font-sans text-sm">
          Photo upload, compression, duplicate detection, and grid view<br />
          will be implemented in Phase 1b after core UI is complete.
        </p>
      </div>
    </div>
  )
}
