<script setup>
import { useAuthStore } from '@/stores/auth'
import { computed, ref, watch } from 'vue'
import ThreeDotMenu from './ThreeDotMenu.vue'
import { useMyFetch } from '@/composables/useMyFetch'

const emit = defineEmits(['refresh-comments'])
const props = defineProps({
  comment: {
    type: Object,
    required: true,
  },
})
const authStore = useAuthStore()
const deleteCommentFetch = useMyFetch('/comments/' + props.comment.id)
const updateCommentFetch = useMyFetch('/comments/' + props.comment.id)
const content = ref(props.comment.content)
const isEditing = ref(false)
const isFormValid = computed(
  () => content.value.trim().length > 0 && content.value !== props.comment.content,
)

const avatar = computed(
  () =>
    props.comment.user.avatar ||
    `https://avatar.iran.liara.run/username?username=${props.comment.user.f_name}+${props.comment.user.l_name}`,
)

const onDelete = async () => {
  await deleteCommentFetch.fetchData({
    method: 'DELETE',
    headers: {
      authorization: `Bearer ${authStore.token}`,
    },
  })

  emit('refresh-comments')
}

const onCancelEdit = () => {
  content.value = props.comment.content
  isEditing.value = false
}

const onEdit = () => {
  isEditing.value = true
}

const onSubmitEdit = async () => {
  await updateCommentFetch.fetchData({
    method: 'PUT',
    headers: {
      authorization: `Bearer ${authStore.token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ content: content.value }),
  })

  emit('refresh-comments')
  isEditing.value = false
}
</script>

<template>
  <div class="flex gap-2">
    <div
      class="flex items-center justify-center rounded-full w-[40px] h-[40px] shadow-lg overflow-hidden flex-shrink-0"
    >
      <img :src="avatar" alt="user-avatar" class="object-cover w-full h-full object-center" />
    </div>
    <div class="flex flex-col w-full gap-1">
      <div class="flex justify-between">
        <span class="font-bold">{{ comment.user.f_name }} {{ comment.user.l_name }}</span>
        <div v-if="authStore.user && authStore.user.id === comment.user.id" class="relative">
          <ThreeDotMenu
            v-if="!isEditing"
            confirmDeleteMessage="Are you sure you want to delete this comment?"
            @edit-clicked="onEdit"
            @delete-clicked="onDelete"
          />
        </div>
      </div>
      <div v-if="isEditing" class="flex flex-col gap-2 w-full">
        <textarea
          v-if="true"
          :disabled="updateCommentFetch.isPending.value"
          class="comment-input border focus:ring"
          style="max-width: 100%"
          v-model="content"
        />
        <div class="flex justify-end">
          <button
            @click="onCancelEdit"
            class="px-4 py-2 text-sm text-black hover:underline underline-offset-4"
            :disabled="updateCommentFetch.isPending.value"
          >
            Cancel
          </button>
          <button
            @click="onSubmitEdit"
            :disabled="!isFormValid || updateCommentFetch.isPending.value"
            class="px-4 py-2 text-sm bg-blue-500 hover:bg-blue-600 text-white rounded-full disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            Post
          </button>
        </div>
      </div>
      <div v-else class="text-sm">{{ comment.content }}</div>
    </div>
  </div>
</template>
