const path = require('path');
const MiniCssTextPlugin = require('mini-css-extract-plugin');

// commonjs 规范,导出配置项
module.exports = {
  mode: 'none',

  // webpack在寻找相对文件路径时，会以context为根目录(绝对路径,默认为CWD)。也可以配置在启动命令后
  context: path.resolve(__dirname, 'src'),

  // entry: './main.js',
  /* entry: {
    main: './main.js' // key是chunk的名称，描述chunk的入口
  }, */
  // 动态入口, 设置为一个函数动态返回配置
  // entry: () =>'./main.js', // 同步函数
  entry: () => new Promise((resolve) => resolve(['./main.js'])), // 异步函数
  
  // https://webpack.js.org/configuration/output/
  output: {
    // filename: 'bundle.js',
    // 借助模板和变量，[id | name | hash(唯一标识id的hash) | chunkhash]
    filename: '[name].js',
    // 非入口(运行过程中产生，使用 CommonChunkPlugin、使用 import('path/to/module') 动态加载等时)chunk在输出时的文件名称
    chunkFilename: '[id].js',
    // 绝对路径
    path: path.resolve(__dirname, './dist'),
    publicPath: '',
    // 异步加载, 通过JSONP实现，JSONP原理动态向html插入script实现。
    // 设置异步加载标签的crossorigin属性
    // https://developer.mozilla.org/zh-CN/docs/Web/HTML/CORS_settings_attributes
    // CORS
    // https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Access_control_CORS
    // 通常用设置 crossorigin 来获取异步加载的脚本执行时的详细错误信息
    crossOriginLoading: false,
    // 当用webpack配置一个可以被其他模块导入使用的库的时候，会用到一下2个属性, 它们常结合使用：
    library: 'webpackHeadFirst', // 配置导出库的名字
    libraryExport: '', // 配置要导出的模块中哪些子模块需要被导出, 只有在libraryTarget 被设置成 commonjs/commonjs2 时使用才有意义
      /* 
        假如要导出的模块源代码是：
        export const a=1;
        export default b=2;
        现在你想让构建输出的代码只导出其中的 a，可以把 output.libraryExport 设置成 a，那么构建输出的代码和使用方法将变成如下：
        // Webpack 输出的代码
        module.exports = lib_code['a'];
        // 使用库的方法
        require('library-name-in-npm')===1;
      */
    libraryTarget: 'this', // 配置以何种方式导出库，枚举类型，如下：
      /* 
        var(默认), 编写的库将通过var被赋值给library指定名称的变量。
          // webpack输出代码
          var webpackHeadFirst = lib_code
          // 使用库的方法
          webpackHeadFirst.doSomething()

          假如library为空，则直接输出lib_code, lib_code代指导出库的代码内容, 是具有返回值的一个自执行函数。

        commonjs, 通过commonjs规范导出。
          // webpack输出代码
          exports['webpackHeadFirst'] = lib_code
          // 使用库的方法
          // library-name-in-npm指模块发布到 Npm 代码仓库时的名称
          require('library-name-in-npm')['webpackHeadFirst'].doSomething()

        commonjs2, 通过commonjs2规范导出, 此时配置library没有意义。
          // webpack输出代码
          module.exports = lib_code
          // 使用库的方法
          require('library-name-in-npm').doSomething()
          CommonJS2 和 CommonJS 规范，差别在于 CommonJS 只能用 exports 导出，而 CommonJS2 在 CommonJS 的基础上增加了 module.exports 的导出方式。
          在 output.libraryTarget 为 commonjs2 时，配置 output.library 将没有意义

        this, 编写的库将通过this被赋值给通过library指定的名称。
          // webpack输出代码
          this["webpackHeadFirst"] = lib_code
          // 使用库的方法
          this.webpackHeadFirst.doSomething()

        window, 编写的库将通过 window 被赋值给通过 library 指定的名称，即把库挂载到 window 上
          // Webpack 输出的代码
          window['webpackHeadFirst'] = lib_code;

          // 使用库的方法
          window.webpackHeadFirst.doSomething();

        global, 编写的库将通过 global 被赋值给通过 library 指定的名称，即把库挂载到 global 上
          // Webpack 输出的代码
          global['webpackHeadFirst'] = lib_code;

          // 使用库的方法
          global.webpackHeadFirst.doSomething();
      */

  },

  module: {
    // 一组规则，告诉webpack遇到哪些文件用哪些loader加载和转换
    rules: [
      {
        test: /\.css$/,
        // 在引用css的地方require('style-loader!css-loader?minimize!.main.css')
        // 或者
        /* use: ['style-loader', {
          loader: 'css-loader',
          options: {
            // minimize: true
          }
        }] */
        // 将css提取到单独的css文件
        use: [{
          loader: MiniCssTextPlugin.loader,
        }, 'css-loader']
      }
    ]
  },
  plugins: [new MiniCssTextPlugin({
    // filename: '[name]_[contenthash:8].css'
    filename: '[name].css'
  })]
}