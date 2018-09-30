const electron = require('electron');
const {app, BrowserWindow, globalShortcut, Menu, Tray, shell, ipcMain, webContents, Notification} = electron;

const mouseClick = require('./main-process/mouse-click.js').mouseClick;
const mousePointer = require('./main-process/mouse-pointer.js').mousePointer;

let win = null;
let tray = null;
const appPath = app.getAppPath();

let _ = {
    init() {
        app.on('ready', () => {
            this.createWindow();
            this.createMenusAndTray();
            mouseClick.registerEvent();

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
            if (mousePointer.getMouseState()) {
                mousePointer.setAsRightClick().setAsLeftCursor();
                mouseClick.setRightKeyAutoClick();
            } else {
                mousePointer.setAsLeftClick().setAsRightCursor();
                mouseClick.setLefKeyAutoClick();
            }

            // console.log(`Mouse cursor changed:${mousePointer.getMouseState() ? 'Left' : 'Right'}`);
        });

        // 切换左右单击
        globalShortcut.register('Ctrl+Alt+`', () => {
            if (mousePointer.getMouseState()) {
                mousePointer.setAsRightClick();
                mouseClick.setRightKeyAutoClick();
            } else {
                mousePointer.setAsLeftClick();
                mouseClick.setLefKeyAutoClick();
            }

            // console.log(`Mouse click changed:${mousePointer.getMouseState() ? 'Left' : 'Right'}`);
        });

        // 开启和暂停自动点击操作
        globalShortcut.register('Alt+F1', () => {
            mouseClick.toggleMouseKey(mousePointer.getMouseState());
            mouseClick.togglePaused();
        });
    },
    createWindow() {
        win = new BrowserWindow({
            title: 'Mouse Settings',
            icon: appPath + '/assets/logo.png',
            autoHideMenuBar: true,
            width: 500,
            height: 420,
            frame: true,
            resizable: false,
            closable: true
        });

        win.setMenu(null); // FIXME

        win.loadFile(appPath + '/sections/index.html');
        //win.hide(); //FIXME hide app on launched.

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

