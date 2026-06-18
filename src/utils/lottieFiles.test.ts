import { describe, expect, it } from 'vitest'
import type { ImageData, LottieAnimationData } from '@/types/lottie'
import {
  formatFileSize,
  formatTime,
  getImagesTotalSize,
  getLottieFrameCount,
  getLottieFrameRate,
  isBrowserSupportedVideo,
  isLottieJSON,
  isVideoFile,
} from '@/utils/lottieFiles'

describe('lottieFiles utilities', () => {
  it('identifies supported video file extensions', () => {
    expect(isVideoFile('demo.mp4')).toBe(true)
    expect(isVideoFile('preview.MOV')).toBe(true)
    expect(isVideoFile('animation.json')).toBe(false)
  })

  it('checks browser video compatibility from file extension and user agent', () => {
    const chromeUa = 'Mozilla/5.0 AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36'
    const safariUa = 'Mozilla/5.0 AppleWebKit/605.1.15 Version/17.0 Safari/605.1.15'
    const firefoxUa = 'Mozilla/5.0 Gecko/20100101 Firefox/121.0'

    expect(isBrowserSupportedVideo('demo.mp4', chromeUa)).toBe(true)
    expect(isBrowserSupportedVideo('demo.mov', chromeUa)).toBe(false)
    expect(isBrowserSupportedVideo('demo.mov', safariUa)).toBe(true)
    expect(isBrowserSupportedVideo('demo.webm', firefoxUa)).toBe(true)
    expect(isBrowserSupportedVideo('demo.avi', chromeUa)).toBe(false)
  })

  it('detects Lottie JSON-like payloads', () => {
    expect(isLottieJSON({ layers: [], v: '5.7.0' })).toBe(true)
    expect(isLottieJSON({ layers: [], fr: 25 })).toBe(true)
    expect(isLottieJSON({ assets: [] })).toBe(false)
    expect(isLottieJSON(null)).toBe(false)
  })

  it('formats file sizes and time values', () => {
    expect(formatFileSize(0)).toBe('0 Bytes')
    expect(formatFileSize(1024)).toBe('1 KB')
    expect(formatFileSize(1536)).toBe('1.5 KB')
    expect(formatTime(0)).toBe('00:00')
    expect(formatTime(65.8)).toBe('01:05')
  })

  it('derives Lottie metadata and image totals', () => {
    const animation: LottieAnimationData = { fr: 25, ip: 10, op: 60 }
    const images: ImageData[] = [
      { name: 'a.png', size: 128, url: 'blob:a' },
      { name: 'b.png', size: 256, url: 'blob:b' },
    ]

    expect(getLottieFrameCount(animation)).toBe(50)
    expect(getLottieFrameRate(animation)).toBe(25)
    expect(getImagesTotalSize(images)).toBe(384)
  })
})
