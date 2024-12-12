<script setup>
import { useForm, useFieldError } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/yup'
import { useMyFetch } from '@/composables/useMyFetch'
import { useAuthStore } from '@/stores/auth'
import * as yup from 'yup'
import FormInputField from './FormInputField.vue'

const emit = defineEmits(['change', 'closeModal'])
const authStore = useAuthStore()

const { defineField, handleSubmit, meta } = useForm({
  validationSchema: toTypedSchema(
    yup.object({
      email: yup.string().min(1).email(),
      firstName: yup.string().min(1, 'First name is required').max(300),
      lastName: yup.string().min(1, 'Last name is required').max(30),
      password: yup.string().min(6, 'Password must contain at least 6 characters'),
      confirmPassword: yup.string().oneOf([yup.ref('password'), null], 'Passwords do not match'),
    }),
  ),
})

// fields
const [email, emailAttrs] = defineField('email')
const [firstName, firstNameAttrs] = defineField('firstName')
const [lastName, lastNameAttrs] = defineField('lastName')
const [password, passwordAttrs] = defineField('password')
const [confirmPassword, confirmPasswordAttrs] = defineField('confirmPassword')

// errors
const emailError = useFieldError('email')
const firstNameError = useFieldError('firstName')
const lastNameError = useFieldError('lastName')
const passwordError = useFieldError('password')
const confirmPasswordError = useFieldError('confirmPassword')
const { data, isPending, error, fetchData } = useMyFetch('/auth/register')

// submit logic
const onSubmit = handleSubmit(async (values) => {
  await fetchData({
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: values.email,
      f_name: values.firstName,
      l_name: values.lastName,
      password: values.password,
    }),
  })

  if (!isPending.value && data.value.user && !error.value) {
    authStore.setAuth(data.value)
    emit('closeModal')
  }
})
</script>

<template>
  <form class="sign-up-form" @submit.prevent="onSubmit">
    <FormInputField
      name="email"
      label="Email"
      type="email"
      :attrs="emailAttrs"
      :isPending="isPending"
      :error="emailError"
      v-model="email"
      required
    />

    <FormInputField
      name="firstName"
      label="First Name"
      type="text"
      :attrs="firstNameAttrs"
      :isPending="isPending"
      :error="firstNameError"
      v-model="firstName"
      required
    />

    <FormInputField
      name="lastName"
      label="Last Name"
      type="text"
      :attrs="lastNameAttrs"
      :isPending="isPending"
      :error="lastNameError"
      v-model="lastName"
      required
    />

    <FormInputField
      name="password"
      label="Password"
      type="password"
      :attrs="passwordAttrs"
      :isPending="isPending"
      :error="passwordError"
      v-model="password"
      required
    />

    <FormInputField
      name="confirmPassword"
      label="Confirm Password"
      type="password"
      :attrs="confirmPasswordAttrs"
      :isPending="isPending"
      :error="confirmPasswordError"
      v-model="confirmPassword"
      required
    />

    <small
      >Already have an account? <span class="link" @click="$emit('change')">Sign In</span></small
    >
    <button
      class="button-primary"
      type="submit"
      :disabled="!meta.valid || !meta.touched"
      :loading="isPending"
    >
      Sign Up
    </button>
  </form>
</template>

<style scoped>
.sign-up-form {
  display: flex;
  flex-direction: column;
  margin: auto;
  margin-bottom: 2rem;
  gap: 1rem;
  width: clamp(300px, 80%, 350px);
}

.button-primary {
  margin: auto;
  width: clamp(200px, 80%, 300px);
}
</style>
