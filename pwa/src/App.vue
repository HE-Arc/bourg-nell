<template>
    <div>
        <AccountScreen :userId="1"/>
        <Navigation/>
    </div>
</template>

<script>

import AccountScreen from './views/AccountScreen';
import Navigation from './components/Navigation';

export default {
    // Todo : Load games from server
    name: 'App',
    components: {
        AccountScreen,
        Navigation
    }
}
</script>
