const five = `
  第5章 原理

  5-1 工作原理概括
    基本概念：
      chunk: 代码块，由多个模块组合成，用于代码的分割合并。
      plugin: 插件，webpack在构建流程中特定时机对外广播事件，插件可以监听某事件的发生，在特定时机做对应的事情。
        (可以想象浏览器及插件的运行)

    webpack的串行运行流程：（可以想象C++的编译过程）
      -> 拿到参数 
      -> 初始化编译器(complier)并读取配置的插件，开始编译(run方法) 
      -> 确定入口模块
      -> 使用loader编译并找出依赖模块 
      -> 编译完依赖模块并找出模块间关系 
      -> 根据模块及关系组装成chunk并加入输出列表(输出最后机会)
      -> 输出完成

      初始化 -> 编译 -> 输出（非监听模式）
      初始化 -> 编译 -> 输出 => 编译 => 输出 => 编译 => 输出 ···（监听模式）
    每个大阶段中会发生很多事件，Webpack 会把这些事件广播出来供给 Plugin 使用。事件参考如下
    (https://webpack.wuhaolin.cn/5%E5%8E%9F%E7%90%86/5-1%E5%B7%A5%E4%BD%9C%E5%8E%9F%E7%90%86%E6%A6%82%E6%8B%AC.html)

  5-2 输出文件分析
    普通bundle.js
      (function(modules) {

        // 模拟 require 语句
        function __webpack_require__() {
        }
      
        // 执行存放所有模块数组中的第0个模块
        __webpack_require__(0);
      
      })([/*存放所有模块的数组*/])

    分割代码时的输出bundle.js
      多了一个 __webpack_require__.e 用于加载被分割出去的，需要异步加载的 Chunk 对应的文件;
      多了一个 webpackJsonp 函数用于从异步加载的文件中安装模块。
    在使用了 CommonsChunkPlugin 去提取公共代码时输出的文件和使用了异步加载时输出的文件是一样的，
    都会有 __webpack_require__.e 和 webpackJsonp。 原因在于提取公共代码和异步加载本质上都是代码分割。

  5-3 编写loader
    一个 Loader 的职责是单一的，只需要完成一种转换

    loader基础
      由于 Webpack 是运行在 Node.js 之上的，一个 Loader 其实就是一个 Node.js 模块，这个模块需要导出一个函数。 
      这个导出的函数的工作就是获得处理前的原内容，对原内容执行处理后，返回处理后的内容。
        module.exports = function (source) {
          return source
        }
      由于 Loader 运行在 Node.js 中，可以调用任何 Node.js 自带的 API，或者安装第三方模块进行调用
        const thirdModule = require('thirdModule');
        module.exports = function(source) {
          return thirdModule(source);
        };

    loader进阶
      如获取用户options，参考：https://www.webpackjs.com/api/loaders/

      如何加载本地loader:
        npm link
        webpack中resolveLoader.modules配置项修改（参考2-7节）
    实战
        ···

  5-4 编写plugin
    https://www.webpackjs.com/api/plugins/
    Webpack 运行的生命周期中会广播出许多事件，Plugin 可以监听这些事件，在合适的时机通过 Webpack 提供的 API 改变输出结果
      class BasicPlugin{
        // 在构造函数中获取用户给该插件传入的配置
        constructor(options){
        }
      
        // Webpack 会调用 BasicPlugin 实例的 apply 方法给插件实例传入 compiler 对象
        // compiler.plugin(事件名称, 回调函数)
        apply(compiler){
          compiler.plugin('compilation',function(compilation) {
          })
        }
      }
      
      // 导出 Plugin
      module.exports = BasicPlugin;

    Compiler 和 Compilation
      Compiler 对象包含了 Webpack 环境所有的的配置信息，包含 options，loaders，plugins
      Compilation 对象包含了当前的模块资源、编译生成资源、变化的文件等，| 通过 Compilation 也能读取到 Compiler 对象  |
      Compiler 和 Compilation 的区别在于：Compiler 代表了整个 Webpack 从启动到关闭的生命周期，而 Compilation 只是代表了一次新的编译。
    
    事件流
      Webpack 通过 Tapable 来组织这条复杂的生产线。 Webpack 在运行过程中会广播事件，插件只需要监听它所关心的事件，就能加入到这条生产线中，去改变生产线的运作。 Webpack 的事件流机制保证了插件的有序性，使得整个系统扩展性很好。
      Webpack 的事件流机制应用了观察者模式，和 Node.js 中的 EventEmitter 非常相似。 Compiler 和 Compilation 都继承自 Tapable，可以直接在 Compiler 和 Compilation 对象上广播和监听事件
        compiler.apply('event-name',params); // 广播
        compiler.plugin('event-name',function(params) { // 监听
        });
      compilation也有以上两个方法
      有些事件是异步的，这些异步的事件会附带两个参数，第二个参数为回调函数，在插件处理完任务时需要调用回调函数通知 Webpack，才会进入下一处理流程
        compiler.plugin('emit',function(compilation, callback) {
          // 处理逻辑
      
          // 处理完毕后执行 callback 以通知 Webpack 
          // 如果不执行 callback，运行流程将会一直卡在这不往下执行 
          callback();
        });
    常用API
      读取输出资源、代码块、模块及其依赖 compilation.chunks
      监听文件变化
      修改输出资源，compilation.assets
      判断 Webpack 使用了哪些插件，compiler.options.plugins
    实战

  5-5 调试 Webpack
    https://webpack.wuhaolin.cn/5%E5%8E%9F%E7%90%86/5-5%E8%B0%83%E8%AF%95Webpack.html
    教你如何断点调试 5-1工作原理概括 中的插件代码。 由于 Webpack 运行在 Node.js 之上，调试 Webpack 就相对于调试 Node.js 程序
      设置断点
      配置入口 （Node.js 的执行入口文件，为 Webpack 的执行入口文件）
      启动调试
      执行到断点
  
  5-6 原理总结
    Webpack 是一个庞大的 Node.js 应用，阅读它的源码，非常多。但无需了解所有的细节，只需了解其整体架构和部分细节即可

    Webpack 把复杂的实现隐藏了起来，给用户暴露出的只是一个简单的工具，让用户能快速达成目的。 同时整体架构设计合理，
    扩展性高，开发扩展难度不高，通过社区补足了大量缺失的功能，让 Webpack 几乎能胜任任何场景
  `
