<template>
    <div>
        <h1>Register </h1>
        <input v-model="email" type="email" placeholder="Email" />
        <input v-model="password" type="password" placeholder="Password" />
        <button @click="registerUser">Create account</button>
        <button @click="signinWithGoogle"> Login with Google</button>

    </div>
</template>

<script>
import {ref} from "vue"
import {auth, googleProvider} from '../config/firebase-config'
import { createUserWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { useRouter } from "vue-router";

    export default{
        setup(){
            const router = useRouter()
            const email = ref("")
            const password = ref("")

            const registerUser = async() => {
                try{
                    const userCredential = await createUserWithEmailAndPassword(auth, email.value, password.value)
                    const idToken = await userCredential.user.getIdToken()
                    localStorage.setItem("token", idToken)
                    alert("Register successsful")
                    console.log( auth.currentUser)
                    router.push('/dashboard')
                } 
                catch (error) {
                    console.error("Login error:", error);
                }
            };

            const signinWithGoogle = async() =>{
                try{
                    const result = await signInWithPopup(auth, googleProvider)
                    const token = await result.user.getIdToken()
                    localStorage.setItem("token", token)
                    console.log("Login with google")
                    router.push("/dashboard")
                } catch(error){
                    console.error("Google sign-in error:", error);
                }
            }

            return{email, password,registerUser, signinWithGoogle}
        }
    }
    
</script>