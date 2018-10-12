# Mouse Finger


### 项目介绍

一个解放鼠标手（指）重度患者的工具。

__主要功能：__
 - 快速切换鼠标左右手指针【Ctrl+`】；
 - 快速切换鼠标左右点击键【Ctrl+Alt+`】；
 - 自动点击鼠标键【Alt+F1】；

__Mouse Finger工具适应人群：__

 > - 手指过度劳损者+左右手操作鼠标者。
 >
 > - 该项目为一个工具类项目：主要解决因长年过度使用鼠标导致手指点击鼠标有劳损的特殊人群，该人群可能需要时常轮换左右手来操作鼠标。当然，如果没有这方面问题的人群可能无法理解，只当共同学习 electronjs框架。
 >
 > - 该工具不但可能切换左右鼠标键，同时还可以切换指针样式，这样就可以在用左手点击鼠标时显得不那么别扭。
 >
 > - 同时还可以设置在完成鼠标移动后自动点击鼠标，就可以绝大多数时间不用点鼠标。（不适合复杂交互工作环境）



### 软件架构

 项目基于 [electron](https://electronjs.org/) 原生应用框架实现。

 __主要依赖库：__
 - [robotjs](https://github.com/octalmage/robotjs), 操作鼠标和键盘。
 - [iohook](https://github.com/WilixLead/iohook), 监听鼠标和键盘事件。
 - [ffi](https://github.com/node-ffi/node-ffi), 调用系统API。
 - [electron-builder](https://github.com/electron-userland/electron-builder), 打包工具。
 - [node-gyp](https://github.com/nodejs/node-gyp)，编译项目时需要（全局安装）。

> 目前只支持 windows 平台，由于个人时间和精力仅在win10测试过。



### 安装教程
 1) 下载最新版本 [mouse-finger](https://gitee.com/chiroc/mouse-finger/releases/) zip文件解压后直接运行 `mouse-finger.exe`。

 2) 也可以手动编译（当然整个过程可能并不是很愉快，要有心理准备）。 安装项目前需要先准备好开发环境（windows）：

 - Visual Studio 2013（C/C++编译环境）
 - Python 2.7

完成后运行：
1. `npm install`
2. `npm rebuild --runtime=electron --target=2.0.0 --disturl=https://atom.io/download/atom-shell --abi=57`
3. `npm start`



### 使用说明

 项目运行后会在windows系统平台任务栏有一个鼠标小图标，双击可以打开设置界面。也可以用键盘快捷键操作：
 - 切换鼠标指针左右样式：【Ctrl+`】；
 - 切换鼠标左右点击键：【Ctrl+Alt+`】；
 - 切换自动鼠标点击事件：【Ctrl+F1】。
