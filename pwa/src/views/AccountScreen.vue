<template>
    <div id="root" class="account screen">
        <div class="account-header">
            <Avatar md5hash="78d172c9cbb993794d2e9021fce57d68" status="online"/>
            <h2>{{username}}</h2>
        </div>
        <h3>Games</h3>
        <HistoryItem v-for="item in games" :key="item.gameId" :gameObj="item"/>
    </div>
</template>

<script>

import Avatar from '../components/Avatar';
import HistoryItem from '../components/HistoryItem';

export default {
    // Todo : Load user
    // Todo : Load games from server
    name: 'App',
    components: {
        Avatar,
        HistoryItem
    },
    props: {
        userId: {
            type: Number,
            required: true
        }
    },
    mounted () {
        this.loadUser();
        this.loadGames();
    },
    methods: {
        loadUser() {
            this.$store.dispatch("fetchUser", this.userId);
        },
        loadGames() {
            this.$store.dispatch("fetchGames", this.userId);
        }
    },
    computed: {
        username() {
            return this.$store.state.currentShownUser.username;
        },
        games() {
            return this.$store.state.currentShownUserGames;
        }
    }
}
</script>