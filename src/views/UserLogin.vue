<template>
  <q-page class="login-page">
    <q-card class="login-card q-pa-md custom-form">
      <q-card-section class="custom-card">
        <h6>Login</h6>
      </q-card-section>
      <q-card-section>
        <q-form @submit.prevent="onLogin">
          <q-input v-model="email" label="Email" type="email" class="q-mb-md" />
          <q-input v-model="password" label="Password" type="password" class="q-mb-md" />
          <q-btn type="submit" label="Login" color="primary" class="full-width q-mt-md" />
        </q-form>
        <div class="create-account-link q-mt-md">
          <span> Don&apos;t have an account? </span>
          <RouterLink to="/about">Sign up</RouterLink>
        </div>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<style lang="scss">
@import '../styles/user-login.scss';
</style>

<script lang="ts">
import { defineComponent, ref } from 'vue'

export default defineComponent({
  setup() {
    const email = ref('')
    const password = ref('')

    const onLogin = () => {
      console.log('Email:', email.value)
      console.log('Password:', password.value)
    }

    return {
      email,
      password,
      onLogin
    }
  }
})
</script>
