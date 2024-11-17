import {getCustomizedData} from '../index.js'
import {insertSummaryItem} from '../summary.js'
import {electronStore, resizeWindow} from '../common.js'

// Dashboard data fetching interval
let interval
/**
 * Open dashboard
 * @param {Function} displayContents Render function that renders the dashboard contents
 * @param {String} dashboardId  The id of the dashboard element to be opened, used to close other dashboard that is displaying
 * @returns
 */
export const openDashboard = async (displayContents, currentDashboardId) => {
    const dashboard = document.querySelector('#monitor_dashboard')
    closeOtherDashoard(currentDashboardId)
    const isDashboardOpen = dashboard.clientHeight > 25
    if (isDashboardOpen) {
        closeDashboard()
        return
    }

    const {
        launchConfiguration: {
            ramDashboard: {isKeepRefreshing, refreshInterval}
        }
    } = electronStore.get("customizedData")

    await displayContents(dashboard)
    if (isKeepRefreshing) {
        clearInterval(interval)
        interval = setInterval(async () => {
            displayContents(dashboard)
        }, refreshInterval)
    }
}

/**
 * Close dashboard
 */
export const closeDashboard = () => {
    clearInterval(interval)
    const dashboard = document.querySelector('#monitor_dashboard')
    dashboard.firstElementChild?.remove()
}

/**
 * Close other dashboard and display current dashboard
 * @param {String} currentDashboardId
 */
const closeOtherDashoard = currentDashboardId => {
    const openedDashboardId = document.querySelector('#monitor_dashboard').firstElementChild?.id
    if (openedDashboardId && openedDashboardId !== currentDashboardId) {
        closeDashboard()
    }
}

export const addOrRemoveMonitorSummaryItem = async itemId => {
    const customizedData = electronStore.get('customizedData')
    if (customizedData.summaryItemRecord[itemId]) {
        console.log('有了，要删!')
        delete customizedData.summaryItemRecord[itemId]
        window.electronAPI.invoke('saveCustomizedData', customizedData)
        electronStore.set('customizedData', customizedData)
        document.querySelector(`#${itemId}`).remove()
    } else {
        const snippetsName = await window.electronAPI.invoke('getHTMLSnippetsNameById', itemId)
        customizedData.summaryItemRecord[itemId] = snippetsName
        electronStore.set('customizedData', customizedData)
        window.electronAPI.invoke('saveCustomizedData', customizedData)
        await insertSummaryItem(snippetsName)
    }

    //Resize window size, set timeout to wait documents prepared.
    await new Promise(resolve => {
        setTimeout(async () => {
            resolve(resizeWindow())
        }, 500)
    })
}
