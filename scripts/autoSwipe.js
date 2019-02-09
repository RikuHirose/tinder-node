require('dotenv').config({ path: __dirname + '/../.env' })
const axios = require('axios')
const facebookUserId = process.env.facebookUserId
// const facebookToken = process.env.facebookToken

const face = require('./face.js')
const tinderAuth = require('./tinderAuth.js')


module.exports = {
  getFaceScore(girl, tinder_client) {
    return new Promise(async (resolve, reject) => {
       try {
        if(girl.photos.length === 1) {
          let faceInfo = await face.detectFace(girl.photos[0]['url'])

          if(faceInfo == false) {
            resolve(false)

          } else {
            let faceScore = faceInfo[0]['attributes']['beauty']['female_score']
            resolve(faceScore)
          }

        }
        else {
          let faceScores = []

          for (var i = 0; i < girl.photos.length; i++) {
            let faceInfo = await face.detectFace(girl.photos[i]['url'])

            // こういうケースは無視
            // https://images-ssl.gotinder.com/5a087f81d181224304422241/1080x1350_01a5b845-c428-40e3-86c9-07082865d657.jpg

            // if(faceInfo[0] != null) {
            //   faceScores.push(faceInfo[0]['attributes']['beauty']['female_score'])
            // }
            if(faceInfo == false) {
              continue
            } else {
              faceScores.push(faceInfo[0]['attributes']['beauty']['female_score'])
            }
          }


          let faceScore = await face.calcFaceMedian(faceScores)
          resolve(faceScore)
        }

      } catch(e) {
        console.log(e)
        reject(new Error('Failure to login'))
      }

    })
  },

  swipe(tinder_client) {
        return new Promise((resolve, reject) => {})
      }
      // 顔写真をscore分岐
          // await tinder_client.like(girl._id)
          // await tinder_client.pass(girl._id)
      // const url = `https://api.gotinder.com/pass/${recommendations.results[0]._id}`
      // axios.get(url, {
      //   headers:
      //     { Accept: 'application/json, text/plain, */*',
      //       'X-Auth-Token': 'cff13cac-34e7-48e7-81e0-c5c4809e7ba3',
      //       'Content-Type': 'application/json',
      //       'User-Agent': 'Tinder Android Version 2.2.3',
      //       os_version: '16' },
      //   })
      //   .then(response => {
      //     console.log(response)
      //   })
      //   .catch(error => {
      //   console.log(error)
      //   })
}
