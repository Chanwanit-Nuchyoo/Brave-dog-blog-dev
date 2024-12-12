<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const props = defineProps({
  authorId: {
    type: Number,
  },
  author: {
    type: Object,
    required: true,
  },
  published: {
    type: String,
    required: true,
  },
})

const avatar = computed(
  () =>
    props.author.avatar ||
    `https://avatar.iran.liara.run/username?username=${props.author.f_name}+${props.author.l_name}`,
)

const formattedPublished = computed(() => {
  if (props.published) {
    return new Date(props.published).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    })
  } else {
    return ''
  }
})

const visitAuthorProfile = () => {
  if (props.authorId) {
    router.push({ name: 'profile', params: { userId: props.authorId } })
  }
}
</script>

<template>
  <div class="flex items-center gap-4 cursor-pointer" @click="visitAuthorProfile">
    <div class="w-[50px] h-[50px] rounded-full overflow-hidden shadow-xl">
      <div class="flex justify-center items-center w-full h-full">
        <img class="object-cover" :src="avatar" />
      </div>
    </div>
    <div class="flex flex-col">
      <div clas="flex gap-4">
        <span>
          by <span class="font-bold">{{ author.f_name }} {{ author.l_name }}</span>
        </span>
      </div>
      <small>
        published on <span class="font-bold">{{ formattedPublished }}</span>
      </small>
    </div>
  </div>
</template>
