const cpuMonitorUtils = require("./cpuMonitorUtils");
const gpuMonitorUtils = require("./gpuMonitorUtils");
const memoryUtils = require("./memoryUtils");
const networkMonitorUtils = require("./networkMonitorUtils");

module.exports = {
    ...cpuMonitorUtils,
    ...gpuMonitorUtils,
    ...memoryUtils,
    ...networkMonitorUtils,
};
