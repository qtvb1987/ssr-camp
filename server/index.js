//这里的node代码。会用babel处理
import React from 'react'
import {renderToString} from 'react-dom/server'
import express from 'express'
import {StaticRouter,matchPath,Route} from 'react-router-dom'
import {Provider} from 'react-redux'
import routes from '../src/App'
import {getServerStore} from '../src/store/store'
import Header from '../src/component/Header'
const store = getServerStore()
const app = express()
app.use(express.static('public'))
app.get('*',(req,res)=>{
    // const Page = <App title="react ssr"></App>
    
    //获取根据路由渲染出的组件，并且拿到loadDatay方法,获取数据
    
    //存储网络请求
    const promises = [];
    routes.some(route =>{
      const match = matchPath(req.path,route);
      if(match) //promises.push(route.loadData(match));
      {
        const {loadData}= route.component
        if(loadData){
          promises.push(loadData(store))
        }
      }
      // return match;
    });
    //等待所有网络请求结束再渲染

    Promise.all(promises).then(()=>{
      //把react组件，解析成thml
      const content = renderToString(
        <Provider store={store}>
        <StaticRouter location={req.url}>
          <Header></Header>
          {routes.map(route=><Route {...route}></Route>)}
        </StaticRouter>
        </Provider>
      )

      //字符串模板
      res.send(`
      <html>
      <head>
      <meta charset="utf-8"/>
      <title>react ssr test</title>
      </head>
      <body>
        <div id="root">${content}</div>
        <script>
        window.__context=${JSON.stringify(store.getState())}
        </script>
        <script src="/bundle.js"></script>
      </body>
      </html>
      `)
    }).catch(()=>{
      res.send('报错了')
    })

    // //把react 组件，解析成html
    // const content = renderToString(
    //   <Provider store={store}>
    //   <StaticRouter location={req.url}>
    //    {App}
    //   </StaticRouter>
    //   </Provider>
    // )
    
})

app.listen(9038,()=>{
    console.log('监听完毕')
})