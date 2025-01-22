import { createRouter, createWebHistory } from 'vue-router'

//components here
import Home from '../views/HomePage.vue'
import Login from '../views/LoginPage.vue'

const routes = [
    { path: '/', name: 'Home', component: Home },
    { path: '/login', name: 'Login', component: Login }
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

export default router