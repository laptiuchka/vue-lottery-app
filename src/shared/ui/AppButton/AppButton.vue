<script setup lang="ts">
import Button from 'primevue/button'

defineProps<{
  label?: string
  icon?: string
  type?: 'button' | 'submit' | 'reset'
  severity?: 'secondary' | 'success' | 'info' | 'warn' | 'help' | 'danger' | 'contrast'
  outlined?: boolean
  text?: boolean
  loading?: boolean
  disabled?: boolean
  size?: 'small' | 'large'
}>()

defineEmits<{
  click: [event: MouseEvent]
}>()
</script>

<template>
  <Button
    :label="label"
    :icon="icon"
    :type="type || 'button'"
    :severity="severity"
    :outlined="outlined"
    :text="text"
    :loading="loading"
    :disabled="disabled"
    :size="size"
    @click="$emit('click', $event)"
  >
    <slot />
  </Button>
</template>