import Vue from 'vue'
import Vuex from 'vuex'

import app from './app'
import todo from './todo'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {},
  mutations: {},
  actions: {},
  modules: {
    app,
    todo,
  },
})
