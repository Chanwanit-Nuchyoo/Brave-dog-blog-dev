<script setup>
import { useEditor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'
import Image from '@tiptap/extension-image'
import useAppBreakpoints from '@/composables/useAppBreakpoints'
import { computed } from 'vue'

const breakpoint = useAppBreakpoints()
const emit = defineEmits(['update'])
const props = defineProps({
  content: {
    type: String,
    default: '',
  },
})

const isMobile = breakpoint.smallerOrEqual('sm')
const iconSize = computed(() => {
  if (isMobile.value) {
    return 1
  } else {
    return 1.2
  }
})

const editor = useEditor({
  extensions: [StarterKit, Link, Image],
  content: props.content,
  editorProps: {
    attributes: {
      class:
        'prose max-w-none w-full focus:outline-none border border-gray-300 p-4 min-h-[20rem] max-h-[25rem] rounded-b-[8px] overflow-y-auto',
    },
  },
  onUpdate: () => {
    const html = editor.value.getHTML()
    emit('update', html)
  },
})
</script>

<template>
  <div class="flex flex-col focus-within:border-[2px] border-[var(--accent)] rounded-[8px]">
    <!-- Toolbar -->
    <div
      class="flex gap-1 flex-wrap items-center border-l border-t border-r rounded-t-[8px] p-[0.5rem]"
    >
      <button
        type="button"
        class="tiptap-button"
        @click="editor.chain().focus().toggleHeading({ level: 1 }).run()"
        :class="{ 'is-active': editor?.isActive('heading', { level: 1 }) }"
      >
        <v-icon name="bi-type-h1" :scale="iconSize" />
      </button>
      <button
        type="button"
        class="tiptap-button"
        @click="editor.chain().focus().toggleHeading({ level: 2 }).run()"
        :class="{ 'is-active': editor?.isActive('heading', { level: 2 }) }"
      >
        <v-icon name="bi-type-h2" :scale="iconSize" />
      </button>
      <button
        type="button"
        class="tiptap-button"
        @click="editor.chain().focus().toggleHeading({ level: 3 }).run()"
        :class="{ 'is-active': editor?.isActive('heading', { level: 3 }) }"
      >
        <v-icon name="bi-type-h3" :scale="iconSize" />
      </button>

      <button
        type="button"
        class="tiptap-button"
        @click="editor.chain().focus().toggleBold().run()"
        :class="{ 'is-active': editor?.isActive('bold') }"
      >
        <v-icon name="bi-type-bold" :scale="iconSize" />
      </button>
      <button
        type="button"
        class="tiptap-button"
        @click="editor.chain().focus().toggleItalic().run()"
        :class="{ 'is-active': editor?.isActive('italic') }"
      >
        <v-icon name="bi-type-italic" :scale="iconSize" />
      </button>
      <button
        type="button"
        class="tiptap-button"
        @click="editor.chain().focus().toggleStrike().run()"
        :class="{ 'is-active': editor?.isActive('strike') }"
      >
        <v-icon name="bi-type-strikethrough" :scale="iconSize" />
      </button>
      <button
        type="button"
        class="tiptap-button"
        @click="editor.chain().focus().toggleOrderedList().run()"
        :class="{ 'is-active': editor?.isActive('orderedList') }"
      >
        <v-icon name="bi-list-ol" :scale="iconSize" />
      </button>
      <button
        type="button"
        class="tiptap-button"
        @click="editor.chain().focus().toggleBulletList().run()"
        :class="{ 'is-active': editor?.isActive('bulletList') }"
      >
        <v-icon name="bi-list-ul" :scale="iconSize" />
      </button>
      <button
        type="button"
        class="tiptap-button"
        @click="editor.chain().focus().toggleBlockquote().run()"
        :class="{ 'is-active': editor?.isActive('blockquote') }"
      >
        <v-icon name="bi-quote" :scale="iconSize" />
      </button>

      <button
        type="button"
        class="tiptap-button"
        @click="editor.chain().focus().toggleCodeBlock().run()"
        :class="{ 'is-active': editor?.isActive('codeBlock') }"
      >
        <v-icon name="bi-code-slash" :scale="iconSize" />
      </button>
      <button
        type="button"
        class="tiptap-button"
        @click="editor.chain().focus().undo().run()"
        :disabled="!editor?.can().undo()"
      >
        <v-icon name="md-undo" :scale="iconSize" />
      </button>
      <button
        type="button"
        class="tiptap-button"
        @click="editor.chain().focus().redo().run()"
        :disabled="!editor?.can().redo()"
      >
        <v-icon name="md-redo" :scale="iconSize" />
      </button>

      <button
        type="button"
        class="tiptap-button"
        @click="editor.chain().focus().unsetAllMarks().run()"
      >
        <v-icon name="md-formatclear" :scale="iconSize" />
      </button>
    </div>
    <editor-content :editor="editor" />
  </div>
</template>

<style scoped>
.tiptap-button {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.4rem;
  border: 1px solid #d2d2dd;
  border-radius: 8px;
}

.tiptap-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.is-active {
  background-color: var(--primary);
  color: white;
}
</style>
