//服务器端
const {ChatModel} = require('../db/models')
module.exports = function (server) {
    //产生io
    const io = require('socket.io')(server)
    //监视浏览器与服务器的连接
    io.on('connection', function (socket) {
        console.log('有一个浏览器连接上了服务器')
    //绑定监听，接收客户端发送的消息
    socket.on('sendMsg', function ({from, to, content}) {
        console.log('服务器接收到了浏览器的消息', {from, to, content})
        //处理数据（保存消息）
        //准备chatMsg对象相关数据
        const chat_id = [from, to].sort().join('_')//from_to or to_from
        const creat_time = Date.now()
        new ChatModel({from, to, content, chat_id, creat_time}).save(function (error, chatMsg) {
            //向所有连接上的客户端发消息
            io.emit('receiveMsg', chatMsg)
        })
    })
  })
}
