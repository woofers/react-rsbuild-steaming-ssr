import { defineConfig } from 'cva'
import { twMerge } from 'tailwind-merge'

export const { cva, cx, compose } = defineConfig({
  hooks: { onComplete: value => twMerge(value) }
})

export type { VariantProps } from 'cva'
