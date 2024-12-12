import './assets/index.css'
import './assets/main.css'
import 'vue-toastification/dist/index.css'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import { OhVueIcon, addIcons } from 'oh-vue-icons'
import Toast, { POSITION } from 'vue-toastification'
import {
  CoHamburgerMenu,
  IoCloseOutline,
  IoArrowForwardOutline,
  FaSearch,
  BiHeartFill,
  IoChatbubbleSharp,
  BiEyeFill,
  RiUserFill,
  RiLogoutBoxRFill,
  HiSolidEmojiSad,
  RiLoader4Line,
  IoCreateOutline,
  BiTypeH1,
  BiTypeH2,
  BiTypeH3,
  BiTypeBold,
  BiTypeItalic,
  BiTypeStrikethrough,
  BiListUl,
  BiListOl,
  BiQuote,
  BiCodeSlash,
  MdUndo,
  MdRedo,
  MdFormatclear,
  MdKeyboarddoublearrowright,
  MdKeyboarddoublearrowdown,
  LaEditSolid,
  IoReturnUpBackOutline,
  BiTrash3,
  MdMorevert,
} from 'oh-vue-icons/icons'

addIcons(
  CoHamburgerMenu,
  IoCloseOutline,
  IoArrowForwardOutline,
  FaSearch,
  BiHeartFill,
  IoChatbubbleSharp,
  BiEyeFill,
  RiUserFill,
  RiLogoutBoxRFill,
  HiSolidEmojiSad,
  RiLoader4Line,
  IoCreateOutline,
  BiTypeH1,
  BiTypeH2,
  BiTypeH3,
  BiTypeBold,
  BiTypeItalic,
  BiTypeStrikethrough,
  BiListUl,
  BiListOl,
  BiQuote,
  BiCodeSlash,
  MdUndo,
  MdRedo,
  MdFormatclear,
  MdKeyboarddoublearrowright,
  MdKeyboarddoublearrowdown,
  LaEditSolid,
  IoReturnUpBackOutline,
  BiTrash3,
  MdMorevert,
)

const app = createApp(App)

app.use(Toast, {
  position: POSITION.BOTTOM_RIGHT,
  timeout: 2500,
  closeOnClick: true,
  pauseOnHover: true,
  showCloseButtonOnHover: false,
})
app.use(createPinia())
app.use(router)

app.component('v-icon', OhVueIcon)
app.mount('#app')
