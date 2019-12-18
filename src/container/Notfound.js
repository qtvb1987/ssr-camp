import React from 'react'
import {Route} from 'react-router-dom'

function Status({code,children}){
  return <Route render={({staticContext})=>{
      if(staticContext){
          staticContext.statuscode=code
      }
      return children
  }}></Route>
}

function Notfound(props){
      console.log('notfound',props)
    return(
        <Status code={404}>
            <h1>不好意思，网站崩了！</h1>
            <img id="img-404" src="/404.jpg" alt="404"/>
        </Status>
    )
}
export default Notfound