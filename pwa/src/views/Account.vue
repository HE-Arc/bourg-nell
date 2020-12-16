<template>
    <div id="root" class="account screen hasnav hasmaxwidth">
        <div class="account-header">
            <Avatar md5hash="78d172c9cbb993794d2e9021fce57d68" />
            <h2>{{name}}</h2>
        </div>
        <h3>Games</h3>
        <div class="games">
            <HistoryItem v-for="item in games" :key="item.gameId" :gameObj="item" :opened="true"/>
        </div>
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
    mounted () {
        console.log(this.$store.state.token);
        this.loadUser().then(() => this.loadGames());
    },
    methods: {
        async loadUser() {
            if(this.$route.params.id)
            {
                await this.$store.dispatch("fetchUser", this.$route.params.id);
            }
            else
            {
                await this.$store.dispatch("fetchAuthUser");
            }
        },
        async loadGames() {
            if(this.$route.params.id)
            {
                this.$store.dispatch("fetchGames", this.$route.params.id);
            }
            else
            {
                this.$store.dispatch("fetchAuthUserGames");
            }
        }
    },
    computed: {
        name() {
            return this.$store.state.currentShownUser.name;
        },
        games() {
            return this.$store.state.currentShownUserGames;
        }
    }
}
</script>