const path = require("node:path");
const fs = require("node:fs");
const { generateRAMListHtmlSnippet } = require("../../html_snippets");
const { app } = require("electron");
const {
    executeCommand,
    executePowershellCommand,
    transformStdoutStringToLines,
    TASK_RAM_USAGE_COMMAND,
} = require("../../commands");

const { getProcessedRAMTasklist } = require("./memoryUtils");

const getRAMTasklist = async () => {
    const stdout = await executeCommand(
        TASK_RAM_USAGE_COMMAND,
        (stdout) => stdout
    );
    const lines = transformStdoutStringToLines(stdout);
    return getProcessedRAMTasklist(lines);
};

const getRAMDashboardHtml = async () => {
    const ramTaskList = await getRAMTasklist();
    return generateRAMListHtmlSnippet(ramTaskList);
};

let isGettingIconOfProcesses = false;
let isAvoidFetchingIconOfProcesses = true;
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

    const targetFloder = "../../../../static/processIcons";
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
                console.log('targetFilePath:',line[0])
                const imageBuffer = (await app.getFileIcon(line[0])).toPNG();
                fs.writeFileSync(targetFilePath, imageBuffer);
            }
        }
    }
    isGettingIconOfProcesses = false;
};

module.exports = {
    getRAMDashboardHtml,
    getIconOfProcesses,
};
