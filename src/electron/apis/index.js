const summaryApis = require('./summaryApis')
const dashboardApis = require('./dashboardApis')
const commomApis = require('./commonApis')

// NOTE: All electron APIs should export here!
module.exports = {
    ...summaryApis,
    ...dashboardApis,
    ...commomApis
}
