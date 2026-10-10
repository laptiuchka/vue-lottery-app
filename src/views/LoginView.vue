<script setup lang="ts">
import { useForm, useField } from 'vee-validate';
import * as yup from 'yup';
import { useRouter, useRoute } from 'vue-router';
import { useAuthStore } from '../stores/auth.store';
import BaseInput from '../components/BaseInput.vue';
import BaseButton from '../components/BaseButton.vue';

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();

const schema = yup.object({
  username: yup.string().required("Це поле є обов'язковим"),
  password: yup.string().min(4, 'Мінімум 4 символи').required("Це поле є обов'язковим"),
});

const { handleSubmit } = useForm({
  validationSchema: schema,
  initialValues: {
    username: 'emilys',
    password: 'emilyspass',
  },
});

const { value: username, errorMessage: usernameError } = useField<string>('username');
const { value: password, errorMessage: passwordError } = useField<string>('password');

const onSubmit = handleSubmit(async (values) => {
  const success = await authStore.login(values);
  if (success) {
    const redirect = (route.query.redirect as string) || '/users';
    router.push(redirect);
  }
});
</script>

<template>
  <div class="login-card">
    <div class="login-header">
      <h2>Авторизація</h2>
      <p>Вхід до панелі керування користувачами</p>
    </div>

    <div v-if="authStore.error" class="alert alert-danger">
      {{ authStore.error }}
    </div>

    <form @submit.prevent="onSubmit">
      <BaseInput
        v-model="username"
        label="Логін (username)"
        placeholder="emilys"
        :error-message="usernameError"
      />

      <BaseInput
        v-model="password"
        type="password"
        label="Пароль"
        placeholder="emilyspass"
        :error-message="passwordError"
      />

      <p class="hint-text">
        Підказка для тесту: <code>emilys</code> / <code>emilyspass</code>
      </p>

      <div class="form-actions">
        <BaseButton type="submit" variant="primary" :disabled="authStore.loading">
          {{ authStore.loading ? 'Вхід...' : 'Увійти' }}
        </BaseButton>
      </div>
    </form>
  </div>
</template>

<style scoped lang="scss">
.login-card {
  background: #ffffff;
  border: 1px solid #e1e4e8;
  border-radius: 8px;
  padding: 2rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);

  .login-header {
    text-align: center;
    margin-bottom: 1.5rem;

    h2 {
      margin: 0 0 0.5rem;
      font-size: 1.5rem;
      color: #333;
    }

    p {
      margin: 0;
      color: #777;
      font-size: 0.9rem;
    }
  }

  .alert {
    padding: 10px 14px;
    border-radius: 4px;
    margin-bottom: 1rem;
    font-size: 0.9rem;

    &.alert-danger {
      background-color: #ffebee;
      color: #c62828;
      border: 1px solid #ffcdd2;
    }
  }

  .hint-text {
    font-size: 0.85rem;
    color: #666;
    margin-bottom: 1.25rem;

    code {
      background: #f0f0f0;
      padding: 2px 6px;
      border-radius: 4px;
      color: #d32f2f;
    }
  }

  .form-actions {
    display: flex;
    justify-content: flex-end;
  }
}
</style>