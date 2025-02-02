<template>
  <v-app>
    <v-app-bar app color="primary" dark>
      <v-toolbar-title>Productivity App</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn text to="/">Home</v-btn>
      <v-btn text to="/login" v-if="!isAuthenticated">Login</v-btn>
      <v-btn text to="/register" v-if="!isAuthenticated">Register</v-btn>
      <v-btn text to="/dashboard" v-if="isAuthenticated">Dashboard</v-btn>
      <v-btn text to="/planner" v-if="isAuthenticated">Planner</v-btn>
      <v-btn text to="/taskboard" v-if="isAuthenticated">Task Board</v-btn>

      <v-btn v-if="isAuthenticated" color="secondary" @click="handleSignOut">Sign out</v-btn>
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
import { computed } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";

export default {
  setup(){

    const store = useStore()
    const router = useRouter()

    const isAuthenticated = computed(() => store.getters["auth/isAuthenticated"])

    const handleSignOut = async () => {
      await store.dispatch("auth/logout")
      router.push("/")
    };

    return { isAuthenticated, handleSignOut };
  }
}
</script>




