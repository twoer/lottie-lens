<template>
  <section class="upload-section" :class="{ minimized: showsCompactState }">
    <div
      class="drop-zone"
      :class="{
        dragover: isDragging,
        minimized: showsCompactState,
      }"
      @drop="handleDrop"
      @dragover.prevent="isDragging = true"
      @dragleave.prevent="isDragging = false"
      @dragenter.prevent
    >
      <input
        ref="folderInput"
        type="file"
        webkitdirectory
        directory
        multiple
        class="hidden"
        @change="handleFolderSelect"
      />

      <div v-if="!showsCompactState" class="upload-layout">
        <div class="upload-main">
          <div class="upload-icon">
            <Folder class="h-8 w-8" />
          </div>

          <div class="upload-copy">
            <p class="upload-kicker">Local Lottie inspection</p>
            <h2>拖入 Lottie 项目文件夹</h2>
            <p>一次读取动画 JSON、图片资源和演示视频，所有处理都在本地完成。</p>
          </div>

          <div class="upload-actions">
            <Button @click="handleTriggerFolderInput">
              <FolderOpen class="h-4 w-4" />
              选择文件夹
            </Button>
            <Button variant="secondary" @click="$emit('toggle-debug-panel')">
              <component :is="showDebugPanel ? EyeOff : Eye" class="h-4 w-4" />
              {{ showDebugPanel ? '隐藏调试' : '显示调试' }}
            </Button>
          </div>
        </div>

        <div class="upload-signals" aria-label="Supported project contents">
          <div v-for="item in signalItems" :key="item.label" class="signal-item">
            <span class="signal-mark">{{ item.mark }}</span>
            <span>
              <strong>{{ item.label }}</strong>
              <small>{{ item.detail }}</small>
            </span>
          </div>
        </div>
      </div>

      <div v-else class="upload-complete">
        <div class="complete-summary">
          <div class="complete-icon">
            <CircleCheck class="h-4 w-4" />
          </div>
          <div>
            <h3>上传完成 - {{ completedTitle }}</h3>
            <p>拖拽新文件夹、重新选择或清空项目</p>
          </div>
        </div>

        <div class="complete-actions">
          <Button size="sm" @click="handleTriggerFolderInput">
            <FolderOpen class="h-4 w-4" />
            重新选择
          </Button>
          <Button size="sm" variant="secondary" @click="$emit('clear-project')">
            <CircleX class="h-4 w-4" />
            清空
          </Button>
          <Button size="sm" variant="secondary" @click="$emit('toggle-debug-panel')">
            <component :is="showDebugPanel ? EyeOff : Eye" class="h-4 w-4" />
            {{ showDebugPanel ? '隐藏调试' : '显示调试' }}
          </Button>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { CircleCheck, CircleX, Eye, EyeOff, Folder, FolderOpen } from '@lucide/vue'
import Button from '@/components/ui/Button.vue'
import { collectDirectoryFiles } from '@/utils/lottieFiles'

const props = defineProps<{
  fileName: string
  hasFiles: boolean
  isUploadComplete: boolean
  showDebugPanel: boolean
}>()

const emit = defineEmits<{
  (event: 'clear-project'): void
  (event: 'empty-selection'): void
  (event: 'files-selected', files: File[]): void
  (event: 'toggle-debug-panel'): void
}>()

const folderInput = ref<HTMLInputElement>()
const isDragging = ref(false)
const showsCompactState = computed(() => props.hasFiles || props.isUploadComplete)
const completedTitle = computed(() => props.fileName || '项目资源')
const signalItems = [
  { mark: 'JSON', label: '动画数据', detail: 'layers / assets / frame rate' },
  { mark: 'IMG', label: '图片资源', detail: 'images 文件夹与引用校验' },
  { mark: 'MP4', label: '演示视频', detail: '同步预览和格式提示' },
]

const handleTriggerFolderInput = () => {
  folderInput.value?.click()
}

const handleDrop = async (event: DragEvent) => {
  event.preventDefault()
  isDragging.value = false

  const items = event.dataTransfer?.items
  if (!items) return

  const files: File[] = []

  for (let i = 0; i < items.length; i++) {
    const item = items[i]
    if (item.kind === 'file') {
      const entry = item.webkitGetAsEntry?.()
      if (entry?.isDirectory) {
        await collectDirectoryFiles(entry as FileSystemDirectoryEntry, files)
      }
    }
  }

  if (files.length > 0) {
    emit('files-selected', files)
  }
}

const handleFolderSelect = (event: Event) => {
  const target = event.target as HTMLInputElement

  if (target.files && target.files.length > 0) {
    const files = Array.from(target.files)
    target.value = ''
    emit('files-selected', files)
  } else {
    target.value = ''
    emit('empty-selection')
  }
}
</script>

<style scoped>
.upload-section {
  width: min(100%, 1040px);
  margin: 0 auto;
  transition: opacity 0.3s ease;
}

.upload-section.minimized {
  width: 100%;
}

.drop-zone {
  position: relative;
  overflow: hidden;
  padding: 24px;
  background: rgb(255 255 255 / 90%);
  border: 1px solid var(--app-border);
  border-radius: 8px;
  box-shadow: 0 12px 34px rgb(15 23 42 / 7%);
  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease,
    transform 0.2s ease;
}

