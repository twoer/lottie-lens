<template>
  <div class="toast-viewport" aria-live="polite" aria-relevant="additions removals">
    <div
      v-for="item in toasts"
      :key="item.id"
      class="toast-item"
      :class="`toast-${item.variant}`"
      role="status"
    >
      <div>
        <p class="toast-title">{{ item.title }}</p>
        <p v-if="item.description" class="toast-description">{{ item.description }}</p>
      </div>
      <button class="toast-close" aria-label="关闭提示" @click="dismissToast(item.id)">
        <X class="h-4 w-4" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { X } from '@lucide/vue'
import { useToast } from '@/composables/useToast'

const { dismissToast, toasts } = useToast()
</script>

<style scoped>
.toast-viewport {
  position: fixed;
  top: 70px;
  right: 18px;
  z-index: 1100;
  display: grid;
  gap: 10px;
  width: min(360px, calc(100vw - 32px));
  pointer-events: none;
}

.toast-item {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 12px;
  align-items: start;
  padding: 12px 12px 12px 14px;
  pointer-events: auto;
  background: rgb(255 255 255 / 96%);
  border: 1px solid rgb(15 23 42 / 8%);
  border-radius: 8px;
  box-shadow: 0 18px 45px rgb(15 23 42 / 14%);
}

.toast-success {
  border-color: rgb(16 185 129 / 22%);
}

.toast-warning {
  border-color: rgb(245 158 11 / 26%);
}

.toast-destructive {
  border-color: rgb(244 63 94 / 28%);
}

.toast-title {
  margin: 0;
  font-size: 13px;
  font-weight: 750;
  color: #172033;
}

.toast-description {
  margin: 3px 0 0;
  font-size: 12px;
  line-height: 1.45;
  color: #64748b;
}

.toast-close {
  display: grid;
  place-items: center;
  width: 24px;
  height: 24px;
  padding: 0;
  color: #94a3b8;
  cursor: pointer;
  background: transparent;
  border: 0;
  border-radius: 6px;
}

.toast-close:hover {
  color: #475569;
  background: #f1f5f9;
}
</style>
