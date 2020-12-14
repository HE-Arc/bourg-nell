<template>
    <div>
        <AccountScreen v-if="connected" :userId="1"/>
        <LoginScreen v-else/>
        <Navigation/>
    </div>
</template>

<script>

import AccountScreen from './views/AccountScreen';
import LoginScreen from './views/LoginScreen';
import Navigation from './components/Navigation';

export default {
    // Todo : Load games from server
    name: 'App',
    components: {
        AccountScreen,
        Navigation,
        LoginScreen,
    },
    computed: {
        connected() {
            return this.$store.getters.loggedIn;
        }
    }
}
</script>
