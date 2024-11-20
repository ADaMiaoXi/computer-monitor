var chartDom = document.getElementById('main')
var myChart = echarts.init(chartDom)
var option

let data = [
    {name: 'test1', value: 10},
    {name: 'test2', value: 2},
    {name: 'test3', value: 12},
    {name: 'test4', value: 1},
    {name: 'test5', value: 14}
]

option = {
    title: {
        text: 'Dynamic Data & Time Axis'
    },
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
        boundaryGap: [0, '100%'],
        splitLine: {
            show: false
        }
    },
    series: [
        {
            name: 'Fake Data',
            type: 'line',
            showSymbol: false,
            data: data
        }
    ]
}

option && myChart.setOption(option)
