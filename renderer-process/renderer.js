const electron = require('electron');
const { ipcRenderer, shell} = electron;
const calls = electron.remote.require('./main-process/calls').calls;

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
        fields.tickingInterval = _.validTime(fields.tickingInterval);

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
        document.querySelector('#timeout').value = _.validTime(fields.tickingInterval);
    },
    /**
     * 验证转换时间
     * @param {number|string} time
     * @returns {number}
     */
    validTime(time) {
        const min = 100, max = 999999;
        if (!time) {
            return min;
        }

        time = parseInt(time, 10);

        if (time < min) {
            time = min;
        }

        if (time > max) {
            time = max;
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