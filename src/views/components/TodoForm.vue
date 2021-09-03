<template>
  <validation-observer
    #default="{ handleSubmit }"
    ref="refFormObserver"
  >
    <b-form
      class="p-2"
      @submit.prevent="handleSubmit(onSubmit)"
      @reset.prevent="resetForm"
    >
      <validation-provider
        #default="validationContext"
        name="Постановщик"
        rules="required"
      >
        <b-form-group
          label="Постановщик"
          label-for="statement"
          :state="getValidationState(validationContext)"
        >
          <v-select
            v-model="elementData.statement"
            :options="statementOptions"
            :clearable="false"
            input-id="statement"
          />
          <b-form-invalid-feedback :state="getValidationState(validationContext)">
            {{ validationContext.errors[0] }}
          </b-form-invalid-feedback>
        </b-form-group>
      </validation-provider>

      <validation-provider
        #default="validationContext"
        name="Ответственный"
        rules="required"
      >
        <b-form-group
          label="Ответственный"
          label-for="executor"
          :state="getValidationState(validationContext)"
        >
          <v-select
            v-model="elementData.executor"
            :options="statementOptions"
            :clearable="false"
            input-id="executor"
          />
          <b-form-invalid-feedback :state="getValidationState(validationContext)">
            {{ validationContext.errors[0] }}
          </b-form-invalid-feedback>
        </b-form-group>
      </validation-provider>

      <validation-provider
        #default="validationContext"
        name="Крайний срок"
        rules=""
      >
        <b-form-group
          label="Крайний срок"
          label-for="deadline"
          :state="getValidationState(validationContext)"
        >
          <flat-pickr
            id="deadline"
            v-model="elementData.deadline"
            class="form-control"
            placeholder="выберите дату"
          />
          <b-form-invalid-feedback :state="getValidationState(validationContext)">
            {{ validationContext.errors[0] }}
          </b-form-invalid-feedback>
        </b-form-group>
      </validation-provider>

      <validation-provider
        #default="validationContext"
        name="Название"
        rules="required"
      >
        <b-form-group
          label="Название"
          label-for="title"
          :state="getValidationState(validationContext)"
        >
          <b-form-input
            id="title"
            v-model="elementData.title"
            trim
          />
          <b-form-invalid-feedback :state="getValidationState(validationContext)">
            {{ validationContext.errors[0] }}
          </b-form-invalid-feedback>
        </b-form-group>
      </validation-provider>

      <b-form-group
        label="Описание"
        label-for="description"
      >
        <quill-editor
          id="quil-content"
          v-model="elementData.description"
          :options="editorOption"
          class="border-bottom-0"
        />
        <div
          id="quill-toolbar"
          class="d-flex justify-content-end border-top-0"
        >
          <!-- Add a bold button -->
          <button class="ql-bold" />
          <button class="ql-italic" />
          <button class="ql-underline" />
          <button class="ql-align" />
          <button class="ql-link" />
        </div>
      </b-form-group>

      <div class="d-flex mt-2">
        <b-button
          v-ripple.400="'rgba(255, 255, 255, 0.15)'"
          variant="primary"
          class="mr-2"
          type="submit"
        >
          Добавить
        </b-button>
        <b-button
          v-ripple.400="'rgba(186, 191, 199, 0.15)'"
          type="button"
          variant="outline-secondary"
          @click="$emit('hide')"
        >
          Отмена
        </b-button>
      </div>

    </b-form>
  </validation-observer>
</template>

<script>
import {
  BForm, BFormGroup, BFormInput, BFormInvalidFeedback, BButton,
} from 'bootstrap-vue'
import Ripple from 'vue-ripple-directive'
import flatPickr from 'vue-flatpickr-component'
import vSelect from 'vue-select'
import { quillEditor } from 'vue-quill-editor'
import { ValidationProvider, ValidationObserver } from 'vee-validate'
// eslint-disable-next-line import/no-unresolved
import { required } from '@validations'
import { ref, watch, computed } from '@vue/composition-api'
import formValidation from '@/utils/forms/form-validation'
import todoView from '../view'

export default {
  components: {
    BForm,
    BFormGroup,
    BFormInput,
    BFormInvalidFeedback,
    BButton,
    flatPickr,
    vSelect,
    quillEditor,
    ValidationProvider,
    ValidationObserver,
  },
  directives: {
    Ripple,
  },
  props: {
    // eslint-disable-next-line vue/require-prop-types
    elementId: {
      required: true,
    },
    isOpenSidebarActive: {
      type: Boolean,
      required: true,
    },
  },
  methods: {
    async onSubmit() {
      if (this.elementId) {
        await this.updateElement(this.elementId, this.elementData)
      } else {
        await this.createElement()
      }
      this.$emit('hide')
      this.$emit('refetch-data')
      this.$swal({
        icon: 'success',
        title: 'Элемент успешно сохранен!',
        showConfirmButton: false,
        timer: 1500,
        customClass: {
          confirmButton: 'btn btn-success',
        },
        buttonsStyling: false,
      })
    },
  },
  setup(props) {
    const {
      elementData,
      resetElementData,

      getElement,
      createElement,
      updateElement,
    } = todoView()
    const statementOptions = ref([
      'Иванов Михаил', 'Петров Василий', 'Сидоров Евгений',
    ])
    const {
      refFormObserver,
      getValidationState,
      resetForm,
    } = formValidation(resetElementData)

    const isOpenSidebar = computed(() => props.isOpenSidebarActive)
    const id = computed(() => props.elementId)
    watch(isOpenSidebar, val => {
      if (val === false) {
        resetForm()
      } else if (id.value) {
        getElement(id.value).then()
      } else {
        resetElementData()
      }
    })

    const editorOption = {
      modules: {
        toolbar: '#quill-toolbar',
      },
      placeholder: 'Запишите описание задачи',
    }
    return {
      elementData,
      statementOptions,
      required,
      refFormObserver,
      getValidationState,
      resetForm,
      editorOption,
      createElement,
      updateElement,
    }
  },
}
</script>

<style lang="scss">
@import '@core/scss/vue/libs/vue-select.scss';
@import '@core/scss/vue/libs/vue-flatpicker.scss';
@import '@core/scss/vue/libs/quill.scss';
</style>
