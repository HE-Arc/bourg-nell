import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

Vue.use(Vuex)
axios.defaults.baseURL = "https://bourgnell.srvz-webapp.he-arc.ch"

export default new Vuex.Store({
    state: {
        token: localStorage.getItem('access_token') || null,
        theme: localStorage.getItem('theme') || 'light',
        authUser: {},
        authUserGames: [],
        currentShownUser: {name: "unknown"},
        currentShownUserGames: []
    },
    getters: {
        loggedIn(state) {
            return state.token != null
        }
    },
    mutations: {
        retrieveToken(state, token) {
            state.token = token;
            localStorage.setItem("access_token", token);
        },
        updateCredentials(state, credentials)
        {
            state.credentials.email = credentials.email
            state.credentials.password = credentials.password
            localStorage.setItem("email", credentials.email);
            localStorage.setItem("password", credentials.email);
        },
        destroyToken(state) {
            localStorage.removeItem("access_token")
            state.token = null
        },
        updateAuthUser(state, user) {
            state.authUser = user;
        },
        updateUser(state, user) {
            state.currentShownUser = user;
        },
        updateAuthGames(state, games) {
            state.authUserGames = games;
        },
        updateGames(state, games) {
            state.currentShownUserGames = games;
        },
        toggleTheme(state) {

            if(state.theme == "light") state.theme = "dark";
            else if(state.theme == "dark") state.theme = "light";
            localStorage.setItem("theme", state.theme);
        }
    },
    actions: {
        async registerUser(context, user) {
            let response = await axios.post("/users/create", {
                name: user.name,
                email: user.email,
                password: user.password
            });
            return response;
        },
        async fetchAuthUser(context) {
            axios.defaults.headers.common["Authorization"] = "Bearer " + context.state.token

            let response = await axios.get("/users/me")
            context.commit("updateAuthUser", response.data.me);
            return response;
        },
        async fetchAuthUserGames(context) {
            axios.defaults.headers.common["Authorization"] = "Bearer " + context.state.token

            let response = await axios.get(`/games/by-user/${context.state.authUser.id}`)
            context.commit("updateAuthGames", response.data.games);
            return response;
        },
        async fetchUser(context, userId) {
            axios.defaults.headers.common["Authorization"] = "Bearer " + context.state.token

            let response = await axios.get(`/users-admin/${userId}`)
            context.commit("updateUser", response.data.user)
            return response;
        },
        async fetchGames(context, userId) {
            axios.defaults.headers.common["Authorization"] = "Bearer " + context.state.token

            let response = await axios.get(`/games/by-user/${userId}`);
            context.commit("updateGames", response.data.games)
            return response;
        },
        async destroyToken(context) {
            axios.defaults.headers.common["Authorization"] = "Bearer " + context.state.token

            if (context.getters.loggedIn) {
                context.commit("destroyToken")
                let response = await axios.post("/users/logout");
                return response;
            }
        },
        async retrieveToken(context, credentials) {
            let response = await axios.post("/users/login", {
                password: credentials.password,
                email: credentials.email
            });

            context.commit("retrieveToken", response.data.token);
            return response;
        }
    },
    modules: { }
});