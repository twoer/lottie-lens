<template>
  <div class="space-y-4" :class="{ 'home-empty-state': !hasFiles, 'home-workspace': hasFiles }">
    <UploadSection
      :file-name="lottieData.fileName"
      :has-files="Boolean(hasFiles)"
      :is-upload-complete="isUploadComplete"
      :show-debug-panel="showDebugPanel"
      @clear-project="handleClearProject"
      @empty-selection="handleEmptyFolderSelection"
      @files-selected="processFiles"
      @toggle-debug-panel="handleToggleDebugPanel"
    />

    <!-- 调试面板 -->
    <transition name="debug-reveal">
      <div v-if="showDebugPanel" class="debug-panel-shell" :class="{ 'is-empty': !hasFiles }">
        <div class="debug-panel">
          <div class="debug-panel-header">
            <p class="debug-panel-title">调试信息</p>
            <Button
              aria-label="刷新调试信息"
              size="icon"
              variant="ghost"
              @click="handleRefreshDebugInfo"
            >
              <RefreshCw class="h-4 w-4" />
            </Button>
          </div>

          <div class="debug-status-grid">
            <div class="debug-status-item">
              <span>文件</span>
              <strong :class="hasFiles ? 'is-ready' : 'is-muted'">
                {{ hasFiles ? '已识别' : '未选择' }}
              </strong>
            </div>
            <div class="debug-status-item">
              <span>Lottie</span>
              <strong :class="!!lottieData.json ? 'is-ready' : 'is-muted'">
                {{ lottieData.json ? '已加载' : '未检测' }}
              </strong>
            </div>
            <div class="debug-status-item">
              <span>动画</span>
              <strong :class="!!lottieAnimation ? 'is-ready' : 'is-muted'">
                {{ lottieAnimation ? '实例正常' : '待初始化' }}
              </strong>
            </div>
            <div class="debug-status-item">
              <span>图片</span>
              <strong :class="imagesData.length > 0 ? 'is-ready' : 'is-muted'">
                {{ imagesData.length }}个
              </strong>
            </div>
          </div>

          <template v-if="hasFiles">
            <div class="debug-detail-grid">
              <div class="debug-detail-card">
                <p class="debug-detail-title">文件信息</p>
                <p class="truncate">{{ lottieData.fileName || '无' }}</p>
                <p>
                  状态: {{ lottieAnimation && lottieAnimation.isLoaded ? '已加载' : '加载中...' }}
                </p>
                <p>帧数: {{ frameCount }} | 帧率: {{ frameRate }}fps</p>
              </div>
              <div class="debug-detail-card">
                <p class="debug-detail-title">图片资源</p>
                <div class="max-h-12 overflow-y-auto">
                  <p v-for="img in imagesData.slice(0, 3)" :key="img.name" class="truncate">
                    {{ img.name }}
                  </p>
                  <p v-if="imagesData.length > 3" class="text-gray-400">
                    ...还有 {{ imagesData.length - 3 }} 个
                  </p>
                  <p v-if="imagesData.length === 0" class="text-gray-400">无图片文件</p>
                </div>
              </div>
            </div>

            <div class="debug-actions">
              <Button size="sm" variant="outline" @click="handleDebugLottieData">
                <FileText class="h-4 w-4" />
                调试 JSON 数据
              </Button>
              <Button
                size="sm"
                variant="outline"
                :disabled="!lottieData.json"
                @click="handleReprocessImageAssets"
              >
                <Image class="h-4 w-4" />
                重新处理图片
              </Button>
            </div>

            <p class="debug-tip">打开浏览器控制台可以查看更完整的解析日志。</p>
          </template>

          <p v-else class="debug-empty-note">
            选择 Lottie 项目文件夹后，这里会显示文件识别、动画实例和资源映射状态。
          </p>
        </div>
      </div>
    </transition>

    <!-- 文件列表和预览区域 -->
    <div v-if="hasFiles" class="preview-grid">
      <!-- Lottie 动画预览 -->
      <div v-if="lottieData.json" class="panel-card lottie-section">
        <div class="panel-header">
          <h2 class="panel-title">
            <CirclePlay class="mr-2 h-4 w-4 text-primary-500" />
            Lottie 动画
          </h2>
          <div class="flex items-center space-x-2">
            <Checkbox v-model="showLottieBackground">显示背景</Checkbox>
          </div>
        </div>

        <!-- Lottie 动画容器 -->
        <div
          ref="lottieContainer"
          class="lottie-container mb-2"
          :class="{ 'lottie-with-background': showLottieBackground }"
        >
          <div v-if="!lottieData.json" class="text-gray-400">
            <FileText class="mx-auto mb-1 h-10 w-10" />
            <p class="text-sm">等待加载 Lottie 文件...</p>
          </div>
          <div v-else-if="!lottieAnimation || !lottieAnimation.isLoaded" class="text-gray-400">
            <LoaderCircle class="mx-auto mb-1 h-10 w-10 animate-spin" />
            <p class="text-sm">加载动画中...</p>
          </div>
        </div>

        <!-- 动画控制栏 -->
        <div class="control-panel">
          <div class="transport-row">
            <button
              class="control-button"
              :aria-label="isLottiePlaying ? '暂停动画' : '播放动画'"
              @click="handleToggleLottiePlay"
            >
              <Play v-if="!isLottiePlaying" class="control-icon is-play text-primary-500" />
              <Pause v-else class="control-icon is-pause text-gray-600" />
            </button>

            <button class="control-button" aria-label="重置动画" @click="handleStopLottie">
              <RefreshCw class="control-icon text-gray-600" />
            </button>
          </div>

          <div class="slider-stack">
            <div class="slider-row">
              <span>速度</span>
              <Slider
                v-model="lottieSpeed"
                :min="0.1"
                :max="2"
                :step="0.1"
                class="flex-1"
                @change="handleUpdateLottieSpeed"
              />
              <strong>{{ lottieSpeed }}x</strong>
            </div>

            <div class="slider-row">
              <span>进度</span>
              <Slider
                v-model="lottieProgress"
                :min="0"
                :max="100"
                class="flex-1"
                @change="handleSeekLottie"
              />
              <strong>{{ lottieProgress }}%</strong>
            </div>
          </div>
        </div>
      </div>

      <!-- 视频预览 -->
      <div v-if="videoData.url" class="panel-card">
        <div class="panel-header">
          <h2 class="panel-title">
            <Film class="mr-2 h-4 w-4 text-primary-500" />
            演示视频
          </h2>
          <div class="flex items-center space-x-2"></div>
        </div>

        <!-- 视频容器 -->
        <div class="video-container mb-2" :class="{ 'is-fallback': !isVideoSupported }">
          <video
            v-if="isVideoSupported"
            ref="videoRef"
            :src="videoData.url"
            controls
            class="w-full h-full"
            @play="handleVideoPlay"
            @pause="handleVideoPause"
            @timeupdate="handleUpdateVideoProgress"
            @error="handleVideoError"
          />

          <div v-else class="video-fallback" role="status">
            <div class="video-fallback-card">
              <span class="video-format-badge">{{ videoExtension }}</span>
              <h3>当前浏览器无法播放此视频</h3>
              <p>
                <strong>{{ videoData.fileName }}</strong>
                建议转为 MP4 后重新选择项目。
              </p>
              <div class="video-advice-list">
                <span>Chrome / Edge 优先使用 MP4</span>
                <span>Safari 通常可以播放 MOV</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 视频信息 -->
        <div class="media-info-panel">
          <div class="media-info-grid">
            <div>
              <span class="text-gray-600">状态:</span>
              <span class="ml-1 font-medium">
                {{ isVideoSupported ? '可播放' : '格式不兼容' }}
              </span>
            </div>
            <div>
              <span class="text-gray-600">时长:</span>
              <span class="ml-1 font-medium">{{ formatTime(videoDuration) }}</span>
            </div>
            <div v-if="isVideoSupported">
              <span class="text-gray-600">当前:</span>
              <span class="ml-1 font-medium">{{ formatTime(videoCurrentTime) }}</span>
            </div>
          </div>
        </div>
      </div>
      <div v-else class="panel-card video-empty-card">
        <div class="panel-header">
          <h2 class="panel-title">
            <Film class="mr-2 h-4 w-4 text-primary-500" />
            演示视频
          </h2>
        </div>

        <div class="video-empty-state" role="status">
          <div class="video-empty-icon">
            <Film class="h-6 w-6" />
          </div>
          <h3>未检测到演示视频</h3>
          <p>
            演示视频是可选内容。需要并排对比时，把 MP4、WebM 或 MOV 一起放入项目文件夹后重新选择。
          </p>
          <div class="video-empty-tags">
            <span>MP4 推荐</span>
            <span>支持 WebM / MOV</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 文件信息面板 -->
    <div v-if="hasFiles" class="panel-card file-info-card">
      <h2 class="panel-title file-info-title">
        <FileText class="mr-2 h-4 w-4 text-primary-500" />
        文件信息
      </h2>

      <div class="file-info-grid">
        <div class="file-info-block">
          <h3>Lottie 文件</h3>
          <div v-if="lottieData.json" class="meta-list">
            <p>
              <span>文件名</span>
              <strong>{{ lottieData.fileName }}</strong>
            </p>
            <p>
              <span>大小</span>
              <strong>{{ formatFileSize(lottieData.size) }}</strong>
            </p>
            <p>
              <span>帧数 / 帧率</span>
              <strong>{{ frameCount }} / {{ frameRate }} fps</strong>
            </p>
          </div>
          <div v-else class="empty-meta">未检测到 JSON 文件</div>
        </div>

        <div class="file-info-block">
          <h3>图片资源</h3>
          <div v-if="imagesData.length > 0" class="meta-list">
            <p>
              <span>数量</span>
              <strong>{{ imagesData.length }} 个文件</strong>
            </p>
            <p>
              <span>总大小</span>
              <strong>{{ formatFileSize(imagesTotalSize) }}</strong>
            </p>
            <p>
              <span>预览</span>
              <strong class="truncate">
                {{ imagePreviewNames }}
              </strong>
            </p>
          </div>
          <div v-else class="empty-meta">未检测到图片文件夹</div>
        </div>

        <div class="file-info-block">
          <h3>演示视频</h3>
          <div v-if="videoData.url" class="meta-list">
            <p>
              <span>文件名</span>
              <strong>{{ videoData.fileName }}</strong>
            </p>
            <p>
              <span>大小</span>
              <strong>{{ formatFileSize(videoData.size) }}</strong>
            </p>
            <p>
              <span>时长</span>
              <strong>{{ formatTime(videoDuration) }}</strong>
            </p>
          </div>
          <div v-else class="empty-meta">未检测到演示视频</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch, nextTick, onUnmounted } from 'vue'
