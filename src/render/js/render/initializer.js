import {
    getStaticInfo,
    electronStore,
    fillMonitorSummary,
    openCPUDashboard,
    openRAMDashboard,
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
