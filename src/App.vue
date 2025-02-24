<script setup>
</script>

<template>
     <router-view />
</template>

<script>
import SignIn from './components/SignIn.vue' // Adjust path as needed

export default {
  name: 'App',
  components: {
    SignIn
  }
}
</script>