
<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <h1 class="text-center">Focus Session</h1>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" md="6" offset-md="3">
        <PomodoroTimer />
      </v-col>
    </v-row>
  </v-container>
</template>
  
<script>
  import PomodoroTimer from "@/components/PomodoroTimer.vue";

  export default {
    components: {
      PomodoroTimer,
    },
    setup() {
    
  },
  };
  </script>
  
  <style scoped>
  .dashboard {
    text-align: center;
    padding: 20px;
  }
  </style>
  