//模拟接口
const express = require('express')

const app = express()

app.get('/api/course/list',(req,res)=>{
    //支持跨域
    res.header('Access-Control-Allow-Origin','*')
    res.header('Access-Control-Allow-Methods','GET,POST,PUT,DELETE')
    res.header('Content-Type','application/json;charset=utf-8') 
    res.json({
        code:0,
        list:[
            {name:'web开发',id:1},
            {name:'php开发',id:2},
            {name:'java开发',id:3},
            {name:'.net开发',id:4},
            {name:'js开发',id:5}
        ]
    })
})

app.listen(9090,()=>{
    console.log('mock接口服务启动完毕')
})