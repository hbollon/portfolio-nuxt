<script setup lang="ts">
import { computed } from 'vue'
import type { RouteLocationRaw } from 'vue-router'

type ButtonVariant = 'primary' | 'secondary' | 'ghost'
type ButtonSize = 'sm' | 'md' | 'lg'
type ButtonTag = 'button' | 'a' | 'NuxtLink'

const props = withDefaults(
  defineProps<{
    variant?: ButtonVariant
    size?: ButtonSize
    tag?: ButtonTag
    href?: string
    to?: RouteLocationRaw
    type?: 'button' | 'submit' | 'reset'
    disabled?: boolean
  }>(),
  {
    variant: 'primary',
    size: 'md',
    tag: 'button',
    href: undefined,
    to: undefined,
    type: 'button',
    disabled: false,
  }
)

const componentTag = computed(() => (props.tag === 'NuxtLink' ? 'NuxtLink' : props.tag))

const componentProps = computed(() => {
  const attrs: {
    href?: string
    to?: RouteLocationRaw
    type?: 'button' | 'submit' | 'reset'
    disabled?: boolean
    ariaDisabled?: boolean
    tabIndex?: number
  } = {}

  if (props.tag === 'button') {
    attrs.type = props.type
    attrs.disabled = props.disabled
  }

  if (props.tag === 'a') {
    attrs.href = props.href
  }

  if (props.tag === 'NuxtLink') {
    attrs.to = props.to ?? props.href
  }

  if (props.disabled && props.tag !== 'button') {
    attrs.ariaDisabled = true
    attrs.tabIndex = -1
  }

  return attrs
})

const baseClasses =
  'inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-nebula-purple focus-visible:ring-offset-2 focus-visible:ring-offset-space-black'

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'bg-gradient-nebula text-star-white shadow-glow-subtle hover:shadow-glow-purple hover:translate-y-[-1px]',
  secondary:
    'glass text-star-white hover:bg-space-void hover:border-nebula-purple/30 hover:shadow-glow-subtle',
  ghost: 'bg-transparent text-star-white hover:bg-space-void/50',
}

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-3 text-base',
  lg: 'px-8 py-4 text-lg',
}

const classes = computed(() => [
  baseClasses,
  variantClasses[props.variant],
  sizeClasses[props.size],
  props.disabled ? 'cursor-not-allowed opacity-50 pointer-events-none' : '',
])
</script>

<template>
  <component :is="componentTag" v-bind="componentProps" :class="classes">
    <slot />
  </component>
</template>
