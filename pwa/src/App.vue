<template>
    <div>
        <AccountScreen userId="Luca Laissue"/>
        <Navigation/>
    </div>
</template>

<script>

import AccountScreen from './screens/AccountScreen';
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
