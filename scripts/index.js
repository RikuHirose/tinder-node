require('dotenv').config({ path: __dirname + '/../.env' })
const facebookUserId = process.env.facebookUserId
const facebookToken = process.env.facebookToken


const {TinderClient, GENDERS, GENDER_SEARCH_OPTIONS} = require('tinder-client')
const TINDER_NUM = process.env.TINDER_NUM || 10
const face = require('./face.js')
const tinderAuth = require('./tinderAuth.js')
const tinderLogic = require('./tinderLogic.js')
const geoCording = require('./geoCording.js')
const checkJapanese = require('./checkJapanese.js')



async function diplayCommits() {
  try{
    // facebookTokenは2時間で失効する
    // const facebookToken = await tinderAuth.getAccessToken()
    // console.log(facebookToken)
    const tinder_client = await TinderClient.create({ facebookUserId, facebookToken })

    const parameters = {
      location: '浅草', // swipeしたい場所を入力(有料会員のみ)
      score: 50,
      firstMessage: 'Hi!',
      ngWord: ['ID', 'LINE', 'ladyboy'], //プロフィールのNGキーワードを指定可能
      japanese: false
    }

    let location = parameters.location
    let place = await geoCording.getLatLng(location)
    await tinder_client.temporarilyChangeLocation({ latitude: place[0], longitude: place[1] })

    // 場所を現在地に戻す
    // await tinder_client.resetTemporaryLocation()

    // 以下スワイプ
    let count = 0
    while(count < TINDER_NUM) {
      // リコメンドを取得し0人だったら終了
      let recommendations = await tinder_client.getRecommendations()

      if(recommendations.results.length === 0 || recommendations.results.length === "undifined") break

      for (var i = 0; i < recommendations.results.length; i++) {
        let user = recommendations.results[i]

        if (parameters.japanese == true) {
           if (await checkJapanese.ja2Bit(user.name) == true) {
            console.log(`${user.name}さんの顔写真を判定中....`)
           } else {
            continue
           }

        } else if (parameters.japanese == false) {
          if (await checkJapanese.ja2Bit(user.name) == false) {
            console.log(11, `${user.name}さんの顔写真を判定中....`)
          } else {
            console.log(`${user.name}さんの顔写真を判定中....`)
            continue
          }
        } else {
          console.log(`${user.name}さんの顔写真を判定中....`)
        }


        let score = await tinderLogic.getFaceScore(user, tinder_client)
        if(score === false || isNaN(score)) {
          continue

        } else {
          if(score < parameters.score) {
            continue
          } else {

            // swipe
            // send message after match
            user = await tinderLogic.checkUser(tinder_client, user, parameters.ngWord)
            if(user == false) continue

            let liked = await tinderLogic.swipe(tinder_client, user)
            let resMessage = await tinderLogic.sendMessage(tinder_client, user, liked, score, parameters.firstMessage)
            console.log(resMessage)

          }
        }
      }

      if(++count >= TINDER_NUM) break
    }

  }
  catch(err){
    console.log(err)
  }

}
diplayCommits()