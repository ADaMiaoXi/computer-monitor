const {exec} = require('child_process')

const iconv = require('iconv-lite')

/**
 * Execute windows CMD command.
 * @param {string} command
 * @param {Function} callback
 * @returns {Promise<string | undefined>} promise with command result
 */
function executeCommand(command, callback, options = {}) {
    return new Promise(resolve => {
        console.info(`[Command] '${command}' is ececuting...`)
        exec(command, {encoding: 'buffer', ...options}, function (error, stdout, stderr) {
            if (error) {
                console.error(error)
                console.info(`[Command] '${command}' ececuted failed!`)
            }
            resolve(callback(iconv.decode(stdout, 'cp936')))
            console.info(`[Command] '${command}' ececuted successed!`)
        })
    })
}

/**
 * Execute powershell command.
 * @param {string} command
 * @param {Function} callback
 * @returns {Promise<string | undefined>} promise with command result
 */
function executePowershellCommand(command, callback) {
    return executeCommand(`${command}`, callback, {shell: 'powershell.exe'})
    //return executeCommand(`powershell.exe ${command}`, callback)
}

/**
 *
 * @param {Array<string>} commands
 * @returns {string} combined command
 */
function combineCommands(commands) {
    return commands.reduce((pre, cur) => `${pre};${cur}`)
}

/**
 *
 * @param {Array<string>[]} commands
 * @returns {string} combined command with the same type
 */
function combineCommandsWithCommonType(commands) {
    const commonType = checkAndRetrieveCommonCommandType(commands)
    const params = retrieveParams(commands)
    if (!commonType) {
        console.error('Combine Command with Common Failed, found different types of command!')
        return ''
    }
    return commands.reduce((pre, cur, index) => {
        const i = cur.search("'")
        return `${pre}${index === 0 ? ' ' + params + ' ' : ','}${cur.slice(i)}`
    }, commonType)
}

/**
 * Retrieve parameters from passed commands
 * @param {Array<string>[]} commands
 * @returns {Array<string>} params
 */
function retrieveParams(commands) {
    const params = []
    commands.forEach(command => {
        command.split(' ').forEach(split => {
            if (split.startsWith('-')) {
                params.push(split)
            }
        })
    })
    return params
}

/**
 *
 * @param {Array<string>[]} commands
 * @returns {string} Common cammand type
 */
function checkAndRetrieveCommonCommandType(commands) {
    const firstCommandType = commands[0].split(' ')[0]
    const diffIndex = commands.findIndex(command => command.split(' ')[0] !== firstCommandType)
    if (diffIndex !== -1) {
        return undefined
    }
    return firstCommandType
}

/**
 *
 * @param {string} stdout
 * @returns {Array<string>} lines
 */
function transformStdoutStringToLines(stdout) {
    return stdout
        .replaceAll('\r', '')
        .split('\n')
        .map(line => line.trim())
        .filter(Boolean)
}

module.exports = {
    executeCommand,
    executePowershellCommand,
    combineCommands,
    transformStdoutStringToLines,
    checkAndRetrieveCommonCommandType,
    retrieveParams,
    combineCommandsWithCommonType
}
