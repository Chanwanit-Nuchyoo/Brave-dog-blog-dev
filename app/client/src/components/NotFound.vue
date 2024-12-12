<script setup>
defineProps({
  message: {
    type: String,
    required: true,
  },
})
</script>

<template>
  <div class="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]">
    <div class="flex justify-center items-center flex-col gap-2">
      <h4 class="text-neutral-500">{{ message }}</h4>
      <button class="button-primary" @click="$router.back()">Go Back</button>
    </div>
  </div>
</template>
