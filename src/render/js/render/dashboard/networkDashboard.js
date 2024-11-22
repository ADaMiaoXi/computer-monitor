import {openDashboard} from '../index.js'

export const openNetworkDashboard = async () => {
    const {
        launchConfiguration: {
            networkDashboard: {isKeepRefreshing, refreshInterval}
        }
    } = electronStore.get('customizedData')
    openDashboard(displayNetworkDashboard, 'monitor_dashboard_network', refreshInterval, isKeepRefreshing)
}

const displayNetworkDashboard = async dashboard => {
    const div = document.createElement('div')
    const ntworkDashboardHtmlSnippet = await window.electronAPI.invoke('getNetworkDashboardHtml')

    div.innerHTML = ntworkDashboardHtmlSnippet

    if (dashboard.firstElementChild) {
        dashboard.replaceChild(div.firstElementChild, dashboard.firstElementChild)
    } else {
        dashboard.appendChild(div.firstElementChild)
    }

    insertNetworkUploadRecord()
    insertNetworkDownloadRecord()
    document.querySelector('.monitor_dashboard_title').innerHTML = electronStore.get('monitorInfo').network.networkCard
}

const insertNetworkUploadRecord = () => {
    var chartDom = document.getElementById('monitor_dashboard_upload_record')
    var myChart = echarts.init(chartDom)
    var option = {
        title: {
            text: `Upload`,
            textStyle: {
                color: '#fff',
                fontSize: 14
            },
            top: 5,
            left: '16'
        },
        textStyle: {
            color: '#fff'
        },
        animation: false,
        grid: {
            top: 60,
            bottom: 28,
            left: 60
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                animation: false
            },
            formatter: function (params) {
                const param = params[0]
                var date = new Date(param.name)
                return `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()} - ${convertNetworkSpeedByKiloBytes(
                    param.value[1]
                )}`
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
            name: 'Speed (KB/s)',
            min: 0,
            splitLine: {
                show: true,
                lineStyle: {
                    color: '#444'
                }
            }
        },
        series: [
            {
                name: 'Upload speed',
                type: 'line',
                lineStyle: {
                    color: '#E85566'
                },
                showSymbol: false,
                data: electronStore.get('networkUploadSpeedRecords')
            }
        ]
    }

    option && myChart.setOption(option)
}

const insertNetworkDownloadRecord = () => {
    var chartDom = document.getElementById('monitor_dashboard_download_record')
    var myChart = echarts.init(chartDom)
    var option = {
        title: {
            text: `Download`,
            textStyle: {
                color: '#fff',
                fontSize: 14
            },
            top: 0,
            left: '16'
        },
        textStyle: {
            color: '#fff'
        },
        animation: false,
        grid: {
            top: 55,
            bottom: 23,
            left: 60
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                animation: false
            },
            formatter: function (params) {
                const param = params[0]
                var date = new Date(param.name)
                return `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()} - ${convertNetworkSpeedByKiloBytes(
                    param.value[1]
                )}`
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
            name: 'Speed (KB/s)',
            min: 0,
            splitLine: {
                show: true,
                lineStyle: {
                    color: '#444'
                }
            }
        },
        series: [
            {
                name: 'Download speed',
                type: 'line',
                lineStyle: {
                    color: '#4DBE86'
                },
                showSymbol: false,
                data: electronStore.get('networkDownloadSpeedRecords')
            }
        ]
    }

    option && myChart.setOption(option)
}

function convertNetworkSpeedByKiloBytes(kiloBytes) {
    const millionBytes = Number(kiloBytes) / 1024
    if (millionBytes > 1) {
        return `${millionBytes.toFixed(2)} MB/s`
    }

    return `${Number(kiloBytes).toFixed(2)} KB/s`
}
