function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload  = () => resolve(reader.result.split(',')[1])
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

export async function scoreImage(file, { lat, lng } = {}) {
  const imageBase64 = await fileToBase64(file)

  const res = await fetch('/.netlify/functions/inat-cv', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ imageBase64, lat, lng }),
  })

  if (!res.ok) throw new Error(`iNat proxy error ${res.status}`)

  const { results } = await res.json()
  return (results ?? []).slice(0, 8).map((r) => ({
    name:     r.taxon?.name ?? '',
    common:   r.taxon?.preferred_common_name ?? '',
    rank:     r.taxon?.rank ?? '',
    score:    Math.round((r.combined_score ?? 0) * 100),
    thumbUrl: r.taxon?.default_photo?.square_url ?? null,
    taxonId:  r.taxon?.id ?? null,
  }))
}
