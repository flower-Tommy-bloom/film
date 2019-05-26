const fs = require('fs')
const puppeteer = require('puppeteer')
// const $ = require('jquery')
const { resolve } = require('path')

const url = `https://movie.douban.com/explore#!type=movie&tag=豆瓣高分&sort=time&page_limit=20&page_start=20`

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

  await sleep(3000)

  await page.waitForSelector('.more')

  let _a = 23
  for (let i = 0; i < _a; i++) {
    await sleep(3000)
    try {
      await page.click('.more')
    }
    catch(err) {
      _a = -1
      console.log(i,err)
    }
  }

  const result = await page.evaluate(() => {
    var $ = window.$
    var items = $('.list-wp .list a')
    var links = []

    if (items.length >= 1) {
      items.each((index, item) => {
        let it = $(item)
        let doubanId = it.find('div').data('id')
        let title = it.find('img').attr('alt')
        let rate = it.find('strong') ? it.find('strong').text() : ''
        // let rate = Number(it.find('strong').text())
        // let poster = it.find('img').attr('src').replace('s_ratio_poster', 'l_ratio_poster')
        let poster = it.find('img') ? it.find('img').attr('src').replace('s_ratio_poster', 'l_ratio_poster') : ''
        let detailLink = it.attr('href')
        links.push({
          doubanId,
          title,
          rate,
          poster,
          detailLink
        })
      })
    }

    return links
  })

  browser.close()
  process.send({result})
  process.exit(result.length)
  // let data = JSON.stringify(result)
  // let time = new Date().getTime()
  // fs.writeFile(__dirname + '/data/' + time +'.json',data,(err,data) => {
  //   if(err) console.log(err)
  //   console.log('文件已保存',result.length+'条数据')
  // })
})()
