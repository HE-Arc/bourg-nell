<template>
  <div id="app">
    <img alt="Vue logo" src="./assets/logo.png">
    <Avatar md5hash="78d172c9cbb993794d2e9021fce57d68" status="online"/>
  </div>
</template>

<script>
import Avatar from './components/Avatar';

export default {
  name: 'App',
  components: {
    Avatar
  }
}
</script>

<style>
</style>
