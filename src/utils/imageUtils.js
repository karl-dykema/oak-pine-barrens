import imageCompression from 'browser-image-compression'
import { blockhash } from 'blockhash-core'

export async function compressImage(file, maxSizeMB = 1) {
  return imageCompression(file, {
    maxSizeMB,
    maxWidthOrHeight: 2048,
    useWebWorker: true,
    fileType: 'image/jpeg',
  })
}

async function getImageData(file) {
  const bitmap = await createImageBitmap(file)
  const size = 128
  let canvas, ctx
  if (typeof OffscreenCanvas !== 'undefined') {
    canvas = new OffscreenCanvas(size, size)
    ctx = canvas.getContext('2d')
  } else {
    canvas = document.createElement('canvas')
    canvas.width = size
    canvas.height = size
    ctx = canvas.getContext('2d')
  }
  ctx.drawImage(bitmap, 0, 0, size, size)
  return ctx.getImageData(0, 0, size, size)
}

export async function computeHash(file) {
  const imgData = await getImageData(file)
  return blockhash(imgData, 16, 2)
}

export function hammingDistance(h1, h2) {
  if (!h1 || !h2 || h1.length !== h2.length) return Infinity
  let dist = 0
  for (let i = 0; i < h1.length; i++) {
    if (h1[i] !== h2[i]) dist++
  }
  return dist
}

// Returns the closest existing photo and distance, or null if no near-duplicate
export function findDuplicate(newHash, existingPhotos, threshold = 15) {
  let closest = null
  let minDist = Infinity

  for (const photo of existingPhotos) {
    if (!photo.hash) continue
    const dist = hammingDistance(newHash, photo.hash)
    if (dist < minDist) {
      minDist = dist
      closest = photo
    }
  }

  return minDist <= threshold ? { photo: closest, distance: minDist } : null
}
