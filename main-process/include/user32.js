/**
 * TIP: 因为项目在打包为 .asar 包文件之后通过 node-ffi 调用系统API时无法读取包内静态文件，所以在打包时需要将相关文件排除在包外。
 * @see https://github.com/electron/electron/issues/782
 */
let ffi = require('ffi');

/**
 * ffi.Library(libraryFile, { functionSymbol: [ returnType, [ arg1Type, arg2Type, ... ], ... ]);
 *
 * Window APIs
 * - SwapMouseButton, https://docs.microsoft.com/en-us/windows/desktop/api/winuser/nf-winuser-swapmousebutton
 * - GetSystemMetrics, https://docs.microsoft.com/en-us/windows/desktop/api/winuser/nf-winuser-getsystemmetrics
 * - SetCursor, https://docs.microsoft.com/en-us/windows/desktop/api/winuser/nf-winuser-setcursor
 * - SetCursorPos, https://docs.microsoft.com/en-us/windows/desktop/api/winuser/nf-winuser-setcursorpos
 * - SetSystemCursor, https://docs.microsoft.com/en-us/windows/desktop/api/winuser/nf-winuser-setsystemcursor
 */
exports.user32 = ffi.Library('user32', {
    GetSystemMetrics: ['int', ['int']],
    SwapMouseButton: ['bool', ['bool']],
    SetCursor: ['int', ['int']],
    SetCursorPos: ['bool', ['int', 'int']],
    LoadCursorFromFileA: ['int', ['string']],
    LoadCursorFromFileW: ['int', ['string']],
    SetSystemCursor: ['bool', ['int', 'int']]
});