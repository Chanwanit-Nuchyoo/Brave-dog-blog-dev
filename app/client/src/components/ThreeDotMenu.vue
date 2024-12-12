<script setup>
import { ref } from 'vue'
import AppModal from './AppModal.vue'

const props = defineProps({
  confirmDeleteMessage: String,
})

defineEmits(['edit-clicked', 'delete-clicked'])

const isOptionMenuOpen = ref(false)
const isShowDeleteConfirm = ref(false)
</script>

<template>
  <v-icon
    class="hover:scale-105 cursor-pointer"
    name="md-morevert"
    scale="1.2"
    @click="isOptionMenuOpen = true"
  />
  <Transition name="fade" mode="out-in">
    <div
      v-if="isOptionMenuOpen"
      class="z-10 absolute right-2 top-7 flex flex-col w-fit h-fit border border-[#ccc] bg-white rounded-lg"
    >
      <button
        @click="
          () => {
            isOptionMenuOpen = false
            $emit('edit-clicked')
          }
        "
        class="flex items-center gap-1 px-5 py-2 hover:bg-[#dfdfdf]"
      >
        <span>
          <v-icon name="la-edit-solid" fill="#666" scale="1.1" />
        </span>
        <span>Edit</span>
      </button>
      <button
        @click="
          () => {
            isOptionMenuOpen = false
            isShowDeleteConfirm = true
          }
        "
        class="flex items-center gap-1 px-5 py-2 hover:bg-[#dfdfdf] text-red-500"
      >
        <span>
          <v-icon name="bi-trash3" fill="#ef4444" scale="1.1" />
        </span>
        <span>Delete</span>
      </button>
    </div>
  </Transition>
  <div v-if="isOptionMenuOpen" @click="isOptionMenuOpen = false" class="invisible-backdrop" />
  <AppModal :is-open="isShowDeleteConfirm" @close="isShowDeleteConfirm = false">
    <div class="flex flex-col gap-4 mt-4 mx-4 h-full justify-between">
      <p>{{ props.confirmDeleteMessage }}</p>
      <div class="flex justify-end gap-4">
        <!-- Cancel Button -->
        <button
          @click="isShowDeleteConfirm = false"
          class="px-4 py-2 rounded-full bg-gray-200 hover:bg-gray-300 text-gray-700 text-sm transition-colors"
        >
          Cancel
        </button>
        <!-- Delete Button -->
        <button
          @click="
            () => {
              isShowDeleteConfirm = false
              $emit('delete-clicked')
            }
          "
          class="px-4 py-2 rounded-full bg-red-500 hover:bg-red-600 text-white text-sm transition-colors"
        >
          Delete
        </button>
      </div>
    </div>
  </AppModal>
</template>
