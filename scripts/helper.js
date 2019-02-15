

module.exports = {
  webp2Jpg(url) {
    return new Promise(async (resolve, reject) => {
       try {
        let photoUrl = url.replace(/webp/i, 'jpg')

        resolve(photoUrl)
       }
       catch(e) {
        console.log(e)
        reject(new Error('Failure to login'))
      }
    })
  }
}