/* 
选择用户头像的UI组件
*/
import React, {Component} from 'react'
import { List, Grid} from 'antd-mobile'
import PropTypes from 'prop-types'
export default class HeaderSelector extends Component{

    static propTypes = {
        setHeader: PropTypes.func.isRequired
    }

    state = {
        icon: null//图片对象，默认没有
    }

    constructor(props){
        super(props)
        //准备要显示的列表数据
        this.headerList = []
        for(let i = 0; i < 20; i++){
            this.headerList.push({
                text:'头像'+ (i+1),
                icon:require(`../../assets/imgs/头像${i+1}.png`)//相对路径，使用require获取动态信息
            })
        }
    }
    handleClick = ({text, icon}) => {
        //更新当前组件状态
        this.setState({icon})
        //调用函数更新父组件状态
        this.props.setHeader(text)
    
    }
    render(){
        const {icon} = this.state
        const listHeader = icon ? <p>已选择头像：<img src={icon} alt='header'/></p> : '请选择头像：'
        return (
            <div>
            <List renderHeader={() => listHeader}></List>
            <Grid data={this.headerList} columnNum='5' onClick={this.handleClick} />
            </div>
        )
    }
}