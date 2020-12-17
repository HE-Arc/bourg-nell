<template>
    <div>
        <router-view :key="$route.fullPath"></router-view>
    </div>
</template>

<script>

import Navigation from './components/Navigation';

export default {
    // Todo : Load games from server
    name: 'App',
    components: {
        Navigation
    },
    computed: {
        connected() {
            return this.$store.getters.loggedIn;
        }
    }
}
</script>
