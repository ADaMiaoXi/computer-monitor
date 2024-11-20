import {openDashboard, electronStore, addOrRemoveMonitorSummaryItem} from '../index.js'

/**
 * Open RAM Dashboard
 * Click event callback of RAM section on monitor summary view
 */
export const openRAMDashboard = async () => {
    const {
        launchConfiguration: {
            ramDashboard: {isKeepRefreshing, refreshInterval}
        }
    } = electronStore.get('customizedData')
    openDashboard(displayRAMDashboard, 'monitor_dashboard_ram', refreshInterval, isKeepRefreshing)
}

const displayRAMDashboard = async (dashboard, currentDashboardId) => {
    const {
        memory: {freeMemory, totalMemory}
    } = window.electronStore.get('monitorInfo')
    // insert HTML
    const ramDashboardHtmlSnippet = await window.electronAPI.invoke('getRAMDashboardHtml', {
        freeMemory,
        totalMemory
    })

    const div = document.createElement('div')
    div.innerHTML = ramDashboardHtmlSnippet
    const taskRamList = div.firstElementChild.children[1].children
    const taskRamItems = []

    const userDataPath = electronStore.get('userDataPath')

    for (let i = 0; i < taskRamList.length; i++) {
        const taskRamItem = taskRamList[i]

        // Add event
        taskRamItem.lastElementChild.addEventListener('click', async e => {
            const imageName = e.target.parentElement.parentElement.children[1].innerText
            const res = await window.electronAPI.invoke('killTaskByName', imageName)

            setTimeout(() => {
                displayRAMDashboard(dashboard)
            }, 200)
        })

        // Add logo image
        const img = document.createElement('img')

        img.setAttribute('src', `${userDataPath}/userData/processIcons/${taskRamItem.children[0].innerText}.png`)
        img.addEventListener('error', e => {
            e.target.setAttribute('src', `${userDataPath}/userData/processIcons/defaultIcon.png`)
        })
        img.classList.add('monitor_dashboard_ram_list_item_logo')
        taskRamItem.insertBefore(img, taskRamItem.firstElementChild)

        taskRamItems.push({
            name: taskRamItem.children[1].innerText,
            value: Number(taskRamItem.children[2].innerText?.split(' ')[0])
        })
    }
    
    const openedDashboardId = document.querySelector('#monitor_dashboard').firstElementChild?.id
    if (openedDashboardId && openedDashboardId !== currentDashboardId) return
    if (dashboard.firstElementChild) {
        dashboard.replaceChild(div.firstElementChild, dashboard.firstElementChild)
    } else {
        dashboard.appendChild(div.firstElementChild)
    }

    // Add event to ram summary items
    enableRamSummaryEvents()
    //Add pie chart
    insertPieChart({freeMemory, totalMemory, taskRamItems})
}

/**
 * Insert pie chart
 * @param {Object} params  freeMemory, totalMemory, taskRamItems
 */
const insertPieChart = ({freeMemory, totalMemory, taskRamItems}) => {
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
    const myChart = echarts.init(chartDom)

    const option = {
        darkMode: true,
        animation: false,
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
                radius: '75%',
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

    option && myChart.setOption(option)
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
