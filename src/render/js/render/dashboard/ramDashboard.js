import {openDashboard, electronStore, addOrRemoveMonitorSummaryItem} from '../index.js'

/**
 * Open RAM Dashboard
 * Click event callback of RAM section on monitor summary view
 */
export const openRAMDashboard = async () => {
    openDashboard(displayRAMDashboard, 'monitor_dashboard_ram')
}

const displayRAMDashboard = async (dashboard, currentDashboardId) => {
    const ramDashboardHtmlSnippet = await window.electronAPI.invoke('getRAMDashboardHtml')

    const div = document.createElement('div')
    div.innerHTML = ramDashboardHtmlSnippet
    dashboard.appendChild(div.firstElementChild)

    await fillRamListAndSummary()
    insertPieChart()

    const {
        launchConfiguration: {
            ramDashboard: {isKeepRefreshing, refreshInterval}
        }
    } = electronStore.get('customizedData')
    if (isKeepRefreshing) {
        window.dashboardInterval = setInterval(async () => {
            await fillRamListAndSummary()
            updatePieChart()
        }, refreshInterval)
    }
    enableRamSummaryEvents()
}

const fillRamListAndSummary = async () => {
    const ramTasklist = await window.electronAPI.invoke('getRAMTasklist')
    const ramListItemsHtmlSnippet = await window.electronAPI.invoke('getRAMListItemsHtmlSnippet', ramTasklist)
    document.querySelector('#monitor_dashboard_ram_list').innerHTML = ramListItemsHtmlSnippet

    const taskRamList = document.querySelector('#monitor_dashboard_ram_list').children

    // Add kill task event
    for (let i = 0; i < taskRamList.length; i++) {
        taskRamList[i].lastElementChild.addEventListener('click', async e => {
            const imageName = e.target.parentElement.parentElement.children[1].innerText
            await window.electronAPI.invoke('killTaskByName', imageName)

            setTimeout(() => {
                fillRamListAndSummary()
            }, 200)
        })
    }

    const {
        memory: {freeMemory, totalMemory}
    } = window.electronStore.get('monitorInfo')
    document.querySelector('#monitor_dashboard_ram_total').innerHTML = `Total: ${(
        Number(totalMemory.split(' ')[0]) / 1024
    ).toFixed(2)} GB`
    document.querySelector('#monitor_dashboard_ram_used').innerHTML = `Used: ${(
        (Number(totalMemory.split(' ')[0]) - Number(freeMemory.split(' ')[0])) /
        1024
    ).toFixed(2)} GB`
    document.querySelector('#monitor_dashboard_ram_free').innerHTML = `Free: ${(
        Number(freeMemory.split(' ')[0]) / 1024
    ).toFixed(2)} GB`
}
/**
 * Insert pie chart
 * @param {Object} params  freeMemory, totalMemory, taskRamItems
 */
