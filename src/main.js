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

  第2章：配置
  配置webpack的方式有2种
    1.通过JS文件描述配置,例如：使用webpack.config.js里的配置
    2.执行webpack可执行文件时通过命令行参数传入，例：webpack --devtool source-map
    这两种方式可以相互搭配使用

  按照配置所影响的功能来划分，可分为：
    2-1 Entry 配置模块的入口；
    2-2 Output 配置如何输出最终想要的代码；
    2-3 Module 配置处理模块的规则；
    2-4 Resolve 配置寻找模块的规则；
    2-5 Plugins 配置扩展插件；
    2-6 DevServer 配置 DevServer；
    2-7 其它配置项 其它零散的配置项；
    2-8 整体配置结构 整体地描述各配置项的结构；
    2-9 多种配置类型 配置文件不止可以返回一个 Object，还有其他返回形式；
    2-10 配置总结 寻找配置 Webpack 的规律，减少思维负担。

    2-10 从前面的配置看来选项很多，Webpack 内置了很多功能。 你不必都记住它们，只需要大概明白 Webpack 原理和核心概念去判断选项大致属于哪个大模块下，再去查详细的使用文档。

    通常你可用如下经验去判断如何配置 Webpack：
    
    想让源文件加入到构建流程中去被 Webpack 控制，配置 entry。
    想自定义输出文件的位置和名称，配置 output。
    想自定义寻找依赖模块时的策略，配置 resolve。
    想自定义解析和转换文件的策略，配置 module，通常是配置 module.rules 里的 Loader。
    其它的大部分需求可能要通过 Plugin 去实现，配置 plugin。
  `
show(content);