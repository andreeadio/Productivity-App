<template>
  <div id="app">
    <nav>
      <ul>
        <li><router-link to="/">Home</router-link></li>
        <li><router-link to="/login">Login</router-link></li>
        <li><router-link to="/register">Register</router-link></li>
        <li><router-link to="/dashboard">Dashboard</router-link></li>
        <button @click="handleSignOut" v-if="isLoggedIn" > Sign out</button>
      </ul>
    </nav>
    <router-view></router-view>
  </div>
</template>

<script>
import { onMounted,ref } from 'vue';
import {auth} from './config/firebase-config'
import { onAuthStateChanged, signOut } from 'firebase/auth';
import router from './router';

export default {
  setup(){

    const isLoggedIn = ref(false)

    onMounted(() => {
      onAuthStateChanged(auth, (user) =>{
        if(user) {
          isLoggedIn.value=true
        }
        else{
          isLoggedIn.value=false
        }
      })
    })
    const handleSignOut= ()=>{
      signOut(auth).then(()=>{router.push('/')})
      
    }

    return{isLoggedIn, handleSignOut}
  }

}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

nav ul {
  list-style-type: none;
  display: flex;
  justify-content: center;
  gap: 1rem;
  padding: 0;
}

nav ul li {
  margin: 0;
}

a {
  text-decoration: none;
  color: #42b983;
}

a:hover {
  color: #2c3e50;
}
</style>
