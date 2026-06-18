<template>
  <input
    class="slider"
    type="range"
    :min="min"
    :max="max"
    :step="step"
    :value="modelValue"
    :style="{ '--slider-progress': `${progress}%` }"
    @input="handleInput"
    @change="handleChange"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    max?: number
    min?: number
    modelValue: number
    step?: number
  }>(),
  {
    max: 100,
    min: 0,
    step: 1,
  }
)

const emit = defineEmits<{
  (event: 'change', value: number): void
  (event: 'update:modelValue', value: number): void
}>()

const progress = computed(() => {
  const range = props.max - props.min
  if (range <= 0) return 0
  return ((props.modelValue - props.min) / range) * 100
})

const getValue = (event: Event) => Number((event.target as HTMLInputElement).value)

const handleInput = (event: Event) => {
  emit('update:modelValue', getValue(event))
}

const handleChange = (event: Event) => {
  emit('change', getValue(event))
}
</script>

<style scoped>
.slider {
  width: 100%;
  height: 20px;
  cursor: pointer;
  appearance: none;
  background: transparent;
}

.slider:focus {
  outline: none;
}

.slider::-webkit-slider-runnable-track {
  height: 6px;
  background:
    linear-gradient(#00ddb3, #00ddb3) 0 / var(--slider-progress) 100% no-repeat,
    #e5eaf0;
  border-radius: 999px;
}

.slider::-webkit-slider-thumb {
  width: 18px;
  height: 18px;
  margin-top: -6px;
  appearance: none;
  background: white;
  border: 3px solid #00c4a0;
  border-radius: 999px;
  box-shadow: 0 1px 4px rgb(15 23 42 / 16%);
}

.slider::-moz-range-track {
  height: 6px;
  background: #e5eaf0;
  border-radius: 999px;
}

.slider::-moz-range-progress {
  height: 6px;
  background: #00ddb3;
  border-radius: 999px;
}

.slider::-moz-range-thumb {
  width: 14px;
  height: 14px;
  background: white;
  border: 3px solid #00c4a0;
  border-radius: 999px;
  box-shadow: 0 1px 4px rgb(15 23 42 / 16%);
}
</style>
