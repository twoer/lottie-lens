<template>
  <Teleport to="body">
    <div v-if="open" class="dialog-root" @keydown.esc="emit('update:open', false)">
      <button class="dialog-overlay" aria-label="关闭弹窗" @click="emit('update:open', false)" />
      <section class="dialog-content" role="dialog" aria-modal="true" :aria-labelledby="titleId">
        <div class="dialog-header">
          <h2 :id="titleId" class="dialog-title">{{ title }}</h2>
          <button class="dialog-close" aria-label="关闭弹窗" @click="emit('update:open', false)">
            <X class="h-4 w-4" />
          </button>
        </div>
        <div class="dialog-body">
          <slot />
        </div>
        <footer v-if="$slots.footer" class="dialog-footer">
          <slot name="footer" />
        </footer>
      </section>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { X } from '@lucide/vue'

const props = defineProps<{
  open: boolean
  title: string
}>()

const emit = defineEmits<{
  (event: 'update:open', value: boolean): void
}>()

const titleId = computed(() => `dialog-${props.title.replace(/\s+/g, '-').toLowerCase()}`)
</script>

<style scoped>
.dialog-root {
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: grid;
  place-items: center;
  padding: 24px;
}

.dialog-overlay {
  position: fixed;
  inset: 0;
  padding: 0;
  cursor: default;
  background: rgb(15 23 42 / 48%);
  border: 0;
}

.dialog-content {
  position: relative;
  width: min(100%, 560px);
  max-height: min(760px, calc(100vh - 48px));
  overflow: auto;
  background: rgb(255 255 255 / 98%);
  border: 1px solid rgb(15 23 42 / 8%);
  border-radius: 10px;
  box-shadow: 0 24px 80px rgb(15 23 42 / 22%);
}

.dialog-header {
  display: flex;
  gap: 16px;
  align-items: center;
  justify-content: space-between;
  padding: 20px 22px 8px;
}

.dialog-title {
  margin: 0;
  font-size: 20px;
  font-weight: 800;
  color: #172033;
  letter-spacing: 0;
}

.dialog-close {
  display: grid;
  place-items: center;
  width: 30px;
  height: 30px;
  padding: 0;
  color: #94a3b8;
  cursor: pointer;
  background: transparent;
  border: 0;
  border-radius: 8px;
}

.dialog-close:hover {
  color: #475569;
  background: #f1f5f9;
}

.dialog-body {
  padding: 8px 22px 12px;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  padding: 8px 22px 20px;
}

@media (width <= 640px) {
  .dialog-root {
    padding: 16px;
  }
}
</style>
