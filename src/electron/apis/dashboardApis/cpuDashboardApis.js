const {generateCPUListHtmlSnippet} = require('../../html_snippets')
const {executeCommand,transformStdoutStringToLines, CPU_PROCESSOR_TIME_COMMAND} = require('../../commands')

const {getProcessedCPUTasksList} = require('../utils')
const getCPUTasklist = async () => {
    const stdout = await executeCommand(CPU_PROCESSOR_TIME_COMMAND, stdout => stdout)
    const lines = transformStdoutStringToLines(stdout)
    return getProcessedCPUTasksList(lines)
}

const getCPUDashboardHtml = async e => {
    const cpuTaskList = await getCPUTasklist()
    return generateCPUListHtmlSnippet(cpuTaskList)
}

module.exports = {
    getCPUDashboardHtml
}
