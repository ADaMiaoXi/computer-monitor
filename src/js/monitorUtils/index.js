const { BrowserWindow } = require("electron");
const {
    combineCommands,
    executePowershellCommand,
    transformStdoutStringToLines,
    combineCommandsWithCommonType,
    CPU_MAX_SPPED_COMMAND,
    NETWORK_NAME_COMMAND,
    CPU_USEAGE_PERCENTAGE_COMMAND,
    GPU_INFO_COMMAND,
    NETWORK_SEND_AND_RECEIVED_COMMAND,
    executeCommand,
} = require("../commands");
const {
    getCPUModel,
    getCPUMaxClockSpeed,
    getCPUUsage,
    getCPUCurrentSpeed,
} = require("./cpuMonitorUtils");
const {
    getNetworkName,
    getNetworkDownloadSpeed,
    getNetworkuploadSpeed,
} = require("./networkMonitorUtils");
const { getGPUInfo } = require("./gpuMonitorUtils");
const {
    getTotalMemory,
    getFreeMemory,
    getMemoryUsage,
} = require("./memoryUtils");

const { getRAMDashboardHtml } = require("./dashboardMornitorUtils");

const getStaticInfo = async () => {
    console.info("[INFO] Is getting static info...");
    const combinedCommands = combineCommands([
        CPU_MAX_SPPED_COMMAND,
        NETWORK_NAME_COMMAND,
    ]);

    const stdout = await executePowershellCommand(
        combinedCommands,
        (stdout) => stdout
    );

    const lines = transformStdoutStringToLines(stdout);

    return {
        CPUModel: getCPUModel(),
        CPUMaxClockSpeed: getCPUMaxClockSpeed(lines),
        networkName: getNetworkName(lines),
        totalMemory: getTotalMemory(),
    };
};

const getDynamicInfo = async (
    e,
    { CPUModel, CPUMaxClockSpeed, networkName, totalMemory }
) => {
    console.info("[INFO] Is getting dynamic info...");
    const combinedCommands = combineCommands([
        GPU_INFO_COMMAND,
        combineCommandsWithCommonType([
            CPU_USEAGE_PERCENTAGE_COMMAND,
            NETWORK_SEND_AND_RECEIVED_COMMAND,
        ]),
    ]);

    const stdout = await executePowershellCommand(
        combinedCommands,
        (stdout) => stdout
    );

    const lines = transformStdoutStringToLines(stdout);

    const CPUUsage = await getCPUUsage();

    const CPUCurrentSpeed = getCPUCurrentSpeed(lines, CPUMaxClockSpeed);

    const networkDownloadSpeed = getNetworkDownloadSpeed(lines, networkName);
    const networkUploadSpeed = getNetworkuploadSpeed(lines, networkName);

    const {
        GPUProductName,
        GPUUsage: {
            GPUUsage,
            GPUMemoryUsage,
            GPUEncoderUsage,
            GPUDecoderUsage,
        },
        GPUTemperature,
        GPUspeed: { GraphicsSpeed, MemorySpeed, VideoSpeed },
        GPUFanSpeed,
    } = getGPUInfo(lines);

    const freeMemory = getFreeMemory();

    const memoryUsage = getMemoryUsage(freeMemory, totalMemory);

    return {
        cpu: {
            CPU: CPUModel,
            CPUUsage: CPUUsage,
            CPUCurrentSpeed: CPUCurrentSpeed,
        },
        gpu: {
            GPU: GPUProductName,
            GPUUsage: GPUUsage,
            GPUMemoryUsage: GPUMemoryUsage,
            GPUEncoderUsage: GPUEncoderUsage,
            GPUDecoderUsage: GPUDecoderUsage,
            GPUTemperature: GPUTemperature,
            GPUFanSpeed: GPUFanSpeed,
            graphicsSpeed: GraphicsSpeed,
            memorySpeed: MemorySpeed,
            videoSpeed: VideoSpeed,
        },
        network: {
            networkCard: networkName,
            downloadSpeed: networkDownloadSpeed,
            uploadSpeed: networkUploadSpeed,
        },
        memory: {
            memoryUsage: memoryUsage,
            freeMemory: freeMemory,
            totalMemory: totalMemory,
        },
    };
};

const getHTMLSnippets = async (e, snippetName) =>
    require(`../html_snippets`)[snippetName];

const getHTMLSnippetsNameById = async (e, snippetId) => {
    const snippets = require("../html_snippets");
    return Object.keys(snippets).find((key) =>
        snippets[key].includes(`id="${snippetId}"`)
    );
};

/**
 *
 * @param {*} e
 * @param {number} width
 * @param {number} height
 * @returns {Array<number>} [width,height]
 */
const resizeWindow = (e, width, height) => {
    const browserWindow = BrowserWindow.fromWebContents(e.sender);
    browserWindow.setSize(width, height);
    return [width, height];
};

const setIgnoreMouseEvents = (e, ignore) => {
    const browserWindow = BrowserWindow.fromWebContents(e.sender);
    browserWindow.setIgnoreMouseEvents(ignore, { forward: true });
};

const moveWindow = (e, x, y) => {
    const browserWindow = BrowserWindow.fromWebContents(e.sender);
    const [originalX, originalY] = browserWindow.getPosition();
    browserWindow.setPosition(originalX + x, originalY + y);
};

const killTaskByName = (e, imageName) =>
    executeCommand(`taskkill /IM ${imageName} /F`, (stdout, err) => {
        if (err) {
            console.log(err);
            return err;
        }
        return stdout;
    });

module.exports = {
    getStaticInfo,
    getDynamicInfo,
    getHTMLSnippets,
    getHTMLSnippetsNameById,
    resizeWindow,
    getRAMDashboardHtml,
    moveWindow,
    killTaskByName,
    setIgnoreMouseEvents
};
