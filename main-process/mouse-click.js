const robot = require('robotjs');
const ioHook = require('iohook');
const {MouseKeys} = require('./include/mouseMetrics');

let ticking = null;
let isPaused = true;
let mouseKey = MouseKeys.LEFT;

/**
 * 自动点击鼠标模块
 */
let _ = {
    setLefKeyAutoClick() {
        mouseKey = MouseKeys.LEFT;
    },
    setRightKeyAutoClick() {
        mouseKey = MouseKeys.RIGHT;
    },
    togglePaused() {
        isPaused = !isPaused;
    },
    toggleMouseKey(state) {
        mouseKey = state ? MouseKeys.LEFT : MouseKeys.RIGHT;
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

            console.log('ticking...', isLocked, isPaused);

            //按住 ctrl 可以暂停自动点击
            if (isLocked || isPaused || event.ctrlKey || event.altKey || event.shiftKey) {
                //clearTimeout(ticking);
                return;
            }

            ticking = setTimeout(() => {
                // console.log('ticking... step over.');

                robot.mouseClick(mouseKey, false);
            }, 300);
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

exports.mouseClick = _;