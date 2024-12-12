<script setup>
import PageContainer from '@/components/PageContainer.vue'
import BlogCard from '@/components/BlogCard.vue'
import NotFound from '@/components/NotFound.vue'
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import { useMyFetch } from '@/composables/useMyFetch'
import { computed, onBeforeMount } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useToast } from 'vue-toastification'

const route = useRoute()
const router = useRouter()
const toast = useToast()
const userId = computed(() => route.params.userId)
const userFetch = useMyFetch(`/users/${userId.value}`)
const blogsFetch = useMyFetch(`/users/${userId.value}/blogs`)
const authStore = useAuthStore()
const avatar = computed(() => {
  if (userFetch.data.value) {
    return (
      userFetch.data.value.avatar ??
      `https://avatar.iran.liara.run/username?username=${userFetch.data.value.f_name}+${userFetch.data.value.l_name}`
    )
  } else {
    return ''
  }
})

onBeforeMount(async () => {
  const fetches = Promise.all([
    userFetch.fetchData({ method: 'GET' }),
    blogsFetch.fetchData({ method: 'GET' }, { order: 'published:desc' }),
  ])

  await fetches
})

const canEdit = computed(() => authStore.user?.id.toString() === userId.value)

const goToEditProfile = () => {
  router.push({
    name: 'edit-profile',
  })
}

const onDelete = async (slug) => {
  if (!authStore.token) {
    toast.error('Please sign in first')
    return
  }

  const res = await fetch(`${import.meta.env.VITE_API_URL}/blogs/${slug}`, {
    method: 'DELETE',
    headers: {
      authorization: `Bearer ${authStore.token}`,
    },
  })

  if (res.status === 204) {
    await blogsFetch.fetchData({ method: 'GET' }, { order: 'published:desc' })
  } else {
    toast.error('Failed to delete blog')
  }
}
</script>

<template>
  <div class="flex flex-col flex-1">
    <PageContainer class="profile-container">
      <LoadingSpinner v-if="userFetch.isPending.value || blogsFetch.isPending.value" />
      <template v-if="!userFetch.isPending.value && userFetch.data.value && !userFetch.error.value">
        <div class="flex flex-col mt-4 md:mt-0 gap-4 rounded-t-[8px] h-fit items-center">
          <div
            class="w-[100px] h-[100px] rounded-full overflow-hidden skeleton shadow-lg relative hover:scale-105"
          >
            <img class="w-full h-full object-cover" :src="avatar" />
          </div>
          <div class="flex flex-col text-center items-center">
            <h4 class="drop-shadow-lg">
              {{ userFetch.data.value.f_name }} {{ userFetch.data.value.l_name }}
            </h4>
            <p class="drop-shadow-lg">{{ userFetch.data.value.email }}</p>

            <button
              v-if="canEdit"
              class="mt-4 text-sm text-white bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-full"
              @click="goToEditProfile"
            >
              Edit Profile
            </button>
            <p class="mt-4">{{ userFetch.data.value.bio }}</p>
          </div>
        </div>
        <div class="line" />
        <div class="flex flex-col">
          <div class="profile-cover">
            <img class="w-full h-full object-cover" src="https://picsum.photos/800/400" />
          </div>
          <div class="flex flex-col mt-4 flex-1">
            <h5>{{ userFetch.data.value.f_name }} {{ userFetch.data.value.l_name }}'s Blogs</h5>
            <div class="separator" />
            <template
              v-if="
                !blogsFetch.isPending.value &&
                blogsFetch.data.value.length &&
                !blogsFetch.error.value
              "
            >
              <BlogCard
                v-for="(blog, index) in blogsFetch.data.value"
                :showEditIcon="canEdit"
                :key="blog.id"
                :blog="blog"
                :is-last="index === blogsFetch.data.value.length - 1"
                @delete="onDelete"
              />
            </template>
            <div class="flex justify-center items-center h-full py-12" v-else>
              <p class="text-[#ccc]">No blogs found</p>
            </div>
          </div>
        </div>
      </template>
      <NotFound
        v-else-if="!userFetch.isPending.value && userFetch.error.value"
        message="User not found"
      />
    </PageContainer>
  </div>
</template>

<style scoped>
.profile-container {
  display: grid;
  grid-template-columns: 1fr 1px 2fr;
  gap: 1rem;
}
.profile-cover {
  display: flex;
  width: 100%;
  height: 200px;
  border-radius: 8px 8px 0 0;
  overflow: hidden;
}

@media (max-width: 640px) {
  .profile-container {
    display: flex;
    flex-direction: column;
  }

  .profile-cover {
    display: none;
  }

  .line {
    display: none;
  }
}
</style>
