import type { ImageData, LottieAnimationData } from '@/types/lottie'

export const collectDirectoryFiles = async (
  entry: FileSystemDirectoryEntry,
  files: File[]
): Promise<void> => {
  const reader = entry.createReader()
  const entries = await new Promise<FileSystemEntry[]>(resolve => {
    reader.readEntries(resolve)
  })

  for (const childEntry of entries) {
    if (childEntry.isFile) {
      const file = await new Promise<File>(resolve => {
        ;(childEntry as FileSystemFileEntry).file(resolve)
      })
      files.push(file)
    } else if (childEntry.isDirectory) {
      await collectDirectoryFiles(childEntry as FileSystemDirectoryEntry, files)
    }
  }
}

export const isVideoFile = (fileName: string): boolean => {
  const videoExtensions = ['.mp4', '.mov', '.avi', '.webm', '.mkv', '.flv', '.wmv']
  return videoExtensions.some(ext => fileName.toLowerCase().endsWith(ext))
}

export const isBrowserSupportedVideo = (
  fileName: string,
  userAgent = navigator.userAgent
): boolean => {
  const ext = fileName.split('.').pop()?.toLowerCase() || ''
  const normalizedUserAgent = userAgent.toLowerCase()
  const isSafari = normalizedUserAgent.includes('safari') && !normalizedUserAgent.includes('chrome')
  const isChrome = normalizedUserAgent.includes('chrome')
  const isFirefox = normalizedUserAgent.includes('firefox')
  const isEdge = normalizedUserAgent.includes('edge')

  switch (ext) {
    case 'mp4':
      return true
    case 'mov':
      return isSafari
    case 'webm':
      return isChrome || isFirefox || isEdge
    case 'avi':
    case 'mkv':
    case 'flv':
    case 'wmv':
    default:
      return false
  }
}

export const isLottieJSON = (json: unknown): boolean => {
  if (!json || typeof json !== 'object') return false

  const data = json as LottieAnimationData
  const hasLayers = Array.isArray(data.layers)
  const hasVersion = data.v !== undefined
  const hasFrameRate = data.fr !== undefined
  const hasInPoint = data.ip !== undefined
  const hasOutPoint = data.op !== undefined

  return Boolean(hasLayers && (hasVersion || hasFrameRate || hasInPoint || hasOutPoint))
}

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes'

  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`
}

export const formatTime = (seconds: number): string => {
  if (!seconds || isNaN(seconds)) return '00:00'

  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)

  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

export const getLottieFrameCount = (json: LottieAnimationData | null): number => {
  if (!json) return 0

  const inPoint = json.ip || 0
  const outPoint = json.op || 0

  return Math.floor(outPoint - inPoint) || 0
}

export const getLottieFrameRate = (json: LottieAnimationData | null): number => {
  return json?.fr ?? 0
}

export const getImagesTotalSize = (images: ImageData[]): number => {
  return images.reduce((total, img) => total + img.size, 0)
}
