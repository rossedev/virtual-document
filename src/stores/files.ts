import { getFiles } from '@/api/files'
import { defineStore } from 'pinia'
import { useAuthStore } from './auth'
import { Notify } from 'quasar'
import type { FileData, FilesState } from '@/types/files'

export const useFilesStore = defineStore('files', {
  state: (): FilesState => ({
    files: []
  }),
  actions: {
    async fetchFiles() {
      const authStore = useAuthStore()
      const userId = authStore.user?.id

      if (!userId) {
        console.error('User not authenticated')
        return
      }

      try {
        const response = await getFiles({ userId: authStore.user?.id })

        if (response.data) {
          const filterCurrentUser = response.data.filter(
            (res: any) => res.userId === authStore.user?.id
          )
          this.files = [...filterCurrentUser]
        }
      } catch (error) {
        Notify.create({ color: 'negative', message: `Error getting files` })
      }
    },
    addFile(newFile: FileData) {
      this.files.push(newFile)
    },
    removeFile(fileId: string) {
      const removeId = this.files.filter((f) => f.id !== fileId)
      this.files = removeId
    },
    editFile(updatedFile: FileData) {
      const index = this.files.findIndex((file) => file.id === updatedFile.id)
      if (index === -1) {
        console.error(`File with id ${updatedFile.id} not found`)
        return
      }
      this.files[index] = updatedFile
    },
    cleanFiles() {
      this.files = []
    },
    initializeStore() {
      this.fetchFiles()
    }
  }
})
