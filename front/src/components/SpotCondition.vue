<template>
  <div class="container py-4">
    <div class="d-flex justify-content-between">
      <div class="row">
        <div class="col">
          <label class="form-label">시작 날짜</label>
          <input type="date" v-model="startDate" class="form-control" />
        </div>
        <div class="col">
          <label class="form-label">종료 날짜</label>
          <input type="date" v-model="endDate" class="form-control" />
        </div>
      </div>

      <div class="row my-3">
        <button @click="selectGold" class="col mx-1 btn btn-lg" :class="{ 'btn-warning': isGold, 'btn-outline-warning': !isGold }">
          금
        </button>
        <button @click="selectSilver" class="col mx-1 btn btn-lg" :class="{ 'btn-secondary': !isGold, 'btn-outline-secondary': isGold }">
          은
        </button>
      </div>
    </div>

    <canvas v-show="isValidRange" ref="chartCanvas"></canvas>
    <p v-if="!isValidRange">선택한 조건에 맞는 데이터가 없습니다. 날짜 범위를 다시 선택해주세요.</p>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import Data from '@/metal_prices.json'

const chartCanvas = ref(null)
let lineChart = null
const rawData = ref(null)
let labels = null
const selectedMetal = ref('gold')
const startDate = ref(null)
const endDate = ref(null)
const isValidRange = ref(true)

onMounted(() => {
  rawData.value = Data
  labels = rawData.value.labels
  startDate.value = labels[0]
  endDate.value = labels[labels.length - 1]
  updateChart()
})
const isGold = ref(true)

const selectGold = (() => {
  selectedMetal.value = 'gold'
  isGold.value = true
  updateChart()
})
const selectSilver = (() => {
  selectedMetal.value = 'silver'
  isGold.value = false
  updateChart()
})

watch([startDate, endDate], ([newStart, newEnd]) => {
  updateChart()
})

function updateChart() {
  const { labels, datasets } = rawData.value
  isValidRange.value = true

  const startIdx = labels.findIndex(date => date >= startDate.value)
  const endIdx = labels.findIndex(date => date >= endDate.value)

  if (startDate.value < labels[0] || endDate.value > labels[labels.length - 1] || startIdx >= endIdx) {
    isValidRange.value = false

  } else {
    const filteredLabels = labels.slice(startIdx, endIdx)
    const dataset = datasets.find(d => d.label.toLowerCase().includes(selectedMetal.value))
    const filteredData = dataset.data.slice(startIdx, endIdx)

    const chartData = {
      labels: filteredLabels,
      datasets: [
        {
          ...dataset,
          data: filteredData
        }
      ]
    }

    if (lineChart) {
      lineChart.destroy()
    }

    lineChart = new Chart(chartCanvas.value, {
      type: 'line',
      data: chartData,
      options: {
        responsive: true,
        cubicInterpolationMode: 'monotone',
        scales: {
          x: {
            title: { display: true, text: '날짜' }
          },
          y: {
            title: { display: true, text: '가격' }
          }
        },
        plugins: {
          title: {
            display: true,
            text: selectedMetal.value === 'gold' ? 'Gold Prices' : 'Silver Prices'
          },
          
          tooltip: {
            mode: 'index',
            intersect: false
          }
        }
      }
    })
    }
  }

  
</script>


<style scoped>
</style>