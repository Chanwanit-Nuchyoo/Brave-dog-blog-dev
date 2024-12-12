<script setup>
import { useMyFetch } from '@/composables/useMyFetch'
import BlogCard from './BlogCard.vue'
import { onBeforeMount } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const { data, isPending, error, fetchData } = useMyFetch('/blogs')

onBeforeMount(async () => {
  await fetchData(
    {
      method: 'GET',
    },
    {
      take: 10,
      page: 1,
      order: 'read:desc,published:desc',
    },
  )
})

const goToBlog = (slug) => {
  router.push({ name: 'blog', params: { slug } })
}
</script>

<template>
  <section class="most-read-blogs">
    <div class="title-container">
      <p>Most read blogs this month</p>
    </div>
    <div class="separator" />
    <template v-if="!isPending && data.blogs && !error">
      <div
        v-for="(blog, index) in data.blogs"
        :key="blog.id"
        class="most-read-blog-list cursor-pointer"
        @click="goToBlog(blog.slug)"
      >
        <BlogCard :blog="blog" :isLast="index === data.blogs.length - 1" mode="compact" />
      </div>
    </template>
  </section>
</template>

<style scoped>
.most-read-blogs {
  display: flex;
  flex-direction: column;
}

.title-container p {
  font-size: 1.2rem;
  font-weight: 600;
}
</style>
