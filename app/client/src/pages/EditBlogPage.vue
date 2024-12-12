<script setup>
import { useRoute } from 'vue-router'
import { useMyFetch } from '@/composables/useMyFetch'
import { onBeforeMount, computed } from 'vue'
import BlogForm from '@/components/BlogForm.vue'
import PageContainer from '@/components/PageContainer.vue'
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import NotFound from '@/components/NotFound.vue'
import { useAuthStore } from '@/stores/auth'

const route = useRoute()
const authStore = useAuthStore()
const blogSlug = computed(() => route.params.slug)
const fetchBlog = useMyFetch(`/blogs/${blogSlug.value}`)
const submitBlog = useMyFetch(`/blogs/${blogSlug.value}`)

onBeforeMount(async () => {
  await fetchBlog.fetchData({
    method: 'GET',
  })
})

const onSubmit = async (values) => {
  const multipartForm = new FormData()

  for (const key in values) {
    multipartForm.append(key, values[key])
  }

  await submitBlog.fetchData({
    method: 'PUT',
    headers: {
      authorization: `Bearer ${authStore.token}`,
    },
    body: multipartForm,
  })

  if (!submitBlog.error.value) {
    fetchBlog.fetchData({
      method: 'GET',
    })
  }
}
</script>

<template>
  <PageContainer class="flex flex-col">
    <LoadingSpinner v-if="fetchBlog.isPending.value" />
    <template
      v-else-if="!fetchBlog.isPending.value && fetchBlog.data.value && !fetchBlog.error.value"
    >
      <BlogForm formHeader="Edit Blog" :initialValues="fetchBlog.data.value" @submit="onSubmit" />
    </template>
    <NotFound v-else message="Blog not found" />
  </PageContainer>
</template>
