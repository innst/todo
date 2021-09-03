<template>
  <b-sidebar
    id="todo-view-sidebar"
    :visible="isOpenSidebarActive"
    bg-variant="white"
    sidebar-class="sidebar-lg"
    shadow
    backdrop
    no-header
    right
    @change="(val) => $emit('update:is-open-sidebar-active', val)"
  >

    <template #default="{ hide }">
      <div class="d-flex justify-content-between align-items-center content-sidebar-header px-2 py-1">
        <h5
          v-if="!elementId"
          class="mb-0"
        >
          Добавить новую задачу
        </h5>
        <h5
          v-else
          class="mb-0"
        >
          Просмотр задачи
        </h5>

        <feather-icon
          class="ml-1 cursor-pointer"
          icon="XIcon"
          size="16"
          @click="hide"
        />
      </div>
      <todo-form
        :element-id="id"
        :is-open-sidebar-active="isOpenSidebarActive"
        @refetch-data="$emit('refetch-data')"
        @hide="hide"
      />
    </template>
  </b-sidebar>
</template>

<script>
import { BSidebar } from 'bootstrap-vue'
import { computed } from '@vue/composition-api'
import TodoForm from './components/TodoForm.vue'

export default {
  components: {
    BSidebar,
    TodoForm,
  },
  model: {
    prop: 'isOpenSidebarActive',
    event: 'update:is-open-sidebar-active',
  },
  props: {
    isOpenSidebarActive: {
      type: Boolean,
      required: true,
    },
    // eslint-disable-next-line vue/require-prop-types
    elementId: {
      required: true,
    },
  },
  setup(props) {
    const id = computed(() => props.elementId)

    return {
      id,
    }
  },
}
</script>
