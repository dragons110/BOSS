/*
包含n个操作数据库集合的Model模块
*/
// 1. 连接数据库 
// 1.1. 引入 mongoose 
const mongoose = require('mongoose')
// 1.2. 连接指定数据库(URL 只有数据库是变化的)
mongoose.connect('mongodb://localhost:27017/gzhipin')
// 1.3. 获取连接对象 
const cnn = mongoose.connection
// 1.4. 绑定连接完成的监听(用来提示连接成功)
cnn.on('connected', () => {
    console.log('db connect success!')
})
// 2. 得到对应特定集合的 Model 
// 2.1. 字义 Schema(描述文档结构)
const userSchema = mongoose.Schema({
    username: {type:String, required: true},
    password: {type:String, required: true},
    type: {type:String, required: true},
    header: {type:String},//头像
    post: {type: String},//职位
    info: {type: String},//个人或职位简介
    company: {type: String},//公司名称
    salary: {type: String},//月薪
})
// 2.2. 定义 Model(与集合对应, 可以操作集合)
const UserModel = mongoose.model('user', userSchema)
//2.3 暴露model
exports.UserModel = UserModel

// 定义 chats 集合的文档结构
const chatSchema = mongoose.Schema({
    from: {type:String, required: true},//发送用户的id
    to: {type:String, required: true},//接收用户的id
    content: {type: String, required: true},//内容
    creat_time: {type: Number},//创建时间
    read: {type:Boolean, default:false},//标识是否已读
    chat_id: {type: String, required: true},//from和to组成的字符串
})
// 定义能操作 chats 集合数据的 Model
const ChatModel = mongoose.model('chat', chatSchema)
//向外暴露 Model
exports.ChatModel = ChatModel