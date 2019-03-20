

module.exports = {
  ja2Bit(userName) {
    return new Promise((resolve, reject) => {
      try {
        if (userName.match(/^[\u30a0-\u30ff\u3040-\u309f\u3005-\u3006\u30e0-\u9fcf]+$/)) {
          // japanese
          resolve(true)
         } {
          resolve(false)
         }
      } catch(e) {
        reject(e)
      }

    })
  }
}