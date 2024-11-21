const ramDashboardApis = require('./ramDashboardApis')
const cpuDashboardApis = require('./cpuDashboardApis')
const networkDashboardApis = require('./networkDashboardApis')

module.exports = {
    ...ramDashboardApis,
    ...cpuDashboardApis,
    ...networkDashboardApis
}
