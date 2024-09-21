# Vue3 + Electron 构建的仿网易云桌面端应用
### 逐字歌词的npm包
[https://www.npmjs.com/package/@lrc-player/core](https://www.npmjs.com/package/@lrc-player/core)

## 安装
### 1.安装本地服务器
```bash
// 1.接口地址: https://gitlab.com/Binaryify/NeteaseCloudMusicApi.git

git clone https://gitlab.com/Binaryify/NeteaseCloudMusicApi.git

// 2.安装依赖

npm/yarn install

// 3.启动服务

node app.js

// 默认端口号: 3000, 如需修改, 请在 server.js 文件中修改
```

### 2.启动项目
```bash
// 1.安装依赖

pnpm i

// 2.启动服务
pnpm start  -- 启动 vite 开发环境, 默认端口号: 5173, 可在 vite.config.ts 文件中修改
pnpm electron -- 启动 electron 开发环境, 保证访问端口号同步, 检查 /electron/index.js 文件
-- 服务端口号默认3000, 如有改动, 请在 .env 文件中修改 VITE_APP_WEB_URL
```

### 3.登录
```md
出于网易云安全策略问题, 仅提供二维码登录, 请使用网易云音乐APP扫码登录
```

## 效果图
待补充

## Electron API
```js
win.maximize() // 最大化窗口
win.unmaximize() // 取消最大化窗口
win.minimize() // 最小化窗口
win.restore() // 将窗口从最小化状态还原到其以前的状态
win.close() // 尝试关闭窗口。这与用户手动单击窗口的关闭按钮具有相同的效果
```