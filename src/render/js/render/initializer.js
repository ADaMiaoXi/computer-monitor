import {
    getStaticInfo,
    electronStore,
    fillMonitorSummary,
    openCPUDashboard,
    openRAMDashboard,
    openNetworkDashboard,
    closeDashboard,
    getIconOfProcesses
} from './index.js'

/**
 * Enable events invokers
 */
export const enableSummaryEvents = () => {
    document.querySelector('#monitor_summary_cpu_section').addEventListener('click', () => {
        getIconOfProcesses(true)
        openCPUDashboard()
    })

    document.querySelector('#monitor_summary_ram_section').addEventListener('click', () => {
        getIconOfProcesses(true)
        openRAMDashboard()
    })

    document.querySelector('#monitor_summary_network_section').addEventListener('click', () => {
        openNetworkDashboard()
    })
}

/**
 * Enable click through for the empty space on window
 */
export const enableSpaceClickThrough = () => {
    document.querySelector('#empty_space').addEventListener('mouseenter', e => {
        window.electronAPI.invoke('setIgnoreMouseEvents', true)
    })

    document.querySelector('#empty_space').addEventListener('mouseleave', e => {
        window.electronAPI.invoke('setIgnoreMouseEvents', false)
    })
}

/**
 * Enable data fetching auto run and stop.
 */
export function enableAutoRunStop() {
    window.electronAPI.listen('stopApp', stop)
    window.electronAPI.listen('runApp', () => {
        run()
    })
}

/**
 * Start data fetching and update monitor summary.
 */
const summaryDataFetchingIntervals = []
export async function run() {
    // Fetch data for monitor summary. And store data in `window.electronStore.monitorInfo`
    // Refresh data every 1200ms.
    const staticInfo = await getStaticInfo()

    const {
        launchConfiguration: {
            summary: {refreshInterval, isKeepRefreshing}
        }
    } = await electronStore.get('customizedData')

    await fillMonitorSummary(staticInfo)
    if (isKeepRefreshing) {
        summaryDataFetchingIntervals.forEach(interval => clearInterval(interval))
        summaryDataFetchingIntervals.push(
            setInterval(async () => {
                await fillMonitorSummary(staticInfo)
                recordCPUUsage(electronStore.get('monitorInfo').cpu.CPUUsage)
            }, refreshInterval)
        )
    }
}

/**
 * Stop data fetching and close dashboard.
 */
export function stop() {
    closeDashboard()
    setTimeout(() => {
        summaryDataFetchingIntervals.forEach(interval => clearInterval(interval))
    }, 3000)
}

/**
 * recordCPUUsage
 * @param {string} usage
 */
export function recordCPUUsage(usage) {
    if (usage) {
        usage = Number(usage.replace('%', ''))
    } else {
        return
    }
    const cpuUsageRecords = electronStore.get('cpuUsageRecords')
    if (cpuUsageRecords.length >= 60) {
        cpuUsageRecords.shift()
        cpuUsageRecords.push({
            name: new Date().toISOString(),
            value: [new Date().getTime(), usage]
        })
    } else {
        cpuUsageRecords.push({
            name: new Date().toISOString(),
            value: [new Date().getTime(), usage]
        })
    }
    electronStore.set('cpuUsageRecords', cpuUsageRecords)
}

/**
 * recordNetworkUploadSpeed
 * @param {string} usage
 */
export function recordNetworkUploadSpeed(speed) {
    
   
}