// 不认识css文件，需要loader解析
require('./main.css');
const show = require('./show');

let content = `
    DevServer 会启动一个 HTTP 服务器用于服务网页请求，同时会帮助启动 Webpack ，并接收 Webpack 发出的文件更变信号，通过 WebSocket 协议自动刷新网页做到实时预览
  `
show(content);
// show('123');