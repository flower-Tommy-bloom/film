const fs = require('fs')
const puppeteer = require('puppeteer')
const { resolve } = require('path')

const base = `https://movie.douban.com/subject/`
const doubanId = '26739551'

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

  await page.goto(base + doubanId, {
    waitUntil: 'networkidle2'
  })

  await sleep(1000)

  const result = await page.evaluate(() => {
    var $ = window.$
    var it = $('.related-pic-video')
    var videoInfo = $('#link-report span').text()

    if(it && it.length > 0) {
        var link = it.attr('href')
        return {
            link,
            videoInfo
        }
    }
  })

  let video 

  if(result.link){
      await page.goto(result.link, {
        waitUntil: 'networkidle2'
      })
      await sleep(2000)
      video = await page.evaluate(() => {
          let $ = window.$
          let it = $('source')
          if(it && it.length > 0){
              return it.attr('src')
          }
          return ''
      })
  }
  const data = {
      video,
      doubanId,
      cover:result.link,
      videoInfo:result.videoInfo
  }
  browser.close()
  process.send(data)
  process.exit(0)
  // let data = JSON.stringify(result)
  // let time = new Date().getTime()
  // fs.writeFile(__dirname + '/data/' + time +'.json',data,(err,data) => {
  //   if(err) console.log(err)
  //   console.log('文件已保存',result.length+'条数据')
  // })
})()
