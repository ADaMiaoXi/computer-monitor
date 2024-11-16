import {
    getStaticInfo,
    electronStore,
    fillMonitorSummary,
    openCPUDashboard,
    openRAMDashboard,
    closeDashboard,
    getCustomizedData,
} from "./index.js";

/**
 * Enable events invokers
 */
export const enableSummaryEvents = () => {
    document
        .querySelector("#monitor_summary_cpu_section")
        .addEventListener("click", openCPUDashboard);

    document
        .querySelector("#monitor_summary_ram_section")
        .addEventListener("click", openRAMDashboard);
};

/**
 * Enable click through for the empty space on window
 */
export const enableSpaceClickThrough = () => {
    document
        .querySelector("#empty_space")
        .addEventListener("mouseenter", (e) => {
            window.electronAPI.invoke("setIgnoreMouseEvents", true);
        });

    document
        .querySelector("#empty_space")
        .addEventListener("mouseleave", (e) => {
            window.electronAPI.invoke("setIgnoreMouseEvents", false);
        });
};

export function enableAutoRunStop() {
    window.electronAPI.listen("stopApp", stop);
    window.electronAPI.listen("runApp", () => {
        run();
    });
}

const summaryDataFetchingIntervals = [];
export async function run() {
    const summaryItemRecord = electronStore.get("summaryItemRecord");
    // Fetch data for monitor summary. And store data in `window.electronStore.monitorInfo`
    // Refresh data every 1200ms.
    const staticInfo = await getStaticInfo();

    const {
        launchConfiguration: {
            summary: { refreshInterval, isKeepRefreshing },
        },
    } = await getCustomizedData();

    await fillMonitorSummary(summaryItemRecord, staticInfo);
    if (isKeepRefreshing) {
        summaryDataFetchingIntervals.push(
            setInterval(async () => {
                await fillMonitorSummary(summaryItemRecord, staticInfo);
            }, refreshInterval)
        );
    }
}

export function stop() {
    closeDashboard();
    setTimeout(() => {
        // Stop data fetching.
        summaryDataFetchingIntervals.forEach((interval) =>
            clearInterval(interval)
        );
    }, 3000);
}
