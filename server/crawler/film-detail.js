const fs = require('fs')
const puppeteer = require('puppeteer')
const { resolve } = require('path')
const $ = require('jquery')
// const url = 

let url = 'https://movie.douban.com/subject/'
try{
  process.on('message', (msg) => {
    console.log('msg',msg)
    url = url + msg.doubanId
  })
}catch(err){
  process.send('没有数据',false)
  process.exit(0)
}

const sleep = time => new Promise(resolve => {
  setTimeout(resolve, time)
})

;(async () => {
  console.log('Start visit the target page')
  const browser = await puppeteer.launch({
    args: ['--no-sandbox'],
    dumpio: false
  })

  const page = await browser.newPage()

  await page.goto(url, {
    waitUntil: 'networkidle2'
  })

  await sleep(1000)

  const result = await page.evaluate(() => {
    let actors = []
    let actorsData = $('.actor .attrs span a') ? $('.actor .attrs span a') : []
    if(actorsData && actorsData.length > 0){
      actorsData.map( (index,val) => {
        actors.push(val.innerHTML)
      })
    }
    let year = $('.year') ? Number($('.year').text().replace('(','').replace(')','')) : ''
    let cover = $('.subject') ? $('.subject').find('img').attr('src') : ''
    let movieTypes = []
    if($("[property='v:genre']")){
      $("[property='v:genre']").map( v => {
        const str = $("[property='v:genre']")[v].innerHTML
        movieTypes.push(str)
      })
    }
    let filmInfo = $('#info') ? $('#info').text() : ''
    let site = ''
    let pubdate = ''
    if(filmInfo){
      const siteStart = filmInfo.indexOf('制片国家/地区') + 8
      const siteEnd = filmInfo.indexOf('语言:')
      site = filmInfo.slice(siteStart,siteEnd).replace(/(^\s*)|(\s*$)/g, "")
      const pubdateStart = filmInfo.indexOf('上映日期:') + 5
      const pubdateEnd = filmInfo.indexOf('片长:')
      pubdate = filmInfo.slice(pubdateStart,pubdateEnd).replace(/(^\s*)|(\s*$)/g, "")
    }

    let summary = $('[property="v:summary"]') ? $('[property="v:summary"]').text().replace(/(\s*)|(\s*)/g, "") : ''

    let video = $('.label-trailer .related-pic-video') ? $('.label-trailer .related-pic-video').attr('href') : ''
    let review = []
    let comments = $('#hot-comments .comment .short') ? $('#hot-comments .comment .short') : []
    if(comments && comments.length> 0){
      comments.map( v => {
        const it = comments[v].innerHTML
        review.push(it)
      })
    }
    return {
      cover,
      actors,
      movieTypes,
      site,
      summary,
      video,
      pubdate,
      year,
      review
    }
  })
  if(!result){
    process.send( url + '这条数据获取失败了',false)
    process.exit(0)
    return
  }
  // console.log(result,result.length)
  browser.close()
  process.send(result)
  process.exit(0)
  // let filmName = result.filmName
  // let time = new Date().getTime()
  // let data = JSON.stringify(result)
  // fs.writeFile(__dirname + '/data/' + filmName + time +'.json',data,(err,data) => {
  //   if(err) console.log(err)
  //   console.log('文件已保存',result.length+'条数据')
  // })
})()
