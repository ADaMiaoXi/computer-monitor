const {generateRAMListHtmlSnippet} = require('../../html_snippets')
const {executeCommand, transformStdoutStringToLines, TASK_RAM_USAGE_COMMAND} = require('../../commands')

const {getProcessedRAMTasklist} = require('../utils')

const getRAMTasklist = async () => {
    const stdout = await executeCommand(TASK_RAM_USAGE_COMMAND, stdout => stdout)
    const lines = transformStdoutStringToLines(stdout)
    return getProcessedRAMTasklist(lines)
}

const getRAMDashboardHtml = async () => {
    const ramTaskList = await getRAMTasklist()
    return generateRAMListHtmlSnippet(ramTaskList)
}

module.exports = {
    getRAMDashboardHtml
}
