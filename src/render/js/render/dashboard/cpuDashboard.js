import {openDashboard} from '../index.js'
/**
 * Open CPU Dashboard
 * Click event callback of CPU section on monitor summary view
 */
export const openCPUDashboard = async () => {
    const displayCPUDashboard = async dashboard => {
        const div = document.createElement('div')
        div.innerHTML = `<h1 id="monitor_dashboard_cpu">CPU</h1>`

        if (dashboard.firstElementChild) {
            dashboard.replaceChild(div.firstElementChild, dashboard.firstElementChild)
        } else {
            dashboard.appendChild(div.firstElementChild)
        }
    }

    openDashboard(displayCPUDashboard, 'monitor_dashboard_cpu')
}