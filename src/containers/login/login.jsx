/* 
    用户登录的路由组件 
*/
import React, {Component} from 'react'
import { NavBar,
        WingBlank,
        List,
        InputItem,
        WhiteSpace,
        Button
} from 'antd-mobile'
import {connect} from 'react-redux'
import {login} from '../../redux/actions'
import {Redirect} from 'react-router-dom'

import Logo from '../../components/logo/logo'

class Login extends Component{

    state = {
        username:'', //用户名
        password:'', //密码
    }

    login = () => {
        // console.log(this.state)
        this.props.login(this.state)

    }
    handleChange = (name, val) => {
        
        //更新状态
        this.setState({
            [name]:val //name变量的值
        })
    }
    toRegister = () => {
        this.props.history.replace('./Register')
    }
    

    render(){
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
                    <Button type='primary'onClick={this.login}>登&nbsp;&nbsp;&nbsp;&nbsp;陆</Button>
                    <WhiteSpace />
                    <Button onClick={this.toRegister}>注册账户</Button>
                </List>
            </WingBlank>
            </div>
        )
    }
}
export default connect(
    state => ({user:state.user}),
    {login}
)(Login)