import {
  CirclePlay,
  Film,
  FileText,
  Image,
  LoaderCircle,
  Pause,
  Play,
  RefreshCw,
} from '@lucide/vue'
import lottie, { type AnimationItem } from 'lottie-web'
import Button from '@/components/ui/Button.vue'
import Checkbox from '@/components/ui/Checkbox.vue'
import Slider from '@/components/ui/Slider.vue'
import UploadSection from '@/components/UploadSection.vue'
import { toast } from '@/composables/useToast'
import type {
  ImageData,
  LottieAnimationData,
  LottieAsset,
  LottieData,
  VideoData,
} from '@/types/lottie'
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

const isDev = import.meta.env.DEV

// 响应式数据
const lottieContainer = ref<HTMLElement>()
const videoRef = ref<HTMLVideoElement>()
const showDebugPanel = ref(false)
const isUploadComplete = ref(false)

const lottieData = reactive<LottieData>({
  json: null,
  fileName: '',
  size: 0,
})

const imagesData = ref<ImageData[]>([])
const generatedAssetUrls = ref<string[]>([])
const videoData = reactive<VideoData>({
  url: '',
  fileName: '',
  size: 0,
})

// Lottie 动画控制
const lottieAnimation = ref<AnimationItem | null>(null)
const isLottiePlaying = ref(false)
const lottieSpeed = ref(1)
const lottieProgress = ref(0)
const showLottieBackground = ref(false)

