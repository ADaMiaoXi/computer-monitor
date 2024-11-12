import config from "./configuration/index.js";
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
 * Retrieve summary item record.
 */
const { summaryItemRecord } = config;

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
    setInterval(async () => {
        await fillMonitorSummary(summaryItemRecord, staticInfo);
    }, 1200);
}

// Invoke render function.
render();
