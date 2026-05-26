import matter from 'gray-matter'

// Vite glob import — all .md files in content/entries/ as raw strings
const rawFiles = import.meta.glob('/content/entries/*.md', { as: 'raw', eager: true })

function parseEntry(raw, filename) {
  const { data, content } = matter(raw)
  // derive id from filename if not set in front-matter
  const id = data.id || filename.replace(/^.*\//, '').replace(/\.md$/, '')
  return { ...data, id, body: content.trim() }
}

export function getAllEntries() {
  return Object.entries(rawFiles)
    .map(([path, raw]) => parseEntry(raw, path))
    .sort((a, b) => new Date(b.date) - new Date(a.date))
}

export function getEntryById(id) {
  return getAllEntries().find((e) => e.id === id) ?? null
}
