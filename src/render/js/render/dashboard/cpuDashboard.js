import {addOrRemoveMonitorSummaryItem, openDashboard} from '../index.js'
/**
 * Open CPU Dashboard
 * Click event callback of CPU section on monitor summary view
 */
export const openCPUDashboard = async () => {
    openDashboard(displayCPUDashboard, 'monitor_dashboard_cpu', false)
}

const displayCPUDashboard = async (dashboard, currentDashboardId) => {
    //const userDataPath = electronStore.get('userDataPath')
    const div = document.createElement('div')
    const cpuDashboardHtmlSnippet = await window.electronAPI.invoke('getCPUDashboardHtml')
    div.innerHTML = cpuDashboardHtmlSnippet

    dashboard.appendChild(div.firstElementChild)

    const {
        launchConfiguration: {
            cpuDashboard: {isKeepRefreshing, refreshInterval}
        }
    } = electronStore.get('customizedData')

    insertCPUUsageList()
    insertCPUUsageRecord()

    if (isKeepRefreshing) {
        window.dashboardInterval = setInterval(() => {
            insertCPUUsageList()
            updateCPUUsageRecord()
        }, refreshInterval)
    }

    enableCPUDetailEvents()
    document.querySelector('.monitor_dashboard_title').innerHTML = electronStore.get('monitorInfo').cpu.CPU
}

const insertCPUUsageList = async () => {
    const cpuTaskList = await window.electronAPI.invoke('getCPUTasklist')
    const cpuListHtml = await window.electronAPI.invoke('getCPUListHtml', cpuTaskList)
    document.querySelector('#monitor_dashboard_cpu_list').innerHTML = cpuListHtml

    const taskCpuList = document.querySelector('#monitor_dashboard_cpu_list').children

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
                insertCPUUsageList()
            }, 200)
            console.log(imageName)
        })
    }
}

const insertCPUUsageRecord = () => {
    // Display CPU usage records
    var cpuRecordChartDom = document.getElementById('monitor_dashboard_cpu_usage_record')
    var cpuRecordChart = echarts.init(cpuRecordChartDom)
    var option = {
        title: {
            text: `Current speed: ${electronStore.get('monitorInfo').cpu.CPUCurrentSpeed}`,
            textStyle: {
                color: '#fff'
            },
            left: '16'
        },
        textStyle: {
            color: '#fff'
        },
        animation: true,
        grid: {
            top: 65,
            bottom: 23,
            left: 63
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                animation: true
            },
            formatter: function (params) {
                const param = params[0]
                var date = new Date(param.name)
                return `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()} - ${param.value[1]} %`
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
            name: 'Utillization (%)',
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

    cpuRecordChart.setOption(option)
    electronStore.get('initializedCharts').push(cpuRecordChart)
}

const updateCPUUsageRecord = () => {
    const cpuRecordChart = electronStore.get('initializedCharts')[0]
    cpuRecordChart.setOption({
        title: {
            text: `Current speed: ${electronStore.get('monitorInfo').cpu.CPUCurrentSpeed}`
        },
        series: [
            {
                data: electronStore.get('cpuUsageRecords')
            }
        ]
    })
}

const enableCPUDetailEvents = () => {
    document.querySelector('#monitor_dashboard_cpu_speed_clickable_block').addEventListener('click', async e => {
        addOrRemoveMonitorSummaryItem('monitor_summary_cpucurrentspeed')
    })
}
