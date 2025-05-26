<template>
  <div v-if="responseText">
    <h2>추천 상품</h2>
    <p>{{ responseText }}</p>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import OpenAI from "openai"
import { useInterestStore } from '@/stores/interest'

const responseText = ref(null)

onMounted(async () => {
  const interestStore = useInterestStore()
  const allPrdt = interestStore.allPrdt

  let context = ''
  allPrdt.forEach((prdt) => {
    let info = ''
    info += '[상품명:' + prdt.fin_prdt_nm
    info += ',평균금리:' + prdt.avg_intr
    info += ',최고우대금리:' + prdt.max_intr
    info += ']|'
    context += info
  })

  console.log(context)

  const client = new OpenAI({
    apiKey: import.meta.env.VITE_GPT_KEY,
    dangerouslyAllowBrowser: true,
  })

  try {
    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "이 텍스트는 정기예금 및 적금 상품에 대해 평균금리와 최고우대금리의 정보를 담았고 상품마다 '|'로 구분한 텍스트 모음이다. 나이가 55살, 보유 자산은 10억원, 월급은 0원인 사람에게 추천할 만한 상품을 평균금리, 최고우대금리에 기반해서 5개 정도로, 상품 이름은 입력받은 그대로 알려줘"
        },
        {
          role: "user",
          content: context
        }
      ],
      temperature: 1,
      max_tokens: 256
    })

    responseText.value = response.choices[0].message.content
  } catch (error) {
    console.error("API 호출 에러:", error)
  }
})
</script>
