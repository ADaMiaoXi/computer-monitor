const monitorSummarySnippets = require("./monitorSummaryHtmlSnippets");
const monitorDashboardSnippets = require("./monitorDashboardHtmlSnippets");

module.exports = {
    ...monitorSummarySnippets,
    ...monitorDashboardSnippets
};