// 视频控制
const isVideoPlaying = ref(false)
const videoDuration = ref(0)
const videoCurrentTime = ref(0)

// 计算属性
const hasFiles = computed(() => {
  return lottieData.json || videoData.url || imagesData.value.length > 0
})
const frameCount = computed(() => getLottieFrameCount(lottieData.json))
const frameRate = computed(() => getLottieFrameRate(lottieData.json))
const imagesTotalSize = computed(() => getImagesTotalSize(imagesData.value))
const isVideoSupported = computed(() => {
  return !videoData.fileName || isBrowserSupportedVideo(videoData.fileName)
})
const videoExtension = computed(() => {
  return videoData.fileName.split('.').pop()?.toUpperCase() || 'VIDEO'
})
const imagePreviewNames = computed(() => {
  const names = imagesData.value.slice(0, 3).map(img => img.name)
  if (imagesData.value.length > 3) {
    names.push(`另 ${imagesData.value.length - 3} 个`)
  }
  return names.join(' / ')
})

const resetProjectState = () => {
  cleanupGeneratedAssetUrls()

  if (lottieAnimation.value) {
    lottieAnimation.value.destroy()
    lottieAnimation.value = null
  }

  imagesData.value.forEach(img => {
    if (img.url && img.url.startsWith('blob:')) {
      URL.revokeObjectURL(img.url)
    }
  })

  if (videoData.url && videoData.url.startsWith('blob:')) {
    URL.revokeObjectURL(videoData.url)
  }

  lottieData.json = null
  lottieData.fileName = ''
  lottieData.size = 0
  imagesData.value = []
  videoData.url = ''
  videoData.fileName = ''
  videoData.size = 0
  isUploadComplete.value = false
  isLottiePlaying.value = false
  lottieSpeed.value = 1
  lottieProgress.value = 0
  showLottieBackground.value = false
  isVideoPlaying.value = false
  videoDuration.value = 0
  videoCurrentTime.value = 0
}

