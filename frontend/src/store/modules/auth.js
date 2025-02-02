import {
    signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup, signOut, onAuthStateChanged
} from "firebase/auth";
import { auth, googleProvider } from '../../config/firebase-config';

const state = {
    user: JSON.parse(localStorage.getItem("user")) || null,
    token: localStorage.getItem("token") || null

};

const mutations = {
    SET_USER(state, user) {
        state.user = user
        localStorage.setItem("user", JSON.stringify(user));
    },
    SET_TOKEN(state, token) {
        state.token = token
        localStorage.setItem("token", token)
    },
    CLEAR_USER(state) {
        state.user = null
        state.token = null
        localStorage.removeItem("user")
        localStorage.removeItem("token")
    }
};

const actions = {
    async login({ commit }, { email, password }) {
        try {
            const { user } = await signInWithEmailAndPassword(auth, email, password)
            const idToken = await user.getIdToken();
            commit('SET_USER', user);
            commit('SET_TOKEN', idToken);
        } catch (error) {
            console.error("Login failed:", error);
        }
    },
    async loginWithGoogle({ commit }) {
        try {
            const { user } = await signInWithPopup(auth, googleProvider)
            const idToken = await user.getIdToken();
            commit('SET_USER', user);
            commit('SET_TOKEN', idToken);

        } catch (error) {
            console.error("Google sign-in error:", error);
        }
    },
    async register({ commit }, { email, password }) {
        try {
            const { user } = await createUserWithEmailAndPassword(auth, email, password);
            const idToken = await user.getIdToken();
            commit('SET_USER', user);
            commit('SET_TOKEN', idToken);

        } catch (error) {
            console.error("Registration failed:", error);
            throw error;
        }
    },
    async registerWithGoogle({ commit }) {
        try {
            const { user } = await signInWithPopup(auth, googleProvider)
            const idToken = await user.getIdToken();
            commit('SET_USER', user);
            commit('SET_TOKEN', idToken);

        } catch (error) {
            console.error("Google Registration failed:", error);
            throw error;
        }
    },

    async logout({ commit }) {
        try {
            await signOut(auth);
            commit('CLEAR_USER');
        } catch (error) {
            console.error("Logout failed:", error);
        }
    },

    autoLogin({ commit }) {
        onAuthStateChanged(auth, async (user) => {
            if (user) {
                const idToken = await user.getIdToken();
                commit("SET_USER", user);
                commit("SET_TOKEN", idToken);
            } else {
                commit("CLEAR_USER");
            }
        });
    }
};

const getters = {
    isAuthenticated: (state) => !!state.user,
    currentUser: (state) => state.user

};

export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters
};
