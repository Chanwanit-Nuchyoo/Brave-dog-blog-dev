<script setup>
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/yup'
import { useAuthStore } from '@/stores/auth'
import { useMyFetch } from '@/composables/useMyFetch'
import * as yup from 'yup'
import FormInputField from './FormInputField.vue'

const emit = defineEmits(['change', 'closeModal'])
const authStore = useAuthStore()

const { meta, defineField, handleSubmit } = useForm({
  validationSchema: toTypedSchema(
    yup.object({
      email: yup.string().min(1).email(),
      password: yup.string().min(6),
    }),
  ),
})
const [email, emailAttrs] = defineField('email')
const [password, passwordAttrs] = defineField('password')
const { data, isPending, error, fetchData } = useMyFetch('/auth/login')
const onSubmit = handleSubmit(async (values) => {
  await fetchData({
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(values),
  })

  if (!isPending.value && data.value && !error.value) {
    authStore.setAuth(data.value)
    emit('closeModal')
  }
})
</script>

<template>
  <form class="sign-in-form" @submit.prevent="onSubmit">
    <FormInputField
      name="email"
      label="Email"
      type="email"
      :attrs="emailAttrs"
      :isPending="isPending"
      v-model="email"
    />

    <FormInputField
      name="password"
      label="Password"
      type="password"
      :attrs="passwordAttrs"
      :isPending="isPending"
      v-model="password"
    />

    <small>Don't have an account? <span class="link" @click="$emit('change')">Sign Up</span></small>
    <!-- <p v-if="error" class="text-center error-text">{{ data?.message || error }}</p> -->
    <button class="button-primary" :disabled="!meta.valid || !meta.touched" :loading="isPending">
      Sign In
    </button>
  </form>
</template>

<style scoped>
.sign-in-form {
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

small {
  margin-top: 1rem;
}
</style>
