<script setup>
const props = defineProps({
  rootProps: Object,
  inputProps: Object,
})
const value = defineModel()
</script>

<template>
  <div class="search-bar" v-bind="props.rootProps">
    <v-icon name="fa-search" scale="1.2" />
    <input type="text" placeholder="Search ..." v-model="value" v-bind="props.inputProps" />
  </div>
</template>

<style scoped>
.search-bar {
  position: relative;
  display: flex;
  gap: 1rem;
  border: 1px solid #ccc;
  border-radius: 30px;
  padding: 0.5rem 1rem;
  width: clamp(300px, 60%, 500px);
  align-items: center;
}

.search-bar:hover {
  border: 2px solid var(--accent);
}

.search-bar:focus-within {
  border: 2px solid var(--accent);
}

.search-bar input {
  border: none;
  width: 100%;
  height: 1rem;
  font-size: 16px;
}

.search-bar input:focus {
  outline: none;
}
</style>
