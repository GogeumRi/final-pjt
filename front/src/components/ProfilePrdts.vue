<template>
    <article class="container">
        <h5>가입한 상품 목록</h5>
        <div v-if="JoinedPrdt.length === 0">
        <p>가입 상품이 없어요...</p>
      </div>
      <div v-else>
        <ul>
            <li v-for="prdt in JoinedPrdt"
            :key="prdt.fin_prdt_cd">
                [{{ prdt.prdt_type === 0 ? '정기예금' : '적금' }}] {{ prdt.kor_co_nm }} - 
                <a class='link-primary link-underline link-offset-2 link-underline-opacity-0' 
                @mouseover="underline" @mouseleave="clear" 
                @click.prevent="selectProduct(prdt)" 
                data-bs-toggle="modal" data-bs-target="#exampleModal">
                    {{ prdt.fin_prdt_nm }}
                </a>
            </li>
        </ul>
        <h5>가입한 상품 금리</h5>
        <canvas ref="chartCanvas"></canvas>
      </div>
    </article>

      <!-- Modal -->
    <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
        <div class="modal-content">
        <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLabel">상세</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
            <table class="table table-borderless">
                <tbody>
                    <tr>
                    <th class="col-3" scope="row">공시 제출월</th>
                    <td>{{ selectedProduct.dcls_month }}</td>
                    </tr>
                    <tr>
                    <th scope="row">금융회사명</th>
                    <td>{{ selectedProduct.kor_co_nm }}</td>
                    </tr>
                    <tr>
                    <th scope="row">상품명</th>
                    <td>{{ selectedProduct.fin_prdt_nm }}</td>
                    </tr>
                    <tr>
                    <th id="wrap">
                        <div id="box">
                            가입제한
                            <i class="fas fa-circle-question"></i>
                        </div>
                        <div id="tooltip">
                            1: 제한없음 - 일반인 대상의 상품<br>
                            2: 서민전용 - 기초생활수급자 등 서민우대상품<br>
                            3: 일부제한 - 특정인 대상 상품<br>
                            2, 3은 가입대상 요건을 확인하세요.
                        </div>
                    </th>
                    <td>{{ selectedProduct.join_deny }}</td>
                    </tr>
                    <tr>
                    <th scope="row">가입대상</th>
                    <td>{{ selectedProduct.join_member }}</td>
                    </tr>
                    <tr>
                    <th scope="row">가입 방법</th>
                    <td>{{ selectedProduct.join_way }}</td>
                    </tr>
                    <tr>
                    <th scope="row">우대조건</th>
                    <td v-html="selectedProduct.spcl_cnd"></td>
                    </tr>
                    <tr>
                    <th scope="row">기타 유의사항</th>
                    <td v-html="selectedProduct.etc_note"></td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">닫기</button>
            <div v-if="authStore.token">
                <button type="button" class="btn btn-danger" v-if="authStore.prdt_list.includes(selectedProduct.fin_prdt_cd)" @click="disJoin">가입 취소</button>
                <button type="button" class="btn btn-primary" v-else @click="Join">상품 가입</button>
            </div>
        </div>
        </div>
    </div>
    </div>
</template>

<script setup>
const props = defineProps({
    joinedprdtid: Object,
})
import { ref, watch, onMounted } from 'vue'
import axios from 'axios'
import { useAuthStore } from '@/stores/auth';
import { useInterestStore } from '@/stores/interest';
let lineChart = null
const chartCanvas = ref(null)

const JoinedId = props.joinedprdtid
const authStore = useAuthStore()
const interestStore = useInterestStore()
const allPrdt = interestStore.allPrdt
const JoinedPrdt = ref([])
allPrdt.forEach((prdt) => {
    JoinedId.forEach((id) => {
        if (prdt.fin_prdt_cd === id) {
            JoinedPrdt.value.push(prdt);
        }
    })
})

