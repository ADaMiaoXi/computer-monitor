const dashboardCpuHtmlSnippets = require('./dashboardCpuHtmlSnippets')
const dashboardNetworkHtmlSnippets = require('./dashboardNetworkHtmlSnippets')
const dashboardRamHtmlSnippets = require('./dashboardRamHtmlSnippets')

module.exports = {
    ...dashboardCpuHtmlSnippets,
    ...dashboardRamHtmlSnippets,
    ...dashboardNetworkHtmlSnippets
}
