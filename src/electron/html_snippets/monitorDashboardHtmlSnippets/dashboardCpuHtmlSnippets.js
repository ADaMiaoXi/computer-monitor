const {app} = require('electron')
const path = require('path')

const generateCPUListHtmlSnippet = cpuTaskList => `
<div class="monitor_dashboard_cpu" id="monitor_dashboard_cpu">
    <div class="monitor_dashboard_title dragable">CPU Utilization</div>
    <div id="monitor_dashboard_cpu_list">${generateCPUListItemsHtmlSnippet(cpuTaskList)}
    </div>
    <div id="monitor_dashboard_cpu_detail">
        <div id="monitor_dashboard_cpu_speed_clickable_block"></div>
        <div id="monitor_dashboard_cpu_usage_record"></id>
    <div>
</div>
`

/**
 * Generates cpu list items
 * @param {Array} items
 * @returns {string} cpu list items html snippet
 */
const generateCPUListItemsHtmlSnippet = cpuTaskList => {
    const userDataPath = app.getPath('userData')
    console.log(userDataPath)
    return cpuTaskList.reduce((per, cur) => {
        const imgPath = path.join(userDataPath,`/userData/processIcons/${cur[0]}.exe.png`)
        const html_snippet = `
        <div class="monitor_dashboard_cpu_list_item">
            <img src="${imgPath}" class="monitor_dashboard_ram_list_item_logo">
            <div class="monitor_dashboard_cpu_list_item_label">${cur[0]}</div>
            <div class="monitor_dashboard_cpu_list_item_value">${cur[1]}</div>
            <div class="monitor_dashboard_cpu_list_item_icon">
                <div class="close-button">╳</div>
            </div>
        </div>`
        return `${per}${html_snippet}`
    }, '')
}

module.exports = {
    generateCPUListHtmlSnippet
}
