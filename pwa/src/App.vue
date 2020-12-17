<template>
    <div>
        <link rel="stylesheet" :href="`${publicPath}${theme}.theme.css`"/>
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
    data() {
        return {
            publicPath: process.env.BASE_URL
        };
    },
    computed: {
        connected() {
            return this.$store.getters.loggedIn;
        },
        theme() {
            return this.$store.state.theme;
        }
    }
}
</script>
