const { totalmem, freemem } = require("node:os");

/**
 * Get total RAM memory in GB
 * @returns {string} Total memory in GB
 */
function getTotalMemory() {
    return `${Number(totalmem() / 1024 / 1024 / 1024).toFixed(2)} GB`;
}

/**
 * Get free RAM memory in GB
 * @returns {string} Free memory in GB
 */
function getFreeMemory() {
    return `${Number(freemem() / 1024 / 1024 / 1024).toFixed(2)} GB`;
}

/**
 * Get memory usage in percentage
 * @param {string} freeMemory Free RAM memory in GB
 * @param {string} totalMemory Total RAM memory in GB
 * @returns {string} Memory usage in percentage
 */
function getMemoryUsage(freeMemory, totalMemory) {
    return `${(
        (1 -
            Number(freeMemory.split(" ")[0]) /
                Number(totalMemory.split(" ")[0])) *
        100
    ).toFixed(2)} %`;
}

function getProcessedRAMTasklist(lines) {
    const processedLines = lines.slice(2).map((line) => {
        return line
            .split("  ")
            .filter(Boolean)
            .map((line) => line.trim());
    });
    const map = new Map();
    processedLines.forEach((lineArr) => {
        const key = lineArr[0];
        const value = Number(
            lineArr[lineArr.length - 1].replaceAll(",", "").replace(" K", "")
        );

        if (map.has(key)) {
            map.set(key, map.get(key) + value);
        } else {
            map.set(key, value);
        }
    });
    const sortedKeys = Array.from(map.keys()).sort(
        (a, b) => map.get(b) - map.get(a)
    );
    const resList = [];
    sortedKeys.forEach((key, index) => {
        resList[index] = [];
        resList[index][0] = key;
        resList[index][1] = `${(map.get(key) / 1024).toFixed(2)} MB`;
    });
    return resList.slice(0, 15);
}

module.exports = {
    getTotalMemory,
    getFreeMemory,
    getMemoryUsage,
    getProcessedRAMTasklist,
};
