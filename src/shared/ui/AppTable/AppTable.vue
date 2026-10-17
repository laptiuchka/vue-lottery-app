<script setup lang="ts" generic="T">
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'

defineProps<{
  value: T[]
  columns: Array<{ field: string; header: string }>
  loading?: boolean
}>()
</script>

<template>
  <DataTable :value="value" :loading="loading" responsiveLayout="scroll" class="app-table">
    <Column v-for="col in columns" :key="col.field" :field="col.field" :header="col.header" />
    <slot />
  </DataTable>
</template>

<style scoped>
.app-table {
  margin-top: 1rem;
}
</style>