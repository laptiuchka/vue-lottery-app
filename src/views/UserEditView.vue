<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useForm, useField } from 'vee-validate';
import * as yup from 'yup';
import { useUsersStore } from '../stores/users.store';
import BaseModal from '../components/BaseModal.vue';
import BaseInput from '../components/BaseInput.vue';
import BaseButton from '../components/BaseButton.vue';

const props = defineProps<{
  id: string | number;
}>();

const emit = defineEmits<{
  (e: 'user-updated'): void;
}>();

const router = useRouter();
const usersStore = useUsersStore();
const isOpen = ref(true);
const loading = ref(true);

const schema = yup.object({
  firstName: yup.string().required("Ім'я є обов'язковим"),
  lastName: yup.string().required("Прізвище є обов'язковим"),
  email: yup.string().email('Некоректний email').required("Email є обов'язковим"),
  phone: yup.string().required("Телефон є обов'язковим"),
  age: yup
    .number()
    .typeError('Вік має бути числом')
    .required("Вік є обов'язковим")
    .min(18, 'Учасник повинен бути старше 18 років')
    .max(120, 'Введіть коректний вік'),
  gender: yup.string().required("Стать є обов'язковою"),
});

const { handleSubmit, setValues } = useForm({
  validationSchema: schema,
});

const { value: firstName, errorMessage: firstNameError } = useField<string>('firstName');
const { value: lastName, errorMessage: lastNameError } = useField<string>('lastName');
const { value: email, errorMessage: emailError } = useField<string>('email');
const { value: phone, errorMessage: phoneError } = useField<string>('phone');
const { value: age, errorMessage: ageError } = useField<number>('age');
const { value: gender, errorMessage: genderError } = useField<string>('gender');

onMounted(async () => {
  try {
    const user = await usersStore.getUserById(Number(props.id));
    setValues({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
      age: user.age,
      gender: user.gender,
    });
  } catch (err: unknown) {
    if (err instanceof Error) {
      alert(`Помилка отримання: ${err.message}`);
    }
    closeModal();
  } finally {
    loading.value = false;
  }
});

const closeModal = () => {
  isOpen.value = false;
  router.push('/users');
};

const onSubmit = handleSubmit(async (values) => {
  try {
    await usersStore.updateUser(Number(props.id), values);
    alert('Дані користувача успішно оновлено!');
    emit('user-updated');
    closeModal();
  } catch (err: unknown) {
    if (err instanceof Error) {
      alert(`Помилка оновлення: ${err.message}`);
    }
  }
});
</script>

<template>
  <BaseModal :is-open="isOpen" title="Редагування користувача" @close="closeModal">
    <div v-if="loading" class="text-center">Завантаження форми...</div>
    <form v-else @submit.prevent="onSubmit">
      <BaseInput v-model="firstName" label="Ім'я" :error-message="firstNameError" />
      <BaseInput v-model="lastName" label="Прізвище" :error-message="lastNameError" />
      <BaseInput v-model="email" type="email" label="Email" :error-message="emailError" />
      <BaseInput v-model="phone" label="Телефон" :error-message="phoneError" />
      <BaseInput v-model.number="age" type="number" label="Вік (18+)" :error-message="ageError" />
      <BaseInput v-model="gender" label="Стать (female/male)" :error-message="genderError" />
    </form>
    <template #footer>
      <BaseButton variant="secondary" @click="closeModal">Скасувати</BaseButton>
      <BaseButton variant="primary" @click="onSubmit">Зберегти зміни</BaseButton>
    </template>
  </BaseModal>
</template>