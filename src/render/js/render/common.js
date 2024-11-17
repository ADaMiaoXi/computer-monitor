/**
 * Get computer static info
 * @returns computer static info
 */
export const getStaticInfo = () => window.electronAPI.invoke('getStaticInfo')

/**
 * Get computer dynamic info
 * @param {Object} staticInfo
 * @returns computer dynamic info
 */
export const getDynamicInfo = staticInfo => window.electronAPI.invoke('getDynamicInfo', staticInfo)

/**
 * Retrieve value from object by path
 * @param {Object} data
 * @param {string} path
 */
export const getValue = (data, path) =>
    path.split('.').reduce((pre, cur) => {
        return pre[cur]
    }, data)

/**
 * Insert HTML snippet by snippetName into the DOM that matches the selector
 * @param {string} selector
 * @param {string} snippetName
 */
export const insertHTMLSnippets = async (selector, snippetName) => {
    const div = document.createElement('div')
    div.innerHTML = await window.electronAPI.invoke('getHTMLSnippets', snippetName)
    document.querySelector(selector).appendChild(div.firstElementChild)
}

/**
 * Resize window to the specified width and height
 * If no width and height is provided, the window will be resized according to the current content
 * @param {number} paramWidth
 * @param {number} paramHeight
 * @returns {Array<number>} [width, height]
 */
export const resizeWindow = async (paramWidth, paramHeight) => {
    const summaryEelement = document.querySelector('#monitor_summary')
    let width = 0

    for (let i = 0; i < summaryEelement.children.length; i++) {
        width += summaryEelement.children[i].clientWidth
    }

    if (paramWidth && paramHeight) {
        return await window.electronAPI.invoke('resizeWindow', {
            width,
            height
        })
    }

    return await window.electronAPI.invoke('resizeWindow', {
        width,
        height: document.querySelector('body').clientHeight
    })
}

// get icon of processes
export const getIconOfProcesses = forced => window.electronAPI.invoke('getIconOfProcesses', forced)

export const electronStore = {
    initialize: () => (window.electronStore = new Map()),
    has: key => window.electronStore.has(key),
    get: key => window.electronStore.get(key),
    set: (key, value) => window.electronStore.set(key, value),
    delete: key => window.electronStore.delete(key),
    clear: () => window.electronStore.clear()
}

export const getCustomizedData = () => window.electronAPI.invoke('getCustomizedData')

export const getUserDataPath = () => window.electronAPI.invoke('getUserDataPath')
