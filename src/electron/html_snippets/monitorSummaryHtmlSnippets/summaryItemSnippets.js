const DOWNLOAD_SPEED_HTML_SNIPPET = `
<div
    id="monitor_summary_downloadspeed"
    class="monitor_summary_item monitor_summary_network_item"
    data-parentId="monitor_summary_network_section"
    data-path="network.downloadSpeed"
>
    <div>
        <svg
            height="25"
            width="25"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="-5 -5 25 25"
            class="dragable"
        >
        >
            <image
                height="15"
                width="15"
                href="../../assets/svg/download.svg"
            />
        </svg>
    </div>
    <div class="monitor_summary_data_value">****.** KB/s</div>
</div>`

const UPLOAD_SPEED_HTML_SNIPPET = `
<div
    id="monitor_summary_uploadspeed"
    class="monitor_summary_item monitor_summary_network_item"
    data-parentId="monitor_summary_network_section"
    data-path="network.uploadSpeed"
>
    <svg
        height="25"
        width="25"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="-5 -5 25 25"
        class="dragable"
    >
        <image
            height="15"
            width="15"
            href="../../assets/svg/upload.svg"
        />
    </svg>
    <div class="monitor_summary_data_value">****.** KB/s</div>
</div>`

const GPU_USAGE_SNIPPET = `
<div
    id="monitor_summary_gpuusage"
    class="monitor_summary_item monitor_summary_gpuusage_item"
    data-parentId="monitor_summary_gpu_section"
    data-path="gpu.GPUUsage"
>
    
    <div class="monitor_summary_data_label">Usage:</div>
    <div class="monitor_summary_data_value usage">*** %</div>
</div>`

const CPU_USAGE_SNIPPET = `
<div
    id="monitor_summary_cpuusage"
    class="monitor_summary_item monitor_summary_cpuusage_item"
    data-parentId="monitor_summary_cpu_section"
    data-path="cpu.CPUUsage"
>
    <div class="monitor_summary_data_label">Usage:</div>
    <div class="monitor_summary_data_value usage">**.** %</div>
</div>`

const RAM_USAGE_SNIPPET = `
<div
    id="monitor_summary_ramusage"
    class="monitor_summary_item monitor_summary_ramusage_item"
    data-parentId="monitor_summary_ram_section"
    data-path="memory.memoryUsage"
>
    <div class="monitor_summary_data_label">Usage:</div>
    <div class="monitor_summary_data_value usage">**.** %</div>
</div>`

module.exports = {
    DOWNLOAD_SPEED_HTML_SNIPPET,
    UPLOAD_SPEED_HTML_SNIPPET,
    GPU_USAGE_SNIPPET,
    CPU_USAGE_SNIPPET,
    RAM_USAGE_SNIPPET
}
