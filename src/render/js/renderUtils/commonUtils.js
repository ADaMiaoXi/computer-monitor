/**
 * Get computer static info
 * @returns computer static info
 */
export const getStaticInfo = () => window.electronApis.getStaticInfo();

/**
 * Get computer dynamic info
 * @param {Object} staticInfo
 * @returns computer dynamic info
 */
export const getDynamicInfo = (staticInfo) =>
    window.electronApis.getDynamicInfo(staticInfo);

/**
 * Retrieve value from object by path
 * @param {Object} data
 * @param {string} path
 */
export const getValue = (data, path) =>
    path.split(".").reduce((pre, cur) => {
        return pre[cur];
    }, data);

/**
 * Insert HTML snippet by snippetName into the DOM that matches the selector
 * @param {string} selector
 * @param {string} snippetName
 */
export const insertHTMLSnippets = async (selector, snippetName) => {
    const div = document.createElement("div");
    div.innerHTML = await window.electronApis.getHTMLSnippets(snippetName);
    document.querySelector(selector).appendChild(div.firstElementChild);
};

/**
 * Resize window to the specified width and height
 * If no width and height is provided, the window will be resized according to the current content
 * @param {number} paramWidth
 * @param {number} paramHeight
 * @returns {Array<number>} [width, height]
 */
export const resizeWindow = async (paramWidth, paramHeight) => {
    const summaryEelement = document.querySelector("#monitor_summary");
    let width = 0;

    for (let i = 0; i < summaryEelement.children.length; i++) {
        width += summaryEelement.children[i].clientWidth;
    }

    if (paramWidth && paramHeight) {
        return await window.electronApis.resizeWindow(width, height);
    }

    return await window.electronApis.resizeWindow(
        width,
        document.querySelector("body").clientHeight
    );
};

/**
 * Enable click through for the empty space on window
 */
export const enableSpaceClickThrough = () => {
    document
        .querySelector("#empty_space")
        .addEventListener("mouseenter", (e) => {
            window.electronApis.setIgnoreMouseEvents(true);
        });

    document
        .querySelector("#empty_space")
        .addEventListener("mouseleave", (e) => {
            window.electronApis.setIgnoreMouseEvents(false);
        });
};

export const getIconOfProcesses = () =>
    window.electronApis.getIconOfProcesses();
