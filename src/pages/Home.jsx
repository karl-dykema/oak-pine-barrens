import { useState } from 'react'
import { Link } from 'react-router-dom'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png'
import markerIcon   from 'leaflet/dist/images/marker-icon.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'

// Fix Leaflet default marker icons broken by Vite's asset pipeline
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl:       markerIcon,
  shadowUrl:     markerShadow,
})

const SITE_COORDS = [43.45656837380997, -85.58916358026472]

const stats = [
  { label: 'Acres',   value: '40' },
  { label: 'County',  value: 'Newaygo, MI' },
  { label: 'Program', value: 'LSFSC Intern' },
  { label: 'Season',  value: 'Summer 2026' },
]

const LAYERS = {
  satellite: {
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution: 'Tiles &copy; Esri &mdash; Esri, Maxar, Earthstar Geographics',
  },
  street: {
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  },
}

export default function Home() {
  const [layer, setLayer] = useState('satellite')
  return (
    <div>
      {/* Hero */}
      <section className="bg-pine-800 text-bark-50 py-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-3xl sm:text-4xl font-serif font-semibold mb-4 text-bark-100">
            Oak-Pine Barrens Restoration Project
          </h1>
          <p className="text-bark-300 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto">
            A 40-acre oak-pine barrens in Newaygo County, Michigan is being restored through
            prescribed fire, invasive species removal, and native plant monitoring. This site
            supports rare species including the federally endangered Karner blue butterfly and
            the eastern box turtle. Our work is guided by the Lake States Forest Stewardship
            Center and funded through the 2026 internship program.
          </p>
          <div className="flex flex-wrap gap-3 justify-center mt-8">
            <Link to="/journal" className="btn-primary">Read the Field Journal</Link>
            <Link to="/gallery" className="btn-outline border-bark-400 text-bark-200 hover:bg-pine-700">
              View Photos
            </Link>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="bg-sand-100 border-y border-sand-200">
        <div className="max-w-5xl mx-auto px-4 pt-6 pb-4 grid grid-cols-2 sm:grid-cols-4 gap-4">
          {stats.map(({ label, value }) => (
            <div key={label} className="text-center">
              <div className="font-serif text-2xl font-semibold text-pine-800">{value}</div>
              <div className="font-sans text-sm text-bark-600 mt-0.5">{label}</div>
            </div>
          ))}
        </div>
        <div className="max-w-5xl mx-auto px-4 pb-5 border-t border-sand-200 mt-2 pt-4">
          <p className="font-sans text-sm text-bark-600 leading-relaxed text-center max-w-2xl mx-auto">
            This project is supported by the{' '}
            <strong className="text-bark-800">Lake States Fire Science Consortium (LSFSC)</strong>{' '}
            intern program, funded by the Joint Fire Science Program and administered through
            The Ohio State University. Program Manager{' '}
            <strong className="text-bark-800">Jack McGowan-Stinski</strong> and Lead PI{' '}
            <strong className="text-bark-800">Eric Toman</strong> provide programmatic oversight
            and connect this work to the broader network of fire-dependent ecosystem research
            across the Lake States region.
          </p>
        </div>
      </section>

      {/* Map */}
      <section className="max-w-5xl mx-auto px-4 py-10">
        <h2 className="font-serif text-xl font-semibold text-pine-800 mb-4">Site Location</h2>
        <div className="relative h-72 sm:h-96 rounded-lg overflow-hidden border border-bark-200 shadow-sm">
          <MapContainer
            center={SITE_COORDS}
            zoom={15}
            className="h-full w-full"
            scrollWheelZoom={false}
          >
            <TileLayer
              key={layer}
              attribution={LAYERS[layer].attribution}
              url={LAYERS[layer].url}
            />
            <Marker position={SITE_COORDS}>
              <Popup>
                <strong>Oak-Pine Barrens Site</strong>
                <br />Newaygo County, MI
              </Popup>
            </Marker>
          </MapContainer>
          {/* Layer toggle — sits above the map */}
          <div className="absolute top-2 right-2 z-[1000] flex rounded overflow-hidden shadow border border-bark-300 text-xs font-sans font-medium">
            <button
              onClick={() => setLayer('satellite')}
              className={`px-2.5 py-1 transition-colors ${layer === 'satellite' ? 'bg-pine-700 text-white' : 'bg-white text-bark-700 hover:bg-bark-50'}`}
            >
              Satellite
            </button>
            <button
              onClick={() => setLayer('street')}
              className={`px-2.5 py-1 transition-colors border-l border-bark-300 ${layer === 'street' ? 'bg-pine-700 text-white' : 'bg-white text-bark-700 hover:bg-bark-50'}`}
            >
              Street
            </button>
          </div>
        </div>
        <p className="text-sm text-bark-500 mt-2 font-sans">
          43.4566° N, 85.5892° W &mdash; Newaygo County, Michigan
        </p>
      </section>

      {/* Quick links */}
      <section className="max-w-5xl mx-auto px-4 pb-12 grid sm:grid-cols-2 gap-6">
        <Link
          to="/journal"
          className="group block rounded-lg border border-bark-200 bg-white p-6 shadow-sm hover:border-pine-400 hover:shadow-md transition-all"
        >
          <h3 className="font-serif text-lg font-semibold text-pine-800 group-hover:text-pine-600 mb-2">
            Field Journal
          </h3>
          <p className="text-sm text-bark-600 font-sans leading-relaxed">
            Chronological log of site observations, burn events, surveys, and project meetings.
            Filterable by author, entry type, and species.
          </p>
        </Link>
        <Link
          to="/gallery"
          className="group block rounded-lg border border-bark-200 bg-white p-6 shadow-sm hover:border-pine-400 hover:shadow-md transition-all"
        >
          <h3 className="font-serif text-lg font-semibold text-pine-800 group-hover:text-pine-600 mb-2">
            Photo Gallery
          </h3>
          <p className="text-sm text-bark-600 font-sans leading-relaxed">
            Documented photos from field work, species observations, and site conditions.
            Linked to journal entries.
          </p>
        </Link>
      </section>
    </div>
  )
}
