<template>
  <q-dialog v-model="isOpenInternal" persistent transition-show="slide-up">
    <q-card class="form-card q-pa-md custom-form">
      <q-card-section class="custom-card">
        <h6>Create a file</h6>
      </q-card-section>
      <q-card-section style="max-height: 60vh" class="scroll">
        <div class="row q-gutter-x-md">
          <div class="col-sm col-lg-12">
            <q-input
              v-model="form.idDocument"
              label="Identification Document"
              class="q-mb-md"
              required
              dense
              outlined
            ></q-input>
          </div>
          <div class="col-sm col-lg-12">
            <q-input
              v-model="form.fileName"
              label="File Name"
              class="q-mb-md"
              dense
              required
              outlined
            ></q-input>
          </div>
        </div>

        <div class="row q-gutter-x-md">
          <div class="col-sm col-lg-12">
            <q-input
              v-model="form.firstName"
              label="First Name"
              class="q-mb-md"
              dense
              required
              outlined
            ></q-input>
          </div>
          <div class="col-sm col-lg-12">
            <q-input
              v-model="form.lastName"
              label="Last Name"
              class="q-mb-md"
              dense
              required
              outlined
            ></q-input>
          </div>
        </div>
        <div class="row q-gutter-x-md">
          <div class="col-sm-3 col-6">
            <q-input
              v-model="form.amountOfPages"
              type="number"
              label="Amount of Pages"
              class="q-mb-md"
              dense
              required
              outlined
            ></q-input>
          </div>
        </div>

        <q-uploader
          label="Select File"
          :multiple="false"
          @added="handleAddedFile"
          accept="image/*,application/pdf"
          class="q-mb-md"
          dense
          style="max-width: 100%"
        ></q-uploader>
      </q-card-section>

      <q-separator />

      <q-card-actions :align="hasErrors ? 'between' : 'right'">
        <div v-if="hasErrors" class="alert">
          <q-icon name="warning" class="warning" />
          <q-alert>Verifique los campos </q-alert>
        </div>

        <div>
          <q-btn flat label="Cancel" color="primary" @click="closeDialog" no-caps />
          <q-btn flat label="Create" color="primary" @click="handleForm" no-caps />
        </div>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<style>
.form-page {
  display: flex;
  justify-content: center;
  align-items: center;

  @media (max-width: 1280px) {
    padding: 15px;
  }
}
.form-card {
  max-width: 400px;
  width: 100%;
}

.alert {
  color: #d82222;

  .warning {
    font-size: 18px;
    margin-right: 0.5rem;
  }
}
</style>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { useFilesStore } from '@/stores/files'
import { uploadFilesToFirebase } from '@/api/firebase'
import { createFile } from '@/api/files'
import { useAuthStore } from '@/stores/auth'
import { Notify } from 'quasar'
import type { FileData } from '@/types/files'

export default defineComponent({
  name: 'FileForm',
  props: {
    isOpen: {
      type: Boolean,
      required: true
    }
  },
  emits: ['close'],
  data(props) {
    const isOpenInternal = ref(props.isOpen)
    const hasErrors = ref(false)
    const form = {
      idDocument: '',
      firstName: '',
      lastName: '',
      fileName: '',
      amountOfPages: 1,
      file: null as File | null
    }

    return { isOpenInternal, form, hasErrors }
  },
  setup(props, { emit }) {
    const filesStore = useFilesStore()
    const authStore = useAuthStore()
    return { emit, authStore, filesStore }
  },
  methods: {
    closeDialog() {
      this.emit('close')
    },
    async handleForm() {
      this.hasErrors = this.verifyField(this.form)
      if (!this.authStore.user?.id || this.hasErrors) {
        return
      }

      this.clearErrors()

      const randomNumber = Math.random().toString(36).slice(2, 12)
      const imageUrl = await uploadFilesToFirebase(this.form.file)
      const newFile: FileData = {
        idDocument: this.form.idDocument,
        firstName: this.form.firstName,
        lastName: this.form.lastName,
        fileName: this.form.fileName,
        amountOfPages: this.form.amountOfPages,
        elementNumber: randomNumber,
        file: imageUrl,
        typeFile: this.form.file?.type || '',
        userId: this.authStore.user?.id.toString() || '',
        pin: false
      }

      try {
        const response = await createFile(newFile)
        if (response.data) {
          this.filesStore.addFile(response.data)
          Notify.create({ color: 'positve', message: 'File saved correctly' })
          this.closeDialog()
        }
      } catch (error) {
        Notify.create({ color: 'negative', message: `Error saving the file: ${error}` })
      }
    },
    handleAddedFile(files: any) {
      if (Array.isArray(files) && files.length > 0) {
        this.form.file = files[0]
      }
    },
    verifyField(form: any) {
      if (
        !form.idDocument ||
        !form.firstName ||
        !form.firstName ||
        !form.lastName ||
        !form.file ||
        !form.amountOfPages
      ) {
        return true
      }
      return false
    },
    clearErrors() {
      this.hasErrors = false
    }
  },
  watch: {
    isOpen(newValue) {
      if (!newValue) {
        this.emit('close')
      }
    }
  }
})
</script>
