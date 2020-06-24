/* 消息的主路由组件 */
import React, {Component} from 'react'
import {connect} from 'react-redux'

import {List, Badge} from 'antd-mobile'

const Item = List.Item
const Brief = Item.Brief

/* 得到所有聊天的最后msg组成的数组 
[msg1, msg2, msg3]*/
//1.使用{}进行分组（chat_id），只保存每个组最后一条msg：{chat_id1:lastMsg1, chat_id2:lastMsg2}
//2.得到所有分组的lastMsg组成数组：Object.values(lastMsgsObj)
//3.对数组进行排序（creat_time， 降序）

function getLastMsgs (chatMsgs, userid) {
    //1.使用{}进行分组（chat_id），只保存每个组最后一条msg：{chat_id1:lastMsg1, chat_id2:lastMsg2}
    const lastMsgObjs = {}
    chatMsgs.forEach(msg => {

    //对msg个体进行统计
    if(msg.to === userid && !msg.read){
        msg.unReadCount = 1
    }else{
        msg.unReadCount = 0
    }
        //判断当前msg对应的lastMsg是否存在
        //取出msg的聊天id
        const chatId = msg.chat_id
        //获取当前已保存的当前组件的lastMsg
        const lastMsg = lastMsgObjs[chatId]
        
        if(!lastMsg) {//不存在
            //msg就是lastMsg
            lastMsgObjs[chatId] = msg
        }else{//存在
            //累计unReadCount=已经统计的 + 当前msg的
            const unReadCount = lastMsg.unReadCount + msg.unReadCount
            //判断msg和lastMsg的发送时间，如果msg晚，就将msg保存为lastMsg
            if (msg.creat_time > lastMsg.creat_time) {
                lastMsgObjs[chatId] = msg
            }
            //将unReadCount并保存在最新的lastMsg上
            lastMsgObjs[chatId].unReadCount = unReadCount
        }
    })
    //2.得到所有分组的lastMsg组成数组：Object.values(lastMsgsObj)
    const lastMsgs = Object.values(lastMsgObjs)
    //3.对数组进行排序（creat_time， 降序）
    lastMsgs.sort(function (m1, m2) {//结果<0,降序；=0不变；>0升序
        return m2.creat_time-m1.creat_time
    })
    return lastMsgs
}

class Message extends Component{

    render(){
        //得到props中的user和chat
        const {user} = this.props
        //得到当前用户id
        //得到所有用户的集合对象users和所有聊天的数组
        const {users, chatMsgs} = this.props.chat
        //得到所有聊天的最后消息的数组
        const lastMsgs = getLastMsgs(chatMsgs, user._id)


        return(
             <List style={{marginBottom:50, marginTop:50}}>
                {
                    lastMsgs.map(msg => {
                    //得到目标用户id
                    const targetUserId = msg.to === user._id ? msg.from : msg.to
                    const targetUser = users[targetUserId]
                    return (
                      <Item 
                        key={msg._id}
                        extra={<Badge text={msg.unReadCount}/>}
                        thumb={targetUser.header ? require(`../../assets/imgs/${targetUser.header}.png`) : null}
                        arrow='horizontal'
                        onClick={() => this.props.history.push(`./chat/${targetUserId}`)}
                      >
                        {msg.content}
                        <Brief>{targetUser.username}</Brief>
                    </Item>
                )
            })
          }
        </List>
        )
    }
}

export default connect(
    state => ({
        user: state.user,
        chat: state.chat
    })
)(Message)