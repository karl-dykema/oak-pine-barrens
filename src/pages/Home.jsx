import { useEffect } from 'react'
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

const SITE_COORDS = [43.5081, -85.7967]

const stats = [
  { label: 'Acres',        value: '40' },
  { label: 'County',       value: 'Newaygo' },
  { label: 'Funder',       value: 'LSFSC' },
  { label: 'Season',       value: 'Summer 2026' },
]

export default function Home() {
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
        <div className="max-w-5xl mx-auto px-4 py-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
          {stats.map(({ label, value }) => (
            <div key={label} className="text-center">
              <div className="font-serif text-2xl font-semibold text-pine-800">{value}</div>
              <div className="font-sans text-sm text-bark-600 mt-0.5">{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Map */}
      <section className="max-w-5xl mx-auto px-4 py-10">
        <h2 className="font-serif text-xl font-semibold text-pine-800 mb-4">Site Location</h2>
        <div className="h-72 sm:h-96 rounded-lg overflow-hidden border border-bark-200 shadow-sm">
          <MapContainer
            center={SITE_COORDS}
            zoom={13}
            className="h-full w-full"
            scrollWheelZoom={false}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={SITE_COORDS}>
              <Popup>
                <strong>Oak-Pine Barrens Site</strong>
                <br />Newaygo County, MI
              </Popup>
            </Marker>
          </MapContainer>
        </div>
        <p className="text-sm text-bark-500 mt-2 font-sans">
          43.5081° N, 85.7967° W &mdash; Newaygo County, Michigan
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
