//这里的node代码。会用babel处理
import React from 'react'
import {renderToString} from 'react-dom/server'
import express from 'express'
import {StaticRouter,matchPath,Route, Switch} from 'react-router-dom'
import {Provider} from 'react-redux'
import routes from '../src/App'
import {getServerStore} from '../src/store/store'
import Header from '../src/component/Header'
import proxy from 'http-proxy-middleware';
const store = getServerStore()
const app = express()
app.use(express.static('public'))
// 客户端来的api开头的请求
app.use(
  '/api',
  proxy({ target: 'http://localhost:9090/', changeOrigin: true })
);
 
app.get('*',(req,res)=>{
    // const Page = <App title="react ssr"></App>
    
    //获取根据路由渲染出的组件，并且拿到loadDatay方法,获取数据
    // if(req.url.startsWith('/api/')){
    //   //不渲染页面，使用axios转发 axios.get
    // }

    //存储网络请求
    const promises = [];
    routes.some(route =>{
      const match = matchPath(req.path,route);
      if(match) //promises.push(route.loadData(match));
      {
        const {loadData}= route.component
        if(loadData){

          //包装后
          //规避报错 可以考虑加日志
          // const promise = new Promise((resolve,reject)=>{
          //   loadData(store).then(resolve).catch(resolve)
          // })
          // promises.push(promise)

          promises.push(loadData(store))
        }
      }
      // return match;
    });
    //等待所有网络请求结束再渲染
    //理解和使用Promise.all和Promise.race
    //https://developer.mozilla.org/zh-CN/docs/web/JavaScript/Reference/Global_Objects/Promise/allSettled
    Promise.allSettled(promises).then(()=>{
      const context = {}
      //把react组件，解析成thml
      const content = renderToString(
        <Provider store={store}>
        <StaticRouter location={req.url} context={context}>
          <Header></Header>
          <Switch>
          {routes.map(route=><Route {...route}></Route>)}
          </Switch>
         
        </StaticRouter>
        </Provider>
      )
      console.log(context)
      if(context.statuscode){
        //状态的切换和页面跳转
        res.status(context.statuscode)
      }
      if(context.action =="REPLACE"){
        res.redirect(301,context.url)
      }

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