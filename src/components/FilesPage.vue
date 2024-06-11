<template>
  <div v-if="filesList.length === 0" class="no-files-message">
    <p>No documents created, create one</p>
  </div>
  <div class="grid-container">
    <div v-for="file in filesList" :key="file.elementNumber" class="grid-item">
      <q-card class="modify-card">
        <q-card-section class="section-card">
          <div class="image-container">
            <img
              :src="
                isImage(file.typeFile) && typeof file.file === 'string'
                  ? file.file
                  : '/public/file.png'
              "
              alt="file.fileName"
              class="image-preview"
              width="auto"
              height="100%"
            />
            <div v-if="file.pin">
              <div class="gray_background"></div>
              <q-icon class="pin_icon" name="font_push_pin" />
            </div>
          </div>
          <q-item-label class="modify-label">{{ truncateFileName(file.fileName) }}</q-item-label>
        </q-card-section>
        <EditFileForm
          v-if="showEditDialog"
          :isOpen="showEditDialog"
          :dataFile="dataFileToEdit"
          @close="closeFileForm"
        />

        <q-menu>
          <q-list style="min-width: 100px">
            <q-item clickable @click="pinFile(file)" v-close-popup dense>
              <q-item-section>{{ file.pin ? 'Unpin' : 'Pin' }}</q-item-section>
            </q-item>
            <q-item clickable @click="openFileForm(file)" v-close-popup dense>
              <q-item-section>Edit</q-item-section>
            </q-item>
            <q-item clickable @click="deleteFileWithId(file)" v-close-popup dense>
              <q-item-section>Delete</q-item-section>
            </q-item>
          </q-list>
        </q-menu>
      </q-card>
    </div>
  </div>
</template>

<style scoped lang="scss">
.section-card {
  padding: 0;
}

.image-container {
  position: relative;
  height: 50px;
  text-align: center;

  img {
    object-fit: cover;
  }

  @media only screen and (max-width: 992px) {
    width: 100%;
    height: 200px;
    img {
      width: 100%;
    }
  }

  .pin_icon {
    position: absolute;
    bottom: 0;
    left: 1rem;
  }

  .gray_background {
    height: 100%;
    background: #ffffff73;
    width: 100%;
    position: absolute;
    top: 0;
    left: 0;
  }
}
.grid-container {
  display: grid;
  grid-template-columns: repeat(15, 1fr);
  grid-template-rows: auto;
  gap: 10px;
  margin: 0.5rem;

  @media only screen and (max-width: 1200px) {
    grid-template-columns: repeat(6, 1fr);
  }

  @media only screen and (max-width: 992px) {
    grid-template-columns: repeat(4, 1fr);
  }

  @media only screen and (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
}
.modify-card {
  box-shadow: none;
  cursor: pointer;
}
.modify-label {
  text-align: center;
  font-size: 10px;
  margin-top: 10px;
}

.no-files-message {
  text-align: center;
  height: 89vh;
  align-content: center;
}
</style>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue'
import { deleteFile, editFile } from '@/api/files'
import { useAuthStore } from '@/stores/auth'
import { Notify } from 'quasar'
import { useFilesStore } from '@/stores/files'
import EditFileForm from './EditFileForm.vue'
import type { FileData } from '@/types/files'
import { isImage } from '@/utils/images'

export default defineComponent({
  name: 'FilesPage',
  data() {
    const showEditDialog = ref(false)
    const dataFileToEdit = ref<FileData | null>(null)

    return {
      showEditDialog,
      dataFileToEdit
    }
  },
  components: {
    EditFileForm
  },
  setup() {
    let filesList = ref<any[]>([])
    const authStore = useAuthStore()
    const filesStore = useFilesStore()

    watch(
      () => filesStore.files,
      (newValue) => {
        if (newValue) {
          filesList.value = newValue
        }
      }
    )

    return { authStore, filesStore, filesList: filesList, isImage }
  },

  methods: {
    truncateFileName(fileName: string) {
      return fileName && fileName.length > 10 ? fileName.slice(0, 10) + '...' : fileName
    },

    async pinFile(file: any) {
      const editPin = { ...file, pin: !file.pin }
      const response = await editFile(editPin)
      if (response.data) {
        this.filesStore.editFile(response.data)
        Notify.create({ color: 'positive', message: `Pinned successfully` })
      }
    },
    async deleteFileWithId(file: any) {
      try {
        if (file.pin) {
          Notify.create({ color: 'info', message: `The file is pinned, it cannot be deleted` })
          return
        }

        const response = await deleteFile(file.id)
        if (response.data) {
          this.filesStore.removeFile(file.id)
          Notify.create({ color: 'positive', message: `File deleted` })
        }
      } catch (error) {
        throw new Error(`There was an error in saving the data ${error}`)
      }
    },
    openFileForm(file: FileData) {
      this.dataFileToEdit = JSON.parse(JSON.stringify(file))
      this.showEditDialog = true
    },
    closeFileForm() {
      this.showEditDialog = false
      this.dataFileToEdit = null
    }
  }
})
</script>
