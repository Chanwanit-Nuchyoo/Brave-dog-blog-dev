<script setup>
import { computed, ref } from 'vue'
import logo from '@/assets/images/logo.png'
import SignInForm from './SignInForm.vue'
import SignUpForm from './SignUpForm.vue'

const emit = defineEmits(['close'])

const formShown = ref('sign-in')
const modaldescription = computed(() => {
  if (formShown.value === 'sign-in') {
    return 'Welcome back to Brave Dog'
  } else {
    return "You're just one step away"
  }
})

const closeModal = () => {
  emit('close')
}
</script>

<template>
  <div class="modal-content">
    <div class="modal-logo"><img :src="logo" /></div>
    <p class="modal-description">{{ modaldescription }}</p>
    <SignInForm
      v-if="formShown === 'sign-in'"
      @change="formShown = 'sign-up'"
      @closeModal="$emit('close')"
    />
    <SignUpForm v-else @change="formShown = 'sign-in'" @closeModal="closeModal" />
  </div>
</template>

<style scoped>
.modal-content {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 400px;
  position: relative;
}

.modal-logo {
  display: flex;
  justify-content: center;
  margin-bottom: 1rem;
}

.modal-logo img {
  width: 200px;
}

.modal-title,
.modal-description {
  text-align: center;
}

@media screen and (max-width: 640px) {
  .modal-content {
    width: 300px;
  }
}
</style>
