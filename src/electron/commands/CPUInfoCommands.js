const CPU_MAX_SPPED_COMMAND = `wmic cpu get MaxClockSpeed`
const CPU_USEAGE_PERCENTAGE_COMMAND = `Get-Counter -Counter '\\Processor Information(_Total)\\% Processor Performance'`
const CPU_PROCESSOR_TIME_COMMAND = `wmic path win32_perfformatteddata_perfproc_process get name,PercentProcessorTime`

module.exports = {
    CPU_MAX_SPPED_COMMAND,
    CPU_USEAGE_PERCENTAGE_COMMAND
}
