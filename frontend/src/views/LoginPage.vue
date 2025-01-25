<template>
    <div>
        <h1>Login </h1>
        <input v-model="email" type="email" placeholder="Email" />
        <input v-model="password" type="password" placeholder="Password" />
        <p v-if="errorMessage">{{ errorMessage }}</p>
        <button @click="loginUser">Login</button>
        <button @click="loginWithGoogle"> Login with Google</button>
        <!-- <button @click="loginWithFacebook">Login with Facebook</button> -->

    </div>
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