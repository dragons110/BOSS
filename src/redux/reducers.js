/*包含多个用于生成新的 state 的 reducer 函数的模块 */
import {combineReducers} from 'redux'

import {
    AUTH_SUCCESS,
    ERROR_MSG,
    RECIVE_USER,
    RESET_USER,
    RECEIVE_USER_LIST,
    RECEIVE_MSG_LIST,
    RECEIVE_MSG,
    MSG_READ
} from './action-types'
import {getRedirectTo} from '../utils/index'

const initUser = {
    username: '', //用户名
    type: '', //用户类型 dashen/laoban
    msg: '', //错误提示信息
    redirectTo: ''//需要自动重定向的路由路径
}

//产生user状态的reducer
function user(state=initUser, action) {
    switch (action.type) {
        
        case AUTH_SUCCESS:
            const {type, header} = action.data
            return {...action.data, redirectTo: getRedirectTo(type, header)}
        case ERROR_MSG:
            return {...state, msg: action.data}
        case RECIVE_USER:  //data  user
            return action.data
        case RESET_USER:  //data:  msg
            return {...initUser, msg: action.data}

        default:
            return state
    }
}

const initUserList = []
//产生userlist状态的reducer
function userList(state=initUserList, action) {
    switch (action.type) {
        case RECEIVE_USER_LIST:
            return action.data //data为userlist
        default:
            return state
    }
}

const initChat = {
    users: {}, //所有用户信息的对象
    chatMsgs: [], //当前用户所有相关msg的数组
    unReadCount: 0 //总的未读数量
}
//产生聊天状态的reducer
function chat(state=initChat, action) {
    switch(action.type){
        case RECEIVE_MSG_LIST:
            const {users, chatMsgs, userid} = action.data
            return {
                users,
                chatMsgs,
                unReadCount: chatMsgs.reduce((preTotal, msg) => preTotal + (!msg.read && msg.to === userid ? 1 : 0), 0)
            }
        case RECEIVE_MSG: 
            const {chatMsg} = action.data
            return {
                users: state.users,
                chatMsgs: [...state.chatMsgs, chatMsg],
                unReadCount: state.unReadCount + (!chatMsg.read && chatMsg.to===action.data.userid ? 1 : 0)
                
            }
        case MSG_READ:
            const {count, from, to} = action.data
            state.chatMsgs.forEach(msg => {
                if(msg.from===from && msg.to===to && !msg.read){
                    msg.read = true
                }
            })
            return {
                users: state.users,
                chatMsgs: state.chatMsgs.map(msg => {
                    if(msg.from===from && msg.to===to && !msg.read){//需要更新
                        return {...msg, read: true} 
                    }else{//不需要更新
                        return msg
                    }
                }),
                unReadCount: state.unReadCount
            }
        default:
            return state
    }
}
export default combineReducers({
    user,
    userList,
    chat,
})
//向外暴露的状态的结构{user：{} , userList:[], chat:{}}
