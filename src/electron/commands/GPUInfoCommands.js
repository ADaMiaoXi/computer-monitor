const GPU_INFO_COMMAND = `nvidia-smi.exe -q`

// (((Get-Counter "\GPU Process Memory(*)\Local Usage").CounterSamples | where CookedValue).CookedValue | measure -sum).sum
// (((Get-Counter "\GPU Engine(*engtype_3D)\Utilization Percentage").CounterSamples | where CookedValue).CookedValue | measure -sum).sum

module.exports = {GPU_INFO_COMMAND}
