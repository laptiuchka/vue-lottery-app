<script setup lang="ts">
import { watch } from 'vue'
import { useField, useForm } from 'vee-validate'
import * as yup from 'yup'
import Dialog from 'primevue/dialog'
import { useToast } from 'primevue/usetoast'
import { useUsersStore } from '@/entities/user'
import type { User } from '@/entities/user'
import { AppButton, AppInput } from '@/shared/ui'

const props = defineProps<{
  visible: boolean
  user?: User | null
}>()

const emit = defineEmits<{ 'update:visible': [val: boolean] }>()

const usersStore = useUsersStore()
const toast = useToast()

const schema = yup.object({
  firstName: yup.string().required("Ім'я обов'язкове"),
  lastName: yup.string().required("Прізвище обов'язкове"),
  email: yup.string().email('Некоректний email').required("Email обов'язковий"),
  age: yup.number().typeError('Вік має бути числом').min(1, 'Мінімум 1').required("Вік обов'язковий")
})

const { handleSubmit, isSubmitting, resetForm, setValues } = useForm({
  validationSchema: schema,
  initialValues: { firstName: '', lastName: '', email: '', age: 20 }
})

const { value: firstName, errorMessage: firstNameError } = useField<string>('firstName')
const { value: lastName, errorMessage: lastNameError } = useField<string>('lastName')
const { value: email, errorMessage: emailError } = useField<string>('email')
const { value: age, errorMessage: ageError } = useField<number>('age')

watch(
  () => props.user,
  (newUser) => {
    if (newUser) {
      setValues({
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        email: newUser.email,
        age: newUser.age
      })
    } else {
      resetForm()
    }
  },
  { immediate: true }
)

const onSubmit = handleSubmit(async (values) => {
  try {
    if (props.user) {
      await usersStore.updateUser(props.user.id, {
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        age: Number(values.age)
      })
      toast.add({ severity: 'success', summary: 'Успіх', detail: 'Дані користувача оновлено!', life: 3000 })
    } else {
      await usersStore.createUser({
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        age: Number(values.age)
      })
      toast.add({ severity: 'success', summary: 'Успіх', detail: 'Користувача додано!', life: 3000 })
    }
    resetForm()
    emit('update:visible', false)
  } catch (e) {
    toast.add({ severity: 'error', summary: 'Помилка', detail: (e as Error).message, life: 3000 })
  }
})
</script>

<template>
  <Dialog
    :visible="visible"
    modal
    :header="user ? 'Редагувати користувача' : 'Створити користувача'"
    :style="{ width: '400px' }"
    @update:visible="emit('update:visible', $event)"
  >
    <form class="user-form" @submit.prevent="onSubmit">
      <AppInput v-model="firstName" label="Ім'я" id="firstName" :error="firstNameError" />
      <AppInput v-model="lastName" label="Прізвище" id="lastName" :error="lastNameError" />
      <AppInput v-model="email" label="Email" id="email" type="email" :error="emailError" />
      <AppInput v-model="age" label="Вік" id="age" type="number" :error="ageError" />

      <div class="modal-actions">
        <AppButton label="Скасувати" severity="secondary" type="button" @click="emit('update:visible', false)" />
        <AppButton :label="user ? 'Зберегти зміни' : 'Створити'" type="submit" :loading="isSubmitting" />
      </div>
    </form>
  </Dialog>
</template>

<style scoped>
.user-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  margin-top: 1rem;
}
</style>