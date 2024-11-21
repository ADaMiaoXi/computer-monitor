import {openDashboard} from '../index.js'

export const openNetworkDashboard = async () => {
    const {
        launchConfiguration: {
            networkDashboard: {isKeepRefreshing, refreshInterval}
        }
    } = electronStore.get('customizedData')
    openDashboard(displayNetworkDashboard, 'monitor_dashboard_network', refreshInterval, isKeepRefreshing)
}

const displayNetworkDashboard = async (dashboard) => {
    const div = document.createElement('div')
    const ntworkDashboardHtmlSnippet = await window.electronAPI.invoke('getNetworkDashboardHtml')

    div.innerHTML = ntworkDashboardHtmlSnippet

    insertNetworkUploadRecord()

    if (dashboard.firstElementChild) {
        dashboard.replaceChild(div.firstElementChild, dashboard.firstElementChild)
    } else {
        dashboard.appendChild(div.firstElementChild)
    }


    document.querySelector('.monitor_dashboard_title').innerHTML = electronStore.get('monitorInfo').network.networkCard
}

const insertNetworkUploadRecord = () => {
    var chartDom = document.getElementById('monitor_dashboard_upload_record')
    const chart = echarts.init(chartDom);

    let data = [];
    let times = [];

     // 设置 ECharts 配置
     const option = {
        title: {
            text: '网络速度监控'
        },
        tooltip: {
            trigger: 'axis'
        },
        xAxis: {
            type: 'category',
            data: times,
            axisLabel: {
                formatter: function (value) {
                    return value.split(' ')[1]; // 只显示时分秒
                }
            }
        },
        yAxis: {
            type: 'value',
            name: '网速 (kB/s)',
            min: 0
        },
        series: [
            {
                name: '网速',
                type: 'line',
                data: data
            }
        ]
    };

    // 渲染图表
    chart.setOption(option);
}