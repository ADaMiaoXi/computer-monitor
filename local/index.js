const path = require("node:path");

const customizedData = require(path.resolve(
    __dirname,
    "./customizedData.json"
));

module.exports = {
    customizedData
};