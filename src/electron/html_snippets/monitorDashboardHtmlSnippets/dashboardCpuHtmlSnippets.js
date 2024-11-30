const fs = require('fs')
const {app} = require('electron')
const path = require('path')

/**
 * Generates cpu list items
 * @param {Array} items
 * @returns {string} cpu list items html snippet
 */
const generateCPUListHtmlSnippet = cpuTaskList => {
    const defaultPath = `${app.getPath('userData')}/userData/processIcons/defaultIcon.png`
    const userDataPath = app.getPath('userData')
    return cpuTaskList.reduce((per, cur) => {
        const imgPath = path.join(userDataPath, `/userData/processIcons/${cur[0]}.exe.png`)
        const html_snippet = `
        <div class="monitor_dashboard_cpu_list_item">
            <img src="${fs.existsSync(imgPath) ? imgPath : defaultPath}" class="monitor_dashboard_ram_list_item_logo">
            <div class="monitor_dashboard_cpu_list_item_label">${cur[0]}</div>
            <div class="monitor_dashboard_cpu_list_item_value">${cur[1]}</div>
            <div class="monitor_dashboard_cpu_list_item_icon">
                <div class="close-button">╳</div>
            </div>
        </div>`
        return `${per}${html_snippet}`
    }, '')
}

const getCPUDashboardHtmlSnippet = () => `
<div class="monitor_dashboard_cpu" id="monitor_dashboard_cpu">
    <div class="monitor_dashboard_title dragable">CPU Utilization</div>
    <div id="monitor_dashboard_cpu_list">
        <span class='monitor_dashboard_loading'>Loading...
    </div>
    <div id="monitor_dashboard_cpu_detail">
        <div id="monitor_dashboard_cpu_speed_clickable_block"></div>
        <div id="monitor_dashboard_cpu_usage_record"></id>
    <div>
</div>
`
module.exports = {
    generateCPUListHtmlSnippet,
    getCPUDashboardHtmlSnippet
}
