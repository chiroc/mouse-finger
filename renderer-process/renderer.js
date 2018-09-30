const electron = require('electron'); //{clipboard, crashReporter, desktopCapturer, ipcRenderer, nativeImage, remote, screen, shell, webFrame}
const {clipboard, crashReporter, desktopCapturer, ipcRenderer, nativeImage, remote, screen, shell, webFrame} = electron;
const calls = electron.remote.require('./main').calls;

let _ = {
    init() {
        this.register();
        this.renderFormFields();
    },
    register() {
        document.querySelectorAll('[name=cursorModel]').forEach(el => {
            el.addEventListener('click', function () {
                calls.setPointerMode(this.value);
            }, false);
        });

        document.querySelectorAll('[name=clickModel]').forEach(el => {
            el.addEventListener('click', function () {
                calls.setClickKey(this.value);
            }, false);
        });

        document.querySelectorAll('[name=autoClick]').forEach(el => {
            el.addEventListener('click', function () {
                calls.setAutoClick(this.value);

                if (this.value === 'on') {
                    document.querySelector('#timeout').setAttribute('disabled', 'disabled');
                    calls.setTime(document.querySelector('#timeout').value);
                } else {
                    document.querySelector('#timeout').removeAttribute('disabled');
                }
            }, false);
        });

        document.querySelector('#project-link').addEventListener('click', () => {
            shell.openExternal('https://gitee.com/chiroc/mouse-finger');
        }, false);

        document.querySelector('#timeout').addEventListener('blur', function (event) {
            calls.setTime(this.value);
        }, false);
    },
    renderFormFields() {

    }
};

_.init();