.drop-zone::before {
  position: absolute;
  inset: 12px;
  pointer-events: none;
  content: '';
  border: 1px dashed rgb(0 196 160 / 24%);
  border-radius: 6px;
}

.drop-zone.dragover {
  border-color: rgb(0 196 160 / 70%);
  box-shadow: 0 16px 40px rgb(0 196 160 / 12%);
  transform: translateY(-1px);
}

.drop-zone.minimized {
  padding: 12px 14px;
  background: rgb(255 255 255 / 78%);
  border-color: rgb(15 23 42 / 5%);
  box-shadow: 0 4px 14px rgb(15 23 42 / 4%);
}

.drop-zone.minimized::before {
  display: none;
}

.upload-layout {
  position: relative;
  display: grid;
  grid-template-columns: minmax(0, 1fr) 320px;
  gap: 22px;
  align-items: stretch;
  min-height: 248px;
}

.upload-main {
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 24px 22px;
  text-align: left;
}

.upload-icon,
.complete-icon {
  display: grid;
  place-items: center;
  color: white;
  background: linear-gradient(135deg, #00d4ad, #0faaa8);
  box-shadow: 0 10px 22px rgb(0 196 160 / 16%);
}

.upload-icon {
  width: 58px;
  height: 58px;
  margin-bottom: 18px;
  border: 1px solid rgb(255 255 255 / 38%);
  border-radius: 14px;
  font-size: 32px;
}

.upload-copy {
  max-width: 560px;
}

.upload-kicker {
  margin: 0 0 8px;
  font-size: 12px;
  font-weight: 700;
  color: #0f766e;
  letter-spacing: 0;
  text-transform: uppercase;
}

.upload-copy h2 {
  margin: 0;
  font-size: 30px;
  font-weight: 800;
  line-height: 1.18;
  color: #111827;
  letter-spacing: 0;
}

.upload-copy p:not(.upload-kicker) {
  max-width: 500px;
  margin: 10px 0 0;
  font-size: 14px;
  line-height: 1.75;
  color: #526071;
}

.upload-actions,
.complete-actions {
  display: flex;
  gap: 10px;
  align-items: center;
  margin-top: 22px;
}

.upload-signals {
  display: grid;
  gap: 10px;
  align-content: center;
  padding: 18px 0 18px 24px;
  border-left: 1px solid var(--app-border);
}

.signal-item {
  display: grid;
  grid-template-columns: 46px 1fr;
  gap: 12px;
  align-items: center;
  padding: 11px 0;
  text-align: left;
  border-bottom: 1px solid rgb(15 23 42 / 5%);
}

.signal-item:last-child {
  border-bottom: 0;
}

.signal-mark {
  display: grid;
  place-items: center;
  width: 42px;
  height: 30px;
  font-size: 11px;
  font-weight: 800;
  color: #0f766e;
  background: rgb(0 221 179 / 12%);
  border: 1px solid rgb(0 196 160 / 22%);
  border-radius: 6px;
}

.signal-item strong,
.signal-item small {
  display: block;
}

.signal-item strong {
  font-size: 13px;
  color: #1f2937;
}

.signal-item small {
  margin-top: 2px;
  font-size: 12px;
  line-height: 1.35;
  color: #64748b;
}

.upload-complete {
  display: flex;
  gap: 14px;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}

.complete-summary {
  display: flex;
  gap: 12px;
  align-items: center;
  min-width: 0;
}

.complete-icon {
  flex: 0 0 auto;
  width: 30px;
  height: 30px;
  border-radius: 9px;
  font-size: 18px;
  box-shadow: none;
}

.complete-summary h3 {
  margin: 0;
  overflow: hidden;
  font-size: 14px;
  font-weight: 700;
  color: #1f2937;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.complete-summary p {
  margin: 2px 0 0;
  font-size: 12px;
  color: #64748b;
}

@media (width <= 768px) {
  .upload-section {
    width: 100%;
  }

  .drop-zone {
    padding: 16px;
  }

  .drop-zone::before {
    inset: 10px;
  }

  .upload-layout {
    grid-template-columns: 1fr;
    gap: 12px;
    min-height: 0;
  }

  .upload-main {
    align-items: center;
    padding: 18px 8px 6px;
    text-align: center;
  }

  .upload-icon {
    width: 58px;
    height: 58px;
    margin-bottom: 14px;
    font-size: 28px;
  }

  .upload-copy h2 {
    font-size: 22px;
  }

  .upload-copy p:not(.upload-kicker) {
    font-size: 13px;
  }

  .upload-actions,
  .complete-actions {
    display: grid;
    grid-template-columns: 1fr 1fr;
    width: 100%;
    margin-top: 18px;
  }

  .upload-actions > *,
  .complete-actions > * {
    width: 100%;
  }

  .upload-signals {
    grid-template-columns: 1fr;
    padding: 4px 6px 6px;
    background: transparent;
    border-left: 0;
  }

  .signal-item {
    grid-template-columns: 42px 1fr;
    padding: 8px 0;
  }

  .upload-complete {
    display: grid;
    gap: 12px;
  }
}
</style>
