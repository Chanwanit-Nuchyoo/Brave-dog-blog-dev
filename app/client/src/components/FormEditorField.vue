<script setup>
import TiptapEditor from './TiptapEditor.vue'
import { useField } from 'vee-validate'

const props = defineProps({
  name: {
    type: String,
    required: true,
  },
  label: {
    type: String,
    required: true,
  },
  isPending: {
    type: Boolean,
    default: false,
  },
  required: {
    type: Boolean,
    default: false,
  },
})

const { value, errorMessage } = useField(() => props.name)
</script>

<template>
  <div
    class="form-field"
    :class="{
      required: props.required,
    }"
  >
    <label :for="props.name">{{ props.label }}</label>
    <TiptapEditor :content="value" @update="(html) => (value = html)" />
    <small v-if="errorMessage" class="error-text">{{ errorMessage }}</small>
  </div>
</template>
