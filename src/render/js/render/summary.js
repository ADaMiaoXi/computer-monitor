import { insertHTMLSnippets, getDynamicInfo, getValue } from "./index.js";

/**
 * Fill data into monitor summary
 * @param {Object} summaryItemRecord
 * @param {Object} staticInfo
 */
export const fillMonitorSummary = async (summaryItemRecord, staticInfo) => {
    const dynamicInfo = await getDynamicInfo(staticInfo);

    window.electronStore.set("monitorInfo", dynamicInfo);

    const ids = Object.keys(summaryItemRecord);
    for (let id of ids) {
        const path = document.getElementById(id).dataset.path;
        const value = getValue(dynamicInfo, path);
        const dataContainer = document.querySelector(
            `#${id} .monitor_summary_data_value`
        );
        dataContainer.innerText = value;
    }
};

/**
 * Init monitor summary
 * @param {Object} summaryItemRecord
 */
export const initMonitorSummary = async (summaryItemRecord) => {
    const keys = Object.keys(summaryItemRecord);
    const initializedSections = [];
    for (let key of keys) {
        const div = document.createElement("div");
        div.innerHTML = await window.electronAPI.invoke('getHTMLSnippets',summaryItemRecord[key])
        const parentId = div.firstElementChild.dataset.parentid;
        if (!initializedSections.includes(parentId)) {
            insertHTMLSnippets(
                `#monitor_summary`,
                await window.electronAPI.invoke('getHTMLSnippetsNameById', parentId)
            );
            initializedSections.push(parentId);
        }
        insertHTMLSnippets(`#${parentId}`, summaryItemRecord[key]);
    }
};
