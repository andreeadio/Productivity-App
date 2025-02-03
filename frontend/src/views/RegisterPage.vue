<template>
    <v-container class="d-flex justify-center align-center" style="height: 100vh;">
        <v-card class="pa-6" max-width="400">
            <v-card-title class="text-h5 text-center">Register</v-card-title>
            <v-card-text>
                <v-form ref="registerForm">
                    <v-text-field v-model="email" label="Email" type="email" placeholder="Enter your email"
                        variant="outlined" prepend-inner-icon="mdi-email"
                        :rules="[rules.required, rules.validEmail]"></v-text-field>

                    <v-text-field v-model="password" label="Password" type="password" placeholder="Enter your password"
                        variant="outlined" prepend-inner-icon="mdi-lock" :rules="[rules.required, rules.minLength]"
                        ></v-text-field>

                    <v-alert v-if="errorMessage" type="error" dense>{{ errorMessage }}</v-alert>

                    <v-btn color="primary" block class="mt-4" @click="registerUser">Register</v-btn>

                    <v-divider class="my-4"></v-divider>

                    <v-btn color="red darken-1" block @click="registerWithGoogle">
                        <v-icon left>mdi-google</v-icon>
                        Register with Google
                    </v-btn>
                </v-form>
            </v-card-text>
        </v-card>
    </v-container>
</template>


<script>
import { ref } from "vue"
import { useRouter } from "vue-router";
import { useStore } from "vuex";

export default {
    setup() {
        const router = useRouter()
        const email = ref("")
        const password = ref("")
        const errorMessage = ref("")
        const store = useStore()
        const registerForm = ref(null)

        const rules = {
            required: (value) => !!value || "This field is required",
            validEmail: (value) => /.+@.+\..+/.test(value) || "Invalid email format",
            minLength: (value) => value.length >= 6 || "Password must be at least 6 characters"
        };

        const registerUser = async () => {
            const isValid = await registerForm.value.validate()
            if (!isValid)
                return

            try {
                await store.dispatch("auth/register", { email: email.value, password: password.value })
                router.push('/taskboard')
            }
            catch (error) {
                errorMessage.value = "Registration failed. Please try again."

                console.error("Register error:", error)
            }
        };

        const registerWithGoogle = async () => {
            try {
                await store.dispatch("auth/registerWithGoogle")
                router.push("/taskboard")
            } catch (error) {
                errorMessage.value = "Google registration failed.";
                console.error("Google sign-in error:", error)
            }
        }

        return { email, password, registerUser, registerWithGoogle, errorMessage, rules, registerForm }
    }
}

</script>

<style scoped>
.v-card {
  box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.15);
  border-radius: 12px;
}

.v-btn {
  font-weight: bold;
  text-transform: uppercase;
}

.v-text-field {
  border-radius: 10px;
}
</style>