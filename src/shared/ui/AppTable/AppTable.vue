<script setup lang="ts">
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'

defineProps<{
  value: any[]
  columns: { field: string; header: string; sortable?: boolean }[]
  loading?: boolean
  paginator?: boolean
  rows?: number
  totalRecords?: number
}>()
</script>

<template>
  <DataTable
    :value="value"
    :loading="loading"
    :paginator="paginator"
    :rows="rows || 10"
    :total-records="totalRecords"
    responsive-layout="scroll"
  >
    <template v-for="col in columns" :key="col.field">
      <Column v-if="col.field === 'actions'" :header="col.header">
        <template #body="slotProps">
          <slot name="actions" :data="slotProps.data" />
        </template>
      </Column>

      <Column
        v-else
        :field="col.field"
        :header="col.header"
        :sortable="col.sortable"
      />
    </template>
  </DataTable>
</template>