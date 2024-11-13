/**
 * Get Network Name from given lines
 * @param {Array<string>} lines lines of command stdout
 * @returns {string} network name
 */
const getNetworkName = function (lines) {
    console.info(`[Info] Is getting Network Name...`);
    const NetworkNameIndex = lines.findIndex((line) => line === "Name") + 1;
    return lines[NetworkNameIndex];
};

/**
 * Get Network Download Speed from given lines
 * @param {Array<string>} lines lines of command stdout
 * @param {string} networkName
 * @returns {string} download speed
 */
function getNetworkDownloadSpeed(lines, networkName) {
    console.info(`[Info] Is getting Download Speed...`);
    const receivedIndex =
        lines.findLastIndex((l) =>
            l.includes(
                networkName
                    .trim()
                    .toLowerCase()
                    .replace("(", "[")
                    .replace(")", "]")
            )
        ) + 1;
    return convertNetworkSpeedByBytes(lines[receivedIndex]);
}

/**
 * Get Network Upload Speed from given lines
 * @param {Array<string>} lines lines of command stdout
 * @param {string} networkName
 * @returns {string} upload speed
 */
function getNetworkuploadSpeed(lines, networkName) {
    console.info(`[Info] Is getting Upload Speed...`);

    const sentIndex =
        lines.findIndex((l) =>
            l.includes(
                networkName
                    .trim()
                    .toLowerCase()
                    .replace("(", "[")
                    .replace(")", "]")
            )
        ) + 1;
    return convertNetworkSpeedByBytes(lines[sentIndex]);
}

/**
 *  Convert Network speed by bytes to  bytes/s, Kb/s or Mb/s
 * @param {string | number} bytes
 * @returns {string} converted bytes
 */
function convertNetworkSpeedByBytes(bytes) {
    const kiloBytes = Number(bytes) / 1024;
    const millionBytes = Number(bytes) / (1024 * 1024);
    if (millionBytes > 1) {
        return `${millionBytes.toFixed(2)} MB/s`;
    }
    if (kiloBytes > 1) {
        return `${kiloBytes.toFixed(2)} KB/s`;
    }

    return `${Number(bytes).toFixed(2)} B/s`;
}

module.exports = {
    getNetworkName,
    getNetworkDownloadSpeed,
    getNetworkuploadSpeed,
    convertNetworkSpeedByBytes,
};
