
    //启动socket.io的函数
    module.exports = function (sever) {
    // 引入操作 chats 集合数据的 Model
    const ChatModel = require('../db/models').ChatModel
    // 得到操作服务器端 sokectIO 的 io 对象
    const io = require('socket.io')(sever)
    //绑定监听回调：客户端连接上服务器
    io.on('connection', function (socket) { //socket代表连接
        console.log('有客户端连接上了服务器')
        // 绑定 sendMsg 监听, 接收客户端发送的消息
    io.on('connection', function (from, to, content) {
        console.log('服务器接收到数据', {from, to, content})
        //将接收到的数据保存
            const chat_id = [from, to].sort().join('_')
            const create_time = Date.now()
            const chatModel = new ChatModel({chat_id, from, to, create_time, content})
            chatModel.save(function (err, chatMsgs) {
            // 保存完成后, 向所有连接的客户端发送消息
            io.emit('receiveMessage', chatMsg) // 全局发送, 所有连接的客户端都可以收到
            console.log('向所有连接的客户端发送消息', chatMsgs)
            })
        })
    })
}




