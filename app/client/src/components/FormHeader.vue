<script setup>
defineProps({
  title: {
    type: String,
    required: true,
  },
})
</script>

<template>
  <div class="form-header">
    <div class="flex items-center gap-2">
      <slot name="icon" />
      <h5 class="title">{{ title }}</h5>
    </div>
    <slot name="actions" />
  </div>
</template>

<style scoped>
.form-header {
  display: flex;
  gap: 5px;
  align-items: center;
  justify-content: space-between;
}
</style>
