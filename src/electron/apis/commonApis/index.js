const fs = require("node:fs");
const path = require("node:path");
const { BrowserWindow, app } = require("electron");
const {
    executeCommand,
    executePowershellCommand,
    transformStdoutStringToLines,
} = require("../../commands");

/**
 * Get HTML snippet by name
 * @param {*} e
 * @param {string} snippetName
 * @returns {string} HTML string
 */
const getHTMLSnippets = async (e, snippetName) =>
    require(`../../html_snippets`)[snippetName];

/**
 * Get HTML snippet name by snippet element ID
 * @param {*} e
 * @param {string} snippetId snippet element ID
 * @returns {string} HTML name
 */
const getHTMLSnippetsNameById = async (e, snippetId) => {
    const snippets = require("../../html_snippets");
    return Object.keys(snippets).find((key) =>
        snippets[key].includes(`id="${snippetId}"`)
    );
};

/**
 * Resize the window
 * @param {*} e
 * @param {number} width
 * @param {number} height
 * @returns {Array<number>} [width,height]
 */
const resizeWindow = (e, { width, height }) => {
    const browserWindow = BrowserWindow.fromWebContents(e.sender);
    browserWindow.setSize(width, height);
    return [width, height];
};

/**
 * Invoke electron api to enable mouse click through
 * @param {*} e
 * @param {boolean} ignore isIgoreMouseEvents
 */
const setIgnoreMouseEvents = (e, ignore) => {
    const browserWindow = BrowserWindow.fromWebContents(e.sender);
    browserWindow.setIgnoreMouseEvents(ignore, { forward: true });
};

/**
 * Move window
 * @param {*} e
 * @param {number} x The distance of horizontal movement
 * @param {number} y The distance of vertical movement
 */
const moveWindow = (e, { x, y }) => {
    const browserWindow = BrowserWindow.fromWebContents(e.sender);
    const [originalX, originalY] = browserWindow.getPosition();
    browserWindow.setPosition(originalX + x, originalY + y);
};

/**
 * Kill task by image name
 * @param {*} e
 * @param {string} imageName
 * @returns
 */
const killTaskByName = (e, imageName) =>
    executeCommand(`taskkill /IM ${imageName} /F`, (stdout, err) => {
        if (err) {
            console.log(err);
            return err;
        }
        return stdout;
    });

/**
 * Get icon of processes(Icons would be stored in `assets/processIcons`)
 */
let isGettingIconOfProcesses = false;
let isAvoidFetchingIconOfProcesses = false;
const getIconOfProcesses = async () => {
    isAvoidFetchingIconOfProcesses = !isAvoidFetchingIconOfProcesses;
    if (isAvoidFetchingIconOfProcesses) {
        return;
    }

    if (isGettingIconOfProcesses) return;
    isGettingIconOfProcesses = true;
    const stdout = await executePowershellCommand(
        "wmic process get name,executablepath",
        (stdout) => stdout
    );
    const lines = transformStdoutStringToLines(stdout);
    const porcessedLines = lines
        .map((line) =>
            line
                .split("  ")
                .filter(Boolean)
                .map((s) => s.trim())
        )
        .filter((lineArr) => lineArr.length === 2);

    const targetFloder = "../../../assets/processIcons";
    if (!fs.existsSync(path.join(__dirname, targetFloder))) {
        fs.mkdirSync(path.join(__dirname, targetFloder));
    }
    for (let i = 0; i < porcessedLines.length; i++) {
        const line = porcessedLines[i];
        if (line[1] && line[1].endsWith(".exe")) {
            const imageName = `${line[1]}.png`;
            const targetFilePath = path.join(
                __dirname,
                targetFloder,
                imageName
            );
            if (!fs.existsSync(targetFilePath)) {
                const imageBuffer = (await app.getFileIcon(line[0])).toPNG();
                fs.writeFileSync(targetFilePath, imageBuffer);
            }
        }
    }
    isGettingIconOfProcesses = false;
};

const getCustomizedData = () => {
    const { customizedData } = require(path.resolve(
        __dirname,
        "../../../config/index.js"
    ));
    return customizedData;
};

module.exports = {
    getHTMLSnippets,
    getHTMLSnippetsNameById,
    resizeWindow,
    setIgnoreMouseEvents,
    moveWindow,
    killTaskByName,
    getIconOfProcesses,
    getCustomizedData
};
