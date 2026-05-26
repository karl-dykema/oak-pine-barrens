const REPO = 'karl-dykema/oak-pine-barrens'

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

async function githubPut(path, base64Content, message, token) {
  const res = await fetch(`https://api.github.com/repos/${REPO}/contents/${path}`, {
    method: 'PUT',
    headers: {
      Authorization: `token ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ message, content: base64Content, branch: 'main' }),
  })
  if (!res.ok) {
    const { message: msg } = await res.json().catch(() => ({}))
    throw new Error(msg || `GitHub API ${res.status}`)
  }
  return res.json()
}

export async function commitPhoto(id, imageBlob, meta, token) {
  const [imageBase64, metaBase64] = await Promise.all([
    blobToBase64(imageBlob),
    Promise.resolve(strToBase64(JSON.stringify(meta, null, 2))),
  ])
  await githubPut(`public/photos/${id}.jpg`, imageBase64, `Add photo ${id}`, token)
  await githubPut(`data/photos/${id}.json`,  metaBase64,  `Add photo metadata ${id}`, token)
}
