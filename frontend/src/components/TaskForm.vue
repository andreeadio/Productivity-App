<template>
  <v-dialog v-model="dialog" persistent max-width="500px">
    <v-card>
      <v-card-title class="d-flex justify-space-between align-center">
        <span>{{ taskData.id ? "Edit Task" : "New Task" }}</span>
        <v-btn icon="mdi-close" variant="text" @click="closeForm"></v-btn>
      </v-card-title>

      <v-card-text>
        <v-form ref="formRef" @submit.prevent="validateAndSubmit">
          <v-text-field v-model="taskData.title" label="Title" :rules="[rules.required]"></v-text-field>
          <v-textarea v-model="taskData.description" label="Description" :rules="[rules.required]"></v-textarea>
          <v-select v-model="taskData.priority" :items="['Low', 'Medium', 'High']" label="Priority"
            :rules="[rules.required]"></v-select>
          <v-menu ref="menu" v-model="dateMenu" :close-on-content-click="false">
            <template v-slot:activator="{ props }">
              <v-text-field v-model="taskData.dueDate" label="Due Date" readonly v-bind="props"
                :rules="[rules.required, rules.minDate]"></v-text-field>
            </template>
            <v-date-picker :min="today" v-model="dueDateAsDate" @update:modelValue="convertDate"></v-date-picker>
          </v-menu>
        </v-form>
      </v-card-text>

      <v-card-actions>
        <v-btn color="red" text @click="closeForm">Cancel</v-btn>
        <v-btn color="green" text @click="validateAndSubmit">{{ taskData.id ? "Save Changes" : "Add Task" }}</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { ref, watch, reactive, computed } from "vue";
//import { useStore } from "vuex";

export default {
  props: {
    task: Object,
    isEdit: Boolean,
    modelValue: Boolean,
  },
  emits: ["cancel", "submit", "update:modelValue"],

  setup(props, { emit }) {
    //const store = useStore();
    const dialog = computed({
      get: () => props.modelValue,
      set: (val) => emit("update:modelValue", val),
    });
    const formRef = ref(null);
    const dateMenu = ref(false);
    const today = new Date().toISOString().split("T")[0];

    //rules for validation 
    const rules = {
      required: (value) => !!value || "This field is required.",
      minDate: (value) => value >= today || "Due Date cannot be in the past.",
    };
    const taskData = reactive({
      title: "",
      description: "",
      priority: "Medium",
      dueDate: new Date().toISOString().split("T")[0],
    });

    const dueDateAsDate = computed(() => (taskData.dueDate ? new Date(taskData.dueDate) : null));

    const convertDate = (date) => {
      const userTimeZoneOffset = date.getTimezoneOffset() * 60000;
      const localDate = new Date(date.getTime() - userTimeZoneOffset);
      taskData.dueDate = localDate.toISOString().split("T")[0];
      dateMenu.value = false;
    };

    watch(() => props.task, (newTask) => {
      if (newTask) {
        Object.assign(taskData, newTask);
      } else {
        Object.assign(taskData, {
          id: null,
          title: "",
          description: "",
          priority: "Medium",
          dueDate: new Date().toISOString().split("T")[0],
          status: "To Do"
        });
      }
    }, { immediate: true });


    const validateAndSubmit = async () => {
      const { valid } = await formRef.value.validate();
      if (valid)
        emit("submit", { ...taskData, status: props.task?.status || "To Do" });
    };

    const closeForm = () => { dialog.value = false; emit("cancel"); };

    return { dialog, taskData, dateMenu, validateAndSubmit, closeForm, formRef, dueDateAsDate, today, rules, convertDate };
  }
};
</script>
