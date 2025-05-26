<template>
    <article class="container p-3">
    <div class="mb-3 input-group">
        <label class="col-4 col-form-label text-center">{{ field.label }}</label>
        <div class="col-6">
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
        </div>
            <button
            class="btn btn-sm btn-success"
            @click="saveEdit"
        >저장</button>
    </div>
    </article>
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