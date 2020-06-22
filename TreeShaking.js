const treeShaking = `
  Tree Shaking 可以用来剔除 JavaScript 中用不上的死代码。
  它依赖  静态的  ES6  模块化语法，例如通过 import 和 export 导入导出。

  要让 Tree Shaking 正常工作的前提是交给 Webpack 的 JS 代码必须是采用 ES6 模块化语法的，
  因为 ES6 模块化语法是静态的（导入导出语句中的路径必须是静态的字符串，而且不能放入其它代码块中），
  这让 Webpack 可以简单的分析出哪些 export 的被 import 过了。 如果你采用 ES5 中的模块化，
  例如 module.export={...}、require(x+y)、if(x){require('./util')}，Webpack 无法分析出哪些代码可以剔除。

  目前的 Tree Shaking 还有些的局限性，经实验发现：
    不会对entry入口文件做 Tree Shaking。
    不会对 异步分割 出去的代码做 Tree Shaking。

  接入treeShaking:
    1.为把ES6模块化语法交给webpack,要关闭babel的模块转换功能。更改babelrc文件中presets中['env',{modules:false}],
    在启动 Webpack 时带上 --display-used-exports 参数,控制台日志会有类似[only some exports used: funcA]
    2.4-8节中提过剔除死代码还需要uglifyJS处理一遍，webpack只是指出了哪些函数用上了哪些没用上。通过4-8压缩代码
    中介绍的加入 UglifyJSPlugin 去实现， 也可以简单的通过在启动 Webpack 时带上 --optimize-minimize 参数
    3.在2-4Resolve mainFields 中曾介绍过 mainFields 用于配置采用哪个字段作为模块的入口描述。 为了让 Tree Shaking 对第三方模块生效，需要配置 Webpack 的文件寻找规则
    resolve.mainFields: ['jsnext:main', 'browser', 'main'], 先使用ES6版本的代码。
`