const selectedProduct = ref([])
const selectProduct = (product) => {
  product.etc_note = product.etc_note.replace(/(?:\r\n|\r|\n)/g, '<br />')
  product.spcl_cnd = product.spcl_cnd.replace(/(?:\r\n|\r|\n)/g, '<br />')
  selectedProduct.value = product
}
const Join = function () {
    const wantProduct = selectedProduct.value.fin_prdt_cd
    axios({
        method: 'POST',
        url: 'accounts/interest/join/',
        headers: {
                Authorization: `Token ${authStore.token}`,
            },
        data: {
            fin_prdt_cd: wantProduct
        },
    })
    .then(res => {
        swal('금융 상품 페이지','상품 가입 완료', 'success')
        authStore.joinPrdt(wantProduct)
        allPrdt.forEach((prdt) => {
            if (prdt.fin_prdt_cd === wantProduct) {
                JoinedPrdt.value.push(prdt)
            }
        })
    })
    .catch(err => {
        swal('금융 상품 페이지','가입에 실패하였습니다. 다시 시도해 주세요.', 'error')
        console.log(err)
    })
}

const disJoin = function () {
    const wantProduct = selectedProduct.value.fin_prdt_cd
    axios({
        method: 'POST',
        url: 'accounts/interest/disjoin/',
        headers: {
                Authorization: `Token ${authStore.token}`,
            },
        data: {
            fin_prdt_cd: wantProduct
        },
    })
    .then(res => {
        swal('금융 상품 페이지','상품 가입 취소 완료', 'success')
        authStore.disjoinPrdt(wantProduct)
        for (let i = 0; i < JoinedPrdt.value.length; i++) {
            if (JoinedPrdt.value[i].fin_prdt_cd === wantProduct) {
                JoinedPrdt.value.splice(i, 1);
                i--
            }
        }
        console.log(JoinedPrdt.value)
    })
    .catch(err => {
        swal('금융 상품 페이지','취소에 실패하였습니다. 다시 시도해 주세요.', 'error')
        console.log(err)
    })
}

const InterestData = ref([[], [], []])
console.log(JoinedPrdt.value)

onMounted(() => {
    JoinedPrdt.value.forEach((prdt) => {
    InterestData.value[0].push(prdt.fin_prdt_nm)
    InterestData.value[1].push(prdt.avg_intr)
    InterestData.value[2].push(prdt.max_intr)
})
    updateChart()
})

watch(JoinedPrdt, (newArray) => {
    InterestData.value = [[],[],[]]
    newArray.forEach((prdt) => {
    InterestData.value[0].push(prdt.fin_prdt_nm)
    InterestData.value[1].push(prdt.avg_intr)
    InterestData.value[2].push(prdt.max_intr)
    })
    updateChart()
}, { deep: true })

function updateChart() {
    const chartData = {
    labels: InterestData.value[0],
    datasets: [
      {
        type: "bar",
        label: "평균 금리",
        data: InterestData.value[1],
        backgroundColor: "#1423A3",
        stack: "Stack 0",
        barThickness: 28,
        maxBarThickness: 20,
      },
      {
        type: "bar",
        label: "최고 우대금리",
        data: InterestData.value[2],
        backgroundColor: "#638AF4",
        stack: "Stack 1",
        barThickness: 28,
        maxBarThickness: 20,
      },
    ]}
    
    if (lineChart) {
      lineChart.destroy()
    }

    lineChart
    lineChart = new Chart(chartCanvas.value, {
      type: 'line',
      data: chartData,
    })
}



</script>

<style scoped>
 #wrap{
    position: relative; 
    display: inline-block;
  }
  #box{
    color: black;
  }
  #tooltip{
    position:absolute; 
    left:0px; 
    top:35px; 
    width:300px;
    background: lavender;
    font-size: smaller;
    padding: 10px; 
    border-radius:5px; 
    color: #000; 
    display: none;
  }
  #tooltip:after{
    display: block; 
    content: ''; 
    position: absolute; 
    /* top: -7px; 
    left:15px; 
    width: 0px; 
    height: 0px; 
    border-top: 8px solid none; 
    border-left: 8psolid transparent; 
    border-right: 8px solid transparent; 
    border-bottom: 8px solid #646FD4; */
  } 
  #wrap:hover #tooltip{display: block;}
</style>  