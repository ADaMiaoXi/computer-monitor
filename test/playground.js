const { app } = require("electron");
const {
    executePowershellCommand,
    transformStdoutStringToLines,
} = require("../src/js/commands");

const run = async () => {
    const stdout = await executePowershellCommand(
        "wmic process get name,executablepath",
        (stdout) => stdout
    );
    const lines = transformStdoutStringToLines(stdout);
    const porcessedLines = lines.map((line) => line.split(" ").filter(Boolean));
    const resultObj = {};
    porcessedLines.forEach((line) => {
        if (line[1] && line[1].endsWith(".exe")) {
            resultObj[line[1]] = line[0];
        }
    });

    //console.log(resultObj);
    console.log(app)
    app.getFileIcon(resultObj["douyin.exe"]).then(data => console.log(data.toDataURL()));
};

run();

//https://stackoverflow.com/questions/61788124/get-desktop-file-icons-using-nodejs