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
        axios.get(`http://127.0.0.1:8000/api/interest/`)
        .then(res => {
            res.data.forEach(product => {
                let intrs = ['-', '-', '-', '-', '-', '-']
                const order = ['1', '3', '6', '12', '24', '36']
                product.options.forEach(option => {
                    const idx = order.indexOf(option.save_trm)
                    if (idx > -1) {
                        intrs[idx] = option.intr_rate
                    }
                })
                product['intrs'] = intrs
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
