import Login from './views/Login.vue'
import Account from './views/Account.vue'

const routes = [
    {
        path: '/login',
        name: 'login',
        component: Login,
        meta: {
            requiresVisitor: true, // Only accessible by unlogged users
        }
    },
    {
        path: '/',
        name: 'account',
        component: Account,
        meta: {
            requiresAuth: true, // Only accessible by logged users
        }
    },
    {
        path: "/user/:id",
        name: 'user-account',
        component: Account,
        meta: {
            requiresAuth: true
        }
    }
];

export default routes;