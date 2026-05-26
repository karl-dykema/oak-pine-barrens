const INAT_URL = 'https://api.inaturalist.org/v1/computervision/score_image'

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
}

export const handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return { statusCode: 204, headers: cors }
  if (event.httpMethod !== 'POST')   return { statusCode: 405, body: 'Method Not Allowed' }

  try {
    const { imageBase64, lat, lng } = JSON.parse(event.body)

    // Use native FormData + Blob (Node 18+) — compatible with native fetch
    const form = new FormData()
    form.append('image', new Blob([Buffer.from(imageBase64, 'base64')], { type: 'image/jpeg' }), 'photo.jpg')
    if (lat != null) form.append('lat', String(lat))
    if (lng != null) form.append('lng', String(lng))

    const res = await fetch(INAT_URL, { method: 'POST', body: form })
    if (!res.ok) throw new Error(`iNat responded ${res.status}`)

    const data = await res.json()
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json', ...cors },
      body: JSON.stringify(data),
    }
  } catch (err) {
    return {
      statusCode: 500,
      headers: cors,
      body: JSON.stringify({ error: err.message }),
    }
  }
}
