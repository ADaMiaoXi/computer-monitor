const fs = require('fs')
const {app} = require('electron')

/**
 * Generates RAM list items
 * @param {Array} items
 * @returns {string} RAM list items html snippet
 */
const generateRAMListItemsHtmlSnippet = ramTaskList => {
    const defaultPath = `${app.getPath('userData')}/userData/processIcons/defaultIcon.png`
    return ramTaskList.reduce((per, cur) => {
        const imgPath = `${app.getPath('userData')}/userData/processIcons/${cur[0]}.png`
        const html_snippet = `
        <div class="monitor_dashboard_ram_list_item">
            <img class="monitor_dashboard_ram_list_item_logo" src= "${fs.existsSync(imgPath) ? imgPath : defaultPath}">
            <div class="monitor_dashboard_ram_list_item_label">${cur[0]}</div>
            <div class="monitor_dashboard_ram_list_item_value">${cur[1]}</div>
            <div class="monitor_dashboard_ram_list_item_icon">
                <div class="close-button">╳</div>
            </div>
        </div>`
        return `${per}${html_snippet}`
    }, '')
}

const getRamHtmlSnippet = () => `
<div class="monitor_dashboard_ram" id="monitor_dashboard_ram">
    <div class="monitor_dashboard_title dragable">RAM utilization</div>
    <div id="monitor_dashboard_ram_list">
    </div>
    <div id="monitor_dashboard_ram_detail">
        <div id="monitor_dashboard_ram_summary">
            <div>Ram summary</div>
            <div id="monitor_dashboard_ram_total"></div>
            <div id="monitor_dashboard_ram_used"></div>
            <div id="monitor_dashboard_ram_free"></div>
            
        </div>
        <div id="monitor_dashboard_ram_buffer"></div>
        <div id="monitor_dashboard_ram_pie">
            Loading...
        </div>
        <div>
    <div>
</div>
`

module.exports = {
    getRamHtmlSnippet,
    generateRAMListItemsHtmlSnippet
}
