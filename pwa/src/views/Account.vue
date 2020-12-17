<template>
    <div id="root" class="account screen hasnav hasmaxwidth hasfab">
        <div class="card navigation" card-elevation="3">
            <div @click="navigateBack" class="card back-button left">
                <font-awesome-icon icon="arrow-left"/>
            </div>
            <div class="separator"></div>
            <div @click="toggleTheme" class="card back-button right">
                <font-awesome-icon icon="moon"/>
            </div>
            <div v-if="isAccount" @click="share" class="card right">
                <font-awesome-icon icon="share-alt"/>
            </div>
            <router-link v-if="isAccount" to="/logout" class="card right">
                <font-awesome-icon icon="sign-out-alt"/>
            </router-link>
            <router-link v-else to="/" class="card right">
                <font-awesome-icon icon="user"/>
            </router-link>
        </div>
        <div class="account-header">
            <Avatar :md5hash="profilePicture" />
            <h2>{{name}}</h2>
        </div>
        <h3>Games</h3>
        <NoGames v-if="!games.length && !loading"/>
        <Loading v-if="loading"/>
        <div v-if="!loading" class="games">
            <HistoryItem @loadUser="loadUser" v-for="item in games" :key="item.gameId" :myId="currentUser.id" :gameObj="item"/>
        </div>
        <PlayButton @play="playGame"/>
    </div>
</template>

<script>

import Avatar from '../components/Avatar';
import HistoryItem from '../components/HistoryItem';
import NoGames from '../components/NoGames';
import Loading from '../components/Loading';
import PlayButton from '../components/PlayButton';

export default {
    name: 'App',
    components: {
        Avatar,
        HistoryItem,
        NoGames,
        Loading,
        PlayButton,
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
        loadUser(userId)
        {
            this.$router.push({ name: "user-account", params: {id: userId} });
        },
        playGame()
        {
            this.$router.push({ name: "game" });
        },
        navigateBack()
        {
            this.$router.back();
        },
        toggleTheme()
        {
            this.$store.commit("toggleTheme");
        },
        share()
        {
            this.$router.push({ name: "user-account", params: {id: this.currentUser.id} });
        }
    },
    computed: {
        reload()
        {
            console.log(this.$$store.state);
            if(this.$store.state.realoadAccountPage)
            {
                this.reload;
            }
        },
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