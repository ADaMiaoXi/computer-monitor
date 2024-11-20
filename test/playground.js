var chartDom = document.getElementById('main');
var myChart = echarts.init(chartDom);
var option;

// 模拟 CPU 使用率数据
function getCPUUsage() {
    return Math.floor(Math.random() * 101); // 生成 0-100 的随机数
}

let data = [];

// 初始化数据
for (let i = 0; i < 100; i++) {
    data.push({
        name: new Date().toISOString(),
        value: [new Date().getTime() + i, getCPUUsage()]
    });
}

option = {
    title: {
        text: 'CPU 使用率'
    },
    animation:false,
    tooltip: {
        trigger: 'axis',
        axisPointer: {
            animation: false
        }
    },
    xAxis: {
        type: 'time',
        splitLine: {
            show: true
        }
    },
    yAxis: {
        type: 'value',
        min: 0,
        max: 100,
        boundaryGap: [0, '100%'],
        splitLine: {
            show: true
        }
    },
    series: [
        {
            name: 'CPU 使用率',
            type: 'line',
            showSymbol: false,
            data: data
        }
    ]
};

option && myChart.setOption(option);

// 动态更新数据
// setInterval(() => {
//     // 添加新的数据点
//     data.push({
//         name: new Date().toISOString(),
//         value: [new Date().getTime(), getCPUUsage()]
//     });

//     // 保留最近 20 个数据点
//     if (data.length > 20) {
//         data.shift();
//     }

//     // 更新图表
//     myChart.setOption({
//         series: [{
//             data: data
//         }]
//     });
// }, 1000);