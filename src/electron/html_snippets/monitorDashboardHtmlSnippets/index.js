const dashboardCpuHtmlSnippets = require('./dashboardCpuHtmlSnippets')
const dashboardNetworkHtmlSnippets = require('./dashboardNetworkHtmlSnippets')
const dashboardRamHtmlSnippets = require('./dashboardRamHtmlSnippets')
const dashboardGpuHtmlSnippets = require('./dashboardGpuHtmlSnippets')

module.exports = {
    ...dashboardCpuHtmlSnippets,
    ...dashboardRamHtmlSnippets,
    ...dashboardNetworkHtmlSnippets,
    ...dashboardGpuHtmlSnippets
}
