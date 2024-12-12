<script setup>
import { useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { computed, inject, ref } from 'vue'
import { useTextareaAutosize } from '@vueuse/core'
import { useMyFetch } from '@/composables/useMyFetch'
import { useToast } from 'vue-toastification'

const props = defineProps({
  initialContent: {
    type: String,
    default: '',
  },
})

const emit = defineEmits(['refresh-comments'])
const { textarea, input } = useTextareaAutosize()
const authStore = useAuthStore()
const route = useRoute()
const toast = useToast()
const isSignInModalOpen = inject('isSignInModalOpen')
const slug = computed(() => route.params.slug)
const createCommentFetch = useMyFetch('/blogs/' + slug.value + '/comments')
const isInputOpen = ref(false)

const username = computed(() => {
  if (authStore.user) {
    return authStore.user.f_name + ' ' + authStore.user.l_name
  } else {
    return ''
  }
})
const avatar = computed(
  () =>
    authStore.user.avatar ||
    `https://avatar.iran.liara.run/username?username=${authStore.user.f_name}+${authStore.user.l_name}`,
)

const cancel = () => {
  input.value = ''
  isInputOpen.value = false
}

const onSubmit = async () => {
  if (input.value && authStore.token && authStore.user) {
    await createCommentFetch.fetchData({
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        authorization: `Bearer ${authStore.token}`,
      },
      body: JSON.stringify({
        content: input.value,
      }),
    })
    input.value = ''
    isInputOpen.value = false

    if (createCommentFetch.error.value) {
      toast.error(createCommentFetch.error.value.message)
      return
    }

    emit('refresh-comments')
  }
}
</script>

<template>
  <div id="comments" class="flex flex-col my-4 gap-4">
    <h5>Comments</h5>
    <form v-if="authStore.user" @submit.prevent="onSubmit" class="flex flex-col">
      <div class="flex flex-col gap-4 p-4 border border-[#ccc] rounded-[8px] relative">
        <div
          v-if="!isInputOpen"
          class="flex justify-center items-center w-full h-full cursor-pointer"
          @click="isInputOpen = true"
        >
          <p class="">Click to add a comment</p>
        </div>
        <div v-if="isInputOpen" class="flex gap-2">
          <div
            class="relative flex items-center justify-center w-[35px] h-[35px] rounded-full overflow-hidden"
          >
            <img class="object-cover" :src="avatar" />
          </div>
          <span>{{ username }}</span>
        </div>
        <textarea
          v-if="isInputOpen"
          :disabled="createCommentFetch.isPending.value"
          ref="textarea"
          v-model="input"
          class="comment-input"
          placeholder="Add a comment"
        />
        <div v-if="isInputOpen" class="flex absolute items-center right-2 bottom-3">
          <button
            @click="cancel"
            class="px-4 py-2 text-sm text-black hover:underline underline-offset-4"
            :disabled="createCommentFetch.isPending.value"
          >
            Cancel
          </button>
          <button
            class="px-4 py-2 text-sm bg-blue-500 hover:bg-blue-600 text-white rounded-full disabled:bg-gray-400 disabled:cursor-not-allowed"
            :disabled="!input || createCommentFetch.isPending.value"
          >
            Post
          </button>
        </div>
      </div>
    </form>
    <div v-else class="flex flex-col gap-4 py-8 px-4 border border-[#ccc] rounded-[8px]">
      <p class="text-center">
        Please
        <span
          class="text-blue-500 hover:underline underline-offset-4 cursor-pointer"
          @click="isSignInModalOpen = true"
          >sign in</span
        >
        to comment
      </p>
    </div>
  </div>
</template>
