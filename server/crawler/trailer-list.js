const fs = require('fs')
const puppeteer = require('puppeteer')
const { resolve } = require('path')

const url = `https://movie.douban.com/tag/#/?sort=S&range=0,10&tags=电影`

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

  await page.waitForSelector('.more')

  let _a = 100
  for (let i = 0; i < _a; i++) {
    await sleep(1000)
    try {
      await page.click('.more')
    }
    catch(err) {
      _a = 1
      console.log(i,err)
    }
  }

  const result = await page.evaluate(() => {
    var $ = window.$
    var items = $('.list-wp a')
    var links = []

    if (items.length >= 1) {
      items.each((index, item) => {
        let it = $(item)
        let doubanId = it.find('div').data('id')
        let title = it.find('.title').text()
        let rate = Number(it.find('.rate').text())
        let poster = it.find('img').attr('src').replace('s_ratio', 'l_ratio')

        links.push({
          doubanId,
          title,
          rate,
          poster
        })
      })
    }

    return links
  })

  browser.close()
  process.send({result})
  process.exit(0)
  // let data = JSON.stringify(result)
  // let time = new Date().getTime()
  // fs.writeFile(__dirname + '/data/' + time +'.json',data,(err,data) => {
  //   if(err) console.log(err)
  //   console.log('文件已保存',result.length+'条数据')
  // })
})()
