const CPUCommands = require('./CPUInfoCommands.js')
const GPUCommands = require('./GPUInfoCommands.js')
const networkCommand = require('./networkCommands.js')
const memoryCommands = require('./memoryCommands.js')
const commandUtils = require('./commandUtils.js')

module.exports = {
    ...CPUCommands,
    ...GPUCommands,
    ...networkCommand,
    ...memoryCommands,
    ...commandUtils
}
