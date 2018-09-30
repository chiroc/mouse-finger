const electron = require('electron'); //{clipboard, crashReporter, desktopCapturer, ipcRenderer, nativeImage, remote, screen, shell, webFrame}
const {clipboard, crashReporter, desktopCapturer, ipcRenderer, nativeImage, remote, screen, shell, webFrame} = electron;

const electronRemote = electron.remote; // 返回主进程大多数对象
// const {app} = electronRemote;

let _ = {
    init() {
        this.register();
    },
    register() {
        document.querySelectorAll('[name=cursorModel]').forEach(el => {
            el.addEventListener('click', function () {
                console.log(this.value);
            }, false);
        });

        document.querySelectorAll('[name=clickModel]').forEach(el => {
            el.addEventListener('click', function () {
                console.log(this.value);
            }, false);
        });

        document.querySelectorAll('[name=autoClick]').forEach(el => {
            el.addEventListener('click', function () {
                console.log(this.value);
            }, false);
        });

        document.querySelector('#project-link').addEventListener('click', () => {
            shell.openExternal('https://gitee.com/chiroc/mouse-finger');
        }, false);

        document.querySelector('#timeout').addEventListener('blur', function (event) {
            console.log(this.value);
        }, false);
    }
};

_.init();
