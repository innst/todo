import Vue from 'vue'
import { ToastPlugin, ModalPlugin, IconsPlugin } from 'bootstrap-vue'
import VueCompositionAPI from '@vue/composition-api'

import App from './App.vue'
import router from './router'
import store from './store'

import '@axios'
import '@/libs/toastification'
import '@/libs/sweet-alerts'
import '@/libs/vue-select'
import '@/libs/feather-icon'

import '@/@fake-db/db'

Vue.use(ToastPlugin)
Vue.use(ModalPlugin)
Vue.use(IconsPlugin)

Vue.use(VueCompositionAPI)

require('@core/assets/fonts/feather/iconfont.css')

require('@/assets/scss/style.scss')
require('@/@core/scss/core.scss')

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
