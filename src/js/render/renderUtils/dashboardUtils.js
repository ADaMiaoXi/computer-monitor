import {getIconOfProcesses} from './commonUtils.js'
/**
 * Open CPU Dashboard
 * Click event callback of CPU section on monitor summary view
 */
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

/**
 * Open RAM Dashboard
 * Click event callback of RAM section on monitor summary view
 */
const openRAMDashboard = async () => {
    const displayRAMDashboard = async (dashboard) => {
        console.log(
            "window.electronStore.monitorInfo:",
            window.electronStore.get("monitorInfo")
        );
        // insert HTML
        const ramDashboardHtmlSnippet =
            await window.electronApis.getRAMDashboardHtml();

        getIconOfProcesses();

        const div = document.createElement("div");
        div.innerHTML = ramDashboardHtmlSnippet;
        const taskRamList = div.firstElementChild.lastElementChild.children;

        for (let i = 0; i < taskRamList.length; i++) {
            const taskRamItem = taskRamList[i];
            // Add event
            taskRamItem.lastElementChild.addEventListener(
                "click",
                async (e) => {
                    const imageName =
                        e.target.parentElement.parentElement.children[1]
                            .innerText;
                    const res = await window.electronApis.killTaskByName(
                        imageName
                    );

                    setTimeout(() => {
                        displayRAMDashboard(dashboard);
                    }, 200);
                }
            );

            // Add logo image
            const img = document.createElement("img");
            img.setAttribute(
                "src",
                `../../static/pic/${taskRamItem.children[0].innerText}.png`
            );
            img.addEventListener(
                "error",
                e => {
                    e.target.setAttribute("src", "../../static/pic/default.png");
                }
            );
            img.classList.add("monitor_dashboard_ram_list_item_logo")
            taskRamItem.insertBefore(img, taskRamItem.firstElementChild);
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
 * @param {Function} displayContents Render function that renders the dashboard contents
 * @param {String} dashboardId  The id of the dashboard element to be opened, used to close other dashboard that is displaying
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

    await displayContents(dashboard);
    
    interval = setInterval(async () => {
        displayContents(dashboard);
    }, 2500);
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
    const openedDashboardId =
        document.querySelector("#monitor_dashboard").firstElementChild?.id;
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
