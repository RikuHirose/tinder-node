require('dotenv').config({ path: __dirname + '/../.env' })
const face = require('./face.js')


module.exports = {
  getFaceScore(user, tinder_client) {
    return new Promise(async (resolve, reject) => {
       try {
        // プロフィール画像が一枚
        if(user.photos.length === 1) {
          let faceInfo = await face.detectFace(user.photos[0]['url'])

          if(faceInfo == false) {
            resolve(false)

          } else {
            let faceScore = faceInfo[0]['attributes']['beauty']['female_score']
            resolve(faceScore)
          }

        }
        else {
          let faceScores = []

          for (var i = 0; i < user.photos.length; i++) {
            let faceInfo = await face.detectFace(user.photos[i]['url'])

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
  checkUser(tinder_client, user) {
    return new Promise(async (resolve, reject) => {
      if(user.bio == false) {
        resolve(user)
      } else {
        // 除外したいword
        let x = ['ID', 'LINE', 'ladyboy']
        let matchArr = user.bio.match(new RegExp(x.join("|")))

        if(matchArr != null) {
          resolve(false)
        }

        resolve(user)
      }

    })
  },
  swipe(tinder_client, user) {
    return new Promise(async (resolve, reject) => {

      let liked = await tinder_client.like(user._id)
      resolve(liked)

    })
  },
  sendMessage(tinder_client, user, liked, score) {
    return new Promise(async (resolve, reject) => {

      // matchしたらmessageを送る
      if(liked.match != false) {
        let sendMessage = await tinder_client.messageMatch({ matchId: liked.match._id, message: 'Hi!' });
        let message = (`${score}点の${user.name}さんとMatchしました!!`)
        resolve(message)

      } else {
        let message = (`${score}点の${user.name}さんをLikeしました`)
        resolve(message)
      }

    })
  }

}
