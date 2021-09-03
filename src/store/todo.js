import axios from '@axios'

export default {
  namespaced: true,
  state: {},
  getters: {},
  mutations: {},
  actions: {
    fetchList(ctx, params) {
      return new Promise((resolve, reject) => {
        axios
          .get('/api/todo/', { params })
          .then(response => resolve(response))
          .catch(error => reject(error))
      })
    },
    fetchElement(ctx, { id }) {
      return new Promise((resolve, reject) => {
        axios
          .get(`/api/todo/${id}`)
          .then(response => resolve(response))
          .catch(error => reject(error))
      })
    },
    createElement(ctx, elementData) {
      return new Promise((resolve, reject) => {
        axios
          .post('/api/todo/', { fields: elementData })
          .then(response => resolve(response))
          .catch(error => reject(error))
      })
    },
    updateElement(ctx, { id, ...elementData }) {
      return new Promise((resolve, reject) => {
        axios
          .post(`/api/todo/${id}`, { fields: elementData })
          .then(response => resolve(response))
          .catch(error => reject(error))
      })
    },
    deleteElement(ctx, { id }) {
      return new Promise((resolve, reject) => {
        axios
          .delete(`/api/todo/${id}`)
          .then(response => resolve(response))
          .catch(error => reject(error))
      })
    },
  },
}
