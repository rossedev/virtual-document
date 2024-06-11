<template>
  <files-page></files-page>
  <file-form :isOpen="isFileFormOpen" @close="isFileFormOpen = false"></file-form>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import FileForm from '@/components/FileForm.vue'
import FilesPage from '@/components/FilesPage.vue'
import { useFilesStore } from '@/stores/files'
const filesStore = useFilesStore()

export default defineComponent({
  components: {
    FileForm,
    FilesPage
  },
  setup() {
    const isFileFormOpen = ref(false)

    return {
      filesStore,
      isFileFormOpen
    }
  },
  created() {
    this.filesStore.initializeStore()
  }
})
</script>
