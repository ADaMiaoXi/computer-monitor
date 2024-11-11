import config from "./configuration/index.js";
import {
    getStaticInfo,
    initMonitorSummary,
    fillMonitorSummary,
    enableSummaryEvents,
    resizeWindow,
    enableSpaceClickThrough
} from "./renderUtils/index.js";

const { summaryItemRecord } = config;

async function render() {
    // initial electron store
    window.electronStore = new Map()
    
    await initMonitorSummary(summaryItemRecord);

    await new Promise((resolve) => {
        setTimeout(async () => {
            resolve(await resizeWindow());
        }, 50);
    });

    enableSummaryEvents();

    enableSpaceClickThrough();

    const staticInfo = await getStaticInfo();
    setInterval(async () => {
        await fillMonitorSummary(summaryItemRecord, staticInfo);
    }, 1200);
}

render();
