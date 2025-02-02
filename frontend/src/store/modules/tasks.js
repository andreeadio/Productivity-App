import axios from 'axios';
import { getAuth } from "firebase/auth";

const state = {
    tasks: [],
    loading: false
};

const mutations = {
    SET_TASKS(state, { status, tasks }) {
        console.log(`Mutating state with tasks for ${status}:`, tasks);

        if (!Array.isArray(state.tasks)) {
            state.tasks = [];
        }

        state.tasks = state.tasks.filter(task => task.status !== status);
        state.tasks = [...state.tasks, ...tasks];
    },
    ADD_TASK(state, task) {
        state.tasks.push(task);
    },
    UPDATE_TASK(state, updatedTask) {
        const index = state.tasks.findIndex(t => t.id === updatedTask.id);
        if (index !== -1) {
            state.tasks.splice(index, 1, updatedTask);
        }
    },
    DELETE_TASK(state, taskId) {
        state.tasks = state.tasks.filter(t => t.id !== taskId);
    },
    SET_LOADING(state, status) {
        state.loading = status;
    }
};

const actions = {
    async fetchTasks({ commit }, status) {
        try {
            const auth = getAuth();
            const user = auth.currentUser;
            if (!user) throw new Error("User not authenticated.");

            const token = await user.getIdToken();
            console.log(`Fetching tasks for status: ${status}`);

            const response = await axios.get(`http://localhost:8080/api/tasks/${status}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            console.log(`Tasks found for status ${status}:`, response.data);
            commit("SET_TASKS", { status, tasks: response.data });

        } catch (error) {
            console.error(`Error fetching tasks for ${status}:`, error);
        }
    },
    async addTask({ commit }, task) {
        try {
            const auth = getAuth();
            const user = auth.currentUser;
            if (!user) throw new Error("User not authenticated.");

            const token = await user.getIdToken();
            const response = await axios.post("http://localhost:8080/api/tasks", task, {
                headers: { Authorization: `Bearer ${token}` }
            });

            commit('ADD_TASK', { ...task, id: response.data.id });
        } catch (error) {
            console.error("Error adding task:", error);
        }
    },
    async editTask({ commit }, task) {
        try {
            const auth = getAuth();
            const user = auth.currentUser;
            if (!user) throw new Error("User not authenticated.");

            const token = await user.getIdToken();
            await axios.put(`http://localhost:8080/api/tasks/${task.id}`, task, {
                headers: { Authorization: `Bearer ${token}` }
            });

            commit('UPDATE_TASK', task);
        } catch (error) {
            console.error("Error updating task:", error);
        }
    },
    async deleteTask({ commit }, taskId) {
        try {
            const auth = getAuth();
            const user = auth.currentUser;
            if (!user) throw new Error("User not authenticated.");

            const token = await user.getIdToken();
            await axios.delete(`http://localhost:8080/api/tasks/${taskId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            commit('DELETE_TASK', taskId);
        } catch (error) {
            console.error("Error deleting task:", error);
        }
    }
};

const getters = {
    tasksByStatus: (state) => (status) => {
        console.log(`Checking tasks for status: ${status}`, state.tasks);

        if (!Array.isArray(state.tasks)) {
            console.error(" Error: state.tasks is not an array!", state.tasks);
            return [];
        }

        const filteredTasks = state.tasks.filter(task => task.status === status);
        console.log(`Filtered tasks for ${status}:`, filteredTasks);

        return filteredTasks;
    },
    isLoading: (state) => state.loading,
};

export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters
};
