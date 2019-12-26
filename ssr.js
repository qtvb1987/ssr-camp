
const express = require('express')
const puppeteer =require('puppeteer')
// /api开头
const axios = require('axios')
const app = express()

async function test(){
    console.log('截图')
    const browser = await puppeteer.launch()
    const page = await browser.newPage()
    await page.goto('https://www.baidu.com')
    await page.screenshot({path:'baidu.png'})
    await browser.close()
}

//test()
const urlCache = {}
app.get('*',async function(req,res){
    console.log(req.url)
    //1,加缓存
    //2，lru缓存算法
    if(urlCache[url]){
        return res.send(urlCache[url])
    }
    if(req.url=='/favicon.ico'){
        //对seo无影响
        return   res.send({code:0})
    }
    const url='http://localhost:9038/'+req.url
    const browser = await puppeteer.launch()
    const page = await browser.newPage()
    await page.goto(url,{
        waitUntil:['networkidle0']
    }) 
   
    const html = await page.content()
    urlCache[url]=html
    console.log(html)
    res.send(html)
})
app.listen(9091,()=>{
    console.log('ssr server start')
})