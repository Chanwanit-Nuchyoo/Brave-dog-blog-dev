<script setup lang="ts">
import BlogForm from '@/components/BlogForm.vue'
import PageContainer from '@/components/PageContainer.vue'
import { useMyFetch } from '@/composables/useMyFetch'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()
const { data, isPending, error, fetchData } = useMyFetch('/blogs')

const onSubmit = async (values) => {
  const multipartForm = new FormData()

  for (const key in values) {
    multipartForm.append(key, values[key])
  }

  await fetchData({
    method: 'POST',
    headers: {
      authorization: `Bearer ${authStore.token}`,
    },
    body: multipartForm,
  })

  if (!error.value) {
    router.push({ name: 'blog', params: { slug: data.value.slug } })
  }
}
</script>

<template>
  <PageContainer class="flex flex-col">
    <BlogForm formHeader="Create Blog" @submit="onSubmit" />
  </PageContainer>
</template>

<style scoped>
.create-blog-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
</style>
