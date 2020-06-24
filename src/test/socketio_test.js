//客户端
//引入客户端io
import io from 'socket.io-client'
//连接服务器，得到socket
const socket = io('ws://localhost:4000')
//发送消息
socket.emit('sendMsg', {name: 'jit'})
console.log('客户端向服务器发送消息',{name: 'jit'})
//绑定监听，接收服务器发送的消息
socket.on('receiveMsg', function (data) {
    console.log('客户端接收到服务器发送的消息', data)
})