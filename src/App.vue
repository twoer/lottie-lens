<template>
  <div class="app-shell min-h-screen">
    <!-- 头部导航 -->
    <header class="app-header fixed top-0 left-0 right-0 z-50">
      <div class="px-4 py-2.5">
        <div class="flex items-center justify-between">
          <div class="brand-lockup flex items-center space-x-2">
            <img :src="`${baseUrl}icon.svg`" alt="Lottie Lens" class="w-8 h-8" />
            <h1>Lottie Lens</h1>
          </div>
          <div class="flex items-center space-x-3">
            <Button
              class="help-icon-button"
              size="icon"
              title="使用帮助"
              variant="ghost"
              aria-label="使用帮助"
              @click="showHelp = true"
            >
              <CircleHelp class="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </header>

    <!-- 主要内容区域 -->
    <main class="app-main mx-auto px-4 pb-6 pt-20">
      <router-view />
    </main>

    <!-- 帮助对话框 -->
    <Dialog v-model:open="showHelp" title="快速帮助">
      <div class="help-content">
        <p class="help-lead">
          把完整 Lottie 项目文件夹拖进页面，Lottie Lens 会在本地完成预览和资源检查。
        </p>

        <div class="help-card">
          <h3>支持内容</h3>
          <ul>
            <li>
              <strong>Lottie JSON</strong>
              <span>.json 动画数据</span>
            </li>
            <li>
              <strong>图片资源</strong>
              <span>images 文件夹与 assets 引用</span>
            </li>
            <li>
              <strong>演示视频</strong>
              <span>建议使用 MP4，MOV 可能不兼容</span>
            </li>
          </ul>
        </div>

        <div class="help-card">
          <h3>检查流程</h3>
          <ol>
            <li>拖入项目文件夹，或点击选择文件夹。</li>
            <li>确认动画、图片资源和演示视频是否被识别。</li>
            <li>使用播放、速度和进度控制检查动画细节。</li>
          </ol>
        </div>

        <div class="help-card">
          <h3>排查提示</h3>
          <ul>
            <li>
              <strong>图片缺失</strong>
              <span>检查 JSON assets 路径和图片文件名</span>
            </li>
            <li>
              <strong>视频黑屏</strong>
              <span>优先转换为 MP4 后重新上传</span>
            </li>
          </ul>
        </div>

        <div class="help-note">文件不会上传到服务器，所有解析和预览都在当前浏览器内完成。</div>
      </div>

      <template #footer>
        <Button @click="showHelp = false">开始检查</Button>
      </template>
    </Dialog>

    <ToastViewport />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { CircleHelp } from '@lucide/vue'
import Button from '@/components/ui/Button.vue'
import Dialog from '@/components/ui/Dialog.vue'
import ToastViewport from '@/components/ui/ToastViewport.vue'

const showHelp = ref(false)
const baseUrl = import.meta.env.BASE_URL
</script>

<style scoped>
.app-shell {
  min-height: 100vh;
  background:
    linear-gradient(180deg, rgb(255 255 255 / 86%) 0, rgb(255 255 255 / 0%) 280px),
    linear-gradient(135deg, #f4fbf9 0%, #f8fafc 48%, #f5f9ff 100%);
}

.app-header {
  background: rgb(255 255 255 / 88%);
  border-bottom: 1px solid var(--app-border);
  box-shadow: 0 1px 0 rgb(255 255 255 / 70%) inset;
  backdrop-filter: blur(14px);
}

.app-main {
  width: 100%;
  max-width: 1480px;
}

.brand-lockup h1 {
  margin: 0;
  font-size: 20px;
  font-weight: 800;
  line-height: 1;
  color: #0f766e;
  letter-spacing: 0;
}

.help-icon-button {
  width: 32px;
  height: 32px;
  color: #64748b;
  background: transparent;
  border-color: transparent;
}

.help-icon-button:hover,
.help-icon-button:focus {
  color: var(--app-primary-ink);
  background: rgb(15 23 42 / 4%);
  border-color: transparent;
}

.help-content {
  display: grid;
  gap: 12px;
  color: #344054;
}

.help-lead {
  margin: 0 0 2px;
  font-size: 14px;
  line-height: 1.7;
  color: #526071;
}

.help-card {
  padding: 14px 16px;
  background: rgb(248 250 252 / 72%);
  border: 1px solid var(--app-border);
  border-radius: 8px;
}

.help-card h3 {
  margin: 0 0 10px;
  font-size: 14px;
  font-weight: 750;
  color: #172033;
  letter-spacing: 0;
}

.help-card ul,
.help-card ol {
  display: grid;
  gap: 8px;
  padding: 0;
  margin: 0;
  list-style: none;
}

.help-card ol {
  counter-reset: help-step;
}

.help-card li {
  display: grid;
  grid-template-columns: 104px 1fr;
  gap: 10px;
  align-items: start;
  font-size: 13px;
  line-height: 1.45;
}

.help-card ol li {
  grid-template-columns: 28px 1fr;
}

.help-card ol li::before {
  display: grid;
  place-items: center;
  width: 22px;
  height: 22px;
  font-size: 12px;
  font-weight: 800;
  color: #0f766e;
  content: counter(help-step);
  counter-increment: help-step;
  background: rgb(0 221 179 / 12%);
  border-radius: 999px;
}

.help-card strong {
  font-weight: 750;
  color: #172033;
}

.help-card span {
  color: #64748b;
}

.help-note {
  padding: 10px 12px;
  font-size: 12px;
  line-height: 1.5;
  color: #0f766e;
  background: rgb(0 221 179 / 9%);
  border: 1px solid rgb(0 196 160 / 16%);
  border-radius: 8px;
}

@media (width <= 640px) {
  .brand-lockup h1 {
    font-size: 18px;
  }

  :deep(.help-dialog) {
    width: calc(100vw - 32px);
  }

  .help-card li {
    grid-template-columns: 1fr;
    gap: 2px;
  }

  .help-card ol li {
    grid-template-columns: 28px 1fr;
    gap: 8px;
  }
}
</style>
