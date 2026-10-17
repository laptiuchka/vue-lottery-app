<script setup lang="ts">
import InputText from 'primevue/inputtext'

defineProps<{
  modelValue?: string | number
  label?: string
  id?: string
  type?: string
  placeholder?: string
  error?: string
  disabled?: boolean
}>()

defineEmits<{
  'update:modelValue': [value: string]
}>()
</script>

<template>
  <div class="app-input-wrapper">
    <label v-if="label" :for="id" class="input-label">{{ label }}</label>
    <InputText
      :id="id"
      :type="type || 'text'"
      :value="modelValue"
      :placeholder="placeholder"
      :disabled="disabled"
      :invalid="!!error"
      class="w-full"
      @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
    />
    <small v-if="error" class="error-message">{{ error }}</small>
  </div>
</template>

<style scoped>
.app-input-wrapper {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  margin-bottom: 1rem;
}

.input-label {
  font-weight: 600;
  font-size: 0.9rem;
}

.error-message {
  color: #e74c3c;
  font-size: 0.8rem;
}

.w-full {
  width: 100%;
}
</style>