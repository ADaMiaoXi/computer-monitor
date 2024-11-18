const ramDashboardApis = require('./ramDashboardApis')
const cpuDashboardApis = require('./cpuDashboardApis')

module.exports = {
    ...ramDashboardApis,
    ...cpuDashboardApis
}
