const NETWORK_NAME_COMMAND = `wmic nic where netEnabled=true get name`
const NETWORK_SEND_SPEED_COMMAND = `Get-Counter '\\Network Interface(*)\\Bytes sent/sec'`
const NETWORK_RECEIVED_SPEED_COMMAND = `Get-Counter '\\Network Interface(*)\\Bytes Received/sec'`
const NETWORK_SEND_AND_RECEIVED_COMMAND = `Get-Counter '\\Network Interface(*)\\Bytes sent/sec','\\Network Interface(*)\\Bytes Received/sec'`

module.exports =  {
    NETWORK_NAME_COMMAND,
    NETWORK_SEND_SPEED_COMMAND,
    NETWORK_RECEIVED_SPEED_COMMAND,
    NETWORK_SEND_AND_RECEIVED_COMMAND
}