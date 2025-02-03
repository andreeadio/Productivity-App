<template>
  <v-container class="d-flex justify-center align-center" style="height: 100vh;">
    <v-card class="pa-6" max-width="400">
      <v-card-title class="text-h5 text-center">Login</v-card-title>
      <v-card-text>
        <v-form ref="loginForm">
          <v-text-field v-model="email" label="Email" type="email" placeholder="Enter your email" variant="outlined"
            prepend-inner-icon="mdi-email" :rules="[rules.required, rules.validEmail]"
           ></v-text-field>

          <v-text-field v-model="password" label="Password" type="password" placeholder="Enter your password"
            variant="outlined" prepend-inner-icon="mdi-lock"  :rules="[rules.required, rules.minLength]"
            ></v-text-field>

          <v-alert v-if="errorMessage" type="error" dense>{{ errorMessage }}</v-alert>

          <v-btn color="primary" block class="mt-4" @click="loginUser">Login</v-btn>

          
          <v-divider class="my-4"></v-divider>

          <v-btn color="red darken-1" block @click="loginWithGoogle">
            <v-icon left>mdi-google</v-icon>
            Login with Google
          </v-btn>
          <v-divider class="my-4"></v-divider>

          <v-btn text to="/register" block class="mt-2">Don't have an account? Register</v-btn>

        </v-form>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>

//imports here
import { ref } from "vue"
import { useRouter } from "vue-router"
import { useStore } from "vuex"

export default {
  name: "LoginPage",

  setup() {
    const email = ref("")
    const password = ref("")
    const errorMessage = ref()
    const router = useRouter()
    const store = useStore()

    const loginForm = ref(null);

    //rules for form validation
    const rules = {
      required: (value) => !!value || "This field is required",
      validEmail: (value) => /.+@.+\..+/.test(value) || "Invalid email format"
    };

    const loginUser = async () => {
      const isValid = await loginForm.value.validate()

      if (!isValid) {
        return
      }

      try {
        await store.dispatch("auth/login", { email: email.value, password: password.value })
        router.push('/taskboard')

      }
      catch (error) {
        errorMessage.value = "Invalid credentials. Please try again."
      }
    };

    const loginWithGoogle = async () => {
      try {
        await store.dispatch("auth/loginWithGoogle")
        console.log("Login with google")

        router.push('/taskboard')

      } catch (error) {
        console.error("Google sign-in error:", error)
      }
    }


    return { email, password, loginUser, loginWithGoogle, errorMessage, rules, loginForm }

  }

};
</script>

<style scoped>
.v-card {
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
}
</style>