const handleEmptyFolderSelection = () => {
  toast({
    title: '未检测到文件',
    description: '请确保选择了包含 Lottie 文件的文件夹',
    variant: 'warning',
  })
  isUploadComplete.value = Boolean(hasFiles.value)
}

const processFiles = async (files: File[]) => {
  try {
    resetProjectState()

    let lottieFound = false
    let imageCount = 0
    let videoFound = false

    for (const file of files) {
      // 处理 JSON 文件
      if (file.name.endsWith('.json')) {
        try {
          const text = await file.text()
          const json = JSON.parse(text)

          if (isLottieJSON(json)) {
            lottieData.json = json
            lottieData.fileName = file.name
            lottieData.size = file.size
            lottieFound = true
          } else {
            // 暂时也加载这个 JSON，用于测试
            lottieData.json = json
            lottieData.fileName = file.name
            lottieData.size = file.size
            lottieFound = true
          }
        } catch (e) {
          if (isDev) {
            console.error('Invalid JSON file:', file.name, e)
          }
        }
      }

      // 处理图片文件
      else if (file.type.startsWith('image/')) {
        // 为每个图片生成唯一的 blob URL
        const url = URL.createObjectURL(file)
        imagesData.value.push({
          name: file.name,
          url,
          size: file.size,
          file: file, // 保存原始文件引用,便于后续处理
        })
        imageCount++
      }

      // 处理视频文件
      else if (isVideoFile(file.name)) {
        videoData.url = URL.createObjectURL(file)
        videoData.fileName = file.name
        videoData.size = file.size
        videoFound = true
      }
    }

    if (!lottieFound && imageCount === 0 && !videoFound) {
      toast({
        title: '未找到 Lottie 相关文件',
        description: '请确认文件夹内容',
        variant: 'warning',
      })
      isUploadComplete.value = false
    } else {
      isUploadComplete.value = true

      // 如果找到了 Lottie 文件，延迟初始化并滚动到播放区域
      if (lottieFound) {
        setTimeout(() => {
          initLottie()
          // 延迟自动播放动画
          setTimeout(() => {
            handleAutoPlayLottie()
          }, 500)
        }, 200)
      }
    }
  } catch (error) {
    toast({ title: '文件处理失败', variant: 'destructive' })
    if (isDev) {
      console.error('Error processing files:', error)
    }
  }
}

const handleClearProject = () => {
  resetProjectState()
  showDebugPanel.value = false
  toast({ title: '已清空当前项目', variant: 'success' })
}

// 自动播放 Lottie 动画
const handleAutoPlayLottie = () => {
  if (lottieAnimation.value && lottieAnimation.value.isLoaded) {
    try {
      lottieAnimation.value.play()
      isLottiePlaying.value = true

      // 同时播放视频（如果有）
      if (videoRef.value && videoData.url) {
        videoRef.value.play().catch(() => {
          // 视频自动播放失败（通常因为浏览器策略），静默处理
        })
      }
    } catch (error) {
      if (isDev) {
        console.error('Auto-play failed:', error)
      }
      toast({ title: '自动播放失败', variant: 'destructive' })
    }
  } else {
    // 延迟重试
    setTimeout(() => {
      if (lottieAnimation.value && lottieAnimation.value.isLoaded) {
        handleAutoPlayLottie()
      }
    }, 1000)
  }
}

