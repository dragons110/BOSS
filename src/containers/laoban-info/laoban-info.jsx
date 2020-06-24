/* 
老板完善界面路由容器组件
*/
import React, {Component} from 'react'
import {connect} from 'react-redux'
import { NavBar, TextareaItem, Button, InputItem} from 'antd-mobile'
import {Redirect} from 'react-router-dom'

import HerderSelector from '../../components/header-selector/header-selector'
import {updateUser} from '../../redux/actions'

class LaobanInfo extends Component{

    state = {
        info:'',
        header:'',
        post:'',
        salary:'',
        company:'',
    }

    setHeader = (header) => {
        this.setState({header})
    }

    handleChange = (name, value) => {
        this.setState({
            [name]: value
        })
    }
    save = () => {
        this.props.updateUser(this.state)
    }

    render(){

        //如果信息已经完善，自动从定向到主界面
        const {header, type} = this.props.user
        if (header) {//message already complete
            const path = type === 'dashen' ? '/dashen' : '/laoban'
            return <Redirect to={path}/>
        }
        return (
            <div>
            <NavBar>老板信息完善</NavBar>
            <HerderSelector setHeader={this.setHeader}/>
                <InputItem placeholder='请输出招聘职位' onChange={val => {this.handleChange('post',val)}}>招聘职位：</InputItem>
                <InputItem placeholder='请输出公司名称' onChange={val => {this.handleChange('company',val)}}>公司名称：</InputItem>
                <InputItem placeholder='请输出职位薪资' onChange={val => {this.handleChange('salary',val)}}>职位薪资：</InputItem>
                <TextareaItem title="职位要求:" rows={3} placeholder='请输出职位要求'  onChange={val => {this.handleChange('info',val)}}/>
                <Button type='primary' onClick={this.save}>提&nbsp;&nbsp;&nbsp;交</Button>
            </div>
        )
    }
}

export default connect(
    state => ({user: state.user}),
    {updateUser}
)(LaobanInfo)