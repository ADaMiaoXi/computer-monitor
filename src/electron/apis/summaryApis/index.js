const {
    combineCommands,
    executePowershellCommand,
    transformStdoutStringToLines,
    combineCommandsWithCommonType,
    CPU_MAX_SPPED_COMMAND,
    NETWORK_NAME_COMMAND,
    CPU_USEAGE_PERCENTAGE_COMMAND,
    GPU_INFO_COMMAND,
    NETWORK_SEND_AND_RECEIVED_COMMAND
} = require('../../commands')

const {
    getCPUModel,
    getCPUMaxClockSpeed,
    getCPUUsage,
    getCPUCurrentSpeed,
    getGPUInfo,
    getNetworkName,
    getNetworkDownloadSpeed,
    getNetworkuploadSpeed,
    getTotalMemory,
    getFreeMemory,
    getMemoryUsage
} = require('./../utils')

/**
 * Get computer static info
 * @returns {Object} staticInfo
 */
const getStaticInfo = async () => {
    console.info('[INFO] Is getting static info...')
    const combinedCommands = combineCommands([CPU_MAX_SPPED_COMMAND, NETWORK_NAME_COMMAND])

    const stdout = await executePowershellCommand(combinedCommands, stdout => stdout)

    const lines = transformStdoutStringToLines(stdout)

    return {
        CPUModel: getCPUModel(),
        CPUMaxClockSpeed: getCPUMaxClockSpeed(lines),
        networkName: getNetworkName(lines),
        totalMemory: getTotalMemory()
    }
}

/**
 * Get computer dynamic info
 * @param {IpcMainInvokeEvent} e
 * @param {Object} param staticInfo
 * @returns {Object} dynamicInfo
 */
const getDynamicInfo = async (e, {CPUModel, CPUMaxClockSpeed, networkName, totalMemory}) => {
    console.info('[INFO] Is getting dynamic info...')
    const combinedCommands = combineCommands([
        GPU_INFO_COMMAND,
        combineCommandsWithCommonType([CPU_USEAGE_PERCENTAGE_COMMAND, NETWORK_SEND_AND_RECEIVED_COMMAND])
    ])

    const stdout = await executePowershellCommand(combinedCommands, stdout => stdout)

    const lines = transformStdoutStringToLines(stdout)

    const CPUUsage = await getCPUUsage()

    const CPUCurrentSpeed = getCPUCurrentSpeed(lines, CPUMaxClockSpeed)

    const networkDownloadSpeed = getNetworkDownloadSpeed(lines, networkName)
    const networkUploadSpeed = getNetworkuploadSpeed(lines, networkName)

    const {
        GPUProductName,
        GPUUsage: {GPUUsage, GPUMemoryUsage, GPUEncoderUsage, GPUDecoderUsage},
        GPUTemperature,
        GPUspeed: {GraphicsSpeed, MemorySpeed, VideoSpeed},
        GPUFanSpeed
    } = getGPUInfo(lines)

    const freeMemory = getFreeMemory()

    const memoryUsage = getMemoryUsage(freeMemory, totalMemory)

    return {
        cpu: {
            CPU: CPUModel,
            CPUUsage: CPUUsage,
            CPUCurrentSpeed: CPUCurrentSpeed
        },
        gpu: {
            GPU: GPUProductName,
            GPUUsage: GPUUsage,
            GPUMemoryUsage: GPUMemoryUsage,
            GPUEncoderUsage: GPUEncoderUsage,
            GPUDecoderUsage: GPUDecoderUsage,
            GPUTemperature: GPUTemperature,
            GPUFanSpeed: GPUFanSpeed,
            graphicsSpeed: GraphicsSpeed,
            memorySpeed: MemorySpeed,
            videoSpeed: VideoSpeed
        },
        network: {
            networkCard: networkName,
            downloadSpeed: networkDownloadSpeed,
            uploadSpeed: networkUploadSpeed
        },
        memory: {
            memoryUsage: memoryUsage,
            freeMemory: freeMemory,
            totalMemory: totalMemory,
            usedMemory: `${(Number(totalMemory.split(' ')[0]) - Number(freeMemory.split(' ')[0])).toFixed(2)} MB`
        }
    }
}

module.exports = {
    getStaticInfo,
    getDynamicInfo
}
