<script setup>
import { useAuthStore } from '@/stores/auth'
import { storeToRefs } from 'pinia'

const { mode } = storeToRefs(useAuthStore())

const setGuestMode = () => {
  mode.value = 'guest'
}
</script>

<template>
  <section class="welcome-section">
    <div class="my-container text-box">
      <h1 class="home-title">Welcome to <br />Brave&nbsp;Dog</h1>
      <h4 class="home-description">Share your experiences and ideas with the world</h4>
      <button class="button-secondary" @click="setGuestMode">Read articles</button>
    </div>
  </section>
</template>

<style scoped>
.welcome-section {
  background-image: url('@/assets/images/home-bg.jpg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  background-attachment: fixed;
}

.text-box {
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-height: calc(100vh - 60px);
  gap: 1rem;
  color: white;
}

h1,
h4 {
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
}

@media screen and (max-width: 640px) {
  .text-box {
    align-items: center;
    text-align: center;
  }
}
</style>
