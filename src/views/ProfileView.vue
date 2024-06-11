<template>
  <div class="profile">
    <h5>Hello {{ userProfile.name }}</h5>
    <p class="subtitle">This is your profile, check out!</p>
    <div>
      <p><strong>Name:</strong> {{ userProfile.name }}</p>
      <p><strong>Lastname:</strong> {{ userProfile.lastname }}</p>
      <p><strong>Email:</strong> {{ userProfile.email }}</p>
    </div>
    <q-btn color="primary" to="/" @click.prevent="logout">Sign out</q-btn>
  </div>
</template>

<style scoped lang="scss">
.profile {
  text-align: center;
}
h5 {
  margin-top: 1rem;
  margin-bottom: 0.5rem;
}

.subtitle {
  margin-bottom: 2rem;
}

strong {
  font-weight: bold;
}

button {
  position: absolute;
  bottom: 0;
}
</style>

<script lang="ts">
import { defineComponent } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { Notify } from 'quasar'
import { useFilesStore } from '@/stores/files'

export default defineComponent({
  data() {
    const authStore = useAuthStore()
    const filesStore = useFilesStore()

    return {
      authStore,
      filesStore,
      userProfile: {
        name: authStore.user?.name || '',
        lastname: authStore.user?.lastname || '',
        email: authStore.user?.email || ''
      }
    }
  },
  methods: {
    logout() {
      this.filesStore.cleanFiles()
      this.authStore.clearUser()
      Notify.create({ color: 'positive', message: 'Logged out successfully' })
    }
  }
})
</script>