// Lottie 动画控制
const initLottie = async () => {
  if (!lottieData.json || !lottieContainer.value) {
    return
  }

  // 确保容器元素存在且可用
  if (!lottieContainer.value || !document.contains(lottieContainer.value)) {
    return
  }

  await nextTick()

  // 清理之前的动画
  if (lottieAnimation.value) {
    try {
      lottieAnimation.value.destroy()
    } catch (error) {
      if (isDev) {
        console.warn('Error destroying previous animation:', error)
      }
    }
    lottieAnimation.value = null
  }
  cleanupGeneratedAssetUrls()

  try {
    // 处理图片资源路径
    const animationData = processImageAssets(lottieData.json)

    lottieAnimation.value = lottie.loadAnimation({
      container: lottieContainer.value,
      renderer: 'svg',
      loop: false, // 只播放一次
      autoplay: false,
      animationData: animationData,
    })

    // 确保动画对象创建成功
    if (!lottieAnimation.value) {
      if (isDev) {
        console.error('Failed to create Lottie animation')
      }
      toast({ title: 'Lottie 动画创建失败', variant: 'destructive' })
      return
    }

    lottieAnimation.value.addEventListener('DOMLoaded', () => {
      // 动画加载完成
    })

    // 监听动画完成事件
    lottieAnimation.value.addEventListener('complete', () => {
      isLottiePlaying.value = false
    })

    lottieAnimation.value.addEventListener('enterFrame', () => {
      if (lottieAnimation.value && lottieAnimation.value.totalFrames) {
        const progress =
          (lottieAnimation.value.currentFrame / lottieAnimation.value.totalFrames) * 100
        lottieProgress.value = Math.round(progress)
      }
    })

    lottieAnimation.value.addEventListener('error', (...args: unknown[]) => {
      if (isDev) {
        console.error('Lottie animation error:', args)
      }
      toast({ title: 'Lottie 动画加载失败', variant: 'destructive' })
    })
  } catch (error) {
    if (isDev) {
      console.error('Error loading Lottie:', error)
    }
    toast({ title: 'Lottie 动画初始化失败', variant: 'destructive' })
  }
}

const processImageAssets = (animationData: LottieAnimationData): LottieAnimationData => {
  if (!animationData.assets || !Array.isArray(animationData.assets)) {
    return animationData
  }

  // 创建动画数据的副本
  const processedData = JSON.parse(JSON.stringify(animationData)) as LottieAnimationData

  // 处理每个图片资源
  if (processedData.assets) {
    processedData.assets = processedData.assets.map((asset: LottieAsset) => {
      if (asset.p && asset.u) {
        // 在上传的图片文件中查找匹配的图片
        const matchingImage = imagesData.value.find(
          img => asset.p && (img.name === asset.p || img.name.includes(asset.p.split('.')[0]))
        )

        if (matchingImage) {
          // 为每次加载创建新的 blob URL,避免缓存问题
          let imageUrl = matchingImage.url

          // 如果有原始文件,重新创建 blob URL 确保唯一性
          if (matchingImage.file) {
            imageUrl = URL.createObjectURL(matchingImage.file)
            generatedAssetUrls.value.push(imageUrl)
          }

          // 使用上传的图片 URL
          return {
            ...asset,
            p: imageUrl,
            u: '', // 清空路径，使用完整 URL
          }
        } else {
          // 尝试使用相对路径
          return {
            ...asset,
            u: './images/',
          }
        }
      }
      return asset
    })
  }

  return processedData
}

const handleRefreshDebugInfo = () => {
  toast({ title: '调试信息已刷新', variant: 'success' })
}

const handleReprocessImageAssets = () => {
  if (lottieData.json) {
    initLottie()
  }
}

// 调试 Lottie 数据
const handleDebugLottieData = () => {
  console.log('=== Lottie 数据调试信息 ===')
  console.log('Lottie JSON 数据:', lottieData.json)
  console.log('Lottie 文件信息:', {
    fileName: lottieData.fileName,
    size: lottieData.size,
  })
  console.log('动画实例:', lottieAnimation.value)
  console.log('图片资源:', imagesData.value)
  console.log('视频数据:', videoData)
  console.log('当前状态:', {
    isPlaying: isLottiePlaying.value,
    speed: lottieSpeed.value,
    progress: lottieProgress.value,
  })

  if (lottieData.json) {
    console.log('动画基本信息:', {
      frameRate: lottieData.json.fr,
      startFrame: lottieData.json.ip,
      endFrame: lottieData.json.op,
      width: lottieData.json.w,
      height: lottieData.json.h,
      totalFrames: frameCount.value,
    })

    console.log('图层信息:', {
      layers: lottieData.json.layers?.length || 0,
      assets: lottieData.json.assets?.length || 0,
    })
  }

  toast({ title: '调试信息已输出到控制台', variant: 'success' })
}

