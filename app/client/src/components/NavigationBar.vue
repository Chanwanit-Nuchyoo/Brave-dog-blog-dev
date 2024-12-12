<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import logo from '@/assets/images/logo.png'
import useAppBreakpoints from '@/composables/useAppBreakpoints'

const emit = defineEmits(['open-modal'])
const authStore = useAuthStore()
const router = useRouter()

const breakpoints = useAppBreakpoints()
const isMobile = breakpoints.smallerOrEqual('sm')
const isSubNavOpen = ref(false)
const isPopupMenuOpen = ref(false)
const avatar = computed(
  () =>
    authStore.user.avatar ||
    `https://avatar.iran.liara.run/username?username=${authStore.user.f_name}+${authStore.user.l_name}`,
)

const openSignInModal = () => {
  isPopupMenuOpen.value = false
  isSubNavOpen.value = false
  emit('open-modal')
}

const signOut = () => {
  authStore.mode = undefined
  authStore.token = undefined
  authStore.user = undefined
  isPopupMenuOpen.value = false
  router.push({ name: 'home' })
}

const goToHome = () => {
  isSubNavOpen.value = false
  router.push({ name: 'home' })
}

const goToWriteBlog = () => {
  isSubNavOpen.value = false

  if (!authStore.user) {
    emit('open-modal')
    return
  }

  router.push({ name: 'create-blog' })
}

const goToProfile = () => {
  isPopupMenuOpen.value = false
  isSubNavOpen.value = false
  router.push({ name: 'profile', params: { userId: authStore.user.id } })
}
</script>

<template>
  <nav class="nav-bar">
    <div class="my-container">
      <img :src="logo" class="nav-logo" />
      <div class="hamburger-button" v-if="isMobile" @click="isSubNavOpen = !isSubNavOpen">
        <v-icon v-if="isSubNavOpen" name="io-close-outline" scale="1.6" />
        <v-icon v-else name="co-hamburger-menu" scale="1.6" />
      </div>
      <div v-else class="nav-menus">
        <div @click="goToHome" class="menu">Home</div>
        <div @click="goToWriteBlog" class="menu">Write Blog</div>
        <div v-if="authStore.user" class="flex items-center gap-2 relative">
          <div
            class="w-[38px] h-[38px] rounded-full overflow-hidden skeleton cursor-pointer hover:scale-105 shadow-lg"
            @click="isPopupMenuOpen = !isPopupMenuOpen"
          >
            <img class="w-full h-full object-cover" :src="avatar" />
          </div>
          <Transition name="fade">
            <div
              v-if="isPopupMenuOpen"
              class="absolute top-[120%] right-0 z-10 overflow-hidden h-fit"
            >
              <div class="popup-menu-container">
                <div class="popup-menu" @click="goToProfile">
                  <v-icon name="ri-user-fill" scale="1.2" />
                  <p>Profile</p>
                </div>
                <div class="popup-menu" @click="signOut">
                  <v-icon name="ri-logout-box-r-fill" scale="1.2" />
                  <p>Sign Out</p>
                </div>
              </div>
            </div>
          </Transition>
        </div>
        <button v-else class="button-primary p-0" @click="openSignInModal">Sign In</button>
      </div>
    </div>
    <div v-if="isMobile" class="sub-nav" :open="isMobile && isSubNavOpen">
      <div class="sub-nav-menus">
        <div @click="goToHome" class="sub-nav-menu">Home</div>
        <div @click="goToWriteBlog" class="sub-nav-menu">Write Blog</div>
        <div v-if="authStore.user" class="sub-nav-menu" @click="goToProfile">Profile</div>
        <div v-if="authStore.user" class="sub-nav-menu" @click="signOut">Sign Out</div>
        <div v-else class="sub-nav-menu" @click="openSignInModal">Sign In</div>
      </div>
    </div>
    <div v-if="isPopupMenuOpen" class="invisible-backdrop" @click="isPopupMenuOpen = false" />
  </nav>
</template>

<style scoped>
.nav-bar {
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  min-height: 60px;
  position: sticky;
  top: 0;
  z-index: 20;
  background-color: white;
}

.nav-bar .my-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 10px;
}

.nav-logo {
  /* placeholder */
  width: 10rem;
  border-radius: 8px;
}

.nav-menus {
  display: flex;
  gap: 20px;
  align-items: center;
}

.nav-menus a {
  font-size: 16px;
  font-weight: 600;
}

.menu,
.sub-nav-menu {
  cursor: pointer;
}

.menu:hover {
  text-decoration: underline;
  text-underline-offset: 5px;
}

.sub-nav {
  position: absolute;
  top: 60px;
  left: 0;
  right: 0;
  overflow: hidden;
  background: whitesmoke;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  transition: height 0.3s ease-in-out;
}

.sub-nav[open='true'] {
  height: calc(100vh - 60px);
}

.sub-nav[open='false'] {
  height: 0;
}

.sub-nav-menus {
  display: flex;
  flex-direction: column;
}

.sub-nav-menu {
  padding: 1rem 0;
  font-size: 16px;
  border-bottom: 0.5px solid #ccc;
  padding: 1rem 10px;
}

.popup-menu-container {
  display: flex;
  flex-direction: column;
  background: white;
  box-shadow: 2px 4px 4px rgba(0, 0, 0, 0.1);
  height: fit-content;
  width: fit-content;
  transition: height 0.25s ease-in-out;
  overflow: hidden;
  border-radius: 8px;
  height: fit-content;
  border: 1px solid #dedede;
}

.popup-menu {
  display: flex;
  align-items: center;
  text-wrap: nowrap;
  gap: 10px;
  padding: 0.5rem 1rem;
  border-bottom: 1px solid #dedede;
  cursor: pointer;
}

.popup-menu:hover {
  background: var(--secondary);
  color: white;
}

.popup-menu:last-of-type:hover {
  background: salmon;
  color: white;
}

@media screen and (max-width: 640px) {
  .nav-logo {
    width: 8rem;
  }
}
</style>
