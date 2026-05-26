const INAT_CV_URL = 'https://api.inaturalist.org/v1/computervision/score_image'

export async function scoreImage(file, { lat, lng } = {}) {
  const form = new FormData()
  form.append('image', file)
  if (lat != null) form.append('lat', lat)
  if (lng != null) form.append('lng', lng)

  const res = await fetch(INAT_CV_URL, { method: 'POST', body: form })
  if (!res.ok) throw new Error(`iNaturalist CV error ${res.status}`)

  const { results } = await res.json()
  return (results ?? []).slice(0, 8).map((r) => ({
    name:      r.taxon?.name ?? '',
    common:    r.taxon?.preferred_common_name ?? '',
    rank:      r.taxon?.rank ?? '',
    score:     Math.round((r.combined_score ?? 0) * 100),
    thumbUrl:  r.taxon?.default_photo?.square_url ?? null,
    taxonId:   r.taxon?.id ?? null,
  }))
}
