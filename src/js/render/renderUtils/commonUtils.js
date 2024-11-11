export const getStaticInfo = () => window.electronApis.getStaticInfo();
export const getDynamicInfo = (initializedInfo) =>
    window.electronApis.getDynamicInfo(initializedInfo);

/**
 *
 * @param {Object} data
 * @param {string} path
 */
export const getValue = (data, path) =>
    path.split(".").reduce((pre, cur) => {
        return pre[cur];
    }, data);

/**
 *
 * @param {string} selector
 * @param {string} snippetName
 */
export const insertHTMLSnippets = async (selector, snippetName) => {
    const div = document.createElement("div");
    div.innerHTML = await window.electronApis.getHTMLSnippets(snippetName);
    document.querySelector(selector).appendChild(div.firstElementChild);
};

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
