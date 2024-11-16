/**
 * Generates RAM list
 * @param {Array} ramTaskList
 * @returns {string} RAM list html snippet
 */
const generateRAMListHtmlSnippet = ramTaskList => `
<div class="monitor_dashboard_ram" id="monitor_dashboard_ram">
    <div class="monitor_dashboard_title dragable">RAM memory usage</div>
    <div id="monitor_dashboard_ram_list">${generateRAMListItemsHtmlSnippet(ramTaskList)}
    </div>
    <div id="monitor_dashboard_ram_detail">
        <div id="monitor_dashboard_ram_pie">
        <div>
    <div>
</div>
`
/**
 * Generates RAM list items
 * @param {Array} items
 * @returns {string} RAM list items html snippet
 */
const generateRAMListItemsHtmlSnippet = ramTaskList => {
    return ramTaskList.reduce((per, cur) => {
        const html_snippet = `
        <div class="monitor_dashboard_ram_list_item">
            <div class="monitor_dashboard_ram_list_item_label">${cur[0]}</div>
            <div class="monitor_dashboard_ram_list_item_value">${cur[1]}</div>
            <div class="monitor_dashboard_ram_list_item_icon">
                <div class="close-button">╳</div>
            </div>
        </div>`
        return `${per}${html_snippet}`
    }, '')
}

module.exports = {
    generateRAMListHtmlSnippet
}
