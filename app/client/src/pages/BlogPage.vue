<script setup>
import { useMyFetch } from '@/composables/useMyFetch'
import { computed, onBeforeMount, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import NotFound from '@/components/NotFound.vue'
import BlogAuthor from '@/components/BlogAuthor.vue'
import BlogCommentsSection from '@/components/BlogCommentsSection.vue'
import BlogContainer from '@/components/BlogContainer.vue'

const route = useRoute()
const authStore = useAuthStore()
const slug = computed(() => route.params.slug)
const blogFetch = useMyFetch('/blogs/' + slug.value + '/read')
const canLikeFetch = useMyFetch('/blogs/' + slug.value + '/can-like')
const likeFetch = useMyFetch('/blogs/' + slug.value + '/like')
const unLikeFetch = useMyFetch('/blogs/' + slug.value + '/unlike')

const refreshBlog = async () => {
  const promises = [
    blogFetch.fetchData({
      method: 'GET',
    }),
  ]

  if (authStore.user) {
    promises.push(
      canLikeFetch.fetchData({
        method: 'GET',
        headers: {
          authorization: `Bearer ${authStore.token}`,
        },
      }),
    )
  }

  await Promise.all(promises)
}

const onLike = async () => {
  await likeFetch.fetchData({
    method: 'POST',
    headers: {
      authorization: `Bearer ${authStore.token}`,
    },
  })

  await refreshBlog()
}

const onUnLike = async () => {
  await unLikeFetch.fetchData({
    method: 'DELETE',
    headers: {
      authorization: `Bearer ${authStore.token}`,
    },
  })

  await refreshBlog()
}

onBeforeMount(async () => {
  await Promise.all([refreshBlog()])
})

watch(
  () => authStore.user,
  () => {
    if (!authStore.user) return

    canLikeFetch.fetchData({
      method: 'GET',
      headers: {
        authorization: `Bearer ${authStore.token}`,
      },
    })
  },
)
</script>

<template>
  <BlogContainer>
    <Transition name="fade" mode="out-in">
      <LoadingSpinner v-if="blogFetch.isPending.value || canLikeFetch.isPending.value" />
      <div v-else-if="!blogFetch.isPending.value && blogFetch.data.value && !blogFetch.error.value">
        <div
          v-if="blogFetch.data.value && blogFetch.data.value.coverImage"
          class="blog-header skeleton"
          :style="{ backgroundImage: `url(${blogFetch.data.value.coverImage})` }"
        />
        <main class="blog-content prose max-w-none">
          <h1>{{ blogFetch.data.value.title }}</h1>
          <div class="flex gap-4 items-center justify-between mb-8">
            <BlogAuthor
              :authorId="blogFetch.data.value.authorId"
              :author="blogFetch.data.value.author"
              :published="blogFetch.data.value.published"
            />
            <div
              @click="onLike"
              v-if="authStore.user && canLikeFetch.data.value.canLike"
              class="flex px-4 items-center gap-1 hover:scale-105 cursor-pointer"
            >
              <v-icon name="bi-heart-fill" scale="1.2" />
              <span class="mb-1">Like</span>
            </div>
            <div
              @click="onUnLike"
              v-else-if="authStore.user && !canLikeFetch.data.value.canLike"
              class="flex px-4 items-center gap-1 text-red-500 hover:scale-105 cursor-pointer"
            >
              <v-icon name="bi-heart-fill" scale="1.2" />
              <span class="mb-1">Liked</span>
            </div>
          </div>
          <div class="flex gap-4 items-center">
            <small
              class="flex items-center gap-1 cursor-pointer hover:underline underline-offset-4"
            >
              <v-icon name="bi-eye-fill" fill="#666" /> {{ blogFetch.data.value.read || 0 }}
            </small>
            <small
              class="flex items-center gap-1 cursor-pointer hover:underline underline-offset-4"
            >
              <v-icon name="bi-heart-fill" fill="#666" />
              {{ blogFetch.data.value._count.likes || 0 }}
            </small>
            <a style="text-decoration: none" href="#comments">
              <small
                class="flex items-center gap-1 cursor-pointer hover:underline underline-offset-4"
              >
                <v-icon name="io-chatbubble-sharp" fill="#666" scale="0.95" />
                {{ blogFetch.data.value._count.comments || 0 }}
              </small>
            </a>
          </div>
          <div class="separator" />
          <div class="mt-8" v-html="blogFetch.data.value.content" />
        </main>
        <div class="separator" />
        <BlogCommentsSection />
      </div>
      <NotFound v-else message="Blog Not Found" />
    </Transition>
  </BlogContainer>
</template>

<style scoped>
.title {
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.25);
}

.blog-header {
  background-size: cover;
  background-position: center;
  padding: 1.5rem;
  color: white;
  border-radius: 8px 8px 0 0;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 300px;
}

.avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  overflow: hidden;
  flex-shrink: 0;
}

.blog-content {
  overflow: auto;
  margin-top: 3rem;
}
</style>
