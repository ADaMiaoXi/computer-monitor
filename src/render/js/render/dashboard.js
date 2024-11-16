import {getIconOfProcesses, getCustomizedData} from './index.js'
/**
 * Open CPU Dashboard
 * Click event callback of CPU section on monitor summary view
 */
export const openCPUDashboard = async () => {
    const displayCPUDashboard = async dashboard => {
        const div = document.createElement('div')
        div.innerHTML = `<h1 id="monitor_dashboard_cpu">CPU</h1>`

        if (dashboard.firstElementChild) {
            dashboard.replaceChild(div.firstElementChild, dashboard.firstElementChild)
        } else {
            dashboard.appendChild(div.firstElementChild)
        }
    }

    openDashboard(displayCPUDashboard, 'monitor_dashboard_cpu')
}

/**
 * Open RAM Dashboard
 * Click event callback of RAM section on monitor summary view
 */
export const openRAMDashboard = async () => {
    const displayRAMDashboard = async dashboard => {
        console.log('window.electronStore.monitorInfo:', window.electronStore.get('monitorInfo'))
        // insert HTML
        const ramDashboardHtmlSnippet = await window.electronAPI.invoke('getRAMDashboardHtml')

        const div = document.createElement('div')
        div.innerHTML = ramDashboardHtmlSnippet
        const taskRamList = div.firstElementChild.children[1].children

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
            //const regex = /^douyin/;
            img.setAttribute('src', `../../assets/processIcons/${taskRamItem.children[0].innerText}.png`)
            img.addEventListener('error', e => {
                e.target.setAttribute('src', '../../assets/processIcons/default.png')
            })
            img.classList.add('monitor_dashboard_ram_list_item_logo')
            taskRamItem.insertBefore(img, taskRamItem.firstElementChild)
        }

        if (dashboard.firstElementChild) {
            dashboard.replaceChild(div.firstElementChild, dashboard.firstElementChild)
        } else {
            dashboard.appendChild(div.firstElementChild)
        }

        // Add pie chart
        // var chartDom = document.getElementById("monitor_dashboard_ram_pie");
        // var myChart = echarts.init(chartDom);

        // const option = {
        //     title: {
        //         text: "Referer of a Website",
        //         subtext: "Fake Data",
        //         left: "center",
        //     },
        //     tooltip: {
        //         trigger: "item",
        //     },
        //     legend: {
        //         orient: "vertical",
        //         left: "left",
        //     },
        //     series: [
        //         {
        //             name: "Access From",
        //             type: "pie",
        //             radius: "50%",
        //             data: [
        //                 { value: 1048, name: "Search Engine" },
        //                 { value: 735, name: "Direct" },
        //                 { value: 580, name: "Email" },
        //                 { value: 484, name: "Union Ads" },
        //                 { value: 300, name: "Video Ads" },
        //             ],
        //             emphasis: {
        //                 itemStyle: {
        //                     shadowBlur: 10,
        //                     shadowOffsetX: 0,
        //                     shadowColor: "rgba(0, 0, 0, 0.5)",
        //                 },
        //             },
        //         },
        //     ],
        // };
        // setTimeout(() => {
        //     option && myChart.setOption(option);
        // }, 2000);
    }

    getIconOfProcesses()
    openDashboard(displayRAMDashboard, 'monitor_dashboard_ram')
}

// Dashboard data fetching interval
let interval

/**
 * Open dashboard
 * @param {Function} displayContents Render function that renders the dashboard contents
 * @param {String} dashboardId  The id of the dashboard element to be opened, used to close other dashboard that is displaying
 * @returns
 */
export const openDashboard = async (displayContents, currentDashboardId) => {
    const dashboard = document.querySelector('#monitor_dashboard')
    closeOtherDashoard(currentDashboardId)
    const isDashboardOpen = dashboard.clientHeight > 25
    if (isDashboardOpen) {
        closeDashboard()
        return
    }

    const {
        launchConfiguration: {
            ramDashboard: {isKeepRefreshing, refreshInterval}
        }
    } = await getCustomizedData()

    await displayContents(dashboard)
    if (isKeepRefreshing) {
        interval = setInterval(async () => {
            displayContents(dashboard)
        }, refreshInterval)
    }
}

/**
 * Close dashboard
 */
export const closeDashboard = () => {
    clearInterval(interval)
    const dashboard = document.querySelector('#monitor_dashboard')
    dashboard.firstElementChild?.remove()
}

/**
 * Close other dashboard and display current dashboard
 * @param {String} currentDashboardId
 */
const closeOtherDashoard = currentDashboardId => {
    const openedDashboardId = document.querySelector('#monitor_dashboard').firstElementChild?.id
    if (openedDashboardId && openedDashboardId !== currentDashboardId) {
        closeDashboard()
    }
}
