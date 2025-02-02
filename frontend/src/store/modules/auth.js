import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup, signOut } from "firebase/auth";
import { auth, googleProvider } from '../../config/firebase-config';

const state = {
    user: null
};

const mutations = {
    SET_USER(state, user) {
        state.user = user;
    },
    CLEAR_USER(state) {
        state.user = null;
    }
};

const actions = {
    async login({ commit }, { email, password }) {
        try {
            const { user } = await signInWithEmailAndPassword(auth, email, password);
            commit('SET_USER', user);
        } catch (error) {
            console.error("Login failed:", error);
        }
    },
    async loginWithGoogle({ commit }) {
        try {
            const { user } = await signInWithPopup(auth, googleProvider)
            commit('SET_USER', user);

        } catch (error) {
            console.error("Google sign-in error:", error);
        }
    },
    async register({ commit }, { email, password }) {
        try {
            const { user } = await createUserWithEmailAndPassword(auth, email, password);
            commit('SET_USER', user);
        } catch (error) {
            console.error("Registration failed:", error);
            throw error;
        }
    },
    async registerWithGoogle({ commit }) {
        try {
            const { user } = await signInWithPopup(auth, googleProvider)
            commit('SET_USER', user);
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
