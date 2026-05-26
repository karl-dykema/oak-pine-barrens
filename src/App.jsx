import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Layout from './components/Layout'
import Home from './pages/Home'
import Journal from './pages/Journal'
import JournalEntry from './pages/JournalEntry'
import Gallery from './pages/Gallery'
import Team from './pages/Team'
import About from './pages/About'

export default function App() {
  return (
    <AuthProvider>
    <BrowserRouter basename={import.meta.env.BASE_URL.replace(/\/$/, '')}>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/"            element={<Home />} />
          <Route path="/journal"     element={<Journal />} />
          <Route path="/journal/:id" element={<JournalEntry />} />
          <Route path="/gallery"     element={<Gallery />} />
          <Route path="/team"        element={<Team />} />
          <Route path="/about"       element={<About />} />
        </Route>
      </Routes>
    </BrowserRouter>
    </AuthProvider>
  )
}
