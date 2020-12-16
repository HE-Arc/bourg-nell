<template>
    <div>
        <router-view></router-view>
        <!--<Navigation/>-->
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
