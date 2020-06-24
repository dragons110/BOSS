/* 
包含n个action creator
异步action
同步action
*/
import io from 'socket.io-client'
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

import {
    reqRegister,
    reqLogin,
    reqUpdataUser,
    reqUserList,
    reqChatMsgList,
    reqReadChatMsg
} from '../api'
//授权成功的同步action
const authSuccess = (user) => ({type: AUTH_SUCCESS, data: user})
//错误提示信息的同步action
const errorMsg = (msg) => ({type: ERROR_MSG, data: msg})
//接收用户的同步action
const receiveUser = (user) => ({type: RECIVE_USER, data: user})
//重置用户同步action
export const resetUser = (msg) => ({type: RESET_USER, data: msg})
//接收用户列表信息同步action
const receiveUserList = (userList) => ({type: RECEIVE_USER_LIST, data: userList})
//接收消息列表的同步action
const receivemsglist = ({users, chatMsgs, userid}) => ({type: RECEIVE_MSG_LIST, data: {users, chatMsgs, userid}})
//接收一个消息的同步action
const receivemsg = (chatMsg, userid) => ({type: RECEIVE_MSG, data: {chatMsg, userid}})
//读取某个聊天消息的同步action
const msgRead = ({from, to, count}) => ({type: MSG_READ, data: {from, to, count}})


//注册异步action
export const register = (user) => {
    const {username, password, password2, type} = user
    //做表单的前台检查，如果检查不通过，return一个errorMsg的同步action
    if(!username){
        return errorMsg('用户名为空')
    }else if(password!==password2){
        return errorMsg('2次密码输入不一致')
    }
    return async dispatch => {
        /* const promise = reqRegister(user)
        promise.then(response => {
            const result = response.data
        }) */
        const response = await reqRegister({username, password, type})
        const result = response.data
        if(result.code===0) {//成功
            getMsgList(dispatch, result.data._id)
            //分发授权成功的同步action
            dispatch(authSuccess(result.data))
        }else{//失败
            //分发错误提示信息的同步action
            dispatch(errorMsg(result.msg))
        }
    }
}
//登录异步action
export const login = (user) => {
    const {username, password} = user
    //做表单的前台检查，如果检查不通过，return一个errorMsg的同步action
    if(!username){
        return errorMsg('用户名必须指定!')
    }else if(!password){
        return errorMsg('密码必须指定!')
    }

    return async dispatch => {
        /* const promise = reqRegister(user)
        promise.then(response => {
            const result = response.data
        }) */
        const response = await reqLogin(user)
        const result = response.data
        if(result.code===0) {//成功
            getMsgList(dispatch, result.data._id)
            //分发授权成功的同步action
            dispatch(authSuccess(result.data))
        }else{//失败
            //分发错误提示信息的同步action
            dispatch(errorMsg(result.msg))

        }
    }
}
//更新用户异步action
export const updateUser = (user) => {
    return async dispatch => {
        const response = await reqUpdataUser(user)
        const result = response.data
        if(result.code === 0){//更新成功
            dispatch(receiveUser(result.data))
        }else{//更新失败  msg
            dispatch(resetUser(result.msg))
        }
    }
}
//获取用户列表的异步action
export const getUserList = (type) => {
    return async dispatch => {
        //执行异步ajax请求
        const response = await reqUserList(type)
        //得到结果后，分发一个同步action
        const result = response.data
        if(result.code === 0){
            getMsgList(dispatch, result.data._id)
            dispatch(receiveUserList(result.data))
        }

    }
}

function initIO(dispatch, userid) {
    //1.创建对象前，判断对象是否存在，只有不存在才会创建
    if(!io.socket){
        //连接服务器
        io.socket = io('ws://localhost:4000')
        //绑定监听，接收服务器发送的消息
        io.socket.on('receiveMsg', function (chatMsg) {
            console.log('客户端接收到服务器发送的消息', chatMsg)
        //只有当chatMsg是与当前用户相关的消息，才会分发同步action保存消息
        if(userid === chatMsg.from || userid === chatMsg.to){
            dispatch(receivemsg(chatMsg, userid))
        }
    })
  }
}
//异步获取消息列表数据
async function getMsgList(dispatch, userid) {
    initIO(dispatch, userid)
    const response = await reqChatMsgList()
    const result = response.data
    if(result.code===0){
        const {users, chatMsgs} = result.data
        //分发同步action
        dispatch(receivemsglist({users, chatMsgs, userid}))
    }
}
//发送消息的异步action
export const sendMsg = ({from, to, content}) => {
    return dispatch => {
        console.log('客户端向服务器发消息', {from, to, content})
        //发消息
        io.socket.emit('sendMsg', {from, to, content})
    }
}
//读取消息的异步action
export const readMsg = (from, to) => {
    return async dispatch => {
        const response = await reqReadChatMsg(from)
        const result = response.data
        if (result.code===0) {
            //分发同步action
            const count = result.data
            dispatch(msgRead({from, to, count}))
        }
    }
}