<template>
  <v-card class="mt-8">
    <v-tabs @change="changeCurrentTimer" v-model="currentTimer" grow>
      <v-tab v-for="timer in timers" :key="timer.name">
        {{ timer.name }}
      </v-tab>
    </v-tabs>

    <v-card class="pa-5 d-flex flex-column justify-center align-center" flat>
      <h1 class="time">{{ displayMinutes }}:{{ displaySeconds }}</h1>

      <div class="button-group">
        <v-btn @click="start" color="primary" :disabled="isRunning">
          <v-icon left small>mdi-play-circle-outline</v-icon>
        </v-btn>
        <v-btn @click="stop" color="error">
          <v-icon left small>mdi-stop-circle-outline</v-icon>
        </v-btn>
        <v-btn @click="reset(timers[currentTimer].minutes)" :disabled="isRunning">
          <v-icon left small>mdi-restart</v-icon>
        </v-btn>
      </div>
    </v-card>
  </v-card>
</template>

<script>
import { ref, computed, watch } from "vue";
import { useStore } from "vuex";
import { getAuth } from "firebase/auth";
import alarmSound from "@/assets/alarm.mp3";

export default {
  setup() {
    const store = useStore();
    const auth = getAuth();
    const isRunning = ref(false);
    const timerInstance = ref(null);
    const totalSeconds = ref(25 * 60);
    const currentTimer = ref(0);
    const timers = ref([
      { name: "Pomodoro", minutes: 25, type: "focus" },
      { name: "Short Break", minutes: 5, type: "break" },
      { name: "Long Break", minutes: 10, type: "break" },
    ]);

    const displayMinutes = computed(() => {
      return formatTime(Math.floor(totalSeconds.value / 60));
    });

    const displaySeconds = computed(() => {
      return formatTime(totalSeconds.value % 60);
    });

    const formatTime = (time) => {
      return time < 10 ? "0" + time : time.toString();
    };

    const start = () => {
      stop();
      isRunning.value = true;
      timerInstance.value = setInterval(() => {
        if (totalSeconds.value <= 0) {
          stop();
          playAlarm();
          saveSession();
          return;
        }
        totalSeconds.value -= 1;
      }, 1000);
    };

    const stop = () => {
      isRunning.value = false;
      clearInterval(timerInstance.value);
    };

    const reset = (minutes) => {
      saveSession();
      stop();
      totalSeconds.value = minutes * 60;
    };

    const changeCurrentTimer = (index) => {
  console.log("changeCurrentTimer() called. Index:", index);

  if (isRunning.value && totalSeconds.value < timers.value[currentTimer.value].minutes * 60) {
    console.log("Calling saveSession() before switching timer...");
    saveSession();
  }

  currentTimer.value = index;
  reset(timers.value[index].minutes);
};

    
    

    const saveSession = async () => {
  console.log("saveSession() called");
  const user = auth.currentUser;

  if (!user) {
    console.error("No authenticated user found.");
    return;
  }

  if (totalSeconds.value < timers.value[currentTimer.value].minutes * 60) {
    try {
      console.log("Sending request to save session...");
      await store.dispatch("sessions/saveSession", {
        userId: user.userId,
        type: timers.value[currentTimer.value].type,
        duration: (timers.value[currentTimer.value].minutes * 60 - totalSeconds.value) / 60,
        timestamp: new Date().toISOString(),
      });
      console.log("Session saved successfully");
    } catch (error) {
      console.error("Error saving session:", error);
    }
  }
};

    const playAlarm = () => {
      new Audio(alarmSound).play();
    };

    watch(currentTimer, (newVal) => {
      totalSeconds.value = timers.value[newVal].minutes * 60;
    });

    return {
      isRunning,
      totalSeconds,
      currentTimer,
      timers,
      displayMinutes,
      displaySeconds,
      start,
      stop,
      reset,
      changeCurrentTimer,
      playAlarm,
    };
  },
};
</script>

<style scoped>
.time {
  font-size: 3rem;
  font-weight: bold;
}
.button-group {
  display: flex;
  gap: 10px;
}
</style>
