<script setup lang="ts">
import type { Participant } from '../types/participant';

defineProps<{
  winner: Participant;
}>();

defineEmits<{
  (e: 'remove', id: string): void;
}>();
</script>

<template>
  <span class="winner-badge">
    <span class="winner-name">{{ winner.name }}</span>
    <button
      type="button"
      class="remove-btn"
      title="Видалити"
      @click="$emit('remove', winner.id)"
    >
      &times;
    </button>
  </span>
</template>

<style scoped lang="scss">
.winner-badge {
  display: inline-flex;
  align-items: center;
  background-color: #d6c6f6;
  color: #4c298a;
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 13px;
  margin-right: 6px;
  margin-bottom: 4px;
}

.winner-name {
  margin-right: 6px;
  font-weight: 600;
}

.remove-btn {
  background: transparent;
  border: none;
  color: #4c298a;
  cursor: pointer;
  font-size: 14px;
  line-height: 1;
  padding: 0;

  &:hover {
    color: #26114b;
  }
}
</style>