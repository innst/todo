import { ref } from '@vue/composition-api'
import store from '@/store'

export default function todoView() {
  const blankData = {
    title: null,
    active: null,
    deadline: new Date(),
    statement: null,
    executor: null,
    status: null,
    create: new Date(),
    description: null,
  }

  const elementData = ref(JSON.parse(JSON.stringify(blankData)))
  const resetElementData = () => {
    elementData.value = JSON.parse(JSON.stringify(blankData))
  }

  const statementOptions = []

  const getElement = id => new Promise((resolve, reject) => {
    store
      .dispatch('todo/fetchElement', { id })
      .then(response => {
        elementData.value = response.data
        resolve(response.data)
      })
      .catch(error => reject(error))
  })

  const createElement = () => new Promise((resolve, reject) => {
    store
      .dispatch('todo/createElement', elementData.value)
      .then(response => {
        resolve(response.data)
      })
      .catch(error => reject(error))
  })

  const updateElement = (id, fields) => new Promise((resolve, reject) => {
    store
      .dispatch('todo/updateElement', { id, ...fields })
      .then(() => {
        resolve()
      })
      .catch(error => reject(error))
  })

  const deleteElement = id => new Promise((resolve, reject) => {
    store
      .dispatch('todo/deleteElement', { id })
      .then(() => {
        resolve()
      })
      .catch(error => reject(error))
  })

  return {
    elementData,
    resetElementData,
    statementOptions,

    getElement,
    createElement,
    updateElement,
    deleteElement,
  }
}
