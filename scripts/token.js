require('dotenv').config({ path: __dirname + '/../.env' })
const puppeteer = require('puppeteer')
const FB_AUTHENTICATION_URL = 'https://www.facebook.com/dialog/oauth?client_id=464891386855067&redirect_uri=fb464891386855067://authorize/&&scope=user_birthday,user_photos,user_education_history,email,user_relationship_details,user_friends,user_work_history,user_likes&response_type=token'


async function diplayCommits() {
  try{
    const token = await getAccessToken()
    console.log(token)

  }
  catch(err){
    console.log(err)
  }

}
diplayCommits()



function getAccessToken() {
  return new Promise(async (resolve, reject) => {
    // headless chrome起動 & セットアップ
    const params = process.env.CI ? {args: ['--no-sandbox', '--disable-setuid-sandbox']} : {headless: true, slowMo: 10}
    const browser = await puppeteer.launch(params)
    const page = await browser.newPage()

    // facebook login
    try {
      await page.goto(FB_AUTHENTICATION_URL)
      await page.waitForSelector('#email')
      await page.type('#email', process.env.fbEmail)
      await page.type('#pass', process.env.fbPassword)
      await page.click('#loginbutton')
      await page.waitForSelector('button[name="__CONFIRM__"]')
    } catch(e) {
      console.log(e)
      reject(new Error('Puppeteer browsing error in login phase'))
    }

    // AccessTokenのレスポンスをリッスン
    page.on('response', async response => {
      const urlRegex = /\/v[0-9]\.[0-9]\/dialog\/oauth\/(confirm|read)/
      if (response.url().match(urlRegex)) {
        try {
          const body = await response.text()
          const [, token] = body.match(/access_token=(.+?)&/)

          await browser.close()
          resolve(token)
        } catch(e) {
          console.log(e)
          reject(new Error('Puppeteer browsing error in confirm response phase'))
        }
      }
    })

    // ログイン成功すれば確認ダイアログのOKをクリック
    try {
      await page.click('body')
      await page.click('button[name="__CONFIRM__"]')
    } catch(e) {
      console.log(e)
      reject(new Error('Failure to login'))
    }
  })
}


