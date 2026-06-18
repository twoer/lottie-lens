import { reactive } from 'vue'

export type ToastVariant = 'default' | 'destructive' | 'success' | 'warning'

export interface ToastItem {
  description?: string
  id: number
  title: string
  variant: ToastVariant
}

const toasts = reactive<ToastItem[]>([])
let toastId = 0

export const dismissToast = (id: number) => {
  const index = toasts.findIndex(toast => toast.id === id)
  if (index >= 0) {
    toasts.splice(index, 1)
  }
}

export const toast = (options: {
  description?: string
  duration?: number
  title: string
  variant?: ToastVariant
}) => {
  const id = ++toastId
  toasts.push({
    description: options.description,
    id,
    title: options.title,
    variant: options.variant ?? 'default',
  })

  window.setTimeout(() => dismissToast(id), options.duration ?? 2600)
}

export const useToast = () => {
  return {
    dismissToast,
    toast,
    toasts,
  }
}
