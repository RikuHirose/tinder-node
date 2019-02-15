const face = require('./face.js')

const photos = [
  'https://images-ssl.gotinder.com/5b7eaa62aacd13480abf01c8/1080x1350_83fc9ece-53a1-492e-8684-284399726a3b.webp',
  'https://images-ssl.gotinder.com/5b7eaa62aacd13480abf01c8/1080x1350_abac234c-8c0b-4a33-bda8-3e6c68b82b1d.webp',
  'https://images-ssl.gotinder.com/5b7eaa62aacd13480abf01c8/1080x1350_5a069b62-4c0e-4786-8b4d-660b66c3a395.webp',
  'https://images-ssl.gotinder.com/5c4d6461899eb911002b7f0c/1080x1080_df1ddd1c-181f-4ebc-abc6-81330b192229.jpg',
]
// const photos = [
//   'https://images-ssl.gotinder.com/5c4d6461899eb911002b7f0c/1080x1080_aaa6d904-dac5-40b8-851f-de54e59af1bc.jpg',
//   'https://images-ssl.gotinder.com/5c4d6461899eb911002b7f0c/1080x1080_df1ddd1c-181f-4ebc-abc6-81330b192229.jpg',
//   'https://images-ssl.gotinder.com/5c4d6461899eb911002b7f0c/1080x1080_81ccecaf-ffc6-498b-95ba-ccd6dbf49c32.jpg',
//   'https://images-ssl.gotinder.com/5c4d6461899eb911002b7f0c/1080x1080_2faeda1f-0683-466a-9141-97f5eb227c8b.jpg',
//   'https://images-ssl.gotinder.com/5c4d6461899eb911002b7f0c/1080x1080_7c3f6f5f-2f24-4bed-895e-b0df2dc474f1.jpg',
//   'https://images-ssl.gotinder.com/5c4d6461899eb911002b7f0c/1080x1080_f5450c51-68ab-4123-90e8-12bfaa01baf7.jpg'
// ]


async function diplayCommits() {

let faceScores = []
for (var i = 0; i < photos.length; i++) {

  let photoUrl = photos[i].replace(/webp/i, 'jpg')

  let faceInfo = await face.detectFace(photoUrl)

  if(faceInfo == false) {
    continue
  } else {
    console.log(faceInfo[0]['attributes']['beauty']['female_score'])
    faceScores.push(faceInfo[0]['attributes']['beauty']['female_score'])
  }
}


let faceScore = await face.calcFaceMedian(faceScores)
console.log(faceScore)


}

diplayCommits()

