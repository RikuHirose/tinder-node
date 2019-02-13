require('dotenv').config({ path: __dirname + '/../.env' })
const facebookUserId = process.env.facebookUserId
const facebookToken = process.env.facebookToken


const {TinderClient, GENDERS, GENDER_SEARCH_OPTIONS} = require('tinder-client')
const TINDER_NUM = process.env.TINDER_NUM || 1
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

      if(recommendations.results.length === 0) break

      for (var i = 0; i < recommendations.results.length; i++) {
        let girl = recommendations.results[i]

        console.log(`${girl.name}さんの顔写真を判定中....`)
        // score return
        let score = await autoSwipe.getFaceScore(girl, tinder_client)
        if(score == false || score == NaN) {
          continue

        } else {
          // swipe
          // send message after match
          if(score > 60) {
            let liked = await tinder_client.like(girl._id)

            // matchしたらmessageを送る
            if(liked.match != false) {
              const sendMessage = await tinder_client.messageMatch({ matchId: liked.match._id, message: 'Hi!' });
              console.log(`${score}点の${girl.name}さんとMatchしました!!`)

            } else {
              console.log(`${score}点の${girl.name}さんをLikeしました`)
            }

          } else {
            continue
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