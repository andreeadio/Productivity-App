<template>
  <v-container>
    <h2>Task Board</h2>
    <v-row>
      <v-col v-for="status in statuses" :key="status" cols="12" md="3">
        <v-card class="kanban-column">
          <v-card-title>{{ status }}
            <v-btn v-if="status === 'To Do'" class="ml-3" color="primary" @click="openDialog(null)">
              New Task
            </v-btn>
          </v-card-title>
          <v-divider></v-divider>
          <v-infinite-scroll :height="500" :onLoad="load(status)"> 
            <v-list-item v-for="task in displayedTasks[status]" :key="task.id" class="task-card">
              <v-card class="pa-3 mb-3">
                <v-card-title>{{ task.title }}</v-card-title>
                <v-card-subtitle>{{ task.priority }} Priority</v-card-subtitle>
                <v-card-text>
                  <p>{{ task.description }}</p>
                  <p>Due: {{ task.dueDate }}</p>
                </v-card-text>
                <v-btn color="blue" icon="mdi-pencil" text @click="openDialog(task)"></v-btn>
                <v-btn color="red" icon="mdi-delete-outline" @click="confirmDelete(task)"></v-btn>
              </v-card>
            </v-list-item>
        </v-infinite-scroll>          
        <v-progress-circular v-if="loading[status]" indeterminate color="primary" class="mt-4"></v-progress-circular>
        </v-card>
      </v-col>
    </v-row>

    <v-dialog v-model="dialog" persistent max-width="500px">
      <v-card>
        <v-card-title>{{ editingTask ? "Edit Task" : "New Task" }} 
          <v-btn icon="mdi-close" variant="text" @click="dialog = false"></v-btn>
        </v-card-title>
        <v-card-text>
          <TaskForm :task="editingTask" :isEdit="!!editingTask" @submit="handleTaskSubmit" @cancel="dialog = false" />
        </v-card-text>
      </v-card>
    </v-dialog>

    <v-dialog v-model="deleteDialog" max-width="400px">
      <v-card>
        <v-card-title class="headline">Confirm Delete</v-card-title>
        <v-card-text>Are you sure you want to delete this task?</v-card-text>
        <v-card-actions>
          <v-btn color="red" text @click="deleteDialog = false">Cancel</v-btn>
          <v-btn color="green" text @click="deleteTask">Confirm</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

  </v-container>
</template>


<script>
import TaskForm from "./TaskForm.vue"; 
import { ref, reactive, onMounted } from "vue";

import axios from "axios";
import { getAuth } from "firebase/auth";

export default{
    components: { TaskForm },

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

        const itemsPerPage = 2;

        const currentPage = reactive({
            'To Do': 0,
            'In Progress': 0,
            'Done': 0,
            'Aborted': 0
        });
        
        const dialog = ref(false);
        const editingTask = ref(null);

        const deleteDialog = ref(false);
        const taskToDelete = ref(null);

        const confirmDelete = (task) => {
          taskToDelete.value = task;
          deleteDialog.value = true;
        };

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

                const newTasks = tasks.slice(currentPage[status] * itemsPerPage, (currentPage[status] + 1) * itemsPerPage);
                if (newTasks.length > 0) {
                    displayedTasks[status].push(...newTasks);
                    currentPage[status]++;}

                console.log("Tasks received:", tasks.length);

            }catch(error){
                console.error("Error fetching tasks:", error)
            }finally {
                loading[status] = false;
            }
        }
        const load = (status) => {
            return async () => {
                await loadTasks(status);    
            };
        };

        // Deschide dialogul pentru creare/editare
        const openDialog = (task) => {
          console.log("Dialog opened, task:", task);
          editingTask.value = task ? { ...task } : null;
          dialog.value = true;
        };

    //add or edit task
    const handleTaskSubmit = async (task) => {
      try {
        const auth = getAuth();
        const user = auth.currentUser;

        if (!user) {
          console.error("User not authenticated.");
          return;
        }

        const token = await user.getIdToken();

        if (task.id) {

          //edit task
          const response = await axios.put(`http://localhost:8080/api/tasks/${task.id}`, task, {
            headers: { Authorization: `Bearer ${token}` }
          });
          
          if (response.status === 200) {
            task.id = response.data.id;
        
            const column = Object.keys(displayedTasks).find(status =>
              displayedTasks[status].some(t => t.id === task.id)
            );

            if (column) {
              const index = displayedTasks[column].findIndex(t => t.id === task.id)
              if (index !== -1) {
                displayedTasks[column][index] = { ...task, id: response.data.id }
              }
            }
          }
        } else {
          //new task
          task.status = "To Do";
          const response = await axios.post("http://localhost:8080/api/tasks", task, {
            headers: { Authorization: `Bearer ${token}` }
          });

          if (response.status === 201) {
            task.id = response.data.id;
            displayedTasks["To Do"].unshift(task);
          }
        }

        dialog.value = false; //dialog close
      } catch (error) {
        console.error("Error saving task:", error);
      }
    };

    const deleteTask = async () => {
      if (!taskToDelete.value) return;

      try {
        const auth = getAuth();
        const user = auth.currentUser;

        if (!user) {
          console.error("User not authenticated.");
          return;
        }

        const token = await user.getIdToken();

        await axios.delete(`http://localhost:8080/api/tasks/${taskToDelete.value.id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

      
        const column = Object.keys(displayedTasks).find(status =>
          displayedTasks[status].some(t => t.id === taskToDelete.value.id)
        );

        if (column) {
          displayedTasks[column] = displayedTasks[column].filter(t => t.id !== taskToDelete.value.id);
        }

        deleteDialog.value = false;
        taskToDelete.value = null;
      } catch (error) {
        console.error("Error deleting task:", error);
      }
    };

        
      onMounted(() => {
          statuses.forEach(status => loadTasks(status));
      });

        
      return { displayedTasks, loading, statuses, load, dialog, editingTask, openDialog, handleTaskSubmit, confirmDelete, deleteDialog, deleteTask };

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
