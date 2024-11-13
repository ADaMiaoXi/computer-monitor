const cpuMonitorUtils = require("./cpuMonitorUtils");
const dashboardMornitorUtils = require("./dashboardMornitorUtils");
const gpuMonitorUtils = require("./gpuMonitorUtils");
const memoryUtils = require("./memoryUtils");
const networkMonitorUtils = require("./networkMonitorUtils");

module.exports = {
    ...cpuMonitorUtils,
    ...dashboardMornitorUtils,
    ...gpuMonitorUtils,
    ...memoryUtils,
    ...networkMonitorUtils,
};
