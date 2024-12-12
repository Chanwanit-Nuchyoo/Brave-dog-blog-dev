<script setup>
import { ref, computed } from 'vue'
import useAppBreakPoints from '@/composables/useAppBreakpoints'

const emit = defineEmits(['update'])

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
  initialImage: {
    type: String,
    default: null,
  },
  circlePreview: {
    type: Boolean,
    default: false,
  },
  previewTop: {
    type: Boolean,
    default: false,
  },
})
const breakpoints = useAppBreakPoints()
const isMobile = breakpoints.smallerOrEqual('sm')
const imagePreview = ref(null)

function handleFileChange(event) {
  const file = event.target.files[0]
  emit('update', file)
  if (file) {
    const reader = new FileReader()
    reader.onload = () => {
      imagePreview.value = reader.result
    }
    reader.readAsDataURL(file)
  } else {
    imagePreview.value = null
  }
}

const style = computed(() => {
  if (props.circlePreview) {
    return {
      borderRadius: props.circlePreview ? '50%' : '8px',
      width: '100px',
      height: '100px',
      overflow: 'hidden',
    }
  } else {
    return {}
  }
})
</script>

<template>
  <div
    class="form-field"
    :class="{
      required: props.required,
    }"
    :style="{
      flexDirection: props.previewTop ? 'column-reverse' : 'column',
    }"
  >
    <div class="flex flex-col gap-2">
      <label for="props.name">{{ props.label }}</label>
      <input
        class="border border-gray-300 rounded-md px-3 py-2 w-full"
        :id="props.name"
        :name="props.name"
        type="file"
        @change="handleFileChange"
        accept="image/*"
        :disabled="isPending"
      />
    </div>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-2 mb-4">
      <div v-if="props.initialImage" class="flex flex-col items-center">
        <p class="text-center">Current Image</p>
        <div class="image-preview" :style="style">
          <img :src="props.initialImage" alt="Image Preview" />
        </div>
      </div>
      <div
        v-if="props.initialImage && imagePreview"
        class="flex items-center justify-center h-full"
      >
        <v-icon v-if="isMobile" name="md-keyboarddoublearrowdown" scale="5" fill="#ccc" />
        <v-icon v-else name="md-keyboarddoublearrowright" scale="5" fill="#ccc" />
      </div>
      <div v-if="imagePreview" class="flex flex-col items-center">
        <p class="text-center">New Image</p>
        <div class="image-preview" :style="style">
          <img :src="imagePreview" alt="Image Preview" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.image-preview {
  margin-top: 1rem;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  border-radius: 8px;
}

.image-preview img {
  max-width: 100%;
  max-height: 100%;
  object-fit: cover;
  object-position: center;
  border-radius: 8px;
}
</style>
