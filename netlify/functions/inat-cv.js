import FormData from 'form-data'

const INAT_URL = 'https://api.inaturalist.org/v1/computervision/score_image'

export const handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: corsHeaders() }
  }
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' }
  }

  try {
    const { imageBase64, lat, lng } = JSON.parse(event.body)
    const buffer = Buffer.from(imageBase64, 'base64')

    const form = new FormData()
    form.append('image', buffer, { filename: 'photo.jpg', contentType: 'image/jpeg' })
    if (lat != null) form.append('lat', String(lat))
    if (lng != null) form.append('lng', String(lng))

    const res = await fetch(INAT_URL, { method: 'POST', body: form, headers: form.getHeaders() })
    if (!res.ok) throw new Error(`iNat responded ${res.status}`)

    const data = await res.json()
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json', ...corsHeaders() },
      body: JSON.stringify(data),
    }
  } catch (err) {
    return {
      statusCode: 500,
      headers: corsHeaders(),
      body: JSON.stringify({ error: err.message }),
    }
  }
}

function corsHeaders() {
  return { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'Content-Type' }
}
