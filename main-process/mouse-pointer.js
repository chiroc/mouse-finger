const path = require('path');
const electron = require('electron');
const {app} = electron;

const {SystemMetrics, Cursors} = require('./include/mouseMetrics');
let user32 = require('./include/user32').user32;
let pointerMode = true; // true-left; false-right

/**
 * 修改鼠标指针模块
 */
let _ = {
    /**
     * 获取当前点击键状态
     * @returns {boolean} true-Left; false-right
     */
    getMouseState() {
        return !user32.GetSystemMetrics(SystemMetrics.SM_SWAPBUTTON);
    },
    /**
     * 获取鼠标物理路径
     * @param {string} fileName
     * @returns {string}
     */
    getCursorPath(fileName) {
        return path.resolve(app.getAppPath() + '/assets/cursor/' + fileName);
    },
    /**
     * 设置为左键单击
     * @returns {boolean} 是否设置成功
     */
    setAsLeftClick() {
        user32.SwapMouseButton(false);

        return this;
    },
    getPointerMode(){
        return pointerMode;
    },
    /**
     * 设置为左手鼠标
     * @returns {_}
     */
    setAsLeftCursor() {
        let ret = user32.SetSystemCursor(user32.LoadCursorFromFileA(_.getCursorPath(Cursors.OCR_NORMAL_FILE_LEFT)), Cursors.OCR_NORMAL);
        user32.SetSystemCursor(user32.LoadCursorFromFileA(_.getCursorPath(Cursors.OCR_HAND_FILE_LEFT)), Cursors.OCR_HAND);
        user32.SetSystemCursor(user32.LoadCursorFromFileA(_.getCursorPath(Cursors.OCR_HELP_FILE_LEFT)), Cursors.OCR_HELP);
        user32.SetSystemCursor(user32.LoadCursorFromFileA(_.getCursorPath(Cursors.OCR_APPSTARTING_FILE_LEFT)), Cursors.OCR_APPSTARTING);

        pointerMode = true;
        return this;
    },
    /**
     * 设置为右键单击
     */
    setAsRightClick() {
        user32.SwapMouseButton(true);

        return this;
    },
    /**
     * 设置为右手鼠标
     * @returns {_}
     */
    setAsRightCursor() {
        let ret = user32.SetSystemCursor(user32.LoadCursorFromFileA(_.getCursorPath(Cursors.OCR_NORMAL_FILE)), Cursors.OCR_NORMAL);
        user32.SetSystemCursor(user32.LoadCursorFromFileA(_.getCursorPath(Cursors.OCR_HAND_FILE)), Cursors.OCR_HAND);
        user32.SetSystemCursor(user32.LoadCursorFromFileA(_.getCursorPath(Cursors.OCR_HELP_FILE)), Cursors.OCR_HELP);
        user32.SetSystemCursor(user32.LoadCursorFromFileA(_.getCursorPath(Cursors.OCR_APPSTARTING_FILE)), Cursors.OCR_APPSTARTING);

        pointerMode = false;
        return this;
    }
};

exports.mousePointer = _;