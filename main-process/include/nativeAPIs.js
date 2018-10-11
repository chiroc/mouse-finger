/**
 * TIP: 因为项目在打包为 .asar 包文件之后通过 node-ffi 调用系统API时无法读取包内静态文件，所以在打包时需要将相关文件排除在包外。
 * @see https://github.com/electron/electron/issues/782
 *
 * ffi.Library(libraryFile, { functionSymbol: [ returnType, [ arg1Type, arg2Type, ... ], ... ]);
 */
let ffi = require('ffi');
let platForms = {
    WINDOWS: 'win32',
    LINUX: 'linux',
    OSX: 'darwin'
};

/**
 * @see https://nodejs.org/api/process.html#process_process_platform
 * @type {NodeJS.Platform}
 */
const platform = process.platform; // win32, linux, darwin

let _ = {
    getSystemMetrics: Function,
    swapMouseButton: Function,
    loadCursorFromFile: Function,
    setSystemCursor: Function
};

let APIs = {};


/**
 * Window APIs
 * - SwapMouseButton, https://docs.microsoft.com/en-us/windows/desktop/api/winuser/nf-winuser-swapmousebutton
 * - GetSystemMetrics, https://docs.microsoft.com/en-us/windows/desktop/api/winuser/nf-winuser-getsystemmetrics
 * - SetCursor, https://docs.microsoft.com/en-us/windows/desktop/api/winuser/nf-winuser-setcursor
 * - SetCursorPos, https://docs.microsoft.com/en-us/windows/desktop/api/winuser/nf-winuser-setcursorpos
 * - SetSystemCursor, https://docs.microsoft.com/en-us/windows/desktop/api/winuser/nf-winuser-setsystemcursor
 */
function bindingWindows() {
    APIs = ffi.Library('user32', {
        GetSystemMetrics: ['int', ['int']],
        SwapMouseButton: ['bool', ['bool']],
        // SetCursor: ['int', ['int']], // unused
        // SetCursorPos: ['bool', ['int', 'int']], // unused
        LoadCursorFromFileA: ['int', ['string']],
        // LoadCursorFromFileW: ['int', ['string']], // unused
        SetSystemCursor: ['bool', ['int', 'int']]
    });

    _.getSystemMetrics = APIs.GetSystemMetrics;
    _.swapMouseButton = APIs.SwapMouseButton;
    _.loadCursorFromFile = APIs.LoadCursorFromFileA;
    _.setSystemCursor = APIs.SetSystemCursor;
}

/**
 * Linux APIs TODO 未实现
 * XGetMainDisplay
 */
function bindingLinux() {
    APIs = {};

    _.getSystemMetrics = undefined;
    _.swapMouseButton = undefined;
    _.loadCursorFromFile = undefined;
    _.setSystemCursor = undefined;
}

/**
 * OSX APIs TODO 未实现
 * CGEventCreateMouseEvent
 * https://developer.apple.com/documentation/coregraphics/quartz_event_services?language=objc
 */
function bindingOSX() {
    APIs = {};

    _.getSystemMetrics = undefined;
    _.swapMouseButton = undefined;
    _.loadCursorFromFile = undefined;
    _.setSystemCursor = undefined;
}


if (platform === platForms.WINDOWS) {
    bindingWindows();
} else if (platform === platforms.LINUX) {
    bindingLinux();
} else if (platform === platforms.OSX) {
    bindingOSX();
}

exports.native = _;