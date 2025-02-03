<template>
  <v-container>
    <h2>Task Board</h2>
    <v-row class="kanban-container">
      <v-col v-for="status in statuses" :key="status" cols="12" md="3">
        <v-card class="kanban-column">
          <v-card-title>
            {{ status }}
            <v-btn v-if="status === 'To Do'" class="ml-3" color="primary" @click="openDialog(null)">
              New Task
            </v-btn>
          </v-card-title>
          <v-divider></v-divider>

          <v-progress-circular v-if="isLoading" indeterminate color="primary" class="mt-4"></v-progress-circular>

          <draggable :list="tasksByStatus(status)" group="tasks" item-key="id" @start="onTaskStart" @end="onTaskDrop"
            class="task-list">
            <template v-slot:item="{ element: task }">
              <v-list-item>
                <v-card class="pa-3 mb-3">
                  <v-card-title>{{ task.title }}</v-card-title>
                  <v-card-subtitle>{{ task.priority }} Priority</v-card-subtitle>
                  <v-card-text>
                    <p>{{ task.description }}</p>
                    <p>Due: {{ task.dueDate }}</p>
                  </v-card-text>
                  <v-btn color="warning" icon="mdi-pencil" text size="x-small" @click="openDialog(task)"></v-btn>
                  <v-btn color="red" icon="mdi-delete-outline" size="x-small" @click="openDeleteDialog(task)"></v-btn>
                </v-card>
              </v-list-item>
            </template>
          </draggable>

          <p class="empty-message" v-if="tasksByStatus(status).length === 0">No tasks for {{ status }}</p>
        </v-card>
      </v-col>
    </v-row>

    <TaskForm v-model="dialog" :task="editingTask" :isEdit="!!editingTask" @submit="handleTaskSubmit"
      @cancel="closeDialog" />

    <v-dialog v-model="deleteDialog" max-width="400px">
      <v-card>
        <v-card-title class="headline">Confirm Delete</v-card-title>
        <v-card-text>Are you sure you want to delete this task?</v-card-text>
        <v-card-actions>
          <v-btn color="red" text @click="deleteDialog = false">Cancel</v-btn>
          <v-btn color="green" text @click="confirmDelete">Confirm</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import TaskForm from "./TaskForm.vue";
import { ref, computed, onMounted } from "vue";
import draggable from "vuedraggable";
import { useStore } from "vuex";

export default {
  components: { TaskForm, draggable },

  setup() {
    const store = useStore();
    const statuses = ["To Do", "In Progress", "Done", "Aborted"]
    const dialog = ref(false)
    const editingTask = ref(null)
    const deleteDialog = ref(false)
    const selectedTask = ref(null)

    const tasks = ref(
      statuses.reduce((acc, status) => {
        acc[status] = []
        return acc
      }, {})
    )

    const draggedTask = ref(null);
    const previousStatus = ref(null);

    onMounted(() => {
      statuses.forEach((status) => {
        store.dispatch("tasks/fetchTasks", status).then(() => {
          tasks.value[status] = store.getters["tasks/tasksByStatus"](status) || [];
        });
      });
    });

    // onMounted(() => {
    //   statuses.forEach((status) => store.dispatch("tasks/fetchTasks", status));
    // });

    // const tasksByStatus = computed({
    //   get: () => (status) => store.getters["tasks/tasksByStatus"](status),
    //   set: (status, tasks) => store.commit("tasks/SET_TASKS", { status, tasks }),
    // });
    const tasksByStatus = computed(() => (status) => {
      //console.log("Filtering tasks for:", status, store.getters["tasks/tasksByStatus"](status));
      return store.getters["tasks/tasksByStatus"](status) || []
    });

    const isLoading = computed(() => store.getters["tasks/isLoading"]);



    const openDialog = (task) => {
      console.log("Opening dialog for task:", task);

      if (task) {
        editingTask.value = { ...task }; 
      } else {
        editingTask.value = {
          title: "",
          description: "",
          priority: "Medium",
          dueDate: new Date().toISOString().split("T")[0],
          status: "To Do"
        };
      }

      dialog.value = true;
    };


    const closeDialog = () => {
      dialog.value = false;
      editingTask.value = null;

    };

    const handleTaskSubmit = async (task) => {
      if (task.id) {
        await store.dispatch("tasks/editTask", task);
      } else {
        task.status = "To Do";
        await store.dispatch("tasks/addTask", task);
      }
      closeDialog()
    };

    const openDeleteDialog = (task) => {
      selectedTask.value = task;
      deleteDialog.value = true;
    };

    const confirmDelete = async () => {
      if (selectedTask.value) {
        await store.dispatch("tasks/deleteTask", selectedTask.value.id);
        deleteDialog.value = false;
        selectedTask.value = null;
      }
    };
    const updateTaskStatus = (task, newStatus) => {
      if (task.status !== newStatus) {
        task.status = newStatus;
        store.dispatch("tasks/editTask", task);
      }
    };

    const onTaskStart = (event) => {
      const task = event.item.__draggable_context?.element;
      if (!task) return;

      previousStatus.value = task.status
      draggedTask.value = { ...task }
    };

    const onTaskDrop = async (event) => {
      if (!event || !event.item || !event.to) return;

      const column = event.to.closest(".kanban-column");
      if (!column) return;

      const newStatus = column.querySelector(".v-card-title")?.textContent?.trim();
      if (!newStatus) return;

      const task = event.item.__draggable_context?.element;
      if (!task) return;

      if (task.status === newStatus) return;

      console.log(`Moving task ${task.id} from ${task.status} to ${newStatus}`);

      await store.dispatch("tasks/editTask", { ...task, status: newStatus });

      await store.dispatch("tasks/fetchTasks", task.status);
      await store.dispatch("tasks/fetchTasks", newStatus);
    };



    return {
      statuses, isLoading, dialog, openDialog, closeDialog, handleTaskSubmit,
      confirmDelete, editingTask, deleteDialog, openDeleteDialog, selectedTask,
      onTaskStart, onTaskDrop, updateTaskStatus, tasks, tasksByStatus
    };


  },
};
</script>

<style>
.kanban-container {
  display: flex;
  align-items: stretch;
  /* //justify-content: center; */
}

.kanban-column {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  height: 100%;
  min-height: 600px;
  max-height: 600px;
  width: 100%;
  background: #f5f5f5;
  border-radius: 10px;
  padding: 10px;
  overflow: hidden;
}

.task-list {
  flex-grow: 1;
  overflow-y: auto;
  padding: 10px;
  height: 500px;
  max-height: 500px;
  background-color: whitesmoke
}


.column-title {
  min-height: 50px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.empty-message {
  text-align: center;
  color: lightgray;
  padding: 10px;
}

/* .v-list {
  max-height: 500px; 
  overflow-y: auto; 
} */

.v-card {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  background-color: lightblue;
}

</style>
