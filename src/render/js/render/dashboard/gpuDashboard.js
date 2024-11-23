import {openDashboard} from '../index.js'

export const openGPUDashboard = async () => {
    const {
        launchConfiguration: {
            gpuDashboard: {isKeepRefreshing, refreshInterval}
        }
    } = electronStore.get('customizedData')
    openDashboard(displayGpuDashboard, 'monitor_dashboard_gpu', refreshInterval, isKeepRefreshing)
}

const displayGpuDashboard = async dashboard => {
    const div = document.createElement('div')
    const gpuDashboardHtmlSnippet = await window.electronAPI.invoke('getGpuDashboardHtml')

    div.innerHTML = gpuDashboardHtmlSnippet

    if (dashboard.firstElementChild) {
        dashboard.replaceChild(div.firstElementChild, dashboard.firstElementChild)
    } else {
        dashboard.appendChild(div.firstElementChild)
    }

    insertGPUUsageRecord()
    insertGPUDecodeUsageRecord()
    insertGPUEncodeUsageRecord()
    insertGPUMemoryUsageRecord()
    insertGPUFanSpeedRecord()

    document.querySelector('.monitor_dashboard_title').innerHTML = electronStore.get('monitorInfo').gpu.GPU
}

const insertGPUUsageRecord = () => {
    var chartDom = document.getElementById('monitor_dashboard_gpu_utilization')
    var myChart = echarts.init(chartDom)
    var option = {
        title: {
            text: `Graphic speed: ${electronStore.get('monitorInfo').gpu.graphicsSpeed}`,
            textStyle: {
                fontSize: 14,
                color: '#fff'
            },
            left: '16'
        },
        textStyle: {
            color: '#fff'
        },
        animation: false,
        grid: {
            top: 55,
            bottom: 23,
            left: 55
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                animation: false
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
            name: 'Graphic (%)',
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
                name: 'GPU Utilization: ',
                type: 'line',
                showSymbol: false,
                lineStyle: {
                    color: '#6DAB06'
                },
                data: electronStore.get('gpuUsageRecords')
            }
        ]
    }

    option && myChart.setOption(option)
}

const insertGPUDecodeUsageRecord = () => {
    var chartDom = document.getElementById('monitor_dashboard_gpu_video_decode')
    var myChart = echarts.init(chartDom)
    var option = {
        title: {
            text: `Video speed: ${electronStore.get('monitorInfo').gpu.videoSpeed}`,
            textStyle: {
                fontSize: 14,
                color: '#fff'
            },
            left: '16'
        },
        textStyle: {
            color: '#fff'
        },
        animation: false,
        grid: {
            top: 55,
            bottom: 23,
            left: 55
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                animation: false
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
            },
            minInterval: 1000 * 10 * 2
        },
        yAxis: {
            type: 'value',
            name: 'Decode (%)',
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
                name: 'GPU decode utilization: ',
                type: 'line',
                showSymbol: false,
                data: electronStore.get('gpuDecodeUsageRecords')
            }
        ]
    }

    option && myChart.setOption(option)
}

const insertGPUEncodeUsageRecord = () => {
    var chartDom = document.getElementById('monitor_dashboard_gpu_video_encode')
    var myChart = echarts.init(chartDom)
    var option = {
        title: {
            show: false
        },
        textStyle: {
            color: '#fff'
        },
        animation: false,
        grid: {
            top: 55,
            bottom: 23,
            left: 35
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                animation: false
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
            },
            minInterval: 1000 * 10 * 2
        },
        yAxis: {
            type: 'value',
            name: 'Encode (%)',
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
                name: 'GPU encode utilization: ',
                type: 'line',
                showSymbol: false,
                data: electronStore.get('gpuEncodeUsageRecords')
            }
        ]
    }

    option && myChart.setOption(option)
}

const insertGPUMemoryUsageRecord = () => {
    var chartDom = document.getElementById('monitor_dashboard_gpu_memory_usage')
    var myChart = echarts.init(chartDom)
    var option = {
        title: {
            text: `Memory speed: ${electronStore.get('monitorInfo').gpu.memorySpeed}`,
            textStyle: {
                fontSize: 14,
                color: '#fff'
            },
            left: '16'
        },
        textStyle: {
            color: '#fff'
        },
        animation: false,
        grid: {
            top: 55,
            bottom: 23,
            left: 55
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                animation: false
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
            },
            minInterval: 1000 * 10 * 2
        },
        yAxis: {
            type: 'value',
            name: 'Memory (%)',
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
                name: 'GPU memory utilization: ',
                type: 'line',
                showSymbol: false,
                data: electronStore.get('gpuMemoryUsageRecords')
            }
        ]
    }

    option && myChart.setOption(option)
}

const insertGPUFanSpeedRecord = () => {
    var chartDom = document.getElementById('monitor_dashboard_gpu_fan')
    var myChart = echarts.init(chartDom)
    var option = {
        title: {
            show: false
        },
        textStyle: {
            color: '#fff'
        },
        animation: false,
        grid: {
            top: 55,
            bottom: 23,
            left: 35
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                animation: false
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
            },
            minInterval: 1000 * 10 * 2
        },
        yAxis: {
            type: 'value',
            name: 'Fan (%)',
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
                name: 'Fan: ',
                type: 'line',
                showSymbol: false,
                data: electronStore.get('gpuFanSpeedRecords')
            }
        ]
    }

    option && myChart.setOption(option)
}
