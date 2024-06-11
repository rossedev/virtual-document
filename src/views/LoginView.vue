<template>
  <q-page class="login-page">
    <q-card class="login-card q-pa-md custom-form">
      <q-card-section class="custom-card">
        <h6>Login</h6>
      </q-card-section>
      <q-card-section>
        <q-form @submit.prevent="loginUser">
          <q-input v-model="email" label="Email" type="email" class="q-mb-md" />
          <q-input v-model="password" label="Password" type="password" class="q-mb-md" />
          <q-btn type="submit" label="Login" color="primary" class="full-width q-mt-md" />
        </q-form>
        <div class="create-account-link q-mt-md">
          <span> Don&apos;t have an account? </span>
          <RouterLink to="/register">Sign up</RouterLink>
        </div>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<style lang="scss">
@import '../styles/user-login.scss';
</style>

<script lang="ts">
import { defineComponent } from 'vue'
import { logInUsers } from '../api/user'
import { useAuthStore } from '../stores/auth'
import { useRouter } from 'vue-router'
import { useFilesStore } from '@/stores/files'
import { Notify } from 'quasar'

export default defineComponent({
  data() {
    return {
      email: '',
      password: ''
    }
  },
  setup() {
    const authStore = useAuthStore()
    const filesStore = useFilesStore()
    const router = useRouter()
    return { router, filesStore, authStore }
  },
  methods: {
    async loginUser() {
      const params = { email: this.email, password: this.password }
      try {
        const existUser = await logInUsers(params)
        if (existUser) {
          this.authStore.setUser(existUser)
          Notify.create({ color: 'positive', message: 'Login successful' })
          this.router.push('/home')
        }
      } catch (error) {
        Notify.create({ color: 'negative', message: `There is an error: ${error}` })
      }
    }
  }
})
</script>
