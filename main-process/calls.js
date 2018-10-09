const mouse = require('./mouse').mouse;

exports.calls = {
    getParams(){
        return mouse.getParams();
    },
    setParams(params){
        mouse.updateParams(params);
    }
};
