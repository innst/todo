<template>
  <div
    id="app"
    class="h-100"
  >
    <component :is="layout">
      <router-view />
    </component>
  </div>
</template>

<script>
import { provideToast } from 'vue-toastification/composition'
import { useWindowSize } from '@vueuse/core'
import { watch } from '@vue/composition-api'
import store from '@/store'

const LayoutClean = () => import('@/layouts/LayoutClean.vue')

export default {
  components: {
    LayoutClean,
  },
  computed: {
    layout() {
      return 'layout-clean'
    },
  },
  setup() {
    provideToast({
      hideProgressBar: true,
      closeOnClick: false,
      closeButton: false,
      icon: false,
      timeout: 3000,
      transition: 'Vue-Toastification__fade',
    })

    store.commit('app/UPDATE_WINDOW_WIDTH', window.innerWidth)
    const { width: windowWidth } = useWindowSize()
    watch(windowWidth, val => {
      store.commit('app/UPDATE_WINDOW_WIDTH', val)
    })
  },
}
</script>
