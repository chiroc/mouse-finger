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
    'GetSystemMetrics': ['int', ['int']],
    'SwapMouseButton': ['bool', ['bool']],
    'SetCursor': ['int', ['int']],
    'SetCursorPos': ['bool', ['int', 'int']],
    'LoadCursorFromFileA': ['int', ['string']],
    'LoadCursorFromFileW': ['int', ['string']],
    'SetSystemCursor': ['bool', ['int', 'int']]
});