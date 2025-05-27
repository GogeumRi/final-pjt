import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from 'axios'

export const useInterestStore = defineStore('interest', () => {
    const allPrdt = ref([])
    const DepositPrdts = ref([])
    const SavingPrdts = ref([])
    const allDepositBank = ref([])
    const allSavingBank = ref([])

    const getAll = function () {
        axios.get(`api/interest/`)
        .then(res => {
            res.data.forEach(product => {
                let intrs = ['-', '-', '-', '-', '-', '-']
                const order = ['1', '3', '6', '12', '24', '36']

                let cnt = 0
                let avg_intr = 0
                let max_intr = 0
                product.options.forEach(option => {
                    const idx = order.indexOf(option.save_trm)
                    if (idx > -1) {
                        intrs[idx] = option.intr_rate
                        cnt++
                        avg_intr += option.intr_rate
                        max_intr += option.intr_rate2
                    }
                })
                product['intrs'] = intrs
                product['avg_intr'] = Math.ceil(avg_intr / cnt * 100) / 100
                product['max_intr'] = Math.ceil(max_intr / cnt * 100) / 100
                product['isShow'] = true
                allPrdt.value.push(product)
                
                if (product.prdt_type === 0) {
                    DepositPrdts.value.push(product)
                    if (
                        allDepositBank.value.findIndex(
                            (bank) => bank.fin_co_no === product.fin_co_no
                        ) === -1
                    ) {
                    allDepositBank.value.push(
                        {fin_co_no: product.fin_co_no, kor_co_nm: product.kor_co_nm}
                    )}
                } else {
                    SavingPrdts.value.push(product)
                    if (
                        allSavingBank.value.findIndex(
                            (bank) => bank.fin_co_no === product.fin_co_no
                        ) === -1
                    ) {
                    allSavingBank.value.push(
                        {fin_co_no: product.fin_co_no, kor_co_nm: product.kor_co_nm}
                    )}
                }
            });
        }).catch(err => {
            alert('금리 정보 조회 실패')
            console.log(err)
        })
    }
    return {
        allPrdt, allDepositBank, allSavingBank, getAll, DepositPrdts, SavingPrdts
    }
})
