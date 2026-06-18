<template>
  <component :is="as" :class="buttonClass" :disabled="disabled">
    <slot />
  </component>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-primary-500 text-white shadow-sm hover:bg-primary-600',
        secondary: 'bg-slate-100 text-slate-700 hover:bg-slate-200',
        ghost: 'text-slate-600 hover:bg-slate-100 hover:text-slate-900',
        outline: 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50',
        destructive: 'bg-rose-500 text-white hover:bg-rose-600',
      },
      size: {
        default: 'h-9 px-4',
        sm: 'h-8 px-3 text-xs',
        icon: 'h-8 w-8',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)

type ButtonVariants = VariantProps<typeof buttonVariants>

const props = withDefaults(
  defineProps<{
    as?: string
    class?: string
    disabled?: boolean
    size?: ButtonVariants['size']
    variant?: ButtonVariants['variant']
  }>(),
  {
    as: 'button',
    class: '',
    disabled: false,
    size: 'default',
    variant: 'default',
  }
)

const buttonClass = computed(() =>
  cn(buttonVariants({ variant: props.variant, size: props.size }), props.class)
)
</script>
