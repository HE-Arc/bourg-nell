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

router.beforeEach(async (to, from, next) => {

    // Check token and load auth user
    if(store.getters.loggedIn)
    {
        try
        {
            await store.dispatch("fetchAuthUser");
        }
        catch
        {
            // Token expired 
            store.commit("destroyToken");
            next({name: "login"});
        }
    }

    if (to.matched.some(record => record.meta.requiresAuth)) {
        // this route requires auth, check if logged in
        // if not, redirect to login page.
        if (!store.getters.loggedIn) {
            next({ name: 'login' })
        }
        else
        {
            next();
        }
    } else if (to.matched.some(record => record.meta.requiresVisitor)) {
        // this route requires visitor (not auth), check if NOT logged in
        // if logged in, redirect to account page.
        if (store.getters.loggedIn) {
            next({ name: 'account' })
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
