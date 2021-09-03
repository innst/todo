<template>
  <b-row>
    <b-col cols="12">
      <b-card
        no-body
        class="mb-0"
      >
        <todo-view
          :is-open-sidebar-active.sync="isOpenSidebarActive"
          :element-id="elementId"
          @refetch-data="refetchData()"
        />
        <div class="m-2">
          <b-row>
            <b-col
              cols="12"
              md="6"
              class="d-flex align-items-center justify-content-start mb-1 mb-md-0"
            >
              <label>Показывать по</label>
              <v-select
                v-model="perPage"
                :options="perPageOptions"
                :clearable="false"
                class="per-page-selector d-inline-block mx-50"
              />
              <label>записей</label>
            </b-col>
            <b-col
              cols="12"
              md="6"
            >
              <div class="d-flex align-items-center justify-content-end">
                <b-form-input
                  v-model="searchQuery"
                  class="d-inline-block mr-1"
                  placeholder="Поиск..."
                />
                <b-button
                  variant="primary"
                  @click="createElement()"
                >
                  <span class="text-nowrap">Добавить задачу</span>
                </b-button>
              </div>
            </b-col>
          </b-row>
        </div>

        <b-table
          ref="refTodoTable"
          class="position-relative"
          :items="fetchItems"
          responsive
          :fields="tableColumns"
          primary-key="id"
          :sort-by.sync="sortBy"
          show-empty
          empty-text="Совпадающих записей не найдено"
          :sort-desc.sync="isSortDirDesc"
        >

          <template #cell(active)="data">
            <feather-icon
              v-if="data.value == 1"
              class="text-success"
              icon="EyeIcon"
              size="16"
            />
            <feather-icon
              v-else
              class="text-danger"
              icon="EyeOffIcon"
              size="16"
            />
          </template>

          <template #cell(actions)="data">
            <b-dropdown
              variant="link"
              no-caret
            >

              <template #button-content>
                <feather-icon
                  icon="MoreVerticalIcon"
                  size="16"
                  class="align-middle text-body"
                />
              </template>

              <b-dropdown-item @click="openElement(data.item.id)">
                <feather-icon icon="EditIcon" />
                <span
                  class="align-middle ml-50"
                >
                  Просмотр
                </span>
              </b-dropdown-item>
              <b-dropdown-item
                @click="activeTodoElement(data.item.id, data.item.active)"
              >
                <feather-icon
                  v-if="data.item.active != 1"
                  icon="EyeIcon"
                  size="16"
                />
                <feather-icon
                  v-else
                  icon="EyeOffIcon"
                  size="16"
                />
                <span
                  v-if=" data.item.active === true"
                  class="align-middle ml-50"
                >Деактивировать</span>
                <span
                  v-else
                  class="align-middle ml-50"
                >Aктивировать</span>
              </b-dropdown-item>
              <b-dropdown-item
                @click="deleteTodoElement(data.item.id)"
              >
                <feather-icon icon="TrashIcon" />
                <span class="align-middle ml-50">Удалить</span>
              </b-dropdown-item>
            </b-dropdown>
          </template>
        </b-table>
        <div class="mx-2 mb-2">
          <b-row>

            <b-col
              cols="12"
              sm="6"
              class="d-flex align-items-center justify-content-center justify-content-sm-start"
            >
              <span class="text-muted">Показано с {{ dataMeta.from }} по {{ dataMeta.to }} из {{ dataMeta.of }} элементов</span>
            </b-col>
            <!-- Pagination -->
            <b-col
              cols="12"
              sm="6"
              class="d-flex align-items-center justify-content-center justify-content-sm-end"
            >

              <b-pagination
                v-model="currentPage"
                :total-rows="totalItems"
                :per-page="perPage"
                first-number
                last-number
                class="mb-0 mt-1 mt-sm-0"
                prev-class="prev-item"
                next-class="next-item"
              >
                <template #prev-text>
                  <feather-icon
                    icon="ChevronLeftIcon"
                    size="18"
                  />
                </template>
                <template #next-text>
                  <feather-icon
                    icon="ChevronRightIcon"
                    size="18"
                  />
                </template>
              </b-pagination>
            </b-col>
          </b-row>
        </div>
      </b-card>
    </b-col>
  </b-row>
</template>

<script>
import {
  BRow, BCol, BCard, BTable, BFormInput, BButton, BDropdown, BDropdownItem, BPagination,
} from 'bootstrap-vue'
import vSelect from 'vue-select'
import { ref } from '@vue/composition-api'
import todolist from './list'
import todoView from './view'
import TodoView from '@/views/TodoView.vue'

export default {
  components: {
    BRow,
    BCol,
    BCard,
    BTable,
    BFormInput,
    BButton,
    BDropdown,
    BDropdownItem,
    BPagination,
    vSelect,
    TodoView,
  },
  methods: {
    activeTodoElement(id, active) {
      this.updateElement(id, { active: !active })
        .then(() => {
          this.refetchData()
          this.$swal({
            icon: 'success',
            title: 'Элемент успешно Изменен!',
            showConfirmButton: false,
            timer: 1500,
            customClass: {
              confirmButton: 'btn btn-success',
            },
            buttonsStyling: false,
          })
        })
    },
    async deleteTodoElement(id) {
      const result = await this.$swal({
        title: 'Подтверждение удаления!',
        text: 'Вы уверены в необходимости удалить задачу?',
        icon: 'warning',
        showCancelButton: true,
        cancelButtonText: 'Отмена',
        confirmButtonText: 'Удалить',
        customClass: {
          confirmButton: 'btn btn-primary',
          cancelButton: 'btn btn-outline-danger ml-1',
        },
        buttonsStyling: false,
      })
      if (result.value) {
        this.deleteElement(id)
          .then(() => {
            this.refetchData()
            this.$swal({
              icon: 'success',
              title: 'Элемент успешно удален!',
              showConfirmButton: false,
              timer: 1500,
              customClass: {
                confirmButton: 'btn btn-success',
              },
              buttonsStyling: false,
            })
          })
      }
    },
  },
  setup() {
    const isOpenSidebarActive = ref(false)
    const elementId = ref(null)
    const {
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
    } = todolist()

    const { updateElement, deleteElement } = todoView()

    const createElement = () => {
      elementId.value = null
      isOpenSidebarActive.value = true
    }

    const openElement = id => {
      console.log('openElement', id)
      elementId.value = id
      isOpenSidebarActive.value = true
    }

    return {
      isOpenSidebarActive,
      elementId,

      createElement,
      openElement,

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
      updateElement,
      deleteElement,
    }
  },
}
</script>

<style lang="scss">
@import '@core/scss/vue/libs/vue-select.scss';
</style>
