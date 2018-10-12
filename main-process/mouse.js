const robot = require('robotjs');
const ioHook = require('iohook');

const path = require('path');
const electron = require('electron');
const {app} = electron;

const {SystemMetrics, Cursors, MouseKeys} = require('./include/mouseMetrics');
let native = require('./include/nativeAPIs').native;

/**
 * 自动点击鼠标定时器
 * @type {null}
 */
let ticking = null;

let defaults = {
    pointerMode: MouseKeys.RIGHT, // 指针左右手指针模式
    mouseKey: MouseKeys.LEFT, // 鼠标自动点击左右键标识
    tickingInterval: 300, // 自动点击鼠标定时时长（ms）
    isPaused: true // 自动点击鼠标暂停状态
};


let _ = {
    /**
     * Get defaults params.
     * @returns {{pointerMode: string, mouseKey: string, tickingInterval: number, isPaused: boolean}}
     */
    getParams() {
        return defaults;
    },
    /**
     * Update defaults params & actions.
     * @param params
     */
    updateParams(params) {
        Object.assign(defaults, params);

        if (defaults.pointerMode === MouseKeys.RIGHT) {
            this.setAsRightCursor();
            this.setAsLeftClick();
        } else {
            this.setAsLeftCursor();
            this.setAsRightClick();
        }

        if (defaults.mouseKey === MouseKeys.RIGHT) {
            this.setAsRightClick();
        } else {
            this.setAsLeftClick();
        }

        if (defaults.isPaused) {
            this.pauseAutoClick();
        } else {
            this.startAutoClick();
        }
    },
    /**
     * 获取当前系统点击键状态
     * @returns {boolean} true-Left key click; false-right key click
     */
    getMouseState() {
        return !native.getSystemMetrics(SystemMetrics.SM_SWAPBUTTON);
    },
    /**
     * 获取鼠标物理路径
     * @param {string} fileName
     * @returns {string}
     */
    getCursorPath(fileName) {
        // TIP: 开始环境访问路径
        // return path.resolve(app.getAppPath() + '/assets/cursor/' + fileName);

        // TIP: 生产环境访问路径：通过electron-builder 打包后被排除的文件夹后面默认加了".unpacked"后缀。
        return path.resolve(app.getAppPath() + '.unpacked/assets/cursor/' + fileName);
    },
    /**
     * 设置为左键单击
     */
    setAsLeftClick() {
        native.swapMouseButton(false);
        defaults.mouseKey = MouseKeys.LEFT;
    },
    /**
     * 设置为右键单击
     */
    setAsRightClick() {
        native.swapMouseButton(true);
        defaults.mouseKey = MouseKeys.RIGHT;
    },
    /**
     * 切换左右点击键
     */
    toggleKeyClick() {
        this.getMouseState() ? this.setAsRightClick() : this.setAsLeftClick();
    },
    /**
     * 设置为左手鼠标模式
     */
    setAsLeftCursor() {
        native.setSystemCursor(native.loadCursorFromFile(_.getCursorPath(Cursors.OCR_NORMAL_FILE_LEFT)), Cursors.OCR_NORMAL);
        native.setSystemCursor(native.loadCursorFromFile(_.getCursorPath(Cursors.OCR_HAND_FILE_LEFT)), Cursors.OCR_HAND);
        native.setSystemCursor(native.loadCursorFromFile(_.getCursorPath(Cursors.OCR_HELP_FILE_LEFT)), Cursors.OCR_HELP);
        native.setSystemCursor(native.loadCursorFromFile(_.getCursorPath(Cursors.OCR_APPSTARTING_FILE_LEFT)), Cursors.OCR_APPSTARTING);

        defaults.pointerMode = MouseKeys.LEFT;
    },
    /**
     * 设置为右手鼠标模式
     */
    setAsRightCursor() {
        native.setSystemCursor(native.loadCursorFromFile(_.getCursorPath(Cursors.OCR_NORMAL_FILE)), Cursors.OCR_NORMAL);
        native.setSystemCursor(native.loadCursorFromFile(_.getCursorPath(Cursors.OCR_HAND_FILE)), Cursors.OCR_HAND);
        native.setSystemCursor(native.loadCursorFromFile(_.getCursorPath(Cursors.OCR_HELP_FILE)), Cursors.OCR_HELP);
        native.setSystemCursor(native.loadCursorFromFile(_.getCursorPath(Cursors.OCR_APPSTARTING_FILE)), Cursors.OCR_APPSTARTING);

        defaults.pointerMode = MouseKeys.RIGHT;
    },

    //////////////////////////////////////////////////////////////

    /**
     * 暂停自动点击
     */
    pauseAutoClick() {
        defaults.isPaused = true;
    },
    /**
     * 开始自动点击
     */
    startAutoClick() {
        defaults.isPaused = false;
    },
    /**
     * 切换自动点击状态
     */
    togglePaused() {
        defaults.isPaused = !defaults.isPaused;
    },
    setTickingInterval(time) {
        defaults.tickingInterval = time;
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

            //按住 ctrl 可以暂停自动点击
            if (isLocked || defaults.isPaused || event.ctrlKey || event.altKey || event.shiftKey) {
                return;
            }

            ticking = setTimeout(() => {
                robot.mouseClick(defaults.mouseKey, false);
            }, defaults.tickingInterval);
        });

        ioHook.on('mousedown', event => {
            clearTimeout(ticking);
        });
        ioHook.on('mouseup', event => {
            isLocked = false;
        });
        ioHook.on('mousedrag', event => {
            isLocked = true;
            clearTimeout(ticking);
        });
        ioHook.on('keydown', event => {
            isLocked = true;
        });
        ioHook.on('keyup', event => {
            isLocked = false;
        });

        // Register and start hook
        ioHook.start(false);
    },
    /**
     * Quit error stack: https://github.com/WilixLead/iohook/issues/69
     */
    destroy() {
        clearTimeout(ticking);
        ioHook.unload();
        ioHook.stop();
    }
};

app.on('before-quit', () => {
    _.destroy();
});

exports.mouse = _;