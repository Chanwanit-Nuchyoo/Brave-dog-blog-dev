<script setup>
import useAppBreakpoints from '@/composables/useAppBreakpoints'

const breakpoints = useAppBreakpoints()
const isMobile = breakpoints.smallerOrEqual('sm')

defineProps({
  isOpen: {
    type: Boolean,
    default: false,
  },
  fullScreenOnSmall: {
    type: Boolean,
    default: false,
  },
})
defineEmits(['close'])
</script>

<template>
  <Transition name="fade">
    <div v-if="isOpen" class="modal-container">
      <div class="backdrop" @click="$emit('close')" />
      <div class="modal" :class="{ 'full-screen-modal': fullScreenOnSmall && isMobile }">
        <slot></slot>
        <v-icon class="close-button" name="io-close-outline" scale="2" @click="$emit('close')" />
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.modal-container {
  z-index: 30;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
}

.backdrop {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
}

.modal {
  background-color: var(--background);
  padding: 3rem 1rem 1rem 1rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  position: relative;
}

.close-button {
  cursor: pointer;
  position: absolute;
  top: 1rem;
  right: 1rem;
}

.full-screen-modal {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

/* @media screen and (max-width: 640px) {
  .modal {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
} */
</style>
