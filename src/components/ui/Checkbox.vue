<template>
  <label class="checkbox-root">
    <input class="checkbox-input" type="checkbox" :checked="modelValue" @change="handleChange" />
    <span class="checkbox-box">
      <Check v-if="modelValue" class="h-3 w-3" />
    </span>
    <span class="checkbox-label">
      <slot />
    </span>
  </label>
</template>

<script setup lang="ts">
import { Check } from '@lucide/vue'

defineProps<{
  modelValue: boolean
}>()

const emit = defineEmits<{
  (event: 'update:modelValue', value: boolean): void
}>()

const handleChange = (event: Event) => {
  emit('update:modelValue', (event.target as HTMLInputElement).checked)
}
</script>

<style scoped>
.checkbox-root {
  display: inline-flex;
  gap: 8px;
  align-items: center;
  font-size: 13px;
  font-weight: 600;
  color: #475569;
  cursor: pointer;
  user-select: none;
}

.checkbox-input {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip-path: inset(50%);
}

.checkbox-box {
  display: grid;
  place-items: center;
  width: 16px;
  height: 16px;
  color: white;
  background: white;
  border: 1px solid rgb(15 23 42 / 14%);
  border-radius: 4px;
}

.checkbox-input:checked + .checkbox-box {
  background: #00ddb3;
  border-color: #00c4a0;
}

.checkbox-input:focus-visible + .checkbox-box {
  outline: 2px solid rgb(0 221 179 / 32%);
  outline-offset: 2px;
}
</style>
