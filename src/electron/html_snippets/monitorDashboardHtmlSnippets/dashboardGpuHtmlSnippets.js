const gpuDashboardHtmlSnippet = `
<div class="monitor_dashboard_gpu" id="monitor_dashboard_gpu">
    <div class="monitor_dashboard_title dragable">GPU</div>
    <div id="monitor_dashboard_gpu_line_graph">
        <div id="monitor_dashboard_gpu_utilization"></div>
        <div id="monitor_dashboard_gpu_video">
            <div id="monitor_dashboard_gpu_video_decode"></div>
            <div id="monitor_dashboard_gpu_video_encode"></div>
        </div>
        <div id="monitor_dashboard_gpu_memory_fan">
            <div id="monitor_dashboard_gpu_memory_usage"></div>
            <div id="monitor_dashboard_gpu_fan"></div>
        </div>
    </div>
</div>
`

module.exports = {gpuDashboardHtmlSnippet}