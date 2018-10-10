# packager
- https://github.com/electron-userland/electron-packager

```
# for use in npm scripts
npm install electron-packager --save-dev

# for use from cli
npm install electron-packager -g
```

# Build commands

## asar
 - `asar pack mouse-finger app.asar`
 - `asar pack mouse-finger electron-release/app.asar --unpack-dir "{.git,.idea,docs}" extract-file .gitignore`

## electron-packager


`electron-packager mouse-finger --platform=win32 --arch=x64`

`electron-packager mouse-finger --platform=win32 --arch=x64 --overwrite --icon=mouse-finger/assets/logo.ico`

> 未压缩版本
`electron-packager mouse-finger --platform=win32 --arch=x64 --overwrite --icon=mouse-finger/assets/logo.ico --out=mouse-finger-release`

> 压缩版本（Not Work）
`electron-packager mouse-finger --platform=win32 --arch=x64 --overwrite --icon=mouse-finger/assets/logo.ico --out=mouse-finger-release --asar.unpack="*.node"`

