/* 应用主界面路由组件 */

import React, {Component} from 'react'
import {Switch, Route, Redirect} from 'react-router-dom'
// import Cookies from 'js-cookies'
import {connect} from 'react-redux'


import DashenInfo from '../dashen-info/dashen-info'
import LaobanInfo from '../laoban-info/laoban-info'
import Dashen from '../dashen/dashen'
import Laoban from '../laoban/laoban'
import Personal from '../personal/personal'
import Message from '../message/message'
import NotFound from '../../components/not-found/not-found'
import { NavBar } from 'antd-mobile'
import NavFooter from '../../components/nav-footer/navfooter'
import Chat from '../chat/chat'

class Main extends Component{
    navList = [
        {
        path:'/laoban',
        component:Laoban,
        title:'大神列表',
        icon:'dashen',
        text:'大神'
    },
    {
        path:'/dashen',
        component:Dashen,
        title:'老板列表',
        icon:'laoban',
        text:'老板'
    },
    {
        path:'/message',
        component:Message,
        title:'消息列表',
        icon:'message',
        text:'消息'
    },
    {
        path:'/personal',
        component:Personal,
        title:'个人列表',
        icon:'personal',
        text:'个人'
    }
]
    render(){
        //如果浏览器没有userid的cookie  直接跳转到login
        /* const userid = Cookies.get('userid')
        if (!userid) {
            this.props.history.replace('/login')
            return null
        } */
    const {user, unReadCount} = this.props
    if(!user._id){
        return <Redirect to ='/login'/>
    }
    const {navList} = this//把navList取出来
    const path = this.props.location.pathname//指定路径
    const currentNav = navList.find(nav => nav.path===path)//得到当前的nav，可能没有

    if(currentNav){
        //判断隐藏哪个数组
        if(user.type==='laoban'){
            //隐藏数组第二个
            navList[1].hide = true
        }else{
            //隐藏数组第一个
            navList[0].hide = true
        }
    }


        return (
            <div>
                {currentNav ? <NavBar className='fix-header'>{currentNav.title}</NavBar> : null}
                <Switch>
                    {
                      navList.map(nav => <Route path={nav.path} component={nav.component} />)
                    }
                    <Route path='/laobaninfo' component={LaobanInfo} />
                    <Route path='/dasheninfo' component={DashenInfo} />
                    <Route path='/chat/:userid' component={Chat} />
                    <Route compontent={NotFound} />
                </Switch>
                {currentNav ? <NavFooter navList={navList} unReadCount={unReadCount}/> : null}
            </div>
        )
    }
}
export default connect(
    state => ({user: state.user, unReadCount: state.chat.unReadCount})
)(Main)
/* 
1.自动登录
    1.如果cookie中有userid，自动发送请求获取对应的user
    2.如果cookie中没有userid，跳转到login界面
2.如果已经登录，如果请求根路径
  根据user的两个值，type和user来计算一个从定向的路由路径，并自动从定向。
*/