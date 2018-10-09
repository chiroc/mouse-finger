const robot = require('robotjs');
const ioHook = require('iohook');

const path = require('path');
const electron = require('electron');
const {app} = electron;

const {SystemMetrics, Cursors, MouseKeys} = require('../main-process/include/mouseMetrics');
let user32 = require('../main-process/include/user32').user32;

/**
 * 指针左右手模式
 * @type {string}
 */
let pointerMode = MouseKeys.RIGHT;
/**
 * 自动点击鼠标定时器
 * @type {null}
 */
let ticking = null;
/**
 * 自动点击鼠标定时时长（ms）
 * @type {number}
 */
let tickingInterval = 300;
/**
 * 自动点击鼠标暂停状态
 * @type {boolean}
 */
let isPaused = true;
/**
 * 鼠标自动点击左右键标识
 * @type {string}
 */
let mouseKey = MouseKeys.LEFT;


let params = {
    pointerMode: MouseKeys.RIGHT,
    mouseKey: MouseKeys.LEFT,
    tickingInterval: 300,
    isPaused: true
};

let _ = {
    /**
     * @deprecated
     * @param _pointerMode
     * @param _isPaused
     * @param _mouseKey
     * @param _tickingInterval
     */
    setParams(_pointerMode = MouseKeys.RIGHT, _isPaused = true, _mouseKey = MouseKeys.LEFT, _tickingInterval) {
        pointerMode = _pointerMode;
        isPaused = _isPaused;
        mouseKey = _mouseKey;
        tickingInterval = _tickingInterval || 300;
    },
    getParams() {
        return {
            pointerMode: pointerMode,
            isPaused: isPaused,
            mouseKey: mouseKey,
            tickingInterval: tickingInterval
        }
    },
    updateParams(params){

    },
    /**
     * 获取当前点击键状态
     * @returns {boolean} true-Left; false-right
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
    getPointerMode() {
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

        pointerMode = MouseKeys.LEFT;
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

        pointerMode = MouseKeys.RIGHT;
        return this;
    },

    //////////////////////////////////////////////////////////////

    setLefKeyAutoClick() {
        mouseKey = MouseKeys.LEFT;
    },
    setRightKeyAutoClick() {
        mouseKey = MouseKeys.RIGHT;
    },
    toggleMouseKey(state) {
        mouseKey = state ? MouseKeys.LEFT : MouseKeys.RIGHT;
    },
    getClickKey() {
        return mouseKey;
    },
    togglePaused() {
        isPaused = !isPaused;
        console.log('togglePaused:', isPaused);
    },
    pauseAutoClick() {
        isPaused = true;
    },
    startAutoClick() {
        isPaused = false;
    },
    getAutoClickState() {
        return isPaused;
    },
    setTickingInterval(time) {
        console.log('time:', time);

        if (time < 100) {
            tickingInterval = 100;
        }

        if (time > 999999) {
            tickingInterval = 999999;
        }

        tickingInterval = time;
    },
    getTickingInterval() {
        return tickingInterval;
    },
    registerEvent() {
        let isLocked = false;

        /**
         * mouse event object:
         * { button: 0, clicks: 10, x: 1164, y: 894, type: 'mousemove' }
         * - button, 0: 无鼠标点击; 1: 鼠标左键点击; 2: 鼠标右键点击; 3: 鼠标中键点击。
         * - clicks,相应button类型键总点击次数。
         */
        ioHook.on('mousemove', event => {
            if (ticking) {
                clearTimeout(ticking);
            }

            // console.log('ticking...', isLocked, isPaused);

            //按住 ctrl 可以暂停自动点击
            if (isLocked || isPaused || event.ctrlKey || event.altKey || event.shiftKey) {
                //clearTimeout(ticking);
                return;
            }

            ticking = setTimeout(() => {
                robot.mouseClick(mouseKey, false);
            }, tickingInterval);
        });

        ioHook.on('mouseclick', event => {
            // console.log('mouseclick:', event);
        });
        ioHook.on('mousedown', event => {
            // console.log('mousedown:', event);
            clearTimeout(ticking);
        });
        ioHook.on('mouseup', event => {
            // console.log('mouseup:', event);
            isLocked = false;
        });
        ioHook.on('mousedrag', event => {
            // console.log('mousedrag:', event);
            isLocked = true;
            clearTimeout(ticking);
        });
        ioHook.on('mousewheel', event => {
            // console.log('mousewheel:', event);
        });

        ioHook.on('keydown', event => {
            // console.log('keydown:', JSON.stringify(event));
            isLocked = true;
        });
        ioHook.on('keyup', event => {
            // console.log('keyup:  ', JSON.stringify(event));
            isLocked = false;
        });

        // Register and start hook
        ioHook.start(false);
    },
    destroy() {
        clearTimeout(ticking);
        ioHook.stop();
        ioHook.unload();
    }
};

exports.mouse = _;