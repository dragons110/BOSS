/* 用户个人中心路由组件 */
import React, {Component} from 'react'
import {connect} from 'react-redux'
import {Result, List, Button, WhiteSpace, Modal} from 'antd-mobile'
import Cookies from 'js-cookie'
import {resetUser} from '../../redux/actions'

const Item = List.Item
const Brief = Item.Brief

class Personal extends Component{
    handleOut = () => {
        Modal.alert('退出','确认退出登录吗?',[
            {
                text:'取消',
                onPress: () => console.log('cancel')
            },
            {
                text:'确认',
                onPress: () => {
                    //删除cookies中的userid
                    Cookies.remove('userid')
                    //删除redux管理user
                    this.props.resetUser()
                }
            }
        ])
    }
    render(){
        const {username, info, company, header, post, salary} = this.props.user
        return (
            <div style={{marginBottom:50, marginTop:45}}>
                <Result img={<img src={require(`../../assets/imgs/${header}.png`)} alt='header'/>}
                style={{width: 380}} alt='header'
                title={username}
                message={company}/>
                <List renderHeader={() => '相关信息'}>
                    <Item multipleLine>
                        <Brief>职位：{post}</Brief>
                        <Brief>简介：{info}</Brief>
                        {salary ? <Brief>薪资：{salary}</Brief> : null}
                    </Item>
                </List>
                <WhiteSpace />
                <List>
                    <Button type='warning' onClick={this.handleOut}>退出登录</Button>
                </List>
                
            </div>
        )
    }
}
export default connect(
    state => ({user: state.user}),
    {resetUser}
)(Personal)