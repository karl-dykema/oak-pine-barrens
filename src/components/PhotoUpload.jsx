import { useState, useRef, useCallback } from 'react'
import { format } from 'date-fns'
import { compressImage, computeHash, findDuplicate } from '../utils/imageUtils'
import { getAllPhotos } from '../utils/parsePhotos'
import { getAllEntries } from '../utils/parseEntries'
import { commitPhoto } from '../utils/githubCommit'
import { useAuth } from '../context/AuthContext'
import SpeciesSelector from './SpeciesSelector'
import exifr from 'exifr'

const AUTHOR_OPTIONS = [
  { value: 'karl',  label: 'Karl' },
  { value: 'emily', label: 'Emily' },
]

const today = format(new Date(), 'yyyy-MM-dd')

const EMPTY_FORM = {
  title: '',
  notes: '',
  date: today,
  author: 'karl',
  tags: '',
  species: '',
  locationName: '',
  lat: '',
  lon: '',
  entryId: '',
}

export default function PhotoUpload({ onClose }) {
  const { token, login } = useAuth()
  const [step, setStep]               = useState('drop')   // drop | processing | form | committing | done
  const [preview, setPreview]         = useState(null)
  const [compressed, setCompressed]   = useState(null)
  const [duplicate, setDuplicate]     = useState(null)
  const [exifMeta, setExifMeta]       = useState(null)
  const [form, setForm]               = useState(EMPTY_FORM)
  const [selectedSpecies, setSelectedSpecies] = useState([])
  const [error, setError]             = useState(null)
  const [commitError, setCommitError] = useState(null)
  const [outputJson, setOutputJson]   = useState(null)
  const inputRef = useRef()

  const entries = getAllEntries()

  const processFile = useCallback(async (file) => {
    if (!file.type.startsWith('image/')) { setError('Please select an image file.'); return }
    setError(null)
    setStep('processing')

    try {
      // Extract EXIF before compression strips it
      const [gps, exif] = await Promise.all([
        exifr.gps(file).catch(() => null),
        exifr.parse(file, {
          pick: ['Make','Model','LensModel','FocalLength','FNumber','ExposureTime',
                 'ISO','DateTimeOriginal','ImageWidth','ImageHeight','Orientation'],
        }).catch(() => null),
      ])

      const camera = exif ? {
        make:          exif.Make         ?? null,
        model:         exif.Model        ?? null,
        lens:          exif.LensModel    ?? null,
        focal_length:  exif.FocalLength  != null ? `${exif.FocalLength}mm` : null,
        aperture:      exif.FNumber      != null ? `f/${exif.FNumber}`     : null,
        shutter:       exif.ExposureTime != null ? `1/${Math.round(1/exif.ExposureTime)}s` : null,
        iso:           exif.ISO          ?? null,
        taken_at:      exif.DateTimeOriginal?.toISOString() ?? null,
        width:         exif.ImageWidth   ?? null,
        height:        exif.ImageHeight  ?? null,
      } : null
      setExifMeta(camera)

      // Compress
      const comp = await compressImage(file)
      setCompressed(comp)
      setPreview(URL.createObjectURL(comp))

      // Duplicate detection
      const hash = await computeHash(comp)
      const dup = findDuplicate(hash, getAllPhotos())
      setDuplicate(dup)

      // Pre-fill title, date, and GPS from EXIF
      setForm((f) => ({
        ...f,
        title: file.name.replace(/\.[^.]+$/, '').replace(/[-_]/g, ' '),
        date:  camera?.taken_at ? camera.taken_at.slice(0, 10) : f.date,
        lat:   gps?.latitude  != null ? String(gps.latitude.toFixed(6))  : f.lat,
        lon:   gps?.longitude != null ? String(gps.longitude.toFixed(6)) : f.lon,
      }))
      setStep('form')
    } catch (e) {
      setError(`Processing failed: ${e.message}`)
      setStep('drop')
    }
  }, [])

  function onDrop(e) {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file) processFile(file)
  }

  function onFileChange(e) {
    const file = e.target.files[0]
    if (file) processFile(file)
  }

  function setField(key) {
    return (e) => setForm((f) => ({ ...f, [key]: e.target.value }))
  }

  function handleSave() {
    const id = `photo-${Date.now()}`
    const allTags = form.tags.split(',').map((t) => t.trim()).filter(Boolean)

    const meta = {
      id,
      filename: `${id}.jpg`,
      title: form.title,
      notes: form.notes,
      date: form.date,
      author: form.author,
      tags: allTags,
      species: selectedSpecies,
      location: {
        lat: form.lat ? parseFloat(form.lat) : null,
        lon: form.lon ? parseFloat(form.lon) : null,
        name: form.locationName || null,
      },
      entry_id: form.entryId || null,
      camera: exifMeta,
      hash: null,
      created_at: new Date().toISOString(),
    }

    const output = { id, meta }
    setOutputJson(output)
    setCommitError(null)

    if (token) {
      setStep('committing')
      commitPhoto(id, compressed, meta, token)
        .then(() => setStep('done'))
        .catch((err) => { setCommitError(err.message); setStep('done') })
    } else {
      setStep('done')
    }
  }

  function downloadJson() {
    const blob = new Blob([JSON.stringify(outputJson.meta, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${outputJson.id}.json`
    a.click()
  }

  function downloadImage() {
    const url = URL.createObjectURL(compressed)
    const a = document.createElement('a')
    a.href = url
    a.download = `${outputJson.id}.jpg`
    a.click()
  }

  const inputCls = 'w-full rounded border border-bark-300 px-3 py-1.5 text-sm font-sans bg-white focus:outline-none focus:ring-1 focus:ring-pine-500'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4" onClick={onClose}>
      <div
        className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[92vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-bark-200">
          <h2 className="font-serif text-lg font-semibold text-pine-900">Upload Photo</h2>
          <button onClick={onClose} className="text-bark-400 hover:text-bark-700 text-2xl leading-none">×</button>
        </div>

        <div className="p-6 flex flex-col gap-5">

          {/* DROP ZONE */}
          {step === 'drop' && (
            <div
              className="border-2 border-dashed border-bark-300 rounded-lg p-12 text-center cursor-pointer hover:border-pine-400 transition-colors"
              onDrop={onDrop}
              onDragOver={(e) => e.preventDefault()}
              onClick={() => inputRef.current.click()}
            >
              <p className="text-bark-500 font-sans text-sm mb-2">Drop a photo here, or click to browse</p>
              <p className="text-bark-400 font-sans text-xs">Compressed to under 1 MB · GPS auto-filled from EXIF</p>
              <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={onFileChange} />
              {error && <p className="mt-3 text-red-600 text-sm font-sans">{error}</p>}
            </div>
          )}

          {/* PROCESSING */}
          {step === 'processing' && (
            <div className="text-center py-10 text-bark-500 font-sans text-sm">
              Compressing and analyzing…
            </div>
          )}

          {/* FORM */}
          {step === 'form' && (
            <>
              {/* Preview + duplicate warning */}
              <div className="flex gap-4 items-start">
                <img src={preview} alt="Preview" className="w-28 h-28 object-cover rounded-lg border border-bark-200 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  {compressed && (
                    <p className="text-xs text-bark-500 font-sans mb-1">
                      Compressed: {(compressed.size / 1024).toFixed(0)} KB
                    </p>
                  )}
                  {duplicate && (
                    <div className="bg-yellow-50 border border-yellow-300 rounded p-3 text-sm font-sans text-yellow-800">
                      ⚠️ Possible duplicate of <strong>{duplicate.photo.title}</strong> (similarity score: {256 - duplicate.distance}/256). You can still save if this is intentional.
                    </div>
                  )}
                </div>
              </div>

              {/* Species selector */}
              <SpeciesSelector
                selected={selectedSpecies}
                onChange={setSelectedSpecies}
              />

              {/* Metadata form */}
              <div className="grid gap-3">
                <div>
                  <label className="block text-xs font-sans font-medium text-bark-600 mb-1">Title</label>
                  <input className={inputCls} value={form.title} onChange={setField('title')} placeholder="Photo title" />
                </div>
                <div>
                  <label className="block text-xs font-sans font-medium text-bark-600 mb-1">Notes</label>
                  <textarea className={inputCls} rows={3} value={form.notes} onChange={setField('notes')} placeholder="What does this show? Any observations?" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-sans font-medium text-bark-600 mb-1">Date</label>
                    <input type="date" className={inputCls} value={form.date} onChange={setField('date')} />
                  </div>
                  <div>
                    <label className="block text-xs font-sans font-medium text-bark-600 mb-1">Author</label>
                    <select className={inputCls} value={form.author} onChange={setField('author')}>
                      {AUTHOR_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-sans font-medium text-bark-600 mb-1">Tags (comma-separated)</label>
                  <input className={inputCls} value={form.tags} onChange={setField('tags')} placeholder="lupine, bloom, east-opening" />
                </div>
                <div>
                  <label className="block text-xs font-sans font-medium text-bark-600 mb-1">Location name</label>
                  <input className={inputCls} value={form.locationName} onChange={setField('locationName')} placeholder="e.g. East Opening — Patch A" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-sans font-medium text-bark-600 mb-1">
                      Latitude{form.lat ? <span className="text-pine-600 ml-1">· from EXIF</span> : ''}
                    </label>
                    <input type="number" step="any" className={inputCls} value={form.lat} onChange={setField('lat')} placeholder="43.4566" />
                  </div>
                  <div>
                    <label className="block text-xs font-sans font-medium text-bark-600 mb-1">
                      Longitude{form.lon ? <span className="text-pine-600 ml-1">· from EXIF</span> : ''}
                    </label>
                    <input type="number" step="any" className={inputCls} value={form.lon} onChange={setField('lon')} placeholder="-85.5892" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-sans font-medium text-bark-600 mb-1">Linked journal entry</label>
                  <select className={inputCls} value={form.entryId} onChange={setField('entryId')}>
                    <option value="">— none —</option>
                    {entries.map((e) => (
                      <option key={e.id} value={e.id}>{e.date} — {e.title}</option>
                    ))}
                  </select>
                </div>
              </div>

              <button onClick={handleSave} className="btn-primary self-end">
                Generate files →
              </button>
            </>
          )}

          {/* COMMITTING */}
          {step === 'committing' && (
            <div className="text-center py-10 text-bark-500 font-sans text-sm">
              Saving to repository…
            </div>
          )}

          {/* DONE */}
          {step === 'done' && outputJson && (
            <div className="flex flex-col gap-4">
              {commitError ? (
                <div className="bg-red-50 border border-red-300 rounded-lg p-4 text-sm font-sans text-red-800">
                  <p className="font-semibold mb-1">Save failed — download and commit manually:</p>
                  <p className="text-xs text-red-600 mb-2">{commitError}</p>
                </div>
              ) : token ? (
                <div className="bg-pine-50 border border-pine-200 rounded-lg p-4 text-sm font-sans text-pine-800">
                  <p className="font-semibold">Saved to repository.</p>
                  <p className="text-xs text-pine-600 mt-1">Site will rebuild in ~1 minute.</p>
                </div>
              ) : (
                <div className="bg-sand-50 border border-sand-200 rounded-lg p-4 text-sm font-sans text-bark-700">
                  <p className="font-semibold mb-2">Login to save directly to the repo:</p>
                  <button onClick={login} className="btn-primary text-sm">Login with GitHub</button>
                  <p className="mt-3 text-xs text-bark-500">Or download files and commit manually:</p>
                </div>
              )}
              <div className="flex gap-3">
                <button onClick={downloadImage} className="btn-outline text-sm">Download image</button>
                <button onClick={downloadJson} className="btn-outline text-sm">Download JSON</button>
              </div>
              <pre className="bg-bark-50 border border-bark-200 rounded p-3 text-xs overflow-x-auto font-mono text-bark-700">
                {JSON.stringify(outputJson.meta, null, 2)}
              </pre>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}
