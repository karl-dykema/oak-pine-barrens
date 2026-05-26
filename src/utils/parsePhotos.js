const photoModules = import.meta.glob('/data/photos/*.json', { eager: true })

export function getAllPhotos() {
  return Object.values(photoModules)
    .map((m) => m.default ?? m)
    .sort((a, b) => new Date(b.date) - new Date(a.date))
}

export function getPhotoById(id) {
  return getAllPhotos().find((p) => p.id === id) ?? null
}

export function getAllTags() {
  const tags = new Set()
  getAllPhotos().forEach((p) => p.tags?.forEach((t) => tags.add(t)))
  return [...tags].sort()
}

export function getAllSpecies() {
  const species = new Set()
  getAllPhotos().forEach((p) => p.species?.forEach((s) => species.add(s)))
  return [...species].sort()
}
