import mock from '@/@fake-db/mock'
import { paginateArray, sortCompare } from '@/@fake-db/utils'

const data = {
  items: [
    {
      id: 1,
      title: 'Написать MVP проекта',
      active: true,
      deadline: '2021-09-03',
      statement: 'Иванов Михаил',
      executor: 'Иванов Михаил',
      status: 'create',
      create: '2021-09-01',
      description: null,
    },
    {
      id: 2,
      title: 'Зашита проекта',
      active: true,
      deadline: '2021-09-04',
      statement: 'Иванов Михаил',
      executor: 'Иванов Михаил',
      status: 'create',
      create: '2021-09-01',
      description: null,
    },
  ],
}

mock.onGet('/api/todo/').reply(config => {
  const {
    q = '',
    perPage = 10,
    page = 1,
    sortBy = 'id',
    sortDesc = false,
    status = null,
  } = config.params

  const queryLowered = q.toLowerCase()
  const filteredData = data.items.filter(
    item => (item.title.toLowerCase().includes(queryLowered) || item.statement.toLowerCase().includes(queryLowered) || item.executor.toLowerCase().includes(queryLowered)) && item.status === (status || item.status),
  )

  const sortedData = filteredData.sort(sortCompare(sortBy))
  if (sortDesc) sortedData.reverse()

  return [200, { items: paginateArray(sortedData, perPage, page), count: filteredData.length }]
})

mock.onGet(/\/api\/todo\/\d+/).reply(config => {
  const itemId = config.url.substring(config.url.lastIndexOf('/') + 1)
  const item = data.items.find(x => x.id === parseInt(itemId, 10))
  if (item) return [200, item]

  return [404]
})

mock.onPost('/api/todo/').reply(config => {
  const { fields } = JSON.parse(config.data)
  fields.status = 'create'

  const lastId = (data.items || []).length > 0 ? data.items[(data.items || []).length - 1].id : 0
  fields.id = lastId + 1

  data.items.push({ ...fields })

  return [201, { fields }]
})

mock.onPost(/\/api\/todo\/\d+/).reply(config => {
  const itemId = config.url.substring(config.url.lastIndexOf('/') + 1)

  const { fields } = JSON.parse(config.data)
  const item = data.items.find(e => e.id === parseInt(itemId, 10))
  Object.assign(item, fields)

  return [200, { item }]
})

mock.onDelete(/\/api\/todo\/\d+/).reply(config => {
  const itemId = config.url.substring(config.url.lastIndexOf('/') + 1)

  const itemIndex = data.items.findIndex(x => x.id === parseInt(itemId, 10))
  data.items.splice(itemIndex, 1)
  return [200]
})