const handleToggleLottiePlay = () => {
  if (!lottieAnimation.value) {
    toast({ title: 'Lottie 动画未加载完成', variant: 'warning' })
    return
  }

  try {
    if (isLottiePlaying.value) {
      lottieAnimation.value.pause()
      // 同时暂停视频
      if (videoRef.value && !videoRef.value.paused) {
        videoRef.value.pause()
      }
    } else {
      lottieAnimation.value.play()
      // 同时播放视频
      if (videoRef.value && videoData.url) {
        videoRef.value.play().catch(() => {
          // 如果视频播放失败，不影响 Lottie 播放
        })
      }
    }
    isLottiePlaying.value = !isLottiePlaying.value
  } catch (error) {
    if (isDev) {
      console.error('Error toggling play state:', error)
    }
    toast({ title: '播放控制失败', variant: 'destructive' })
  }
}

const handleStopLottie = () => {
  if (!lottieAnimation.value) {
    return
  }

  try {
    lottieAnimation.value.stop()
    // 同时停止视频
    if (videoRef.value && !videoRef.value.paused) {
      videoRef.value.pause()
      videoRef.value.currentTime = 0
    }
    isLottiePlaying.value = false
    lottieProgress.value = 0
  } catch (error) {
    if (isDev) {
      console.error('Error stopping animation:', error)
    }
    toast({ title: '停止动画失败', variant: 'destructive' })
  }
}

// 切换调试面板显示
const handleToggleDebugPanel = () => {
  showDebugPanel.value = !showDebugPanel.value
}

const handleUpdateLottieSpeed = () => {
  if (lottieAnimation.value) {
    lottieAnimation.value.setSpeed(lottieSpeed.value)
  }
}

const handleSeekLottie = (progress: number) => {
  if (lottieAnimation.value && lottieAnimation.value.totalFrames) {
    const frame = Math.round((progress / 100) * lottieAnimation.value.totalFrames)
    lottieAnimation.value.goToAndStop(frame, true)
  }
}

const handleUpdateVideoProgress = () => {
  if (videoRef.value) {
    videoCurrentTime.value = videoRef.value.currentTime
  }
}

// 处理视频播放事件
const handleVideoPlay = () => {
  isVideoPlaying.value = true
}

// 处理视频暂停事件
const handleVideoPause = () => {
  isVideoPlaying.value = false
}

// 处理视频错误事件
const handleVideoError = (event: Event) => {
  if (isDev) {
    console.error('Video playback error:', event)
  }

  if (videoData.fileName && !isBrowserSupportedVideo(videoData.fileName)) {
    return
  }

  toast({ title: '视频播放失败', description: '请检查文件格式或网络连接', variant: 'destructive' })
}

const cleanupGeneratedAssetUrls = () => {
  generatedAssetUrls.value.forEach(url => {
    URL.revokeObjectURL(url)
  })
  generatedAssetUrls.value = []
}

// 组件卸载时清理资源
onUnmounted(() => {
  // 清理 Lottie 动画
  if (lottieAnimation.value) {
    lottieAnimation.value.destroy()
    lottieAnimation.value = null
  }
  cleanupGeneratedAssetUrls()

  // 清理图片 blob URLs
  imagesData.value.forEach(img => {
    if (img.url && img.url.startsWith('blob:')) {
      URL.revokeObjectURL(img.url)
    }
  })

  // 清理视频 blob URL
  if (videoData.url && videoData.url.startsWith('blob:')) {
    URL.revokeObjectURL(videoData.url)
  }
})

// 监听 Lottie 数据变化（仅在首次加载时初始化）
watch(
  () => lottieData.json,
  async (newJson, oldJson) => {
    // 只在从null变为有数据时初始化，避免压缩时重新初始化
    if (newJson && !oldJson) {
      setTimeout(() => {
        initLottie()
      }, 100)
    }
  },
  { immediate: true }
)

// 监听图片数据变化（当图片加载完成后重新初始化 Lottie）
watch(
  () => imagesData.value.length,
  () => {
    if (lottieData.json && lottieData.json.assets?.some((asset: LottieAsset) => asset.p)) {
      setTimeout(() => {
        initLottie()
      }, 100)
    }
  }
)

// 监听视频加载完成
watch(
  () => videoData.url,
  newUrl => {
    if (newUrl && videoRef.value) {
      nextTick(() => {
        videoRef.value?.addEventListener(
          'loadedmetadata',
          () => {
            videoDuration.value = videoRef.value?.duration || 0
          },
          { once: true }
        )
        videoRef.value?.load()
      })
    }
  }
)
</script>

<style scoped>
.home-empty-state {
  padding-top: min(7vh, 56px);
}

