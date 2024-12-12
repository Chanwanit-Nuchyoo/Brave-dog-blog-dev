<script setup>
import { storeToRefs } from 'pinia'
import { useAuthStore } from '@/stores/auth'
import WelcomeSection from '@/components/WelcomeSection.vue'
import HomeContent from '@/components/HomeContent.vue'

const { mode } = storeToRefs(useAuthStore())
</script>

<template>
  <WelcomeSection v-if="!mode" />
  <HomeContent v-else />
</template>
