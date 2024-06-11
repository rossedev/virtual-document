<template>
  <q-dialog v-model="isOpenInternal" transition-show="slide-up">
    <q-card class="form-card q-pa-md custom-form">
      <q-card-section class="custom-card">
        <div class="text-h6">Show file</div>
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
              readonly
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
              readonly
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
              readonly
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
              readonly
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
              readonly
            ></q-input>
          </div>
        </div>

        <img
          :src="
            isImage(form.typeFile) && typeof form.file === 'string' ? form.file : '/public/file.png'
          "
          alt="Preview"
          class="image-preview"
        />
      </q-card-section>

      <q-separator />

      <q-card-actions align="right">
        <div>
          <q-btn flat label="Cancel" color="primary" @click="closeDialog" no-caps />
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
import { useAuthStore } from '@/stores/auth'
import type { FileData } from '@/types/files'
import { isImage } from '@/utils/images'

export default defineComponent({
  name: 'ShowFileForm',
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
    const changeShowDocument = ref(false)
    const form = {
      ...props.dataFile
    }

    return { isOpenInternal, form, changeShowDocument }
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
