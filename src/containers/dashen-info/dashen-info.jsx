/* 
大神完善界面路由容器组件
*/
import React, {Component} from 'react'
import {connect} from 'react-redux'
import { NavBar, TextareaItem, Button, InputItem} from 'antd-mobile'
import {Redirect} from 'react-router-dom'

import HerderSelector from '../../components/header-selector/header-selector'
import {updateUser} from '../../redux/actions'

class DashenInfo extends Component{
    state = {
        info:'',
        post:''
    }
    handleChange = (name, value) => {
        this.setState({[name]: value})
    }
    setHeader = (header) => {
        this.setState({header})
    }
    save = () => {
        this.props.updateUser(this.state)
    }
    render(){
        const {header, type} = this.props.user
        if (header) {//message already complete
            const path = type === 'dashen' ? '/dashen' : '/laoban'
            return <Redirect to={path}/>
        }
        return (
            <div>
            <NavBar>大神信息完善</NavBar>
            <HerderSelector  setHeader={this.setHeader}/>
                <InputItem placeholder = '请输入求职岗位' onChange={(v) => {this.handleChange('post',v)}}>求职岗位：</InputItem>
                <TextareaItem title="个人介绍:" rows={3} placeholder='请输出个人介绍' onChange={(v) => {this.handleChange('info',v)}}/>
                <Button type='primary'onClick={this.save}>提&nbsp;&nbsp;&nbsp;交</Button>
            </div>
        )
    }
}

export default connect(
    state => ({user: state.user}),
    {updateUser}
)(DashenInfo)