<template>
    <v-form ref="formRef" @submit.prevent="validateAndSubmit">
        <v-text-field v-model="taskData.title" label="Title" :rules="[rules.required]" ></v-text-field>
        <v-textarea v-model="taskData.description" label="Description"   :rules="[rules.required]"></v-textarea>
        <v-select
            v-model="taskData.priority"
            :items="['Low', 'Medium', 'High']"
            label="Priority"
             :rules="[rules.required]"
        ></v-select>
        <v-menu ref="menu" v-model="dateMenu" :close-on-content-click="false">
        <template v-slot:activator="{ props }">
            <v-text-field v-model="taskData.dueDate" label="Due Date" readonly v-bind="props" :rules="[rules.required, rules.minDate]"></v-text-field>
        </template>
        <v-date-picker :min="today" v-model="dueDateAsDate" @update:modelValue="convertDate" 
        ></v-date-picker>
        </v-menu>

        <v-card-actions>
            <v-btn color="red" text @click="$emit('cancel')">Cancel</v-btn>
            <v-btn color="green" text type="submit">{{ isEdit ? "Save Changes" : "Add Task" }}</v-btn>
        </v-card-actions>
  </v-form>
</template>

<script>
import { ref, watch, reactive, computed } from "vue";

export default {
  props: {
    task: Object, 
    isEdit: Boolean, 
  },
  emits: ["submit", "cancel"],

  setup(props, { emit }) 
  {
    const dateMenu = ref(false);
    const today = new Date().toISOString().split("T")[0];

    const formRef = ref(null);


    const taskData = reactive({
      title: "",
      description: "",
      priority: "Medium",
      dueDate: new Date().toISOString().substr(0, 10),
    });

    const dueDateAsDate = computed(() => {
        return taskData.dueDate ? new Date(taskData.dueDate) : null;
    });


    watch(
      () => props.task,
      (newTask) => {
        if (newTask) {
          taskData.title = newTask.title || "";
          taskData.description = newTask.description || "";
          taskData.priority = newTask.priority || "Medium";
          taskData.dueDate = newTask.dueDate || new Date().toISOString().split("T")[0];
        }
      },
      { immediate: true }
    )


    const convertDate = (date) => {
      const userTimeZoneOffset = date.getTimezoneOffset() * 60000; 
      const localDate = new Date(date.getTime() - userTimeZoneOffset); 
      taskData.dueDate = localDate.toISOString().split("T")[0]; 
      dateMenu.value = false;
    };

    const rules = {
      required: (value) => !!value || "This field is required.",
      minDate: (value) => value >= today || "Due Date cannot be in the past.",
    };

    const validateAndSubmit = () => {
      formRef.value?.validate().then((valid) => {
        if (valid) {
            emit("submit", { ...taskData, status: props.task?.status || "To Do" });
        }
      });
    };

    return { taskData, dateMenu, validateAndSubmit, rules, convertDate, formRef, dueDateAsDate,today };
  }
}

</script>