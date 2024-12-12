<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useMyFetch } from '@/composables/useMyFetch'
import { onBeforeMount } from 'vue'
import LoadingSpinner from './LoadingSpinner.vue'
import BlogComment from './BlogComment.vue'
import BlogCommentInput from './BlogCommentInput.vue'

const route = useRoute()
const slug = computed(() => route.params.slug)

const commentsFetch = useMyFetch('/blogs/' + slug.value + '/comments')

const refreshComments = async () => {
  await commentsFetch.fetchData({
    method: 'GET',
  })
}

onBeforeMount(async () => {
  await refreshComments()
})
</script>

<template>
  <div class="flex flex-col">
    <BlogCommentInput @refresh-comments="refreshComments" />
    <Transition name="fade" mode="out-in">
      <div
        v-if="commentsFetch.isPending.value"
        class="flex h-full justify-center items-center relative"
      >
        <LoadingSpinner />
      </div>
      <div
        v-else-if="!commentsFetch.isPending.value && commentsFetch.data.value"
        class="flex flex-col mt-8 gap-6 min-h-[100px] pb-[3rem]"
      >
        <BlogComment
          @refresh-comments="refreshComments"
          v-for="(comment, index) in commentsFetch.data.value"
          :comment="comment"
          :key="index"
        />
      </div>
    </Transition>
  </div>
</template>

<style scoped></style>
