import React, {Component} from 'react'
import {TabBar} from 'antd-mobile'
import PropTypes from 'prop-types'
import {withRouter} from 'react-router-dom'

const Item = TabBar.Item
 class NavFooter extends Component{

    static propTypes = {
        navList: PropTypes.array.isRequired,
        unReadCount: PropTypes.number.isRequired
    }

    render(){
        let {navList, unReadCount} = this.props
        //过滤掉hide为true的navList
        navList = navList.filter(nav => (!nav.hide))//数组的filter过滤方法
        const path = this.props.location.pathname
        return (
               <TabBar>
                   {
                       navList.map((nav) => (
                        <Item key={nav.path} 
                              badge={nav.path === '/message' ? unReadCount : 0}
                              title={nav.text}
                              icon={{uri:require(`./imgs/${nav.icon}.png`)}}
                              selectedIcon={{uri:require(`./imgs/${nav.icon}-selected.png`)}}
                              selected={path===nav.path}
                              onPress={() => this.props.history.replace(nav.path)}/>

                       ))
                   }
               </TabBar>
        )
    }
}
export default withRouter(NavFooter)
