import imageCompression from 'browser-image-compression'
import { bmvbhash } from 'blockhash-core'

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
  return bmvbhash(imgData, 16) // returns hex string
}

function hexToBits(hex) {
  return hex.split('').map((c) => parseInt(c, 16).toString(2).padStart(4, '0')).join('')
}

export function hammingDistance(h1, h2) {
  if (!h1 || !h2) return Infinity
  const b1 = hexToBits(h1)
  const b2 = hexToBits(h2)
  if (b1.length !== b2.length) return Infinity
  let dist = 0
  for (let i = 0; i < b1.length; i++) {
    if (b1[i] !== b2[i]) dist++
  }
  return dist
}

export function findDuplicate(newHash, existingPhotos, threshold = 15) {
  let closest = null
  let minDist = Infinity
  for (const photo of existingPhotos) {
    if (!photo.hash) continue
    const dist = hammingDistance(newHash, photo.hash)
    if (dist < minDist) { minDist = dist; closest = photo }
  }
  return minDist <= threshold ? { photo: closest, distance: minDist } : null
}
