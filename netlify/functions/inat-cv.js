const https = require('https')

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
}

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return { statusCode: 204, headers: CORS }
  if (event.httpMethod !== 'POST')   return { statusCode: 405, body: 'Method Not Allowed' }

  try {
    const { imageBase64 } = JSON.parse(event.body)
    const imageBuffer = Buffer.from(imageBase64, 'base64')

    const boundary = 'FormBoundary' + Date.now()
    const CRLF = '\r\n'

    const preamble = Buffer.from(
      `--${boundary}${CRLF}` +
      `Content-Disposition: form-data; name="image"; filename="photo.jpg"${CRLF}` +
      `Content-Type: image/jpeg${CRLF}${CRLF}`
    )
    const epilogue = Buffer.from(`${CRLF}--${boundary}--${CRLF}`)
    const body = Buffer.concat([preamble, imageBuffer, epilogue])

    const data = await new Promise((resolve, reject) => {
      const req = https.request(
        {
          hostname: 'api.inaturalist.org',
          path: '/v1/computervision/score_image',
          method: 'POST',
          headers: {
            'Content-Type': `multipart/form-data; boundary=${boundary}`,
            'Content-Length': body.length,
          },
        },
        (res) => {
          const chunks = []
          res.on('data', (c) => chunks.push(c))
          res.on('end', () => {
            try { resolve(JSON.parse(Buffer.concat(chunks).toString())) }
            catch (e) { reject(e) }
          })
        }
      )
      req.on('error', reject)
      req.write(body)
      req.end()
    })

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json', ...CORS },
      body: JSON.stringify(data),
    }
  } catch (err) {
    return {
      statusCode: 500,
      headers: CORS,
      body: JSON.stringify({ error: err.message }),
    }
  }
}
