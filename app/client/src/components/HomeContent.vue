<script setup>
import BlogList from './BlogList.vue'
import useAppBreakpoints from '@/composables/useAppBreakpoints'
import MostReadBlogList from './MostReadBlogList.vue'
import CardComponent from './PageContainer.vue'

const breakpoints = useAppBreakpoints()
const isMobile = breakpoints.smallerOrEqual('sm')
</script>

<template>
  <CardComponent>
    <div class="home-container">
      <main class="main-content">
        <div class="title-container">
          <p>Latest Blogs</p>
        </div>
        <div class="separator" />
        <BlogList />
      </main>
      <div class="line" v-if="!isMobile"></div>
      <aside class="aside-content" v-if="!isMobile">
        <MostReadBlogList />
      </aside>
    </div>
  </CardComponent>
</template>

<style scoped>
.home-container {
  display: grid;
  grid-template-columns: 2fr 1px 1fr;
  gap: 1rem;
}

.main-content {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  width: 100%;
}

.search-bar-container {
  display: flex;
  gap: 10px;
  align-items: center;
}

.title-container {
  display: flex;
  gap: 10px;
}

.title-container p {
  font-size: 1.2rem;
  font-weight: 600;
}

.aside-content {
  width: 100%;
}

@media (max-width: 768px) {
  .home-container {
    grid-template-columns: 1fr; /* Set to 1fr for smaller screens */
  }
}
</style>
