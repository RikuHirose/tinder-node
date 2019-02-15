require('dotenv').config({ path: __dirname + '/../.env' })
const facePlusAPIKey = process.env.facePlusAPIKey
const facePlusAPISecret = process.env.facePlusAPISecret

const rp = require('request-promise')
const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest
const xhr = new XMLHttpRequest()


module.exports = {
  detectFace(imageUrl) {
    return new Promise((resolve, reject) => {
      // urlがvalidかチェックする
      // https://images-ssl.gotinder.com/5c58088633c09c110016f8fe/1080x1080_216158ba-64d5-4d80-8a2c-5809beca84e8.jpg
      // xhr.open("HEAD", imageUrl, false);
      // xhr.send(null)

      // if(xhr.status != 404 || xhr.status != 403) {
      //   imageUrl = imageUrl
      //   console.log(2222222)
      // } else {
      //   console.log(11111111111)
      // }

      let options = {
        method: 'POST',
        uri: 'https://api-us.faceplusplus.com/facepp/v3/detect',
        form: {
          api_key: facePlusAPIKey,
          api_secret: facePlusAPISecret,
          image_url: imageUrl,
          return_attributes: 'gender,age,beauty'
        },
        json: true
      }

      rp(options)
        .then((res) => {
          // こういうケースは無視
          // https://images-ssl.gotinder.com/5859968f38b602fe090ae0a5/1080x1080_2d33fb1b-0074-4473-bde7-251724903e7c.jpg

          if(res.faces.length != 0) {
            resolve(res.faces)
          } else {
            resolve(false)
          }
        })
        .catch((err) => {
          // urlがinvalid
          // https://images-ssl.gotinder.com/5c58088633c09c110016f8fe/1080x1080_216158ba-64d5-4d80-8a2c-5809beca84e8.jpg
            resolve(false)
        })
    })
  },

  calcFaceMedian(faceScores) {
    return new Promise((resolve, reject) => {
      let lengthHalf = (faceScores.length/2)|0
      // 配列を値でソート
      let sortableData = faceScores.sort()

      let result
      if (sortableData.length%2) {
          // 配列個数が奇数の場合
          result = sortableData[lengthHalf];
      } else {
          // 配列個数が偶数の場合
          result = (sortableData[lengthHalf - 1] + sortableData[lengthHalf]) / 2;
      }
      resolve(result)
    })
  }
}

