/* 用户注册的路由组件 */

import React, {Component} from 'react'
import { NavBar,
        WingBlank,
        List,
        InputItem,
        WhiteSpace,
        Radio,
        Button
} from 'antd-mobile'
import {connect} from 'react-redux'
import {register} from '../../redux/actions'
import {Redirect} from 'react-router-dom'

import Logo from '../../components/logo/logo'
const ListItem = List.Item

class Register extends Component{

    state = {
        username:'', //用户名
        password:'', //密码
        password2:'', //确认密码
        type:'laoban',//用户类型
    }
    register = () => {
        // console.log(this.state)
        this.props.register(this.state)
    }
    handleChange = (name, val) => {
        //更新状态
        this.setState({
            [name]:val //name变量的值
        })
    }
    toLogin = () => {
        this.props.history.replace('./Login')
    }
    render(){
        const {type} = this.state
        const {msg, redirectTo} = this.props.user
        if(redirectTo){
            return <Redirect to={redirectTo}/>
        }
        return (
            <div>
            <NavBar>BOSS&nbsp;招&nbsp;聘</NavBar>
            <Logo/>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <WingBlank>
                <List>
                    {msg ? <div className='error-msg'>{msg}</div>:null}
                    <WhiteSpace />
                    <InputItem placeholder='请输入用户名' onChange={val => {this.handleChange('username',val)}}>用户名：</InputItem>
                    <WhiteSpace />
                    <InputItem placeholder='请输入密码' type="password" onChange={val => {this.handleChange('password',val)}}>密&nbsp;&nbsp;&nbsp;码：</InputItem>
                    <WhiteSpace />
                    <InputItem placeholder='请确认密码  ' type="password" onChange={val => {this.handleChange('password2',val)}}>确认密码：</InputItem>
                    <WhiteSpace />
                    <ListItem>
                        <span>用户类型：</span>&nbsp;&nbsp;&nbsp;
                        <Radio checked={type==='dashen'} onChange={() => {this.handleChange('type', 'dashen')}}>大神</Radio>&nbsp;&nbsp;&nbsp;
                        <Radio checked={type==='laoban'} onChange={() => {this.handleChange('type', 'laoban')}}>老板</Radio>
                    </ListItem>
                    <WhiteSpace />
                    <Button type='primary'onClick={this.register}>注&nbsp;&nbsp;&nbsp;&nbsp;册</Button>
                    <WhiteSpace />
                    <Button onClick={this.toLogin}>已有账户</Button>
                </List>
            </WingBlank>
            </div>
        )
    }
}
export default connect(
    state => ({user:state.user}),
    {register}
)(Register)