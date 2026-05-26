import { NavLink } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const links = [
  { to: '/',        label: 'Home' },
  { to: '/journal', label: 'Field Journal' },
  { to: '/gallery', label: 'Photos' },
  { to: '/team',    label: 'Team' },
  { to: '/about',   label: 'About' },
]

export default function Navbar() {
  const { user, login, logout } = useAuth()

  return (
    <header className="bg-pine-800 text-bark-50 shadow-md">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center gap-2 py-3">
        <NavLink to="/" className="font-serif text-lg font-semibold tracking-wide text-bark-100 hover:text-white">
          Oak-Pine Barrens
        </NavLink>
        <nav className="flex flex-wrap gap-1 sm:ml-auto items-center">
          {links.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                `px-3 py-1.5 rounded text-sm font-sans font-medium transition-colors ${
                  isActive
                    ? 'bg-pine-600 text-white'
                    : 'text-bark-200 hover:text-white hover:bg-pine-700'
                }`
              }
            >
              {label}
            </NavLink>
          ))}

          {user ? (
            <span className="flex items-center gap-2 ml-2">
              {user.avatar_url && (
                <img src={user.avatar_url} alt={user.login} className="w-6 h-6 rounded-full" />
              )}
              <span className="text-xs text-bark-300 font-sans">{user.login}</span>
              <button
                onClick={logout}
                className="text-xs text-bark-400 hover:text-bark-200 font-sans transition-colors"
              >
                Sign out
              </button>
            </span>
          ) : (
            <button
              onClick={login}
              className="ml-2 px-3 py-1.5 rounded text-sm font-sans font-medium text-bark-300 hover:text-white hover:bg-pine-700 transition-colors"
            >
              Login
            </button>
          )}
        </nav>
      </div>
    </header>
  )
}
