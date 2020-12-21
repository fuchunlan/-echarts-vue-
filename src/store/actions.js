/*包含多个接收组件通知触发mutation间接调用状态的方法的对象*/

import {GET_MESSAGE} from './mutation-type'
import axios from 'axios' // vuex中必须单独引入axios才能使用axios和main.js中相互独立
export default {
    // 异步获取message
    reqMessage({commit}){
        axios({
          method:'get',
          url:'/api/getOnsInfo?name=disease_h5'
        }).then(( response )=> {
            const message = response.data.data
            console.log(message)
            conmmit(GET_MESSAGE,message)
        })
        // this.$axios.get('/api/getOnsInfo?name=disease_h5').then((response) => {
        //    const message = response.data.data
        //    conmmit(GET_MESSAGE,message)
        //})
    }
}
