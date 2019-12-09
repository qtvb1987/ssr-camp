import React,{useState} from 'react'

function App(props){
    const [count,setCount] = useState(0)
   return (
   <div>
    <h1>hello {props.title} --- {count}</h1>
    <button onClick={()=>setCount(count+1)}>点击我</button>
   </div> 
   )
}

export default <App title="react ssr"></App>