<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import AppModal from './AppModal.vue'
import ThreeDotMenu from './ThreeDotMenu.vue'

const emit = defineEmits(['delete'])

const props = defineProps({
  blog: Object,
  isLast: Boolean,
  mode: String,
  showEditIcon: Boolean,
})

const { title, slug, summary, author, published, coverImage, read, likes, comments } = props.blog
const router = useRouter()

const clipedSummary = summary.length > 150 ? summary.slice(0, 150) + ' ...' : summary

const formattedPublished = new Date(published).toLocaleDateString('en-US', {
  month: 'short',
  day: 'numeric',
})

const goToBlog = () => {
  router.push({ name: 'blog', params: { slug } })
}

const goToEdit = () => {
  router.push({ name: 'edit-blog', params: { slug } })
}

const confirmDelete = () => {
  emit('delete', slug)
}
</script>

<template>
  <div v-if="mode === 'compact'" class="blog-card-compact">
    <h5 class="title">{{ title }}</h5>
    <small class="meta">by {{ author }} - {{ formattedPublished }}</small>
  </div>
  <div v-else class="blog-card">
    <div class="blog-info">
      <div class="flex justify-between flex-nowrap">
        <div @click="goToBlog" class="clickable flex flex-col flex-1">
          <h4 class="title">{{ title }}</h4>
          <small class="meta">by {{ author }} - {{ formattedPublished }}</small>
        </div>
        <div v-if="showEditIcon" class="relative flex flex-col py-4 w-[30px] cursor-pointer">
          <ThreeDotMenu
            confirm-delete-message="Are you sure you want to delete this blog?"
            @delete-clicked="confirmDelete"
            @edit-clicked="goToEdit"
          />
        </div>
      </div>
      <p class="summary">{{ clipedSummary }}</p>
      <div class="stats">
        <small class="read-icon"> <v-icon name="bi-eye-fill" fill="#666" /> {{ read }} </small>
        <small class="like-icon"> <v-icon name="bi-heart-fill" fill="#666" /> {{ likes }} </small>
        <small class="comment-icon">
          <v-icon name="io-chatbubble-sharp" fill="#666" scale="0.95" /> {{ comments }}
        </small>
      </div>
    </div>
    <div class="blog-cover skeleton">
      <img :src="coverImage" :alt="title" />
    </div>
  </div>
  <div v-if="!isLast" class="separator" />
</template>

<style scoped>
.clickable {
  cursor: pointer;
}

.blog-card {
  display: flex;
  align-items: center;
  padding: 1rem 0;
  height: auto;
  gap: 10px;
}

.blog-card-compact {
  display: flex;
  flex-direction: column;
  padding: 1rem 0 0 0;
  gap: 10px;
}

.blog-info {
  flex-grow: 1;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.summary {
  margin-top: 10px;
  flex-grow: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  line-clamp: 3; /* Show 3 lines by default */
  -webkit-line-clamp: 3; /* Safari support */
}

.blog-cover {
  width: clamp(120px, 30%, 160px);
  height: 80%;
  flex-shrink: 0;
  border-radius: 8px;
}

.blog-cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 8px;
}

.stats {
  display: flex;
  gap: 10px;
  margin-top: 10px;
  align-items: center;
}

.stats small {
  display: flex;
  align-items: center;
  gap: 5px;
  color: #666;
}

@media (max-width: 1024px) {
  .summary {
    line-clamp: 2;
    -webkit-line-clamp: 2;
  }
  .title {
    font-size: 1.5rem;
    line-clamp: 2;
  }
}

/* Responsive Design */
@media (max-width: 768px) {
  .blog-card {
    flex-direction: column-reverse;
  }

  .blog-cover {
    width: 70%;
    height: 150px;
  }
}
</style>
