const {getRamHtmlSnippet, generateRAMListItemsHtmlSnippet} = require('../../html_snippets')
const {executeCommand, transformStdoutStringToLines, TASK_RAM_USAGE_COMMAND} = require('../../commands')

const {getProcessedRAMTasklist} = require('../utils')

const getRAMTasklist = async () => {
    const stdout = await executeCommand(TASK_RAM_USAGE_COMMAND, stdout => stdout)
    const lines = transformStdoutStringToLines(stdout)
    return getProcessedRAMTasklist(lines)
}

const getRAMDashboardHtml = getRamHtmlSnippet

const getRAMListItemsHtmlSnippet = (e, ramTaskList) => generateRAMListItemsHtmlSnippet(ramTaskList)

module.exports = {
    getRAMListItemsHtmlSnippet,
    getRAMTasklist,
    getRAMDashboardHtml
}
