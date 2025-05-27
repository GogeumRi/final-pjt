<template>
  <main class="container">
    <h1 class="my-3">상품 추천</h1>
    <hr>
      <div v-if="isLoading" class="d-flex flex-column align-items-center justify-content-center" style="min-height: 200px;">
        <div class="spinner-border text-primary mb-3" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
        <p class="text-muted">추천 상품을 불러오는 중입니다...</p>
      </div>

      <div v-else-if="recommendations.length">
        <h5 class="mb-4">추천 상품</h5>
        <figure class="text-end">
          <blockquote class="blockquote">
            <p>연령 {{profile.age}} 세, 보유 자산 {{profile.current_assets}} 만원, 연봉 {{ profile.wage }} 만원인 {{ profile.nickname }} 님께...</p>
          </blockquote>
          <figcaption class="blockquote-footer">
            <cite title="Source Title">GPT 4o-mini</cite> 모델 분석결과
          </figcaption>
        </figure>
        <div class="row row-cols-1 row-cols-sm-2 row-cols-lg-4 g-4">
          <div v-for="(item, index) in rec_name" :key="index" class="col">
            <a class="link-body-emphasis link-underline link-offset-2 link-underline-opacity-0"
            @mouseover="underline" @mouseleave="clear">
            <div class="card h-100 shadow-sm"
            @click.prevent="selectProduct(item)" 
            data-bs-toggle="modal" data-bs-target="#exampleModal">
              <div class="card-body">
                <h5 class="card-title">{{ item }}</h5>
                <p class="card-text">
                  평균금리: <strong>{{ rec_avg_intr[index] }}</strong><br>
                  최고우대금리: <strong>{{ rec_max_intr[index] }}</strong>
                </p>
              </div>
            </div>
            </a>
          </div>
        </div>
      </div>
      <div v-else>
        <p class="text-danger">😢 추천 결과를 불러오지 못했습니다.</p>
      </div>

      <div class="my-5" v-show="recommendations.length">
        <hr>
        <h5>추천 상품 금리 비교</h5>
        <canvas ref="chartCanvas"></canvas>
      </div>
    </main>

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
import { onMounted, ref, reactive } from 'vue'
import OpenAI from "openai"
import axios from "axios"
import { useInterestStore } from '@/stores/interest'
import { useProfileStore } from '@/stores/profile'
import { useAuthStore } from '@/stores/auth'

const interestStore = useInterestStore()
const profileStore = useProfileStore()
const authStore = useAuthStore()
const allPrdt = interestStore.allPrdt

const recommendations = ref([])
const rec_name = ref([])
const rec_avg_intr = ref([])
const rec_max_intr = ref([])
const isLoading = ref(true)
let lineChart = null
const chartCanvas = ref(null)
const profile = reactive({
    nickname: '',
    age: '',
    current_assets: '',
    wage: '',
  })
let context = ''
  allPrdt.forEach((prdt) => {
    if (!authStore.prdt_list.includes(prdt.fin_prdt_cd)) {
      context += `[상품명:${prdt.fin_prdt_nm},평균금리:${prdt.avg_intr},최고우대금리:${prdt.max_intr},상품ID:${prdt.fin_prdt_cd}]|`
    }
  })

onMounted(async () => {
  const data = await profileStore.fetchProfile()
  Object.assign(profile, data)

  const client = new OpenAI({
    apiKey: import.meta.env.VITE_GPT_MY_KEY,
    dangerouslyAllowBrowser: true,
  })

  try {
    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `
당신은 정기예금 및 적금 상품 추천을 담당하는 금융 전문가입니다.
사용자가 제공한 상품 정보는 상품명, 평균금리, 최고우대금리로 구성되어 있고 각 상품은 "|" 기호로 구분되어 있습니다.
사용자의 나이는 ${profile.age}세, 자산은 ${profile.current_assets}만원, 월급은 ${profile.wage}원입니다.  
이 사용자가 선택하면 좋을 4개의 상품을 추천해주세요.
응답은 "반드시 상품ID만 입력받은 그대로", "|" 기호로 구분하고 앞뒤로 공백을 붙이지 않고 출력해주세요.
`.trim()
        },
        {
          role: "user",
          content: context
        }
      ],
      temperature: 1,
      // max_output_tokens: 128
    })

    console.log(response.choices[0].message.content)
    recommendations.value = response.choices[0].message.content.split("|")
    rec_name.value = []
    rec_avg_intr.value = []
    rec_max_intr.value = []
  } catch (error) {
    swal('AI 분석 실패', '잠시 후 다시 시도해 주세요. (더미데이터가 대신 출력됩니다.)', 'error')
    recommendations.value = ["WR0001L", "10527001000925000", "WR0001F", "21001259"]
    console.error("API 호출 에러 또는 JSON 파싱 실패:", error)
  } finally {
    isLoading.value = false

    recommendations.value.forEach((prdtCode) => {
    allPrdt.forEach((prdt) => {
      if (prdt.fin_prdt_cd === prdtCode) {
        console.log(prdt)
        rec_name.value.push(prdt.fin_prdt_nm)
        rec_avg_intr.value.push(prdt.avg_intr)
        rec_max_intr.value.push(prdt.max_intr)
      }
    })
    })
    const chartData = {
    labels: rec_name.value,
    datasets: [
      {
        type: "bar",
        label: "평균 금리",
        data: rec_avg_intr.value,
        backgroundColor: "#1423A3",
        stack: "Stack 0",
        barThickness: 28,
        maxBarThickness: 20,
      },
      {
        type: "bar",
        label: "최고 우대금리",
        data: rec_max_intr.value,
        backgroundColor: "#638AF4",
        stack: "Stack 1",
        barThickness: 28,
        maxBarThickness: 20,
      },
    ]}
    
    if (lineChart) {
      lineChart.destroy()
    }

    lineChart = new Chart(chartCanvas.value, {
      type: 'line',
      data: chartData,
    })
  }
})

const underline = function () {
    event.currentTarget.classList.remove('link-underline-opacity-0')
    event.currentTarget.classList.add('link-underline-opacity-100')
}

const clear = function () {
    event.currentTarget.classList.remove('link-underline-opacity-100')
    event.currentTarget.classList.add('link-underline-opacity-0')
}

const selectedProduct = ref([])
const selectProduct = (product) => {
  allPrdt.forEach((prdt) => {
    if (prdt.fin_prdt_nm === product) {
      selectedProduct.value = prdt
      selectedProduct.value.etc_note = selectedProduct.value.etc_note.replace(/(?:\r\n|\r|\n)/g, '<br />')
      selectedProduct.value.spcl_cnd = selectedProduct.value.spcl_cnd.replace(/(?:\r\n|\r|\n)/g, '<br />')
    }
  })
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
    })
    .catch(err => {
        swal('금융 상품 페이지','취소에 실패하였습니다. 다시 시도해 주세요.', 'error')
        console.log(err)
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