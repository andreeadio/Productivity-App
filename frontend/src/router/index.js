import { createRouter, createWebHistory } from 'vue-router'
import { auth } from '../config/firebase-config'
import { onAuthStateChanged } from 'firebase/auth'

//components here
import Home from '../views/HomePage.vue'
import LoginPage from '../views/LoginPage.vue'
import MainPage from '../views/MainPage.vue'
import RegisterPage from '@/views/RegisterPage.vue'
import { meta } from '@babel/eslint-parser'


const routes = [
    { path: '/', name: 'Home', component: Home },
    { path: '/login', name: 'Login', component: LoginPage, meta: { requiresGuest: true } },
    { path: '/register', name: 'RegisterPage', component: RegisterPage, meta: { requiresGuest: true } },
    {
        path: '/dashboard',
        name: 'Dashboard', component: MainPage,
        meta: {
            requiresAuth: true
        },
    },

]


const router = createRouter({
    history: createWebHistory(),
    routes,
})

const getCurrentUser = () => {
    return new Promise((resolve, reject) => {
        const removeListener = onAuthStateChanged(auth,
            (user) => {
                removeListener(),
                    resolve(user)
            },
            reject
        )
    })
}

router.beforeEach(async (to, from, next) => {

    if (to.matched.some((record) => record.meta.requiresAuth)) {
        next()
        if (await getCurrentUser) {
            next()
        }
        else {
            alert("You don't have permission!")
            next("/")
        }
    }
    else {
        next()
    }
})
export default router