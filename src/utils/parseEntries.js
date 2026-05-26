import { parse as parseYaml } from 'yaml'

// Vite 8 glob syntax: query + import:'default' returns raw string content
const rawFiles = import.meta.glob('/content/entries/*.md', { query: '?raw', import: 'default', eager: true })

function parseFrontMatter(src) {
  const match = src.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/)
  if (!match) return { data: {}, content: src }
  try {
    const data = parseYaml(match[1]) ?? {}
    return { data, content: match[2].trim() }
  } catch {
    return { data: {}, content: src }
  }
}

function parseEntry(raw, filepath) {
  const { data, content } = parseFrontMatter(raw)
  const id = data.id || filepath.replace(/^.*\//, '').replace(/\.md$/, '')
  return { ...data, id, body: content }
}

export function getAllEntries() {
  return Object.entries(rawFiles)
    .map(([path, raw]) => parseEntry(raw, path))
    .sort((a, b) => new Date(b.date) - new Date(a.date))
}

export function getEntryById(id) {
  return getAllEntries().find((e) => e.id === id) ?? null
}
