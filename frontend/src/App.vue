<template>
  <v-app>
    <v-app-bar app color="primary" dark>
      <v-toolbar-title>Productivity App</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn text to="/">Home</v-btn>
      <v-btn text to="/login">Login</v-btn>
      <v-btn text to="/register">Register</v-btn>
      <v-btn text to="/dashboard">Dashboard</v-btn>
      <v-btn v-if="isLoggedIn" color="secondary" @click="handleSignOut">Sign out</v-btn>
    </v-app-bar>

    <v-main>
      <v-container>
        <router-view></router-view>
      </v-container>
    </v-main>

    <v-footer app color="grey darken-4" class="white--text text-center">
    </v-footer>
  </v-app>
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




