import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

Vue.use(Vuex)
axios.defaults.baseURL = "https://bourgnell.srvz-webapp.he-arc.ch"

export default new Vuex.Store({
    state: {
        token: localStorage.getItem('access_token') || null,
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
        },
        destroyToken(state) {
            state.token = null
        },
        updateUser(state, user) {
            state.currentShownUser = user;
        },
        updateGames(state, games) {
            state.currentShownUserGames = games;
        }
    },
    actions: {
        fetchAuthUser(context) {
            axios.defaults.headers.common["Authorization"] = "Bearer " + context.state.token
            return new Promise((resolve, reject) => {
                axios.get("/users/me")
                    .then(response => {
                        context.commit("updateUser", response.data);
                        resolve(response);
                    })
                    .catch(error => {
                        reject(error);
                    });
            })
        },
        fetchAuthUserGames(context) {
            axios.defaults.headers.common["Authorization"] = "Bearer " + context.state.token
            return new Promise((resolve, reject) => {
                axios.get(`/games/by-user/${context.state.currentShownUser.id}`)
                    .then(response => {
                        context.commit("updateGames", response.data.games);
                        resolve(response);
                    })
                    .catch(error => {
                        reject(error);
                    });
            })
        },
        fetchUser(context, userId) {
            axios.defaults.headers.common["Authorization"] = "Bearer " + context.state.token
            return new Promise((resolve, reject) => {
                axios.get(`/users-admin/${userId}`)
                    .then(response => {
                        context.commit("updateUser", response.data.user)
                        resolve(response)
                    })
                    .catch(error => {
                        reject(error)
                    })
            })
        },
        fetchGames(context, userId) {
            axios.defaults.headers.common["Authorization"] = "Bearer " + context.state.token
            return new Promise((resolve, reject) => {
                axios.get(`/games/by-user/${userId}`)
                    .then(response => {
                        context.commit("updateGames", response.data.games)
                        resolve(response)
                    })
                    .catch(error => {
                        reject(error)
                    })
            })
        },
        destroyToken(context) {
            axios.defaults.headers.common["Authorization"] = "Bearer " + context.state.token

            if (context.getters.loggedIn) {
                return new Promise((resolve, reject) => {
                    axios.post("/users/logout")
                        .then(response => {
                            localStorage.removeItem("access_token")
                            context.commit("destroyToken")
                            resolve(response)
                        })
                        .catch(error => {
                            localStorage.removeItem("access_token")
                            context.commit("destroyToken")
                            reject(error)
                        })
                })
            }
        },
        retrieveToken(context, credentials) {
            return new Promise((resolve, reject) => {
                axios.post("/users/login", {
                    password: credentials.password,
                    email: credentials.email
                })
                    .then(response => {
                        console.log(response);
                        context.commit("retrieveToken", response.data.token)
                        localStorage.setItem("access_token", response.data.token);
                        resolve(response)
                    })
                    .catch(error => {
                        reject(error)
                    })
            });
        }
    },
    modules: { }
});