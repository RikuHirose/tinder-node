require('dotenv').config({ path: __dirname + '/../.env' })
const puppeteer = require('puppeteer')


const FB_AUTHENTICATION_URL = 'https://www.facebook.com/login.php?skip_api_login=1&api_key=464891386855067&signed_next=1&next=https%3A%2F%2Fwww.facebook.com%2Fv2.8%2Fdialog%2Foauth%3Fchannel%3Dhttps%253A%252F%252Fstaticxx.facebook.com%252Fconnect%252Fxd_arbiter%252Fr%252Fvy-MhgbfL4v.js%253Fversion%253D44%2523cb%253Df1614040967587c%2526domain%253Dtinder.com%2526origin%253Dhttps%25253A%25252F%25252Ftinder.com%25252Ff2fa6ec000aaa38%2526relation%253Dopener%26redirect_uri%3Dhttps%253A%252F%252Fstaticxx.facebook.com%252Fconnect%252Fxd_arbiter%252Fr%252Fvy-MhgbfL4v.js%253Fversion%253D44%2523cb%253Df2a51d5381fef2%2526domain%253Dtinder.com%2526origin%253Dhttps%25253A%25252F%25252Ftinder.com%25252Ff2fa6ec000aaa38%2526relation%253Dopener%2526frame%253Df38f674561539b4%26display%3Dpopup%26scope%3Duser_birthday%252Cuser_photos%252Cemail%252Cuser_friends%252Cuser_likes%26response_type%3Dtoken%252Csigned_request%26domain%3Dtinder.com%26origin%3D1%26client_id%3D464891386855067%26ret%3Dlogin%26sdk%3Djoey%26fallback_redirect_uri%3Dhttps%253A%252F%252Ftinder.com%252F%26logger_id%3D669dac3b-8f9a-9410-a34f-066ca9cf7f17&cancel_url=https%3A%2F%2Fstaticxx.facebook.com%2Fconnect%2Fxd_arbiter%2Fr%2Fvy-MhgbfL4v.js%3Fversion%3D44%23cb%3Df2a51d5381fef2%26domain%3Dtinder.com%26origin%3Dhttps%253A%252F%252Ftinder.com%252Ff2fa6ec000aaa38%26relation%3Dopener%26frame%3Df38f674561539b4%26error%3Daccess_denied%26error_code%3D200%26error_description%3DPermissions%2Berror%26error_reason%3Duser_denied%26e2e%3D%257B%257D&display=popup&locale=ja_JP&logger_id=669dac3b-8f9a-9410-a34f-066ca9cf7f17'

async function diplayCommits() {
  try{
    await tinderLogin(FB_AUTHENTICATION_URL)

  }
  catch(err){
    console.log(err)
  }

}
diplayCommits()

function tinderLogin(FB_AUTHENTICATION_URL) {
  return new Promise(async (resolve, reject) => {
    const params = process.env.CI ? {args: ['--no-sandbox', '--disable-setuid-sandbox']} : {headless: false, slowMo: 10}
    const browser = await puppeteer.launch(params)
    const page = await browser.newPage()

    try {

      // await page.goto('chrome://settings/content/location')
      // await page.waitForSelector('#knob',  {visible: true})
      // await page.click('#knob')

      await page.goto(FB_AUTHENTICATION_URL)
      await page.waitForSelector('#email')
      await page.type('#email', process.env.fbEmail)
      await page.type('#pass', process.env.fbPassword)
      await page.click('#loginbutton')

      await page.goto('https://tinder.com/')
      await page.waitForSelector('._facebookButton',  {visible: true})
      await page.click('._facebookButton')
      await page.waitForSelector('.button--primary-shadow',  {visible: true})
      await page.click('.button--primary-shadow')


      // await browser.close()

    } catch(e) {
      console.log(e)
      reject(new Error('Puppeteer browsing error in login phase'))
    }



  })
}