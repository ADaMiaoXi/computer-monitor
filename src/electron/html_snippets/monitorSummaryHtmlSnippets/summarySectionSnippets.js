const NETWORK_SECTION_HTML_SNIPPET = `
<div
    id="monitor_summary_network_section"
    class="monitor_summary_section"
></div>`;

const CPU_SECTION_HTML_SNIPPET = `
<div
    id="monitor_summary_cpu_section"
    class="monitor_summary_section"
>
    <svg
        height="25"
        width="25"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="-1 -2 18 18"
        class="dragable"
    >
        <image
            height="15"
            width="15"
            href="../../assets/svg/cpu.svg"
        />
    </svg>
</div>`;

const GPU_SECTION_HTML_SNIPPET = `
<div
     id="monitor_summary_gpu_section"
     class="monitor_summary_section"
 >
     <svg
         height="25"
         width="25"
         xmlns="http://www.w3.org/2000/svg"
         viewBox="0 0 16 16"
         class="dragable"
     >
         <image
             height="15"
             width="15"
             href="../../assets/svg/gpu.svg"
         />
     </svg>
 </div>`;

const RAM_SECTION_HTML_SNIPPET = `
<div
    id="monitor_summary_ram_section"
    class="monitor_summary_section"
>
    <svg
        height="25"
        width="25"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="-2 -2 20 20"
        class="dragable"
    >
        <image
            height="15"
            width="15"
            href="../../assets/svg/ram.svg"
        />
    </svg>
</div>`;

module.exports = {
    NETWORK_SECTION_HTML_SNIPPET,
    CPU_SECTION_HTML_SNIPPET,
    GPU_SECTION_HTML_SNIPPET,
    RAM_SECTION_HTML_SNIPPET,
};
