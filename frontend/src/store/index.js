import { createStore } from 'vuex';
import auth from './modules/auth';
import tasks from './modules/tasks';
import sessions from './modules/sessions';

export default createStore({
    modules: {
        auth,
        tasks,
        sessions
    }
});
