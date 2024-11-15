import {
    summaryItemRecord,
    launchConfiguration,
} from "../../configuration/index.js";
import {
    getStaticInfo,
    initMonitorSummary,
    fillMonitorSummary,
    enableSummaryEvents,
    resizeWindow,
    enableSpaceClickThrough,
    getIconOfProcesses,
    closeDashboard,
} from "./render/index.js";

const summaryDataFetchingIntervals = [];
async function run() {
    // Fetch data for monitor summary. And store data in `window.electronStore.monitorInfo`
    // Refresh data every 1200ms.
    const staticInfo = await getStaticInfo();

    const {
        summary: { refreshInterval, isKeepRefreshing },
    } = launchConfiguration;

    await fillMonitorSummary(summaryItemRecord, staticInfo);
    if (isKeepRefreshing) {
        summaryDataFetchingIntervals.push(
            setInterval(async () => {
                await fillMonitorSummary(summaryItemRecord, staticInfo);
            }, refreshInterval)
        );
    }
}

function stop() {
    closeDashboard();
    setTimeout(() => {
        // Stop data fetching.
        summaryDataFetchingIntervals.forEach((interval) =>
            clearInterval(interval)
        );
    }, 3000);
}

function enableAutoRunStop() {
    window.electronAPI.listen("stopApp", stop);
    window.electronAPI.listen("runApp", run);
}

/**
 * Render program window.
 */
async function render() {
    // Initialize electron store.
    window.electronStore = new Map();
    // Initialize monitor summary.
    await initMonitorSummary(summaryItemRecord);
    // Resize window size, set timeout to wait documents prepared.
    await new Promise((resolve) => {
        setTimeout(async () => {
            resolve(await resizeWindow());
        }, 50);
    });

    // Attach events for monitor summary view.
    enableSummaryEvents();
    // Enable click through for empty space.
    enableSpaceClickThrough();
    // Get icon of processes.
    getIconOfProcesses();
    // Run summary data fetching.
    run();
    // Enable auto run and stop.
    enableAutoRunStop();
}

// Invoke render function.
render();
