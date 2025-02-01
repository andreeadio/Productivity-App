<template>
  <v-container>
    <h2>Task Board</h2>
    <v-row>
      <v-col v-for="status in statuses" :key="status" cols="12" md="3">
        <v-card class="kanban-column">
          <v-card-title>{{ status }}</v-card-title>
          <v-divider></v-divider>
          <v-list ref="taskContainer" @scroll="handleScroll(status)">
            <v-list-item v-for="task in displayedTasks[status]" :key="task.id" class="task-card">
              <v-card class="pa-3 mb-3">
                <v-card-title>{{ task.title }}</v-card-title>
                <v-card-subtitle>{{ task.priority }} Priority</v-card-subtitle>
                <v-card-text>
                  <p>{{ task.description }}</p>
                  <p>Due: {{ task.dueDate }}</p>
                </v-card-text>
              </v-card>
            </v-list-item>
          </v-list>
          <v-progress-circular v-if="loading[status]" indeterminate color="primary" class="mt-4"></v-progress-circular>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>


<script>
import { reactive, onMounted } from "vue";

import axios from "axios";
import { getAuth } from "firebase/auth";

export default{
    setup(){
        const statuses = ['To Do', 'In Progress', 'Done','Aborted']
        const displayedTasks = reactive({
            'To Do': [],
            'In Progress': [],
            'Done': [],
            'Aborted': []
        });

        const loading = reactive({
            'To Do': false,
            'In Progress': false,
            'Done': false,
            'Aborted': false
        });

        const itemsPerPage = 5;

        const currentPage = reactive({
            'To Do': 0,
            'In Progress': 0,
            'Done': 0,
            'Aborted': 0
        });
        
        const loadTasks = async (status) => {

            if (loading[status]) 
                return;
            loading[status] = true;


            try{           
                const auth = getAuth();
                const user = await auth.currentUser //.getIdToken();
                const token = await user.getIdToken();
                
                if (!user) {
                    console.error("User not authenticated.");
                    return;
                }

                const response = await axios.get(`http://localhost:8080/api/tasks/${status}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                const tasks = response.data
                displayedTasks[status].push(...tasks.slice(0,itemsPerPage))
                currentPage[status]++
            }catch(error){
                console.error("Error fetching tasks:", error)
            }finally {
                loading[status] = false;
            }
        }

        const handleScroll = (status) => {
        const container = document.querySelector(`.kanban-column-${status.replace(/\s+/g, '-')}`);
        if (!container) return;
        const { scrollTop, scrollHeight, clientHeight } = container;
        if (scrollTop + clientHeight >= scrollHeight - 50 && !loading[status]) {
            loadTasks(status);
        }
        }
        
        onMounted(() => {
            statuses.forEach(status => loadTasks(status));
        });

        return { displayedTasks, loading, statuses, handleScroll };
    }
        
}
</script>

<style>
.kanban-column {
  padding: 10px;
  max-height: 500px;
  overflow-y: auto;
  background: #f5f5f5;
  border-radius: 10px;
}
.task-card {
  border: 1px solid #ccc;
  border-radius: 5px;
  margin-bottom: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
</style>
