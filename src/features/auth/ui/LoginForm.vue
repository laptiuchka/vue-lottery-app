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
  initialValues: { username: 'kminchelle', password: '0lelzaR' },
})

const { value: username, errorMessage: usernameError } = useField<string>('username')
const { value: password, errorMessage: passwordError } = useField<string>('password')

const onSubmit = handleSubmit(async (values) => {
  try {
    sessionStore.setSession(`mock-jwt-token-${values.username}`)
    toast.add({ severity: 'success', summary: 'Успіх', detail: 'Ви успішно увійшли!', life: 3000 })
    router.push((route.query.redirect as string) || '/users')
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
    <div class="submit-wrapper">
      <AppButton label="Увійти" type="submit" :loading="isSubmitting" class="force-visible-btn" />
    </div>
  </form>
</template>

<style scoped>
.login-form {
  max-width: 400px;
  margin: 3rem auto;
  padding: 2.5rem;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  background-color: #ffffff !important;
  border: 1px solid #e9d5ff !important;
}

.login-form h2,
.login-form :deep(label) {
  color: #2e1065 !important;
}

.login-form h2 {
  margin-bottom: 1.5rem;
  text-align: center;
}

.login-form :deep(input) {
  background-color: #ffffff !important;
  color: #2e1065 !important;
  border: 1px solid #d8b4fe !important;
}

.login-form :deep(input):focus {
  border-color: #9333ea !important;
  box-shadow: 0 0 0 2px rgba(147, 51, 234, 0.2) !important;
}

.submit-wrapper {
  margin-top: 1.5rem;
  width: 100%;
}

:deep(.force-visible-btn) {
  display: flex !important;
  justify-content: center !important;
  width: 100% !important;
  background-color: #9333ea !important;
  border: 1px solid #9333ea !important;
  color: #ffffff !important;
  padding: 0.8rem !important;
  font-weight: 700 !important;
  border-radius: 8px !important;
}

:global(.dark-theme) .login-form {
  background-color: #4c2f76 !important;
  border: 1px solid #4c1d95 !important;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4);
}

:global(.dark-theme) .login-form h2,
:global(.dark-theme) .login-form :deep(label) {
  color: #f3e8ff !important;
}

:global(.dark-theme) .login-form :deep(input) {
  background-color: #d4bdec !important;
  color: #1a093b !important;
  border: 1px solid #4c1d95 !important;
}

:global(.dark-theme) .login-form :deep(input):focus {
  border-color: #9457d2 !important;
}

:global(.dark-theme) :deep(.force-visible-btn) {
  background-color: #4c1d95 !important;
  border-color: #4c1d95 !important;
  color: #f3e8ff !important;
}
</style>