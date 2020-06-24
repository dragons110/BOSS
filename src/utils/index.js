/* 
包含n个功能函数的模块
*/
/* 
封装一个获取路径的函数
用户主界面路由
laoban:/laoban
dashen:/dashen
用户完善界面路由
laoban:/laobaninfo
dashen:/dasheninfo

先判断type类型为什么  如果是dashen跳转dashen
如果是laoban跳转laoban
再判断header是否有值？ 如果有跳转用户主界面
*/
export function getRedirectTo(type, header) {
    let path
    if (type === 'dashen') {
        path = '/dashen'
    } else{
        path = '/laoban'
    }
    if (!header) {
        path += 'info'
    }
    return path
}
