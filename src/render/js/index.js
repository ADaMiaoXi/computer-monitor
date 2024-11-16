import {
    initMonitorSummary,
    enableSummaryEvents,
    resizeWindow,
    enableSpaceClickThrough,
    getIconOfProcesses,
    getCustomizedData,
    enableAutoRunStop,
    run,
    electronStore
} from './render/index.js'

/**
 * Render program window.
 */
async function render() {
    // Retrieve recorded summary data.
    const {record} = await getCustomizedData()
    // Initialize electron store.
    electronStore.initialize()
    electronStore.set('summaryItemRecord', record)
    // Initialize monitor summary.
    await initMonitorSummary()
    // Resize window size, set timeout to wait documents prepared.
    await new Promise(resolve => {
        setTimeout(async () => {
            resolve(await resizeWindow())
        }, 50)
    })
    // Attach events for monitor summary view.
    enableSummaryEvents()
    // Enable click through for empty space.
    enableSpaceClickThrough()
    // Get icon of processes.
    getIconOfProcesses()
    // Run summary data fetching.
    run()
    // Enable auto run and stop.
    enableAutoRunStop()
}

// Invoke render function.
render()
