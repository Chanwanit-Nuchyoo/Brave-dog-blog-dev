<script setup>
import { computed, ref, watch } from 'vue'
import * as yup from 'yup'
import { useToast } from 'vue-toastification'
import { toTypedSchema } from '@vee-validate/yup'
import { useAuthStore } from '@/stores/auth'
import { useForm, useFieldError } from 'vee-validate'
import { useMyFetch } from '@/composables/useMyFetch'
import { useRouter } from 'vue-router'
import FormHeader from '@/components/FormHeader.vue'
import FormImageInput from '@/components/FormImageInput.vue'
import PageContainer from '@/components/PageContainer.vue'
import FormInputField from '@/components/FormInputField.vue'
import FormTextAreaField from '@/components/FormTextAreaField.vue'

const authStore = useAuthStore()
const router = useRouter()
const toast = useToast()

watch(
  () => authStore.user,
  () => {
    if (!authStore.user) {
      toast.error('Please sign in first')
      router.push({ name: 'home' })
    }
  },
)

const profileInitialValues = computed(() => ({
  f_name: authStore.user.f_name,
  l_name: authStore.user.l_name,
  bio: authStore.user.bio,
}))

const { defineField, handleSubmit, resetForm } = useForm({
  validationSchema: toTypedSchema(
    yup.object({
      f_name: yup.string().min(1, 'First name is required').max(30),
      l_name: yup.string().min(1, 'Last name is required').max(30),
      bio: yup.string().nullable().max(300),
    }),
  ),
  initialValues: profileInitialValues,
})

const { data, isPending, error, fetchData } = useMyFetch(`/users/${authStore.user.id}`)

const [firstName, firstNameAttrs] = defineField('f_name')
const [lastName, lastNameAttrs] = defineField('l_name')
const [bio, bioAttrs] = defineField('bio')

const firstNameError = useFieldError('f_name')
const lastNameError = useFieldError('l_name')
const bioError = useFieldError('bio')

const currentAvatar = computed(
  () =>
    authStore.user.avatar ||
    `https://avatar.iran.liara.run/username?username=${authStore.user.f_name}+${authStore.user.l_name}`,
)
const newAvatar = ref(null)

const onSubmit = handleSubmit(async (values) => {
  const formData = new FormData()

  for (const key in values) {
    formData.append(key, values[key])
  }

  if (newAvatar.value) {
    formData.append('avatar', newAvatar.value)
  }

  await fetchData({
    method: 'PUT',
    headers: {
      authorization: `Bearer ${authStore.token}`,
    },
    body: formData,
  })

  if (!isPending.value && !error.value && data.value) {
    authStore.setUser(data.value)
    router.push({ name: 'profile', params: { userId: authStore.user.id } })
  }
})

const onCancel = () => {
  resetForm()
  newAvatar.value = null
  router.push({ name: 'profile', params: { userId: authStore.user.id } })
}
</script>

<template>
  <PageContainer class="flex flex-col items-center">
    <FormHeader title="Edit Profile" />
    <div class="separator" />
    <form @submit.prevent="onSubmit">
      <FormImageInput
        @update="(avatar) => (newAvatar = avatar)"
        name="profileImage"
        label="Profile Image"
        :initial-image="currentAvatar"
        preview-top
        circle-preview
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

      <FormTextAreaField
        name="bio"
        label="Bio"
        type="text"
        :attrs="bioAttrs"
        :isPending="isPending"
        :error="bioError"
        v-model="bio"
      />

      <div class="flex w-full justify-center mt-12 gap-4">
        <button @click="onCancel" type="button" class="button-secondary" :disabled="isPending">
          Cancel
        </button>
        <button type="submit" class="button-primary" :disabled="isPending">Save</button>
      </div>
    </form>
  </PageContainer>
</template>

<style scoped>
form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-width: 800px;
  width: 100%;
}
</style>
