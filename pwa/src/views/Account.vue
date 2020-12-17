<template>
    <div id="root" class="account screen hasnav hasmaxwidth">
        <div class="account-header">
            <Avatar :md5hash="profilePicture" />
            <h2>{{name}}</h2>
        </div>
        <h3>Games</h3>
        <NoGames v-if="!games.length && !loading"/>
        <Loading v-if="loading"/>
        <div v-if="!loading" class="games">
            <HistoryItem @loadUser="loadUser" v-for="item in games" :key="item.gameId" :gameObj="item"/>
        </div>
    </div>
</template>

<script>

import Avatar from '../components/Avatar';
import HistoryItem from '../components/HistoryItem';
import NoGames from '../components/NoGames';
import Loading from '../components/Loading';

export default {
    name: 'App',
    components: {
        Avatar,
        HistoryItem,
        NoGames,
        Loading
    },
    data() {
        return {
            loading: true,
        }
    },
    created () {
        this.load();
    },
    methods: {
        async load()
        {
            this.loading = true;
            if(!this.isAccount)
            {
                await this.$store.dispatch("fetchUser", this.$route.params.id);
                await this.$store.dispatch("fetchGames", this.$route.params.id);
            }
            else
            {
                this.$store.dispatch("fetchAuthUserGames");
            }
            this.loading = false;
        },
        async loadUser(userId)
        {
            if(userId != this.currentUser.id)
            {
                await this.$router.push({ name: "user-account", params: {id: userId} });
                await this.load();
            }
        }
    },
    computed: {
        isAccount()
        {
            return !Boolean(this.$route.params.id);
        },
        currentUser()
        {
            if(this.isAccount)
            {
                return this.$store.state.authUser;
            }
            else
            {
                return this.$store.state.currentShownUser;
            }
        },
        name() {
            return this.currentUser.name;
        },
        profilePicture() {
            return this.currentUser.gravatar;
        },
        games() {
            if(this.isAccount)
            {
                return this.$store.state.authUserGames;
            }
            else
            {
                return this.$store.state.currentShownUserGames;
            }
        }
    }
}
</script>