
<template>
    <v-container class="d-flex justify-center align-center" style="height: 100vh;">
      <v-card class="pa-6" max-width="400">
        <v-card-title class="text-h5 text-center">Login</v-card-title>
        <v-card-text>
          <v-text-field
            v-model="email"
            label="Email"
            type="email"
            placeholder="Enter your email"
            variant="outlined"
            prepend-inner-icon="mdi-email"
          ></v-text-field>
  
          <v-text-field
            v-model="password"
            label="Password"
            type="password"
            placeholder="Enter your password"
            variant="outlined"
            prepend-inner-icon="mdi-lock"
          ></v-text-field>
  
          <v-alert v-if="errorMessage" type="error" dense>{{ errorMessage }}</v-alert>
  
          <v-btn color="primary" block class="mt-4" @click="loginUser">Login</v-btn>
  
          <v-divider class="my-4"></v-divider>
  
          <v-btn color="red darken-1" block @click="loginWithGoogle">
            <v-icon left>mdi-google</v-icon>
            Login with Google
          </v-btn>
        </v-card-text>
      </v-card>
    </v-container>
</template>
  
<script>

//imports here
import {ref} from "vue"
import {auth, googleProvider} from '../config/firebase-config'
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { useRouter } from "vue-router";

export default {
    name: "LoginPage", // Schimbare la un nume multi-word

    setup(){
        const email = ref("")
        const password = ref("")
        const errorMessage =ref()
        const router = useRouter()

        const loginUser = async() => {
            try{
                const userCredential = await signInWithEmailAndPassword(auth, email.value, password.value)
                const idToken = await userCredential.user.getIdToken()
                localStorage.setItem("token", idToken)
                alert("Login successsful")
                console.log(auth.currentUser)
                router.push('/dashboard')

            } 
            catch(error){
                console.log(error.code)
                switch(error.code){
                    case "auth/invalid-email":
                        errorMessage.value="Invalid email"
                        break
                    case "auth/user-not-found":
                        errorMessage.value ="No account with this email was found"
                        break
                    case "auth/wrong-password":
                        errorMessage.value="Incorrect password"
                        break
                }
            } 
        };

        const loginWithGoogle = async() =>{
            try{
                const result = await signInWithPopup(auth, googleProvider)
                const token = await result.user.getIdToken()
                localStorage.setItem("token", token)

                alert("Login with google ")
                console.log("Login with google")

                router.push('/dashboard')

            } catch(error){
                console.error("Google sign-in error:", error);
            }
        }

        // const loginWithFacebook = async() =>{
        //     try{
        //         const result = await signInWithPopup(auth, facebookProvider)
        //         const token = await result.user.getIdToken()
        //         localStorage.setItem("token", token)

        //         alert("Login with google ")
        //         console.log("Login with facebook")
        //     } catch(error){
        //         console.error("Facebook sign-in error:", error);
        //     }
        // }

        return{email, password,loginUser, loginWithGoogle, errorMessage}
        
    }

};
</script>

<style scoped>
.v-card {
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
}
</style>