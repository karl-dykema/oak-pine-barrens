import { useMemo } from 'react'
import { getAllEntries } from '../utils/parseEntries'

export function useEntries(filters = {}) {
  const all = useMemo(() => getAllEntries(), [])

  return useMemo(() => {
    let result = all

    if (filters.author) {
      result = result.filter((e) => e.author === filters.author)
    }

    if (filters.type) {
      result = result.filter((e) => e.type === filters.type)
    }

    if (filters.tag) {
      result = result.filter((e) => Array.isArray(e.tags) && e.tags.includes(filters.tag))
    }

    if (filters.dateFrom) {
      result = result.filter((e) => e.date >= filters.dateFrom)
    }

    if (filters.dateTo) {
      result = result.filter((e) => e.date <= filters.dateTo)
    }

    if (filters.search) {
      const q = filters.search.toLowerCase()
      result = result.filter(
        (e) =>
          e.title?.toLowerCase().includes(q) ||
          e.body?.toLowerCase().includes(q) ||
          e.tags?.some((t) => t.toLowerCase().includes(q))
      )
    }

    return result
  }, [all, filters.author, filters.type, filters.tag, filters.dateFrom, filters.dateTo, filters.search])
}
