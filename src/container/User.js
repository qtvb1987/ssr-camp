import React from 'react'
import {connect} from 'react-redux'
import {getUserInfo} from '../store/user'
import {Redirect} from 'react-router-dom'
function User(props){
  //例如登录逻辑
  //没登录跳转到首页登录，判断cookie 判断 localStorage
  return <Redirect to="/about"></Redirect>
  // return (
  //  <div>
  //    <h1>
  //        你好 {props.userinfo.name} ,你们最棒的人是{props.userinfo.best}
  //    </h1>
  //  </div> 
  //  )
}
User.loadData = (store)=>{
    return store.dispatch(getUserInfo())
}
export default connect(
   state=>({userinfo:state.user.userinfo})
   ,
//    {getIndexList}
)(User)
