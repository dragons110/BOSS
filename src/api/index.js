/* 
包含了n个接口请求的函数的模块
函数返回值：promise
*/

import ajax from './ajax'
//注册接口
export const reqRegister = (user) => ajax('/register', user, 'POST')
//登录接口
export const reqLogin = ({username, password}) => ajax('/login', {username, password}, 'POST')
//更新用户接口
export const reqUpdataUser = (user) => ajax('/updata', user, 'POST')
//获取用户列表
export const reqUserList = (type) => ajax('/userlist',{type})
//获取聊天记录
export const reqChatMsgList = () => ajax('/msglist')
//标识查看了指定用户发送的聊天信息
export const reqReadChatMsg = (from) => ajax('/readmsg', {from}, 'POST')