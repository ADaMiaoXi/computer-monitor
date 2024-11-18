const os = require('os')
const path = require('path')
const {app} = require('electron')
const {getCustomizedData} = require('../commonApis')
/**
 * Get CPU Max Clock Speed from given lines
 * @param {Array<string>} lines lines of command stdout
 * @returns {string} CPU Max Clock Speed
 */
const getCPUMaxClockSpeed = function (lines) {
    console.info(`[Info] Is getting CPU Max clock speed...`)
    const CPUMaxClockSpeedIndex = lines.findIndex(line => line.includes('MaxClockSpeed')) + 1
    return lines[CPUMaxClockSpeedIndex]
}

/**
 * Get CPU Usage
 * @returns {Promise<string>} Promise with CPUUsage
 */
const getCPUUsage = function () {
    console.info(`[Info] Is getting CPU usage...`)
    let startStatus = getCPUInfo()
    let startIdleTime = startStatus.idleTime
    let startTotalTime = startStatus.totalTime
    const {
        launchConfiguration: {cpuSamplingDuration}
    } = getCustomizedData()
    return new Promise(resolve => {
        setTimeout(function () {
            let endStats = getCPUInfo()
            let endIdleTime = endStats.idleTime
            let endTotalTime = endStats.totalTime

            let idleTime = endIdleTime - startIdleTime
            let totalTime = endTotalTime - startTotalTime
            let usePercentage = 1 - idleTime / totalTime

            resolve(`${(usePercentage * 100).toFixed(2)}%`)
        }, cpuSamplingDuration)
    })
}

/**
 * Get CPU Infomation
 * @returns {idleTime:number, totalTime:number}
 */
function getCPUInfo() {
    const cpus = os.cpus()

    let userTime = 0
    let niceTime = 0
    let sysTime = 0
    let idleTime = 0
    let irqTime = 0
    let totalTime = 0

    for (let cpu of cpus) {
        userTime += cpu.times.user
        niceTime += cpu.times.nice
        sysTime += cpu.times.sys
        irqTime += cpu.times.irq
        idleTime += cpu.times.idle
    }

    totalTime = userTime + niceTime + sysTime + idleTime + irqTime

    return {
        idleTime,
        totalTime
    }
}

/**
 * Get CPU Model
 * @returns {string} CPU Model
 */
function getCPUModel() {
    console.info(`[Info] Is getting CPU model...`)
    return os.cpus()[0].model
}

/**
 * Get CPU Current Speed
 * @param {Array<string>} lines lines of command stdout
 * @param {string} CPUMaxClockSpeed
 * @returns {string} CPU Current Speed
 */
function getCPUCurrentSpeed(lines, CPUMaxClockSpeed) {
    const processorPerformanceIndex = lines.findIndex(l => l.includes('processor performance')) + 1

    return `${(((lines[processorPerformanceIndex] / 100) * CPUMaxClockSpeed) / 1000).toFixed(2)}  GHz`
}

function getProcessedCPUTasksList(lines) {
    const map = new Map()
    lines
        .slice(1)
        .map(line => {
            return line
                .split('  ')
                .filter(Boolean)
                .map(line => line.trim().replace(/#.*$/, ''))
        })
        .forEach(porcessArr => {
            const key = porcessArr[0]
            const value = Number(porcessArr[1])
            if (map.has(key)) {
                map.set(key, map.get(key) + value)
            } else {
                map.set(key, value)
            }
        })
    const sortedKeys = Array.from(map.keys()).sort((a, b) => map.get(b) - map.get(a))
    const resList = []
    sortedKeys.forEach((key, index) => {
        resList[index] = []
        resList[index][0] = key
        resList[index][1] = map.get(key)
    })
    const totalTime = resList.find(item => item[0] === '_Total')[1]
    return resList.slice(0, 17).filter(item => (item[0] !== 'Idle' && item[0] !== '_Total')).map(item => [item[0], `${((item[1] / totalTime)*100).toFixed(2)}%`])
     
}

module.exports = {
    getCPUModel,
    getCPUUsage,
    getCPUMaxClockSpeed,
    getCPUCurrentSpeed,
    getProcessedCPUTasksList
}