.home-workspace {
  max-width: 1360px;
  margin: 0 auto;
}

.preview-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}

.debug-panel-shell {
  display: grid;
  grid-template-rows: 1fr;
  margin: -8px 0 16px;
  overflow: hidden;
}

.debug-panel-shell.is-empty {
  width: min(100%, 1040px);
  margin: -6px auto 16px;
}

.debug-reveal-enter-active,
.debug-reveal-leave-active {
  transition:
    grid-template-rows 0.22s ease,
    margin 0.22s ease,
    opacity 0.18s ease;
}

.debug-reveal-enter-from,
.debug-reveal-leave-to {
  grid-template-rows: 0fr;
  margin-top: -8px;
  margin-bottom: 0;
  opacity: 0;
}

.debug-reveal-enter-to,
.debug-reveal-leave-from {
  grid-template-rows: 1fr;
  opacity: 1;
}

.debug-panel {
  min-height: 0;
  padding: 13px;
  color: var(--app-muted);
  background: rgb(255 255 255 / 82%);
  border: 1px solid var(--app-border);
  border-radius: 8px;
  box-shadow: 0 4px 14px rgb(15 23 42 / 4%);
}

.debug-panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
}

.debug-panel-title {
  margin: 0;
  font-size: 14px;
  font-weight: 750;
  color: var(--app-foreground);
  letter-spacing: 0;
}

.debug-status-grid,
.debug-detail-grid {
  display: grid;
  gap: 8px;
  margin-bottom: 8px;
}

.debug-status-grid {
  grid-template-columns: repeat(4, minmax(0, 1fr));
}

.debug-detail-grid {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.debug-status-item,
.debug-detail-card {
  min-width: 0;
  padding: 10px;
  font-size: 12px;
  line-height: 1.45;
  background: rgb(248 250 252 / 50%);
  border: 1px solid rgb(15 23 42 / 4%);
  border-radius: 8px;
}

.debug-status-item {
  display: grid;
  gap: 3px;
}

.debug-status-item span {
  color: #94a3b8;
}

.debug-status-item strong,
.debug-detail-title {
  font-weight: 750;
  color: var(--app-foreground);
}

.debug-detail-card p {
  margin: 0;
}

.debug-detail-title {
  margin-bottom: 4px !important;
}

.is-ready {
  color: var(--app-primary-ink) !important;
}

.is-muted {
  color: #94a3b8 !important;
}

.debug-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 8px;
}

.debug-tip {
  padding: 9px 10px;
  margin: 0;
  font-size: 12px;
  line-height: 1.5;
  color: var(--app-primary-ink);
  background: rgb(0 221 179 / 7%);
  border: 1px solid rgb(0 196 160 / 12%);
  border-radius: 8px;
}

.debug-empty-note {
  padding: 10px 12px;
  margin: 0;
  font-size: 12px;
  line-height: 1.55;
  color: #64748b;
  background: rgb(248 250 252 / 62%);
  border: 1px solid rgb(15 23 42 / 4%);
  border-radius: 8px;
}

.panel-card {
  padding: 13px;
  background: rgb(255 255 255 / 82%);
  border: 1px solid var(--app-border);
  border-radius: 8px;
  box-shadow: 0 4px 14px rgb(15 23 42 / 4%);
}

.panel-header {
  display: flex;
  gap: 12px;
  align-items: center;
  justify-content: space-between;
  min-height: 32px;
  margin-bottom: 12px;
}

.panel-title {
  display: flex;
  align-items: center;
  margin: 0;
  font-size: 16px;
  font-weight: 750;
  line-height: 1.2;
  color: #1f2937;
  letter-spacing: 0;
}

.file-info-card {
  box-shadow: 0 3px 12px rgb(15 23 42 / 3%);
}

.file-info-title {
  margin-bottom: 12px;
}

.lottie-with-background {
  background-color: #f8f9fa;
}

.control-panel,
.media-info-panel {
  padding: 10px 12px;
  background: rgb(248 250 252 / 62%);
  border: 1px solid var(--app-border);
  border-radius: 8px;
}

.transport-row {
  display: flex;
  gap: 10px;
  align-items: center;
  justify-content: center;
  margin-bottom: 10px;
}

.slider-stack {
  display: grid;
  gap: 7px;
}

.slider-row {
  display: grid;
  grid-template-columns: 40px minmax(0, 1fr) 42px;
  gap: 10px;
  align-items: center;
}

.slider-row span,
.slider-row strong {
  font-size: 12px;
  color: var(--app-muted);
}

