const http = require('http')
const { WEATHER_API_KEY, CITY } = require('./config')

const url = `http://api.weatherstack.com/current?access_key=${WEATHER_API_KEY}&query=${CITY}`

http.get(url, (res) => {
    const { statusCode } = res
    if (statusCode !== 200) {
        console.log('statusCode', statusCode)
        return
    }

    res.setEncoding('utf8')
    let rowData = ''
    res.on('data', (chunk) => rowData += chunk)
    res.on('end', () => {
        let parseData = JSON.parse(rowData)
        console.log('parseData', parseData)
    })
}).on('error', (err) => console.error(err))