<script setup lang="ts">
interface Props {
  modelValue: string | number;
  label?: string;
  placeholder?: string;
  type?: string;
  errorMessage?: string;
  isValid?: boolean;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: string | number): void;
}>();

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const val = props.type === 'number' ? (target.value === '' ? '' : Number(target.value)) : target.value;
  emit('update:modelValue', val);
};
</script>

<template>
  <div class="input-group-custom">
    <label v-if="label" class="input-label">{{ label }}</label>
    <div class="input-wrapper">
      <input
        :type="type || 'text'"
        :value="modelValue"
        :placeholder="placeholder"
        class="form-field"
        :class="{
          'is-invalid': !!errorMessage,
          'is-valid': isValid && !errorMessage
        }"
        @input="handleInput"
      />
      <span v-if="isValid && !errorMessage" class="valid-icon">✓</span>
    </div>
    <span v-if="errorMessage" class="error-text">{{ errorMessage }}</span>
  </div>
</template>

<style scoped lang="scss">
.input-group-custom {
  display: flex;
  flex-direction: column;
  margin-bottom: 1rem;
  width: 100%;
}

.input-label {
  font-size: 13px;
  font-weight: 700;
  color: #4a4554;
  margin-bottom: 5px;
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.form-field {
  width: 100%;
  padding: 8px 12px;
  background-color: #fbf9fe;
  border: 1px solid #e3deee;
  border-radius: 6px;
  font-size: 14px;
  outline: none;
  transition: border-color 0.2s ease, background-color 0.2s ease;

  &:focus {
    background-color: #ffffff;
    border-color: #906cd4;
  }

  &.is-invalid {
    border-color: #e57373;
    background-color: #fff;
  }

  &.is-valid {
    border-color: #906cd4;
    padding-right: 32px;
  }
}

.valid-icon {
  position: absolute;
  right: 10px;
  color: #906cd4;
  font-weight: bold;
}

.error-text {
  color: #e57373;
  font-size: 12px;
  margin-top: 4px;
}
</style>