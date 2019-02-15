const axios = require('axios')
const convert = require('xml-js')

module.exports = {
  getLatLng(location) {
    return new Promise(async (resolve, reject) => {
       try {

        const url = `https://www.geocoding.jp/api/?v=1.1&q=${location}`

        axios.get(encodeURI(url))
          .then(function (response) {

            const xml = response.data
            const result = convert.xml2js(xml, {compact: true, spaces: 2});

            const place = [result.result.coordinate.lat._text, result.result.coordinate.lng._text]
            resolve(place)

          })
          .catch(function (error) {
            resolve(false)
          })

       }
       catch(e) {
        console.log(e)
        reject(new Error('Failure to login'))
      }
    })
  }
}