const insertPieChart = () => {
    const {
        memory: {freeMemory, totalMemory}
    } = window.electronStore.get('monitorInfo')

    const taskRamItems = []
    const taskRamList = document.querySelector('#monitor_dashboard_ram_list').children
    for (let i = 0; i < taskRamList.length; i++) {
        const taskRamItem = taskRamList[i]
        taskRamItems.push({
            name: taskRamItem.children[1].innerText,
            value: Number(taskRamItem.children[2].innerText?.split(' ')[0])
        })
    }
    const freeMemoryValue = Number(freeMemory?.split(' ')[0])
    const totalMemoryValue = Number(totalMemory?.split(' ')[0])
    const otherUsedMemoryValue =
        totalMemoryValue -
        freeMemoryValue -
        taskRamItems[0].value -
        taskRamItems[1].value -
        taskRamItems[2].value -
        taskRamItems[3].value -
        taskRamItems[4].value -
        taskRamItems[5].value -
        taskRamItems[6].value -
        taskRamItems[7].value -
        taskRamItems[8].value -
        taskRamItems[9].value

    const chartDom = document.getElementById('monitor_dashboard_ram_pie')
    const pieChat = echarts.init(chartDom)

    const option = {
        darkMode: true,
        animation: true,
        title: {
            show: false
        },
        tooltip: {
            trigger: 'item',
            formatter: '{a}<br />{b}: {c} MB'
        },
        legend: {
            show: false
        },
        series: [
            {
                name: 'RAM Usage',
                type: 'pie',
                radius: '85%',
                data: [
                    {value: freeMemoryValue, name: 'Free'},
                    {value: otherUsedMemoryValue.toFixed(2), name: 'Others'},
                    {value: taskRamItems[0].value, name: taskRamItems[0].name},
                    {value: taskRamItems[1].value, name: taskRamItems[1].name},
                    {value: taskRamItems[2].value, name: taskRamItems[2].name},
                    {value: taskRamItems[3].value, name: taskRamItems[3].name},
                    {value: taskRamItems[4].value, name: taskRamItems[4].name},
                    {value: taskRamItems[5].value, name: taskRamItems[5].name},
                    {value: taskRamItems[6].value, name: taskRamItems[6].name},
                    {value: taskRamItems[7].value, name: taskRamItems[7].name},
                    {value: taskRamItems[8].value, name: taskRamItems[8].name},
                    {value: taskRamItems[9].value, name: taskRamItems[9].name}
                ]
            }
        ]
    }

    pieChat.setOption(option)
    electronStore.get('initializedCharts').push(pieChat)
}

const updatePieChart = () => {
    const pieChat = electronStore.get('initializedCharts')[0]
    const {
        memory: {freeMemory, totalMemory}
    } = window.electronStore.get('monitorInfo')

    const taskRamItems = []
    const taskRamList = document.querySelector('#monitor_dashboard_ram_list').children
    for (let i = 0; i < taskRamList.length; i++) {
        const taskRamItem = taskRamList[i]
        taskRamItems.push({
            name: taskRamItem.children[1].innerText,
            value: Number(taskRamItem.children[2].innerText?.split(' ')[0])
        })
    }
    const freeMemoryValue = Number(freeMemory?.split(' ')[0])
    const totalMemoryValue = Number(totalMemory?.split(' ')[0])
    const otherUsedMemoryValue =
        totalMemoryValue -
        freeMemoryValue -
        taskRamItems[0].value -
        taskRamItems[1].value -
        taskRamItems[2].value -
        taskRamItems[3].value -
        taskRamItems[4].value -
        taskRamItems[5].value -
        taskRamItems[6].value -
        taskRamItems[7].value -
        taskRamItems[8].value -
        taskRamItems[9].value

    pieChat.setOption({
        series: [
            {
                data: [
                    {value: freeMemoryValue, name: 'Free'},
                    {value: otherUsedMemoryValue.toFixed(2), name: 'Others'},
                    {value: taskRamItems[0].value, name: taskRamItems[0].name},
                    {value: taskRamItems[1].value, name: taskRamItems[1].name},
                    {value: taskRamItems[2].value, name: taskRamItems[2].name},
                    {value: taskRamItems[3].value, name: taskRamItems[3].name},
                    {value: taskRamItems[4].value, name: taskRamItems[4].name},
                    {value: taskRamItems[5].value, name: taskRamItems[5].name},
                    {value: taskRamItems[6].value, name: taskRamItems[6].name},
                    {value: taskRamItems[7].value, name: taskRamItems[7].name},
                    {value: taskRamItems[8].value, name: taskRamItems[8].name},
                    {value: taskRamItems[9].value, name: taskRamItems[9].name}
                ]
            }
        ]
    })
}

/**
 * Add event to ram summary items
 */
const enableRamSummaryEvents = () => {
    document.querySelector('#monitor_dashboard_ram_total').addEventListener('click', async e => {
        addOrRemoveMonitorSummaryItem('monitor_summary_ramtotal')
    })

    document.querySelector('#monitor_dashboard_ram_used').addEventListener('click', async e => {
        addOrRemoveMonitorSummaryItem('monitor_summary_ramused')
    })

    document.querySelector('#monitor_dashboard_ram_free').addEventListener('click', async e => {
        addOrRemoveMonitorSummaryItem('monitor_summary_ramfree')
    })
}
