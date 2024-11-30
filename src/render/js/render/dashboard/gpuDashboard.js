import {openDashboard} from '../index.js'
export const openGPUDashboard = async () => {
    openDashboard(displayGpuDashboard, 'monitor_dashboard_gpu')
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

    insertGraphs()

    document.querySelector('.monitor_dashboard_title').innerHTML = electronStore.get('monitorInfo').gpu.GPU
}

const insertGraphs = () => {
    // 1. insertGPUUsageRecord
    const gpuUtilizationChatDom = document.getElementById('monitor_dashboard_gpu_utilization')
    const gpuUtilizationChart = echarts.init(gpuUtilizationChatDom)
    const gpuUtilizationChartOption = {
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
        animation: true,
        grid: {
            top: 55,
            bottom: 23,
            left: 55
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                animation: true
            },
            formatter: function (params) {
                const param = params[0]
                const date = new Date(param.name)
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

    gpuUtilizationChart.setOption(gpuUtilizationChartOption)
    electronStore.get('initializedCharts').push(gpuUtilizationChart)

    //2.insertGPUDecodeUsageRecord
    const gpuVideoDecodeChartDom = document.getElementById('monitor_dashboard_gpu_video_decode')
    const gpuVideoDecodeChart = echarts.init(gpuVideoDecodeChartDom)
    const gpuVideoDecodeChartOption = {
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
        animation: true,
        grid: {
            top: 55,
            bottom: 23,
            left: 55
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                animation: true
            },
            formatter: function (params) {
                const param = params[0]
                const date = new Date(param.name)
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

    gpuVideoDecodeChart.setOption(gpuVideoDecodeChartOption)
    electronStore.get('initializedCharts').push(gpuVideoDecodeChart)

    //3.insertGPUEncodeUsageRecord
    const gpuVideoEncodeChartDom = document.getElementById('monitor_dashboard_gpu_video_encode')
    const gpuVideoEncodeChart = echarts.init(gpuVideoEncodeChartDom)
    const gpuVideoEncodeChartOption = {
        title: {
            show: false
        },
        textStyle: {
            color: '#fff'
        },
        animation: true,
        grid: {
            top: 55,
            bottom: 23,
            left: 35
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                animation: true
            },
            formatter: function (params) {
                const param = params[0]
                const date = new Date(param.name)
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

    gpuVideoEncodeChart.setOption(gpuVideoEncodeChartOption)
    electronStore.get('initializedCharts').push(gpuVideoEncodeChart)

    //4.insertGPUMemoryUsageRecord
    const gpuMemoryUsageChartDom = document.getElementById('monitor_dashboard_gpu_memory_usage')
    const gpuMemoryUsageChart = echarts.init(gpuMemoryUsageChartDom)
    const gpuMemoryUsageChartOption = {
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
        animation: true,
        grid: {
            top: 55,
            bottom: 23,
            left: 55
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                animation: true
            },
            formatter: function (params) {
                const param = params[0]
                const date = new Date(param.name)
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

    gpuMemoryUsageChart.setOption(gpuMemoryUsageChartOption)
    electronStore.get('initializedCharts').push(gpuMemoryUsageChart)

    //5.insertGPUFanSpeedRecord
    const gpuFanChartDom = document.getElementById('monitor_dashboard_gpu_fan')
    const gpuFanChart = echarts.init(gpuFanChartDom)
    const gpuFanChartOption = {
        title: {
            show: false
        },
        textStyle: {
            color: '#fff'
        },
        animation: true,
        grid: {
            top: 55,
            bottom: 23,
            left: 35
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                animation: true
            },
            formatter: function (params) {
                const param = params[0]
                const date = new Date(param.name)
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

    gpuFanChart.setOption(gpuFanChartOption)
    electronStore.get('initializedCharts').push(gpuFanChart)

    //6.insertGPUTemperatureGauge
    const gpuTemperatureChartDom = document.getElementById('monitor_dashboard_gpu_temperature')
    const gpuTemperatureChart = echarts.init(gpuTemperatureChartDom)
    const gpuTemperatureChartOption = {
        animation: true,
        series: [
            {
                type: 'gauge',
                center: ['50%', '70%'],
                startAngle: 200,
                endAngle: -20,
                min: 0,
                max: 100,
                splitNumber: 20,
                itemStyle: {
                    color: getTemporatureColor()
                },
                progress: {
                    show: true,
                    width: 8
                },
                pointer: {
                    show: false
                },
                axisLine: {
                    lineStyle: {
                        width: 8
                    }
                },
                axisTick: {
                    distance: -32,
                    splitNumber: 5,
                    lineStyle: {
                        width: 2,
                        color: '#aaa'
                    }
                },
                splitLine: {
                    distance: -32,
                    length: 14,
                    lineStyle: {
                        width: 1,
                        color: '#aaa'
                    }
                },
                axisLabel: {
                    distance: -20,
                    color: '#fff',
                    fontSize: 9
                },
                anchor: {
                    show: false
                },
                title: {
                    show: false
                },
                detail: {
                    valueAnimation: true,
                    width: '60%',
                    lineHeight: 25,
                    borderRadius: 8,
                    offsetCenter: [0, '-15%'],
                    fontSize: 18,
                    fontWeight: 'bolder',
                    formatter: '{value} °C',
                    color: 'inherit'
                },
                data: [
                    {
                        value: Number(electronStore.get('monitorInfo').gpu.GPUTemperature.replace(' C', ''))
                    }
                ]
            }
        ]
    }
    gpuTemperatureChart.setOption(gpuTemperatureChartOption)
    electronStore.get('initializedCharts').push(gpuTemperatureChart)

    // refresh data
    const {
        launchConfiguration: {
            gpuDashboard: {isKeepRefreshing, refreshInterval}
        }
    } = electronStore.get('customizedData')

    if (isKeepRefreshing) {
        window.dashboardInterval = setInterval(() => {
            //1. refresh gpuUtilizationChart
            gpuUtilizationChart.setOption({
                title: {
                    text: `Graphic speed: ${electronStore.get('monitorInfo').gpu.graphicsSpeed}`
                },
                series: [
                    {
                        data: electronStore.get('gpuUsageRecords')
                    }
                ]
            })

            //2.refresh gpuVideoDecodeChart
            gpuVideoDecodeChart.setOption({
                title: {
                    text: `Video speed: ${electronStore.get('monitorInfo').gpu.videoSpeed}`
                },
                series: [
                    {
                        data: electronStore.get('gpuDecodeUsageRecords')
                    }
                ]
            })

            //3.refresh gpuVideoEncodeChart
            gpuVideoEncodeChart.setOption({
                series: [
                    {
                        data: electronStore.get('gpuEncodeUsageRecords')
                    }
                ]
            })

            //4.refresh gpuMemoryUsageChart
            gpuMemoryUsageChart.setOption({
                title: {
                    text: `Memory speed: ${electronStore.get('monitorInfo').gpu.memorySpeed}`
                },
                series: [
                    {
                        data: electronStore.get('gpuMemoryUsageRecords')
                    }
                ]
            })

            //5.refresh gpuFanChart
            gpuFanChart.setOption({
                series: [
                    {
                        data: electronStore.get('gpuFanSpeedRecords')
                    }
                ]
            })

            //6. refresh gpuTemperatureChart
            gpuTemperatureChart.setOption({
                series: [
                    {
                        data: [
                            {
                                value: Number(electronStore.get('monitorInfo').gpu.GPUTemperature.replace(' C', ''))
                            }
                        ]
                    }
                ]
            })
        }, refreshInterval)
    }
}

const getTemporatureColor = () => {
    const t = Number(electronStore.get('monitorInfo').gpu.GPUTemperature.replace(' C', ''))
    if (t < 50) {
        return '#6DAB06'
    } else if (t < 70) {
        return '#ffce61'
    } else {
        return '#dd2222'
    }
}
