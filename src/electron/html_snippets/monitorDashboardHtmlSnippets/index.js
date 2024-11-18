const dashboardCpuHtmlSnippets = require('./dashboardCpuHtmlSnippets')

const dashboardRamHtmlSnippets = require('./dashboardRamHtmlSnippets')

module.exports = {
    ...dashboardCpuHtmlSnippets,
    ...dashboardRamHtmlSnippets
}
