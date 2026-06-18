export interface LottieAnimationData {
  v?: string
  fr?: number
  ip?: number
  op?: number
  w?: number
  h?: number
  layers?: unknown[]
  assets?: LottieAsset[]
  meta?: Record<string, unknown>
  [key: string]: unknown
}

export interface LottieAsset {
  id?: string
  p?: string
  u?: string
  e?: number
  [key: string]: unknown
}

export interface LottieData {
  json: LottieAnimationData | null
  fileName: string
  size: number
}

export interface ImageData {
  name: string
  url: string
  size: number
  file?: File
}

export interface VideoData {
  url: string
  fileName: string
  size: number
}
