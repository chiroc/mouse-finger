const electron = require('electron');
const {app, BrowserWindow, globalShortcut, Menu, Tray, shell, ipcMain, webContents, Notification} = electron;

const mouse = require('./main-process/mouse').mouse;
const {MouseKeys} = require('./main-process/include/mouseMetrics');

let win = null;
let tray = null;
const appPath = app.getAppPath();

let _ = {
    init() {
        app.on('ready', () => {
            this.createWindow();
            this.createMenusAndTray();
            mouse.registerEvent();

            this.registerShortcut();
        });

        app.on('window-all-closed', () => {
            win = null;
            tray = null;

            if (process.platform !== 'darwin') {
                app.quit();
            }
        });

        app.on('activate', () => {
            if (win === null) {
                this.createWindow();
            }
        });
    },
    registerShortcut() {
        // 切换左右键及指针
        globalShortcut.register('Ctrl+`', () => {
            if (mouse.getMouseState()) {
                mouse.setAsRightClick().setAsLeftCursor();
                mouse.setRightKeyAutoClick();
            } else {
                mouse.setAsLeftClick().setAsRightCursor();
                mouse.setLefKeyAutoClick();
            }

            // console.log(`Mouse cursor changed:${mouse.getMouseState() ? 'Left' : 'Right'}`);
        });

        // 切换左右单击
        globalShortcut.register('Ctrl+Alt+`', () => {
            if (mouse.getMouseState()) {
                mouse.setAsRightClick();
                mouse.setRightKeyAutoClick();
            } else {
                mouse.setAsLeftClick();
                mouse.setLefKeyAutoClick();
            }

            // console.log(`Mouse click changed:${mouse.getMouseState() ? 'Left' : 'Right'}`);
        });

        // 开启和暂停自动点击操作
        globalShortcut.register('Alt+F1', () => {
            mouse.toggleMouseKey(mouse.getMouseState());
            mouse.togglePaused();
        });
    },
    setPointerMode(params) {
        if (params === MouseKeys.LEFT) {
            mouse.setAsRightClick().setAsLeftCursor();
            mouse.setRightKeyAutoClick();
        } else {
            mouse.setAsLeftClick().setAsRightCursor();
            mouse.setLefKeyAutoClick();
        }
    },
    setClickKey(params) {
        if (params === MouseKeys.RIGHT) {
            mouse.setAsRightClick();
            mouse.setRightKeyAutoClick();
        } else {
            mouse.setAsLeftClick();
            mouse.setLefKeyAutoClick();
        }
    },
    setAutoClick(params, time) {
        if (params === 'on') {
            mouse.startAutoClick();
            time && mouse.setTickingInterval(parseInt(time, 10));
        } else {
            mouse.pauseAutoClick();
        }
    },
    setTime(time){
        console.log('t:', time);
        mouse.setTickingInterval(parseInt(time, 10));
    },
    createWindow() {
        win = new BrowserWindow({
            title: 'Mouse Settings',
            icon: appPath + '/assets/logo.png',
            autoHideMenuBar: true,
            width: 500,
            height: 420,
            frame: true,
            // resizable: false, //FIXME
            closable: true
        });

        // win.setMenu(null); // FIXME

        win.loadFile(appPath + '/sections/index.html');
        //win.hide(); //FIXME

        win.on('closed', () => {
            win = null;
        });

        win.on('hide', () => {
            this.createMenusAndTray();
        });

        win.on('minimize', () => {
            win.hide();
        });

        // 隐藏/显示程序
        globalShortcut.register('Ctrl+Alt+0', () => {
            this.toggleWin();
        });
    },
    createMenusAndTray() {
        if (tray) {
            return;
        }


        tray = new Tray(appPath + '/assets/logo.png');

        const contextMenu = Menu.buildFromTemplate([{
            label: '设置（Settings）',
            type: 'normal',
            icon: appPath + '/assets/settings.png',
            click(menuItem, browserWindow, event) {
                win.show();
            }
        }, {
            label: '退出（Exit）',
            type: 'normal',
            icon: appPath + '/assets/exit.png',
            click(menuItem, browserWindow, event) {
                app.quit();
            }
        }]);

        tray.setToolTip('Mouse Finger');
        tray.setContextMenu(contextMenu);

        tray.on('double-click', () => {
            this.toggleWin();
        });
    },
    toggleWin() {
        win.isVisible() ? win.hide() : win.show();
    }
};

_.init();


exports.calls = {
    setPointerMode: _.setPointerMode,
    setClickKey: _.setClickKey,
    setAutoClick: _.setAutoClick,
    setTime: _.setTime
};
