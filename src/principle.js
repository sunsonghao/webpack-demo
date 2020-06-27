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
  `
