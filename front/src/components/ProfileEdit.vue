<template>
    <div class="row align-items-center mb-3">
      <label class="col-sm-2 col-form-label">{{ field.label }}</label>
      <div class="col-sm-6">
        <!-- text input -->
        <input
          v-if="field.type === 'text'"
          v-model="inputValue"
          type="text"
          class="form-control"
        />
        <!-- number input -->
        <input
          v-else-if="field.type === 'number'"
          v-model.number="inputValue"
          type="number"
          class="form-control"
        />
        <!-- select for array fields -->
        <select
          v-else-if="field.type === 'array'"
          v-model="inputValue"
          class="form-select"
        >
          <option disabled value="">선택하세요</option>
          <option
            v-for="option in field.options"
            :key="option"
            :value="option"
          >
            {{ option }}
          </option>
        </select>
      </div>
      <div class="col-sm-4 text-end">
        <button
          class="btn btn-sm btn-success"
          @click="saveEdit"
        >저장</button>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, watch, onMounted } from 'vue'
  
  const props = defineProps({
    field: {
      type: Object,
      required: true,
    },
    value: {
      type: [String, Number],
      required: true,
    },
  })
  const emit = defineEmits(['save'])
  
  // Local state for the input
  const inputValue = ref(props.value)
  
  // Keep local input synced if parent updates value
  watch(
    () => props.value,
    (newVal) => {
      inputValue.value = newVal
    }
  )
  
  onMounted(() => {
    inputValue.value = props.value
  })
  
  function saveEdit() {
    emit('save', { key: props.field.key, value: inputValue.value })
  }
  </script>
  
  <style scoped>
  .mb-3 {
    margin-bottom: 1rem;
  }
  </style>
  