import { ref, watch, computed } from '@vue/composition-api'
import store from '@/store'
// import { useToast } from 'vue-toastification/composition'
// import ToastificationContent from '@core/components/toastification/ToastificationContent.vue'

export default function todolist() {
  // const toast = useToast()

  const tableColumns = [
    { key: 'actions', label: '', sortable: false },
    { key: 'title', label: 'Название', sortable: true },
    { key: 'active', label: 'Активность', sortable: true },
    { key: 'deadline', label: 'Крайний срок', sortable: true },
    { key: 'statement', label: 'Постановщик', sortable: true },
    { key: 'executor', label: 'Ответственный', sortable: true },
    { key: 'status', label: 'Статус', sortable: true },
    { key: 'create', label: 'Дата создания', sortable: true },
  ]

  const refTodoTable = ref(null)

  const perPage = ref(10)
  const totalItems = ref(0)
  const currentPage = ref(1)
  const perPageOptions = [10, 25, 50, 100]
  const searchQuery = ref('')
  const sortBy = ref('id')
  const isSortDirDesc = ref(true)

  const dataMeta = computed(() => {
    const localItemsCount = refTodoTable.value ? refTodoTable.value.localItems.length : 0
    return {
      from: perPage.value * (currentPage.value - 1) + (localItemsCount ? 1 : 0),
      to: perPage.value * (currentPage.value - 1) + localItemsCount,
      of: totalItems.value,
    }
  })

  const refetchData = () => {
    refTodoTable.value.refresh()
  }

  watch([currentPage, perPage, searchQuery], () => {
    refetchData()
  })

  const fetchItems = (ctx, callback) => {
    store.dispatch('todo/fetchList', {
      q: searchQuery.value,
      perPage: perPage.value,
      page: currentPage.value,
      sortBy: sortBy.value,
      sortDesc: isSortDirDesc.value,
    })
      .then(response => {
        console.log(response.data)
        const { items, count } = response.data

        callback(items || [])
        totalItems.value = count || 0
      })
  }

  return {
    tableColumns,
    fetchItems,
    perPage,
    currentPage,
    totalItems,
    dataMeta,
    perPageOptions,
    searchQuery,
    sortBy,
    isSortDirDesc,
    refTodoTable,

    refetchData,
  }
}
