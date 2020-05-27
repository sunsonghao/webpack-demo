// 不认识css文件，需要loader解析
require('./main.css');
const show = require('./show');

let content = `
    DevServer 会启动一个 HTTP 服务器用于服务网页请求，同时会帮助启动 Webpack ，并接收 Webpack 发出的文件更变信号，通过 WebSocket 协议自动刷新网页做到实时预览
  
  核心概念：
  Chunk：代码块，一个 Chunk 由多个模块组合而成，用于代码合并与分割。
  Plugin：扩展插件，在 Webpack 构建流程中的特定时机注入扩展逻辑来改变构建结果或做你想要的事情。

  webpack启动后会从Entry里配置的模块文件 递归解析 Entry文件所依赖的模块。每找到一个模块Module就根据配置的Loader转换，转换后再解析出依赖的Module。
  这些模块会以Entry为单位进行分组，一个Entry和其所依赖的Module被分到一个组也就是一个chunk。
  最后webpack会把所有的chunk转换为输出文件。
  在整个流程中webpack会在恰当的时机执行Plugin中定义的逻辑。
    `
show(content);