
import {GET_MESSAGE} from './mutation-type'

export default{
    [GET_MESSAGE](state,message){
        state.message = message
    }
}