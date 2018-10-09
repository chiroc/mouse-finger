/**
 * APIs: https://docs.microsoft.com/zh-cn/windows/desktop/api/winuser/nf-winuser-getsystemmetrics
 * @type {{}}
 */
exports.SystemMetrics = {
    SM_SWAPBUTTON: 23 //Nonzero if the meanings of the left and right mouse buttons are swapped; otherwise, 0.
};

/**
 * APIs: https://docs.microsoft.com/en-us/windows/desktop/api/winuser/nf-winuser-setsystemcursor
 * @type {{}}
 */
exports.Cursors = {
    OCR_NORMAL: 32512, // [aero_arrow.cur] Standard arrow
    OCR_NORMAL_FILE: 'aero_arrow.cur',
    OCR_NORMAL_FILE_LEFT: 'aero_arrow_left.cur',

    OCR_HAND: 32649, // [aero_link.cur] Hand
    OCR_HAND_FILE: 'aero_link.cur',
    OCR_HAND_FILE_LEFT: 'aero_link_left.cur',

    OCR_HELP: 32651, // [aero_helpsel.cur] Arrow and question mark
    OCR_HELP_FILE: 'aero_helpsel.cur',
    OCR_HELP_FILE_LEFT: 'aero_helpsel_left.cur',

    OCR_APPSTARTING: 32650, // [aero_working.ani] Standard arrow and small hourglass
    OCR_APPSTARTING_FILE: 'aero_working.ani',
    OCR_APPSTARTING_FILE_LEFT: 'aero_working_left.ani',
};

/**
 * 鼠标左右键名称
 * @type {{LEFT: string, RIGHT: string}}
 */
exports.MouseKeys = {
    LEFT: 'left',
    RIGHT: 'right'
};

exports.MouseKeysLabel_ZHCN = {
    left: '左',
    right: '右'
};