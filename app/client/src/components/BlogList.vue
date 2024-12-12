<script setup>
import BlogCard from '@/components/BlogCard.vue'
import { useMyFetch } from '@/composables/useMyFetch'
import { computed, onBeforeMount } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { watch } from 'vue'
import {
  Pagination,
  PaginationList,
  PaginationListItem,
  PaginationFirst,
  PaginationPrev,
  PaginationNext,
  PaginationLast,
  PaginationEllipsis,
} from '@/components/ui/pagination'
import { Button } from '@/components/ui/button'

const take = 10

const router = useRouter()
const route = useRoute()
const currentPage = computed(() => Number(route.query.page) || 1)
const { data, isPending, error, fetchData } = useMyFetch('/blogs')

onBeforeMount(async () => {
  await fetchData(
    {
      method: 'GET',
    },
    {
      take: take,
      page: currentPage.value,
    },
  )
})

watch(
  () => currentPage.value,
  async () => {
    await fetchData(
      {
        method: 'GET',
      },
      {
        take: take,
        page: currentPage.value,
      },
    )
  },
)

const onNext = () => {
  if (data.value && data.value.hasNext) {
    router.push({
      query: {
        page: currentPage.value + 1,
      },
    })
  }
}

const onLast = () => {
  if (data.value) {
    router.push({
      query: {
        page: data.value.totalPages,
      },
    })
  }
}

const onFirst = () => {
  if (data.value) {
    router.push({
      query: {
        page: 1,
      },
    })
  }
}

const onPrev = () => {
  if (data.value && currentPage.value > 1) {
    router.push({
      query: {
        page: currentPage.value - 1,
      },
    })
  }
}

const changePage = (page) => {
  router.push({
    query: {
      page,
    },
  })
}
</script>

<template>
  <Transition name="fade" mode="out-in">
    <div v-if="isPending" class="no-blogs">
      <v-icon name="ri-loader-4-line" scale="2" animation="spin" />
    </div>
    <div v-else-if="!isPending && data.blogs && !error" class="blog-list">
      <BlogCard
        v-for="(blog, index) in data.blogs"
        :key="blog.id"
        :blog="blog"
        :isLast="index === data.blogs.length - 1"
      />
      <div class="flex justify-center mt-4">
        <Pagination
          v-if="!isPending && data && data.totalPages > 1"
          v-slot="{ page }"
          :total="data.total"
          :items-per-page="data.take"
          :sibling-count="1"
          :default-page="1"
          :page="currentPage"
          show-edges
        >
          <PaginationList v-slot="{ items }" class="flex items-center gap-1">
            <PaginationFirst class="border border-[#ccc]" @click="onFirst" />
            <PaginationPrev class="border border-[#ccc]" @click="onPrev" />

            <template v-for="(item, index) in items">
              <PaginationListItem
                v-if="item.type === 'page'"
                :key="index"
                :value="item.value"
                as-child
              >
                <Button
                  class="w-10 h-10 p-0 text-black border border-[#ccc] data-[selected=true]:bg-[black] data-[selected=true]:text-white"
                  :variant="item.value === page ? 'default' : 'outline'"
                  @click="changePage(item.value)"
                >
                  {{ item.value }}
                </Button>
              </PaginationListItem>
              <PaginationEllipsis v-else :key="item.type" :index="index" />
            </template>

            <PaginationNext class="border border-[#ccc]" @click="onNext" />
            <PaginationLast class="border border-[#ccc]" @click="onLast" />
          </PaginationList>
        </Pagination>
      </div>
    </div>
    <div v-else-if="!isPending && !data.blogs && !error" class="no-blogs">
      <div>
        <p>No blogs found</p>
      </div>
    </div>
    <div v-else class="no-blogs"></div>
  </Transition>
</template>

<style scoped>
.blog-list {
  display: flex;
  flex-direction: column;
}

.no-blogs {
  display: grid;
  place-items: center;
  height: 100%;
}
</style>