.slider-row strong {
  font-weight: 700;
  text-align: right;
}

.media-info-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
  font-size: 12px;
}

.video-empty-card {
  display: flex;
  flex-direction: column;
}

.video-empty-state {
  display: grid;
  place-items: center;
  align-content: center;
  flex: 1;
  min-height: 352px;
  padding: 28px;
  color: var(--app-muted);
  text-align: center;
  background:
    linear-gradient(135deg, rgb(248 250 252 / 70%), rgb(255 255 255 / 86%)),
    repeating-linear-gradient(
      -45deg,
      rgb(15 23 42 / 2%) 0,
      rgb(15 23 42 / 2%) 1px,
      transparent 1px,
      transparent 12px
    );
  border: 1px dashed rgb(15 23 42 / 8%);
  border-radius: 8px;
}

.video-empty-icon {
  display: grid;
  place-items: center;
  width: 44px;
  height: 44px;
  margin-bottom: 12px;
  color: var(--app-primary-ink);
  background: rgb(0 221 179 / 8%);
  border: 1px solid rgb(0 196 160 / 14%);
  border-radius: 10px;
}

.video-empty-state h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 750;
  color: var(--app-foreground);
}

.video-empty-state p {
  max-width: 420px;
  margin: 8px 0 14px;
  font-size: 13px;
  line-height: 1.65;
}

.video-empty-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  justify-content: center;
}

.video-empty-tags span {
  padding: 6px 9px;
  font-size: 12px;
  color: #526071;
  background: rgb(255 255 255 / 72%);
  border: 1px solid rgb(15 23 42 / 6%);
  border-radius: 999px;
}

.video-fallback {
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  padding: 20px;
  background:
    radial-gradient(circle at 50% 35%, rgb(0 221 179 / 12%), transparent 34%),
    linear-gradient(180deg, #111827, #0f172a);
  border-radius: 8px;
}

.video-fallback-card {
  display: grid;
  justify-items: center;
  width: min(430px, 100%);
  color: white;
  text-align: center;
}

.video-format-badge {
  display: inline-grid;
  place-items: center;
  min-width: 58px;
  height: 34px;
  padding: 0 12px;
  margin-bottom: 14px;
  font-size: 12px;
  font-weight: 800;
  color: #fbbf24;
  letter-spacing: 0.06em;
  background: rgb(251 191 36 / 10%);
  border: 1px solid rgb(251 191 36 / 42%);
  border-radius: 8px;
}

.video-fallback-card h3 {
  margin: 0 0 8px;
  font-size: 18px;
  font-weight: 750;
}

.video-fallback-card > p {
  max-width: 360px;
  margin: 0 0 16px;
  font-size: 13px;
  line-height: 1.6;
  color: rgb(255 255 255 / 76%);
}

.video-fallback-card strong {
  color: white;
}

.video-advice-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  justify-content: center;
}

.video-advice-list span {
  padding: 7px 10px;
  font-size: 12px;
  color: rgb(255 255 255 / 78%);
  background: rgb(255 255 255 / 8%);
  border: 1px solid rgb(255 255 255 / 9%);
  border-radius: 999px;
}

.file-info-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 10px;
}

.file-info-block {
  min-width: 0;
  padding: 12px;
  background: rgb(248 250 252 / 50%);
  border: 1px solid var(--app-border);
  border-radius: 8px;
}

.file-info-block h3 {
  margin: 0 0 9px;
  font-size: 13px;
  font-weight: 750;
  color: var(--app-foreground);
}

.meta-list {
  display: grid;
  gap: 6px;
}

.meta-list p {
  display: grid;
  grid-template-columns: 72px minmax(0, 1fr);
  gap: 10px;
  margin: 0;
  font-size: 12px;
  line-height: 1.4;
}

.meta-list span {
  color: #94a3b8;
}

.meta-list strong {
  min-width: 0;
  font-weight: 650;
  color: #526071;
}

.empty-meta {
  font-size: 12px;
  color: #94a3b8;
}

@media (width <= 768px) {
  .home-empty-state {
    padding-top: 0;
  }

  .home-workspace {
    max-width: none;
  }

  .preview-grid {
    grid-template-columns: 1fr;
  }

  .file-info-grid {
    grid-template-columns: 1fr;
  }

  .debug-status-grid,
  .debug-detail-grid {
    grid-template-columns: 1fr;
  }

  .panel-card {
    padding: 12px;
  }

  .panel-header {
    align-items: flex-start;
    flex-direction: column;
  }
}
</style>
