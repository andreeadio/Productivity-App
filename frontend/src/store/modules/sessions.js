import axios from "axios";
import { getAuth } from "firebase/auth";

const state = {
    sessions: [],
};

const mutations = {
    ADD_SESSION(state, session) {
        state.sessions.push(session);
    },
    SET_SESSIONS(state, sessions) {
        state.sessions = sessions;
    }
};

const actions = {
    async saveSession({ commit }, session) {
        try {
            const auth = getAuth();
            const user = auth.currentUser;
            if (!user) {
                throw new Error("User not authenticated");
            }

            const token = await user.getIdToken();

            const response = await axios.post(`http://localhost:8080/api/sessions`, session, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            commit("ADD_SESSION", response.data);
            console.log("Vuex: Session saved successfully:", response.data);
        } catch (error) {
            console.error("Vuex: Error saving session:", error);
        }
    },

    async getSessions({ commit }) {
        try {
            const auth = getAuth();
            const user = auth.currentUser;
            if (!user) {
                throw new Error("User not authenticated");
            }

            const token = await user.getIdToken();

            const response = await axios.get(`http://localhost:8080/api/sessions`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            commit("SET_SESSIONS", response.data);
        } catch (error) {
            console.error("Vuex: Error fetching sessions:", error);
        }
    }
};

export default {
    namespaced: true,
    state,
    mutations,
    actions
};
