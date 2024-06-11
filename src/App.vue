<template>
  <q-layout>
    <q-header>
      <q-toolbar>
        <RouterLink v-if="authStore.isAuthenticated" to="/home">Virtual Document</RouterLink>
        <h7 v-else>Virtual Document</h7>
        <q-space />
        <q-btn
          v-if="authStore.isAuthenticated"
          @click="openFileForm"
          class="modify-btn"
          flat
          no-caps
        >
          Create File
        </q-btn>
        <FileForm
          v-if="showDialog"
          class="modify-btn"
          :isOpen="showDialog"
          @close="closeFileForm"
        />

        <RouterLink v-if="authStore.isAuthenticated" class="modify-btn" to="/profile"
          >Profile</RouterLink
        >
        <RouterLink v-if="authStore.isAuthenticated" to="/" @click.prevent="logout"
          >Log out</RouterLink
        >
      </q-toolbar>
    </q-header>
    <q-page-container class="page-container">
      <RouterView />
    </q-page-container>
  </q-layout>
</template>

<style scoped>
a {
  color: #fff;
}

.page-container {
  padding-top: 0;
}

.modify-btn {
  margin-right: 1rem;
  cursor: pointer;
}
</style>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { useAuthStore } from './stores/auth'
import { useRouter } from 'vue-router'
import { RouterView } from 'vue-router'
import FileForm from './components/FileForm.vue'
import { useFilesStore } from './stores/files'

export default defineComponent({
  components: {
    FileForm
  },
  setup() {
    const showDialog = ref(false)

    const authStore = useAuthStore()
    const filesStore = useFilesStore()
    const router = useRouter()
    return { filesStore, showDialog, router, authStore, RouterView }
  },
  methods: {
    logout() {
      this.filesStore.cleanFiles()
      this.authStore.clearUser()
    },
    openFileForm() {
      this.showDialog = true
    },
    closeFileForm() {
      this.showDialog = false
    }
  }
})
</script>
