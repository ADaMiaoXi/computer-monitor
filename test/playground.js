var chartDom = document.getElementById('main');
var myChart = echarts.init(chartDom);

let data = [];
let times = [];

for (let i = 0; i < 60; i++) {
    const time = new Date(Date.now() - (59 - i) * 1000).toLocaleString();
    const speed = Math.floor(Math.random() * 100); // 模拟网速数据
    times.push(time);
    data.push(speed);
}

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
        name: '下载网速 (kB/s)',
        min: 0
    },
    series: [
        {
            name: '下载网速',
            type: 'line',
            data: data
        }
    ]
};

// 渲染图表
myChart.setOption(option);