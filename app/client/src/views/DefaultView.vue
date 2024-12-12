<script setup>
import { provide, ref } from 'vue'
import NavigationBar from '@/components/NavigationBar.vue'
import AppModal from '@/components/AppModal.vue'
import AuthenicateModalContent from '@/components/AuthenicateModalContent.vue'
import { RouterView } from 'vue-router'

const isSignInModalOpen = ref(false)
provide('isSignInModalOpen', isSignInModalOpen)
</script>

<template>
  <div class="flex flex-col min-h-screen">
    <NavigationBar @open-modal="isSignInModalOpen = true" />
    <div class="flex flex-col flex-1">
      <RouterView v-slot="{ Component }" mode="out-in">
        <Transition name="fade" mode="out-in" appear>
          <component :is="Component" />
        </Transition>
      </RouterView>
    </div>
    <AppModal :is-open="isSignInModalOpen" @close="isSignInModalOpen = false" full-screen-on-small>
      <AuthenicateModalContent @close="isSignInModalOpen = false" />
    </AppModal>
  </div>
</template>
