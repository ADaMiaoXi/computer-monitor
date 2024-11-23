const ramDashboardApis = require('./ramDashboardApis')
const cpuDashboardApis = require('./cpuDashboardApis')
const networkDashboardApis = require('./networkDashboardApis')
const gpuDashboardApis = require('./gpuDashboardApis')

module.exports = {
    ...ramDashboardApis,
    ...cpuDashboardApis,
    ...networkDashboardApis,
    ...gpuDashboardApis
}
