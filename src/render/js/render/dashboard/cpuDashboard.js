import {electronStore, addOrRemoveMonitorSummaryItem, openDashboard} from '../index.js'
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

    insertCPUUsageRecord()

    enableCPUDetailEvents()

    document.querySelector('.monitor_dashboard_title').innerHTML = electronStore.get('monitorInfo').cpu.CPU
}

const insertCPUUsageRecord = () => {
    // Display CPU usage records
    var chartDom = document.getElementById('monitor_dashboard_cpu_usage_record')
    var myChart = echarts.init(chartDom)
    var option = {
        title: {
            text: `Current speed: ${electronStore.get('monitorInfo').cpu.CPUCurrentSpeed}`,
            textStyle: {
                color: '#fff'
            }
        },
        textStyle: {
            color: '#fff'
        },
        animation: false,
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                animation: false
            }
        },
        xAxis: {
            type: 'time',
            splitLine: {
                show: false
            }
        },
        yAxis: {
            type: 'value',
            min: 0,
            max: 100,
            boundaryGap: [0, '100%'],
            splitLine: {
                show: true,
                lineStyle: {
                    color: '#444'
                }
            }
        },
        series: [
            {
                name: 'CPU Utilization: ',
                type: 'line',
                showSymbol: false,
                data: electronStore.get('cpuUsageRecords')
            }
        ]
    }

    option && myChart.setOption(option)
}


const enableCPUDetailEvents = () => {
    document.querySelector('#monitor_dashboard_cpu_speed_clickable_block').addEventListener('click', async e => {
        addOrRemoveMonitorSummaryItem('monitor_summary_cpucurrentspeed')
    })
}