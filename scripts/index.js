require('dotenv').config({ path: __dirname + '/../.env' })
const axios = require('axios')
const fs = require('fs')
const facebookUserId = process.env.facebookUserId
const facebookToken = process.env.facebookToken


const {TinderClient, GENDERS, GENDER_SEARCH_OPTIONS} = require('tinder-client')
const TINDER_NUM = process.env.TINDER_NUM || 2
const face = require('./face.js')
const tinderAuth = require('./tinderAuth.js')
const autoSwipe = require('./autoSwipe.js')



async function diplayCommits() {
  try{
    // const facebookToken = await tinderAuth.getAccessToken()
    // console.log(facebookToken)
    const tinder_client = await TinderClient.create({ facebookUserId, facebookToken })

     // tinderユーザー設定更新
    // const user_info = await tinder_client.updateProfile({
    //   userGender: GENDERS.male,
    //   searchPreferences: {
    //     maximumAge: 25,
    //     minimumAge: 18,
    //     genderPreference: GENDER_SEARCH_OPTIONS.female,
    //     maximumRangeInKilometers: 30
    //   }
    // })

    // 以下スワイプ
    let count = 0
    while(count < TINDER_NUM) {
      // リコメンドを取得し0人だったら終了
      let recommendations = await tinder_client.getRecommendations()
      console.log(recommendations.results.length)

      // if(recommendations.results.length === 0) break

      for (var i = 0; i < recommendations.results.length; i++) {
        let girl = recommendations.results[i]

        // score return
        let score = await autoSwipe.getFaceScore(girl, tinder_client)
        if(score == false || score == NaN) {
          console.log(1)
          continue

        } else {
          // swipe
          // send message after match
          console.log(score)
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