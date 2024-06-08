<script setup lang="ts">
import { RouterView } from 'vue-router'
</script>

<template>
  <q-layout>
    <q-header>
      <q-toolbar>
        <q-title> Virtual Document </q-title>
        <q-space />
        <!--   <q-btn stretch flat to="/" label="Home" />
        <q-btn stretch flat to="/about" label="About" /> -->
      </q-toolbar>
    </q-header>
    <q-page-container>
      <q-page>
        <RouterView />
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<style scoped></style>
