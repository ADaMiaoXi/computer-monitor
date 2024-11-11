const { executePowershellCommand } = require("../src/js/commands");

const {
  CPU_USEAGE_PERCENTAGE_COMMAND,
  NETWORK_SEND_AND_RECEIVED_COMMAND,
  checkAndRetrieveCommonCommandType,
  retrieveParams,
  combineCommandsWithCommonType,
} = require("../src/js/commands");

const res = checkAndRetrieveCommonCommandType([
  CPU_USEAGE_PERCENTAGE_COMMAND,
  NETWORK_SEND_AND_RECEIVED_COMMAND,
]);

console.log(res);

const params = retrieveParams([
  CPU_USEAGE_PERCENTAGE_COMMAND,
  NETWORK_SEND_AND_RECEIVED_COMMAND,
]);

console.log(params);

const command = combineCommandsWithCommonType([
  CPU_USEAGE_PERCENTAGE_COMMAND,
  NETWORK_SEND_AND_RECEIVED_COMMAND,
]);

console.log(command);

executePowershellCommand(command, (stdout) => stdout).then((data) => {
  console.log(data);
});
