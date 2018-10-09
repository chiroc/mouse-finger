const electron = require('electron');
const {app, BrowserWindow, globalShortcut, Menu, Tray, shell, ipcMain, webContents, Notification} = electron;

const mouse = require('./main-process/mouse').mouse;
const {MouseKeys, MouseKeysLabel_ZHCN} = require('./main-process/include/mouseMetrics');

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
            this.registerEvent();
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
    registerEvent(){
        ipcMain.on('params-updated', (event, arg) => {
           this.updateTray(arg);
        });
    },
    /**
     * 注册系统全局快捷键
     */
    registerShortcut() {
        // 切换左右键及指针。同时会切换为对应的点击键（左手指针为右键点击，右手指针为左手点击）。
        globalShortcut.register('Ctrl+`', () => {
            if (mouse.getParams().pointerMode === MouseKeys.LEFT) {
                mouse.setAsRightCursor();
                mouse.setAsLeftClick();
            } else {
                mouse.setAsLeftCursor();
                mouse.setAsRightClick();
            }

            win.webContents.send('shortcut-event', mouse.getParams());
            this.updateTray();
        });

        // 只切换左右单击键。
        globalShortcut.register('Ctrl+Alt+`', () => {
            if (mouse.getMouseState()) {
                mouse.setAsRightClick();
            } else {
                mouse.setAsLeftClick();
            }

            win.webContents.send('shortcut-event', mouse.getParams());
            this.updateTray();
        });

        // 开启和暂停自动点击操作
        globalShortcut.register('Alt+F1', () => {
            mouse.togglePaused();

            win.webContents.send('shortcut-event', mouse.getParams());
            this.updateTray();
        });
    },
    createWindow() {
        win = new BrowserWindow({
            title: 'Mouse Settings',
            icon: appPath + '/assets/logo.png',
            autoHideMenuBar: true,
            width: 350,
            height: 490,
            frame: true,
            resizable: false, //FIXME
            closable: true
        });

        win.setMenu(null); // FIXME

        win.loadFile(appPath + '/sections/index.html');
        win.hide(); //FIXME

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

        tray = new Tray(appPath + '/assets/mouse.png');

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
        // tray.setTitle('Mouse Finger');
        tray.setContextMenu(contextMenu);

        tray.on('double-click', () => {
            this.toggleWin();
        });

        _.updateTray();
    },
    /**
     * 更新系统托盘图标和提示信息
     * @param {object} [params]
     */
    updateTray(params){
        if(!params){
            params = mouse.getParams();
        }

        tray.setImage(appPath + `/assets/mouse-${params.mouseKey}-${params.isPaused ? 'manual' : 'auto'}.png`);

        tray.setToolTip(`${MouseKeysLabel_ZHCN[params.pointerMode]}手指针|${MouseKeysLabel_ZHCN[params.mouseKey]}键点击|${params.isPaused ? '手动': '自动'}点击`);
    },
    toggleWin() {
        win.isVisible() ? win.hide() : win.show();
    }
};

_.init();