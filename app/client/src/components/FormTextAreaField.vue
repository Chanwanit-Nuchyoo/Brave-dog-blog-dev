<script setup>
defineProps({
  name: {
    type: String,
    required: true,
  },
  label: {
    type: String,
    required: true,
  },
  placeholder: {
    type: String,
    default: '',
  },
  type: {
    type: String,
    default: 'text',
  },
  attrs: {
    type: Object,
    required: true,
  },
  isPending: {
    type: Boolean,
    default: false,
  },
  error: {
    type: String,
    default: '',
  },
  required: {
    type: Boolean,
    default: false,
  },
})

const model = defineModel()
</script>

<template>
  <div
    class="form-field"
    :class="{
      required: required,
    }"
  >
    <label for="name">{{ label }}</label>
    <textarea
      :id="name"
      :name="name"
      :type="type"
      :placeholder="placeholder || label"
      v-model="model"
      v-bind="attrs"
      :disabled="isPending"
    />
    <small v-if="error" class="error-text">{{ error }}</small>
  </div>
</template>
