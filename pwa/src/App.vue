<template>
    <div>
        <GameScreen/>
        <!--<AccountScreen userId="Luca Laissue"/>
        <Navigation/>-->
    </div>
</template>

<script>

import AccountScreen from './screens/AccountScreen';
import GameScreen from './screens/GameScreen';
import Navigation from './components/Navigation';

export default {
    // Todo : Load games from server
    name: 'App',
    components: {
        AccountScreen,
        Navigation,
        GameScreen
    }
}
</script>
