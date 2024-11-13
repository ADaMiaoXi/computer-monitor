import {
    summaryItemRecord,
    launchConfiguration,
} from "./configuration/index.js";
import {
    getStaticInfo,
    initMonitorSummary,
    fillMonitorSummary,
    enableSummaryEvents,
    resizeWindow,
    enableSpaceClickThrough,
    getIconOfProcesses,
} from "./renderUtils/index.js";

/**
 * Render program window.
 */
async function render() {
    // Initial electron store.
    window.electronStore = new Map();
    // Initial monitor summary.
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

    getIconOfProcesses();

    // Fetch data for monitor summary. And store data in `window.electronStore.monitorInfo`
    // Refresh data every 1200ms.
    const staticInfo = await getStaticInfo();

    const {
        summary: {
            monitorSummaryRefreshInterval,
            isMonitorSummaryKeepRefreshing,
        },
    } = launchConfiguration;

    await fillMonitorSummary(summaryItemRecord, staticInfo);
    if (isMonitorSummaryKeepRefreshing) {
        setInterval(async () => {
            await fillMonitorSummary(summaryItemRecord, staticInfo);
        }, monitorSummaryRefreshInterval);
    }
}

// Invoke render function.
render();
