<script setup lang="ts">
import FormEditorField from '@/components/FormEditorField.vue'
import FormHeader from '@/components/FormHeader.vue'
import FormInputField from '@/components/FormInputField.vue'
import { toTypedSchema } from '@vee-validate/yup'
import { useFieldError, useForm } from 'vee-validate'
import { computed, ref } from 'vue'
import * as yup from 'yup'
import FormImageInput from './FormImageInput.vue'
import { useRouter } from 'vue-router'

const props = defineProps({
  formHeader: {
    type: String,
    required: true,
  },
  initialValues: {
    type: Object,
  },
  submitFn: {
    type: Function,
  },
})

const emit = defineEmits(['submit'])

const router = useRouter()
const { meta, values, defineField, resetForm } = useForm({
  initialValues: {
    title: props.initialValues?.title || '',
    summary: props.initialValues?.summary || '',
    content: props.initialValues?.content || '',
  },
  validationSchema: toTypedSchema(
    yup.object({
      title: yup.string().min(5).max(150),
      summary: yup.string().min(10).max(300),
      content: yup.string().min(300).max(30000),
    }),
  ),
})

const [title, titleAttr] = defineField('title')
const [summary, summaryAttr] = defineField('summary')
const oldCoverImage = computed(() => props.initialValues?.coverImage || '')
const coverImage = ref(null)

const titleError = useFieldError('title')
const summaryError = useFieldError('summary')

const setCoverImageFileValue = (value) => {
  coverImage.value = value
}

const onCancel = () => {
  resetForm()
  router.back()
}
</script>

<template>
  <FormHeader :title="props.formHeader">
    <template #icon>
      <v-icon name="io-create-outline" scale="1.3" />
    </template>
    <template #actions>
      <div class="flex gap-2">
        <v-icon name="io-return-up-back-outline" @click="onCancel" scale="1.3">Cancel</v-icon>
      </div>
    </template>
  </FormHeader>
  <div class="separator" />
  <form class="blog-form" @submit.prevent="emit('submit', { ...values, coverImage })">
    <FormInputField
      v-model="title"
      :attrs="titleAttr"
      :error="titleError"
      name="title"
      label="Title"
      required
    />
    <FormInputField
      v-model="summary"
      :attrs="summaryAttr"
      :error="summaryError"
      name="summary"
      label="Summary"
      required
    />

    <FormEditorField name="content" label="Content" required />

    <FormImageInput
      name="coverImage"
      :label="`Cover Image (Optional)`"
      :initialImage="oldCoverImage"
      @update="setCoverImageFileValue"
    />

    <div class="flex items-center my-16 justify-center">
      <button class="button-primary submit-button" type="submit">
        {{ initialValues ? 'Update' : 'Create' }}
      </button>
    </div>
  </form>
</template>

<style scoped>
.blog-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.submit-button {
  width: 200px;
}
</style>
