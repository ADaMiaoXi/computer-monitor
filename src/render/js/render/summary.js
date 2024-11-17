import {insertHTMLSnippets, getDynamicInfo, getValue, electronStore} from './index.js'

/**
 * Fill data into monitor summary
 * @param {Object} summaryItemRecord
 * @param {Object} staticInfo
 */
export const fillMonitorSummary = async staticInfo => {
    const {summaryItemRecord} = electronStore.get('customizedData')
    const dynamicInfo = await getDynamicInfo(staticInfo)

    electronStore.set('monitorInfo', dynamicInfo)

    const ids = Object.keys(summaryItemRecord)
    for (let id of ids) {
        if (document.getElementById(id)) {
            const path = document.getElementById(id)?.dataset.path
            const value = getValue(dynamicInfo, path)
            const dataContainer = document.querySelector(`#${id} .monitor_summary_data_value`)
            dataContainer.innerText = value
        }
    }
}

/**
 * Init monitor summary
 * @param {Object} summaryItemRecord
 */
export const initMonitorSummary = async () => {
    const {summaryItemRecord} = electronStore.get('customizedData')
    const keys = Object.keys(summaryItemRecord)
    const initializedSections = []
    for (let key of keys) {
        const div = document.createElement('div')
        div.innerHTML = await window.electronAPI.invoke('getHTMLSnippets', summaryItemRecord[key])
        const parentId = div.firstElementChild.dataset.parentid
        if (!initializedSections.includes(parentId)) {
            insertHTMLSnippets(`#monitor_summary`, await window.electronAPI.invoke('getHTMLSnippetsNameById', parentId))
            initializedSections.push(parentId)
        }
        insertHTMLSnippets(`#${parentId}`, summaryItemRecord[key])
    }
}

/**
 * insert monitor summary Item by snippetsName
 * @param {*} snippetsName
 */
export const insertSummaryItem = async snippetsName => {
    const html = await window.electronAPI.invoke('getHTMLSnippets', snippetsName)
    const div = document.createElement('div')
    div.innerHTML = html
    const parentId = div.firstElementChild.dataset.parentid
    insertHTMLSnippets(`#${parentId}`, snippetsName)
}
