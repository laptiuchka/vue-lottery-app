<script setup lang="ts">
import { watch } from 'vue'
import { useForm, useField } from 'vee-validate'
import * as yup from 'yup'
import Dialog from 'primevue/dialog'
import { useToast } from 'primevue/usetoast'
import { useUsersStore, type User } from '@/entities/user'
import { AppButton, AppInput } from '@/shared/ui'

const props = defineProps<{
  visible: boolean
  userToEdit?: User | null
}>()

const emit = defineEmits<{
  'update:visible': [value: boolean]
  saved: []
}>()

const toast = useToast()
const usersStore = useUsersStore()

const schema = yup.object({
  firstName: yup.string().required("Ім'я обов'язкове"),
  lastName: yup.string().required("Прізвище обов'язкове"),
  email: yup.string().email('Некоректна адреса електронної пошти').required("Email обов'язковий"),
})

const { handleSubmit, resetForm, isSubmitting } = useForm({
  validationSchema: schema,
})

const { value: firstName, errorMessage: firstNameError } = useField<string>('firstName')
const { value: lastName, errorMessage: lastNameError } = useField<string>('lastName')
const { value: email, errorMessage: emailError } = useField<string>('email')

watch(
  () => props.userToEdit,
  (newUser) => {
    if (newUser) {
      resetForm({
        values: {
          firstName: newUser.firstName,
          lastName: newUser.lastName,
          email: newUser.email,
        },
      })
    } else {
      resetForm({ values: { firstName: '', lastName: '', email: '' } })
    }
  },
  { immediate: true }
)

const onSubmit = handleSubmit(async (values) => {
  try {
    const payload = {
      firstName: values.firstName as string,
      lastName: values.lastName as string,
      email: values.email as string,
    }

    if (props.userToEdit) {
      await usersStore.updateUser(props.userToEdit.id, payload)
      toast.add({ severity: 'success', summary: 'Успіх', detail: 'Користувача оновлено!', life: 3000 })
    } else {
      await usersStore.createUser(payload)
      toast.add({ severity: 'success', summary: 'Успіх', detail: 'Користувача створено!', life: 3000 })
    }
    emit('update:visible', false)
    emit('saved')
  } catch (e) {
    toast.add({ severity: 'error', summary: 'Помилка', detail: (e as Error).message, life: 3000 })
  }
})
</script>

<template>
  <Dialog
    :visible="visible"
    :header="userToEdit ? 'Редагувати користувача' : 'Створити користувача'"
    :modal="true"
    :style="{ width: '450px' }"
    @update:visible="emit('update:visible', $event)"
  >
    <form @submit.prevent="onSubmit">
      <AppInput v-model="firstName" label="Ім'я" id="firstName" :error="firstNameError" />
      <AppInput v-model="lastName" label="Прізвище" id="lastName" :error="lastNameError" />
      <AppInput v-model="email" label="Email" id="email" :error="emailError" />

      <div class="dialog-footer">
        <AppButton label="Скасувати" severity="secondary" text @click="emit('update:visible', false)" />
        <AppButton :label="userToEdit ? 'Зберегти' : 'Створити'" type="submit" :loading="isSubmitting" />
      </div>
    </form>
  </Dialog>
</template>

<style scoped>
.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
  margin-top: 1.5rem;
}
</style>