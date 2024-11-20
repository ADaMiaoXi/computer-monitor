import {getIconOfProcesses, openDashboard} from '../index.js'
/**
 * Open CPU Dashboard
 * Click event callback of CPU section on monitor summary view
 */
export const openCPUDashboard = async () => {
    const {
        launchConfiguration: {
            cpuDashboard: {isKeepRefreshing, refreshInterval}
        }
    } = electronStore.get('customizedData')
    openDashboard(displayCPUDashboard, 'monitor_dashboard_cpu', refreshInterval, isKeepRefreshing, true)
}

const displayCPUDashboard = async (dashboard, currentDashboardId) => {
    const userDataPath = electronStore.get('userDataPath')
    const div = document.createElement('div')
    const cpuDashboardHtmlSnippet = await window.electronAPI.invoke('getCPUDashboardHtml')
    div.innerHTML = cpuDashboardHtmlSnippet

    const taskCpuList = div.firstElementChild.children[1].children

    for (let i = 0; i < taskCpuList.length; i++) {
        const taskCpuItem = taskCpuList[i]
        const img = taskCpuItem.firstElementChild
        img.addEventListener('error', e => {
            e.target.setAttribute('src', `${userDataPath}/userData/processIcons/defaultIcon.png`)
        })
        // Add event
        taskCpuItem.lastElementChild.addEventListener('click', async e => {
            const imageName = `${e.target.parentElement.parentElement.children[1].innerText}.exe`
            await window.electronAPI.invoke('killTaskByName', imageName)
            setTimeout(() => {
                displayCPUDashboard(dashboard)
            }, 200)
        })
    }

    const openedDashboardId = document.querySelector('#monitor_dashboard').firstElementChild?.id
    if (openedDashboardId !== currentDashboardId) return
    if (dashboard.firstElementChild) {
        dashboard.replaceChild(div.firstElementChild, dashboard.firstElementChild)
    } else {
        dashboard.appendChild(div.firstElementChild)
    }
}
