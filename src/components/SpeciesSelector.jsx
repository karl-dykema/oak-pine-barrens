import { useState, useRef, useMemo } from 'react'
import { getAllSpecies } from '../utils/parsePhotos'
import { getAllEntries } from '../utils/parseEntries'

function buildExistingSpecies() {
  const set = new Set()
  getAllSpecies().forEach((s) => set.add(s))
  getAllEntries().forEach((e) => e.species?.forEach((s) => set.add(s)))
  return [...set].sort()
}

export default function SpeciesSelector({ selected, onChange }) {
  const [input, setInput]   = useState('')
  const [open, setOpen]     = useState(false)
  const inputRef            = useRef()
  const existing            = useMemo(() => buildExistingSpecies(), [])

  const q = input.trim().toLowerCase()

  const filtered = existing.filter(
    (s) => !selected.includes(s) && (!q || s.toLowerCase().includes(q))
  )

  const hasDropdown = open && (filtered.length > 0 || q.length > 1)

  function add(name) {
    const trimmed = name.trim()
    if (trimmed && !selected.includes(trimmed)) onChange([...selected, trimmed])
    setInput('')
    inputRef.current?.focus()
  }

  function remove(name) { onChange(selected.filter((s) => s !== name)) }

  function onKeyDown(e) {
    if ((e.key === 'Enter' || e.key === ',') && input.trim()) {
      e.preventDefault()
      add(input)
    } else if (e.key === 'Backspace' && !input && selected.length) {
      remove(selected[selected.length - 1])
    } else if (e.key === 'Escape') {
      setOpen(false)
    }
  }

  return (
    <div className="relative">
      <label className="block text-xs font-sans font-medium text-bark-600 mb-1">
        Species
      </label>

      {/* Selected tags + input */}
      <div
        className="min-h-[38px] flex flex-wrap gap-1.5 items-center rounded border border-bark-300 bg-white px-2 py-1.5 cursor-text focus-within:ring-1 focus-within:ring-pine-500"
        onClick={() => { inputRef.current?.focus(); setOpen(true) }}
      >
        {selected.map((s) => (
          <span key={s} className="inline-flex items-center gap-1 tag italic">
            {s}
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); remove(s) }}
              className="text-bark-400 hover:text-bark-700 leading-none"
              aria-label={`Remove ${s}`}
            >×</button>
          </span>
        ))}
        <input
          ref={inputRef}
          value={input}
          onChange={(e) => { setInput(e.target.value); setOpen(true) }}
          onKeyDown={onKeyDown}
          onFocus={() => setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 150)}
          placeholder={selected.length ? '' : 'Type or pick a species…'}
          className="flex-1 min-w-[140px] text-sm font-sans bg-transparent outline-none"
        />
      </div>
      <p className="text-xs text-bark-400 font-sans mt-0.5">Enter or comma to add a custom name · Backspace to remove last</p>

      {/* Dropdown */}
      {hasDropdown && (
        <div className="absolute z-20 left-0 right-0 mt-1 bg-white border border-bark-200 rounded-lg shadow-lg max-h-64 overflow-y-auto">
          {filtered.length > 0 && (
            <>
              <div className="px-3 pt-2 pb-1 text-xs font-sans font-semibold text-bark-400 uppercase tracking-wide">
                Previously recorded
              </div>
              {filtered.map((s) => (
                <button
                  key={s}
                  type="button"
                  onMouseDown={(e) => { e.preventDefault(); add(s) }}
                  className="w-full px-3 py-1.5 hover:bg-pine-50 text-left text-sm font-sans italic text-bark-700"
                >
                  {s}
                </button>
              ))}
            </>
          )}

          {q.length > 1 && !selected.includes(input.trim()) && (
            <div className="border-t border-bark-100">
              <button
                type="button"
                onMouseDown={(e) => { e.preventDefault(); add(input) }}
                className="w-full px-3 py-1.5 hover:bg-pine-50 text-left text-sm font-sans text-pine-700"
              >
                Add "<span className="italic">{input.trim()}</span>"
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
