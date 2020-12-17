import Vue from 'vue'
import VueRouter from 'vue-router'
import App from './App.vue'
import store from './store/store'
import routes from './routes'

Vue.config.productionTip = false
Vue.use(VueRouter);

const router = new VueRouter({
    mode: "history",
    base: "/",
    routes
});

router.beforeEach((to, from, next) => {
    if (to.matched.some(record => record.meta.requiresAuth)) {
        // this route requires auth, check if logged in
        // if not, redirect to login page.
        if (!store.getters.loggedIn) {
            next({
                name: 'login',
            })
        } else {
            next()
        }
    } else if (to.matched.some(record => record.meta.requiresVisitor)) {
        // this route requires visitor (not auth), check if NOT logged in
        // if logged in, redirect to account page.
        if (store.getters.loggedIn) {
            next({
                name: 'account',
            })
        } else {
            next()
        }
    } else {
        next() // make sure to always call next()!
    }
})

new Vue({
    render: h => h(App),
    store,
    router
}).$mount('#root')
