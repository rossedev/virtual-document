<template>
  <q-dialog v-model="isOpenInternal" persistent transition-show="slide-up">
    <q-card class="form-card q-pa-md custom-form">
      <q-card-section class="custom-card">
        <h6>Edit file</h6>
      </q-card-section>
      <q-card-section style="max-height: 60vh" class="scroll">
        <div class="row q-gutter-x-md">
          <div class="col">
            <q-input
              v-model="form.idDocument"
              label="Identification Document"
              class="q-mb-md"
              required
              dense
              outlined
            ></q-input>
          </div>
          <div class="col">
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
          <div class="col">
            <q-input
              v-model="form.firstName"
              label="First Name"
              class="q-mb-md"
              dense
              required
              outlined
            ></q-input>
          </div>
          <div class="col">
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
          <div class="col-2">
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

        <div v-if="!changeShowDocument">
          <a :href="form.file" target="_blank" rel="noopener noreferrer"
            ><img
              :src="
                isImage(form.typeFile) && typeof form.file === 'string'
                  ? form.file
                  : '/public/file.png'
              "
              alt="Preview"
              class="image-preview"
            />
          </a>
          <div>
            <q-label class="labelFileView" @click="handleShowFile">Change the document</q-label>
          </div>
        </div>

        <div v-else-if="changeShowDocument">
          <q-uploader
            label="Select Document"
            :multiple="false"
            @added="handleAddedFile"
            accept="image/*,application/pdf"
            class="q-mb-md"
            dense
          ></q-uploader>
        </div>
      </q-card-section>

      <q-separator />

      <q-card-actions :align="hasErrors ? 'between' : 'right'">
        <div v-if="hasErrors" class="alert">
          <q-icon name="warning" class="warning" />
          <q-label>Verifique los campos </q-label>
        </div>

        <div>
          <q-btn flat label="Cancel" color="primary" @click="closeDialog" no-caps />
          <q-btn flat label="Update" color="primary" @click="handleEdit" no-caps />
        </div>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<style scoped>
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

.image-preview {
  width: 200px;
}

.labelFileView {
  cursor: pointer;
  color: #1976d2;
}
</style>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { useFilesStore } from '../stores/files'
import { uploadFilesToFirebase } from '../api/firebase'
import { editFile } from '../api/files'
import { useAuthStore } from '@/stores/auth'
import { Notify } from 'quasar'
import type { FileData } from '@/types/files'
import { isImage } from '@/utils/images'

export default defineComponent({
  name: 'EditFileForm',
  props: {
    isOpen: {
      type: Boolean,
      required: true
    },
    dataFile: {
      type: Object as () => FileData | null,
      required: true
    }
  },
  emits: ['close'],
  data(props) {
    const isOpenInternal = ref(props.isOpen)
    const hasErrors = ref(false)
    const changeShowDocument = ref(false)
    const form = {
      ...props.dataFile
    }

    return { isOpenInternal, form, hasErrors, changeShowDocument }
  },
  setup(props, { emit }) {
    const filesStore = useFilesStore()
    const authStore = useAuthStore()

    return { emit, authStore, filesStore, isImage }
  },
  methods: {
    closeDialog() {
      this.emit('close')
    },
    async handleEdit() {
      let imageUrl
      const isANewDocument = typeof this.form.file !== 'string'

      this.hasErrors = this.verifyField(this.form)
      if (!this.authStore.user?.id || this.hasErrors) {
        return
      }

      this.clearErrors()

      const randomNumber = Math.random().toString(36).slice(2, 12)
      if (isANewDocument) {
        imageUrl = await uploadFilesToFirebase(this.form.file)
      }

      const newFile = {
        id: this.form.id,
        idDocument: this.form?.idDocument,
        firstName: this.form.firstName,
        lastName: this.form.lastName,
        fileName: this.form.fileName,
        amountOfPages: this.form.amountOfPages,
        elementNumber: randomNumber,
        file: isANewDocument ? imageUrl : this.form.file,
        typeFile: isANewDocument ? this.form.file?.type : this.form.typeFile,
        userId: this.authStore.user?.id.toString() || '',
        pin: this.form.pin
      }

      try {
        const response = await editFile(newFile as FileData)
        if (response.data) {
          this.filesStore.editFile(response.data)
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
    },
    handleShowFile() {
      this.changeShowDocument = !this.changeShowDocument
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
