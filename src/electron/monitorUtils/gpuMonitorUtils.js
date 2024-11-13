/**
 * Get GPU Name from given lines
 * @param {Array<string} lines lines of command stdout
 * @returns {string} GPU Product Name
 */
function getGPUProductName(lines) {
    return lines
        .find((line) => line.includes("Product Name"))
        .split(":")[1]
        .trim();
}

/**
 * Get GPU Usage from given lines
 * @param {Array<string>} lines lines of command stdout
 * @returns {object<{GPUUsage,GPUMemoryUsage,GPUEncoderUsage,GPUDecoderUsage}>} GPU Usage
 */
function getGPUUsage(lines) {
    const utilizationLineIndex = lines.findIndex((line) =>
        line.includes("Utilization")
    );

    return {
        GPUUsage: lines[utilizationLineIndex + 1].split(":")[1].trim(),
        GPUMemoryUsage: lines[utilizationLineIndex + 2].split(":")[1].trim(),
        GPUEncoderUsage: lines[utilizationLineIndex + 3].split(":")[1].trim(),
        GPUDecoderUsage: lines[utilizationLineIndex + 4].split(":")[1].trim(),
    };
}

/**
 * Get GPU Temperature from given lines
 * @param {Array<string>} lines lines of command stdout
 * @returns {string} GPU Temperature}
 */
function getGPUTemperature(lines) {
    const GPUCurrentTemperatureIndex = lines.findIndex((line) =>
        line.includes("GPU Current Temp")
    );
    return lines[GPUCurrentTemperatureIndex].split(":")[1].trim();
}

/**
 * Get GPU Clock Speed from given lines
 * @param {Array<string>} lines lines of command stdout
 * @returns {object<{GraphicsSpeed,MemorySpeed,VideoSpeed}>} GPU Clock Speed
 */
function getGPUSpeed(lines) {
    const clockLineIndex = lines.findIndex((line) => line === "Clocks");
    return {
        GraphicsSpeed: lines[clockLineIndex + 1].split(":")[1].trim(),
        MemorySpeed: lines[clockLineIndex + 3].split(":")[1].trim(),
        VideoSpeed: lines[clockLineIndex + 4].split(":")[1].trim(),
    };
}

/**
 * Get GPU Fan Speed from given lines
 * @param {Array<string>} lines lines of command stdout
 * @returns {string} GPU Fan Speed
 */
function getFanSpeed(lines) {
    const fanSpeedIndex = lines.findIndex((line) => line.includes("Fan Speed"));
    return lines[fanSpeedIndex].split(":")[1].trim();
}

/**
 * Get GPU Info from given lines
 * @param {Array<string>} lines lines of command stdout
 * @returns {object<{GPUProductName,GPUUsage,GPUTemperature,GPUspeed,GPUFanSpeed}>} GPU Info
 */
function getGPUInfo(lines) {
    console.info(`[Info] Is getting GPU info...`);

    return {
        GPUProductName: getGPUProductName(lines),
        GPUUsage: getGPUUsage(lines),
        GPUTemperature: getGPUTemperature(lines),
        GPUspeed: getGPUSpeed(lines),
        GPUFanSpeed: getFanSpeed(lines),
    };
}

module.exports = {
    getGPUInfo,
};
