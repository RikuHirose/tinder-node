require('dotenv').config({ path: __dirname + '/../.env' })
const facebookUserId = process.env.facebookUserId
const facebookToken = process.env.facebookToken


const {TinderClient, GENDERS, GENDER_SEARCH_OPTIONS} = require('tinder-client')
const TINDER_NUM = process.env.TINDER_NUM || 3
const face = require('./face.js')
const tinderAuth = require('./tinderAuth.js')
const tinderLogic = require('./tinderLogic.js')



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
    // let location = await tinder_client.temporarilyChangeLocation({ latitude: '35.6603785', longitude: '139.7073692' })
    // console.log(location)



    // 以下スワイプ
    let count = 0
    while(count < TINDER_NUM) {
      // リコメンドを取得し0人だったら終了
      let recommendations = await tinder_client.getRecommendations()

      if(recommendations.results.length === 0) break

      for (var i = 0; i < recommendations.results.length; i++) {
        let user = recommendations.results[i]

        console.log(`${user.name}さんの顔写真を判定中....`)

        let score = await tinderLogic.getFaceScore(user, tinder_client)
        if(score == false || score == NaN) {
          continue

        } else {
          if(score < 75) {
            continue
          } else {

            // swipe
            // send message after match
            user = await tinderLogic.checkUser(tinder_client, user)
            if(user == false) continue

            let liked = await tinderLogic.swipe(tinder_client, user)
            let message = await tinderLogic.sendMessage(tinder_client, user, liked, score)
            console.log(message)

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