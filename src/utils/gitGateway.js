function strToBase64(str) {
  const bytes = new TextEncoder().encode(str)
  const binStr = Array.from(bytes, (b) => String.fromCodePoint(b)).join('')
  return btoa(binStr)
}

function blobToBase64(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result.split(',')[1])
    reader.onerror = reject
    reader.readAsDataURL(blob)
  })
}

async function gitPut(path, base64Content, message) {
  const user = window.netlifyIdentity?.currentUser()
  if (!user) throw new Error('Not logged in')
  const token = await user.jwt()

  const res = await fetch(`/.netlify/git/github/contents/${path}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ message, content: base64Content, branch: 'main' }),
  })

  if (!res.ok) {
    const body = await res.text()
    throw new Error(`Git Gateway ${res.status}: ${body}`)
  }
  return res.json()
}

export async function commitPhoto(id, imageBlob, meta) {
  const imageBase64 = await blobToBase64(imageBlob)
  const metaBase64  = strToBase64(JSON.stringify(meta, null, 2))

  await gitPut(`public/photos/${id}.jpg`, imageBase64, `Add photo ${id}`)
  await gitPut(`data/photos/${id}.json`,  metaBase64,  `Add photo metadata ${id}`)
}
