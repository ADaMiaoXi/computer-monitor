import { resizeWindow } from "./index.js";

const openCPUDashboard = async () => {
    const displayCPUDashboard = async (dashboard) => {
        const div = document.createElement("div");
        div.innerHTML = `<h1 id="monitor_dashboard_cpu">CPU</h1>`;

        if (dashboard.firstElementChild) {
            dashboard.replaceChild(
                div.firstElementChild,
                dashboard.firstElementChild
            );
        } else {
            dashboard.appendChild(div.firstElementChild);
        }
    };

    openDashboard(displayCPUDashboard, "monitor_dashboard_cpu");
};
const openRAMDashboard = async () => {
    const displayRAMDashboard = async (dashboard) => {

        console.log('window.electronStore.monitorInfo:',window.electronStore.get('monitorInfo'))
        // insert HTML
        const ramDashboardHtmlSnippet =
            await window.electronApis.getRAMDashboardHtml();
        const div = document.createElement("div");

        div.innerHTML = ramDashboardHtmlSnippet;

        // Add events
        const taskRamList = div.firstElementChild.lastElementChild.children;

        for (let i = 0; i < taskRamList.length; i++) {
            const taskRamItem = taskRamList[i];
            taskRamItem.lastElementChild.addEventListener(
                "click",
                async (e) => {
                    const imageName =
                        e.target.parentElement.parentElement.firstElementChild
                            .innerText;
                    const res = await window.electronApis.killTaskByName(
                        imageName
                    );

                    console.log(res);

                    setTimeout(() => {
                        displayRAMDashboard(dashboard);
                    }, 200);
                }
            );
        }

        if (dashboard.firstElementChild) {
            dashboard.replaceChild(
                div.firstElementChild,
                dashboard.firstElementChild
            );
        } else {
            dashboard.appendChild(div.firstElementChild);
        }
    };
    openDashboard(displayRAMDashboard, "monitor_dashboard_ram");
};

// Dashboard data fetching interval
let interval;

/**
 * Open dashboard
 * @param {Function} displayContents
 * @returns
 */
export const openDashboard = async (displayContents, currentDashboardId) => {
    const dashboard = document.querySelector("#monitor_dashboard");
    closeOtherDashoard(currentDashboardId);
    const isDashboardOpen = dashboard.clientHeight > 25;
    if (isDashboardOpen) {
        closeDashboard();
        return;
    }

    interval = setInterval(async () => {
        displayContents(dashboard);
    }, 2000);

    await displayContents(dashboard);
};

/**
 * Close dashboard
 */
export const closeDashboard = () => {
    clearInterval(interval);
    const dashboard = document.querySelector("#monitor_dashboard");
    const y = dashboard.clientHeight;
    dashboard.firstElementChild.remove();
};

/**
 * Close other dashboard and display current dashboard
 * @param {String} currentDashboardId
 */
const closeOtherDashoard = (currentDashboardId) => {
    const openedDashboardId = document.querySelector("#monitor_dashboard").firstElementChild?.id;
    if (openedDashboardId && openedDashboardId !== currentDashboardId) {
        closeDashboard();
    }
};


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