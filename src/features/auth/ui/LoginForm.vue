<script setup lang="ts">
import { useField, useForm } from 'vee-validate'
import * as yup from 'yup'
import { useRouter, useRoute } from 'vue-router'
import { useToast } from 'primevue/usetoast'
import { useSessionStore } from '@/entities/session'
import { AppButton, AppInput } from '@/shared/ui'

const router = useRouter()
const route = useRoute()
const toast = useToast()
const sessionStore = useSessionStore()

const schema = yup.object({
  username: yup.string().required("Ім'я користувача обов'язкове"),
  password: yup.string().min(4, 'Пароль має містити щонайменше 4 символи').required("Пароль обов'язковий"),
})

const { handleSubmit, isSubmitting } = useForm({
  validationSchema: schema,
  initialValues: {
    username: 'kminchelle',
    password: '0lelzaR',
  },
})

const { value: username, errorMessage: usernameError } = useField<string>('username')
const { value: password, errorMessage: passwordError } = useField<string>('password')

const onSubmit = handleSubmit(async (values) => {
  try {
    sessionStore.setSession(`mock-jwt-token-${values.username}`)
    toast.add({ severity: 'success', summary: 'Успіх', detail: 'Ви успішно увійшли!', life: 3000 })
    
    const redirectPath = (route.query.redirect as string) || '/users'
    router.push(redirectPath)
  } catch {
    toast.add({ severity: 'error', summary: 'Помилка', detail: 'Невірна авторизація', life: 3000 })
  }
})
</script>

<template>
  <form class="login-form" @submit.prevent="onSubmit">
    <h2>Авторизація</h2>
    <AppInput v-model="username" label="Логін" id="username" :error="usernameError" />
    <AppInput v-model="password" label="Пароль" id="password" type="password" :error="passwordError" />
    <AppButton label="Увійти" type="submit" :loading="isSubmitting" class="w-full" />
  </form>
</template>

<style scoped>
.login-form {
  max-width: 400px;
  margin: 2rem auto;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  background: var(--surface-card, #fff);
}

.login-form h2 {
  margin-bottom: 1.5rem;
  text-align: center;
}

.w-full {
  width: 100%;
}
</style>