import Login from './views/Login.vue';
import Account from './views/Account.vue';
import AccountCreation from './views/AccountCreation.vue';
import Game from './views/Game.vue';

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
        path: '/register',
        name: 'register',
        component: AccountCreation,
        meta: {
            requiresVisitor: true, // Only accessible by unlogged users
        }
    },
    {
        
        path: '/play',
        name: 'game',
        component: Game,
        meta: {
            requiresAuth: true, // Only accessible by logged users
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