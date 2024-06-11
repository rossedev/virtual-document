<template>
  <q-page class="register-page">
    <q-card class="register-card q-pa-md custom-form">
      <q-card-section class="custom-card">
        <h6>Register</h6>
      </q-card-section>
      <q-card-section>
        <q-form @submit.prevent="registerUser">
          <div class="row q-gutter-x-md">
            <div class="col-sm col-lg-12">
              <q-input v-model="name" required label="Name" type="text" class="q-mb-md" dense />
            </div>

            <div class="col-sm col-lg-12">
              <q-input
                v-model="lastname"
                required
                label="Last name"
                type="text"
                class="q-mb-md"
                dense
              />
            </div>
          </div>

          <q-input v-model="email" required label="Email" type="email" class="q-mb-md" dense />
          <q-input
            v-model="password"
            required
            label="Password"
            type="password"
            class="q-mb-md"
            dense
          />
          <q-btn type="submit" label="Register" color="primary" class="full-width q-mt-md" />
        </q-form>
        <div class="create-account-link q-mt-md">
          <span> Or </span>
          <RouterLink to="/">Log In</RouterLink>
        </div>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<style lang="scss">
@import '../styles/user-register.scss';
</style>

<script lang="ts">
import { defineComponent } from 'vue'
import { saveUser } from '../api/user'
import { useAuthStore } from '../stores/auth'
import { useRouter } from 'vue-router'
import { Notify } from 'quasar'

export default defineComponent({
  data() {
    return {
      name: '',
      lastname: '',
      email: '',
      password: ''
    }
  },
  setup() {
    const authStore = useAuthStore()
    const router = useRouter()
    return { router, authStore }
  },
  methods: {
    async registerUser() {
      const params = {
        name: this.name,
        lastname: this.lastname,
        email: this.email,
        password: this.password
      }

      try {
        const response = await saveUser(params)

        if (response) {
          this.authStore.setUser(response)

          Notify.create({ color: 'positive', message: 'User registered successfully' })

          this.router.push('/home')
        }
      } catch (error) {
        Notify.create({ color: 'negative', message: `There is an error: ${error}` })
      }
    }
  }
})
</script>
