import React, {Component} from 'react'
import {connect} from 'react-redux'
import {NavBar, List, InputItem, Grid, Icon} from 'antd-mobile'
import {sendMsg, readMsg} from '../../redux/actions'
import QueueAnim from 'rc-queue-anim'

const Item = List.Item

class Chat extends Component{
    state = {
        content:'',
        isShow: false//是否显示表情列表
    }
    //在第一次render（）之前回调
    componentWillMount(){
        //初始化表情列表数据
        const emojis = ['😀','😃','😄','😁','😆','😅','😀','😃','😄',
                        '🙈','🙉','😅','😀','😃','😄','😁','😆','😅',
                        '😀','😃','😄','😂','😆','😅','😀','😃','😄',
                        '😁','😆','😅','😀','😃','😄','😁','😆','😅']
        this.emojis = emojis.map(emoji => ({text: emoji}))
    }
    componentDidMount() {
        // 初始显示列表
        window.scrollTo(0, document.body.scrollHeight) 
    }

    componentDidUpdate () {
         // 更新显示列表 
        window.scrollTo(0, document.body.scrollHeight) }

    componentWillUnmount () {
         //发送请求更新消息的未读状态
         const from = this.props.match.params.userid
         const to = this.props.user._id
         this.props.readMsg(from, to)
    }

    toggleShow = () => {
        const isShow = !this.state.isShow
        this.setState({isShow})
        if(isShow){
            // 异步手动派发 resize 事件,解决表情列表显示的 bug
            setTimeout(() => {
                window.dispatchEvent(new Event('resize'))
            },0)
        }
    }

    handleSend = () => {
        //收集数据
        const from = this.props.user._id
        const to = this.props.match.params.userid
        const content = this.state.content.trim()
        //发送请求（发消息）
        if(content){
            this.props.sendMsg({from, to, content})
        }
        //发送完成后，清除输入数据
        this.setState({
            content: '',
            isShow: false
    })
    }
    render(){
        const {user} = this.props
        const {users, chatMsgs} = this.props.chat

        //计算当前的chatID
        const meId = user._id
        //如果还没有获取数据，直接不做任何显示
        if(!users[meId]){
            return null
        }
        const targetId = this.props.match.params.userid
        const chatId = [meId, targetId].sort().join('_')

        //对chatMsg进行过滤
        const msgs = chatMsgs.filter(msg => msg.chat_id === chatId)
        //得到目标对象的头像header

        const targetHeader = users[targetId].header
        const tartgetId = targetHeader ? require(`../../assets/imgs/${targetHeader}.png`) : null
        return (
            <div id='chat-page'>
                <NavBar 
                    icon={<Icon type='left'/>}
                    className='fix-header'
                    onLeftClick={() => this.props.history.goBack()}
                >
                    {users[targetId].username}
                </NavBar>
                <List style={{marginTop:50, marginBottom:50}}>
                    <QueueAnim type='left'>
                    {
                        msgs.map(msg => {
                            if(meId===msg.to){//对方发送给我的消息
                                return (
                                <Item key={msg._id} thumb={tartgetId}>{msg.content}</Item>
                                )
                            }else{ //我发给对方的消息
                                return (
                                <Item key={msg._id} className='chat-me' extra='我'>{msg.content}</Item>
                                )
                            }
                        })
                    }
                    </QueueAnim>
                    
                </List>
                <div className='am-tab-bar' >
                    <InputItem placeholder="请输入" 
                    value={this.state.content}  
                    onChange={val => this.setState({content: val})}
                    onFocus={() => this.setState({isShow: false})}
                    extra={
                        <span>
                            <span onClick={this.toggleShow} style={{marginRight: 5}}>😀</span>
                            <span onClick={this.handleSend} >发送</span>
                        </span>
                    }/>
                    {this.state.isShow ? (<Grid 
                        data={this.emojis}
                        columnNum={8}
                        carouselMaxRow={4}
                        isCarousel={true}
                        onClick={(item) => {
                            this.setState({content: this.state.content + item.text})
                        }}
                    />) : null}
                </div>
            </div>
        )
    }
}
export default connect(
    state => ({user: state.user, chat: state.chat}),
    {sendMsg, readMsg}
)(Chat)