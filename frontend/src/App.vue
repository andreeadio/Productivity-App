<template>
  <v-app>
    <v-app-bar app color="primary" dark>
      <v-toolbar-title>Productivity App</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn text to="/login" v-if="!isAuthenticated">Login</v-btn>
      <v-btn text to="/taskboard" v-if="isAuthenticated">Task Board</v-btn>
      <v-btn text to="/focusSession" v-if="isAuthenticated">Focus Session</v-btn>
      <v-btn v-if="isAuthenticated" color="secondary" class="rounded-lg px-4" @click="handleSignOut">Sign out</v-btn>
    </v-app-bar>

    <v-main>
      <v-container>
        <router-view></router-view>
      </v-container>
    </v-main>

  </v-app>
</template>

<script>
import { computed } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";

export default {
  setup() {
    const store = useStore();
    const router = useRouter();

    const isAuthenticated = computed(() => store.getters["auth/isAuthenticated"]);

    const handleSignOut = async () => {
      await store.dispatch("auth/logout");
      router.push("/login");
    };

    return { isAuthenticated, handleSignOut };
  }
};
</script>

<style scoped>
.v-btn {
  font-weight: bold;
  letter-spacing: 0.5px;
}
</style>
