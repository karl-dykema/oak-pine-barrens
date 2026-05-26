import { useMemo } from 'react'
import { getAllPhotos } from '../utils/parsePhotos'

export function usePhotos(filters = {}) {
  const all = useMemo(() => getAllPhotos(), [])

  return useMemo(() => {
    let result = all

    if (filters.author) {
      result = result.filter((p) => p.author === filters.author)
    }
    if (filters.tag) {
      result = result.filter((p) => p.tags?.includes(filters.tag))
    }
    if (filters.species) {
      result = result.filter((p) => p.species?.includes(filters.species))
    }
    if (filters.dateFrom) {
      result = result.filter((p) => p.date >= filters.dateFrom)
    }
    if (filters.dateTo) {
      result = result.filter((p) => p.date <= filters.dateTo)
    }
    if (filters.search) {
      const q = filters.search.toLowerCase()
      result = result.filter(
        (p) =>
          p.title?.toLowerCase().includes(q) ||
          p.notes?.toLowerCase().includes(q) ||
          p.tags?.some((t) => t.toLowerCase().includes(q)) ||
          p.species?.some((s) => s.toLowerCase().includes(q))
      )
    }

    return result
  }, [all, filters.author, filters.tag, filters.species, filters.dateFrom, filters.dateTo, filters.search])
}
