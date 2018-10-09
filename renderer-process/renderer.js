const electron = require('electron'); //{clipboard, crashReporter, desktopCapturer, ipcRenderer, nativeImage, remote, screen, shell, webFrame}
const {clipboard, crashReporter, desktopCapturer, ipcRenderer, nativeImage, remote, screen, shell, webFrame} = electron;
const calls = electron.remote.require('./main-process/calls').calls;
const {app} = electron.remote;

let _ = {
    init() {
        let config = this.loadConfig();
        this.renderFormData(config);
        calls.setParams(config);
        this.registerAppEvent();
        this.register();
    },
    register() {
         document.querySelector('#submit').addEventListener('click', () => {
            let fields = _.getFormData();
            _.saveConfig(fields);
            calls.setParams(fields);

            ipcRenderer.send('params-updated', fields);
        }, false);


        // 链接事件
        document.querySelector('#project-link').addEventListener('click', () => {
            shell.openExternal('https://gitee.com/chiroc/mouse-finger');
        }, false);
    },
    /**
     * 获取表单数据对象
     */
    getFormData(){
        let formData = new FormData(document.getElementById('frm'));
        let fields = {};

        formData.forEach((v, k) => {
            fields[k] = v;
        });

        fields.isPaused = fields.isPaused === 'off';
        fields.tickingInterval = parseInt(fields.tickingInterval, 10);

        return fields;
    },
    /**
     * 将数据对象填充到表单
     * @param {object} fields
     */
    renderFormData(fields = {}){
        document.querySelectorAll(`[name=pointerMode][value=${fields.pointerMode}]`)[0].checked = true;
        document.querySelectorAll(`[name=mouseKey][value=${fields.mouseKey}]`)[0].checked = true;
        document.querySelectorAll(`[name=isPaused][value=${fields.isPaused ? 'off' : 'on'}]`)[0].checked = true;
        document.querySelector('#timeout').value = fields.tickingInterval;
    },
    /**
     * 验证转换时间
     * @param {string} time
     * @returns {number}
     */
    validTime(time) {
        if (!time) {
            return 100;
        }

        time = parseInt(time, 10);

        if (time < 100) {
            time = 100;
        }

        if (time > 999999) {
            time = 999999;
        }

        return time;
    },
    registerAppEvent() {
        // 当前主进程参数变化时将渲染到表单和保存到前端缓存（localStorage）
        ipcRenderer.on('shortcut-event', (event, arg) => {
            _.saveConfig(arg);
            _.renderFormData(arg);
        });
    },
    /**
     * 从缓存中初始化设置信息；如果找不到就从缓存默认参数中获取。
     */
    loadConfig() {
        let params = {};
        let config = localStorage.getItem('finger');
        if (config) {
            params = JSON.parse(config);
        } else {
            params = calls.getParams();
        }

        return params;
    },
    /**
     * 将配置参数缓存到前端（localStorage）
     * @param {object} fields
     */
    saveConfig(fields) {
        localStorage.setItem('finger', JSON.stringify(fields));
    }
};

_.init();