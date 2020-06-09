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

  // module配置如何处理模块
  module: {
    // 配置模块的读取和解析规则，一组规则，告诉webpack遇到哪些文件用哪些loader加载和转换
    // 配置一项rules大致通过以下几种方式：
      /* 
        1条件匹配：通过 test 、 include 、 exclude 三个配置项来命中 Loader 要应用规则的文件。
        2应用规则：对选中后的文件通过 use 配置项来应用 Loader，可以只应用一个 Loader 或者按照从后往前的顺序应用一组 Loader，同时还可以分别给 Loader 传入参数。
        3重置顺序：一组 Loader 的执行顺序默认是从右到左执行，通过 enforce 选项可以让其中一个 Loader 的执行顺序放到最前或者最后。
      */
    rules: [
      {
        test: /\.js$/,
        // use: ['babel-loader?cacheDirectory'], // 参数，缓存babel编译结果，加快重新编译速度
        use: [
          {
            loader:'babel-loader',
            options:{
              cacheDirectory:true,
            },
            // enforce:'post' 的含义是把该 Loader 的执行顺序放到最后
            // enforce 的值还可以是 pre，代表把 Loader 的执行顺序放到最前面
            // enforce: 'post'
          },
        ],
    
        /* 
        因为 Webpack 是以模块化的 JavaScript 文件为入口，所以内置了对模块化 JavaScript 的解析功能，支持 AMD、CommonJS、SystemJS、ES6。 parser 属性可以更细粒度的配置哪些模块语法要解析哪些不解析，
        和 noParse 配置项的区别在于 parser 可以精确到语法层面， 而 noParse 只能控制哪些文件不被解析
        */
        parser: {
          amd: false, // 禁用 AMD
          commonjs: false, // 禁用 CommonJS
          system: false, // 禁用 SystemJS
          harmony: false, // 禁用 ES6 import/export
          requireInclude: false, // 禁用 require.include
          requireEnsure: false, // 禁用 require.ensure
          requireContext: false, // 禁用 require.context
          browserify: false, // 禁用 browserify
          requireJs: false, // 禁用 requirejs
        },
        include: path.resolve(__dirname, 'src') // 只命中src下的文件，加快webpack检索速度
      },
      {
        // 对非文本文件采用 file-loader 加载
        test: /\.(gif|png|jpe?g|eot|woff|ttf|svg|pdf)$/,
        use: ['file-loader'],
      },
      {
        test: /\.css$/,
        // 排除 node_modules 目录下的文件
        exclude: path.resolve(__dirname, 'node_modules'),
        // 在引用css的地方require('style-loader!css-loader?minimize!.main.css')
        // 或者 多参数时使用Object来描述
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
      },
      // test include exclude 这三个命中文件的配置项除了正则还支持数组，数组每一项是 或 的关系，即符合任意一项即命中
      {
        test:[
          /\.jsx?$/,
          /\.tsx?$/
        ],
        include:[
          path.resolve(__dirname, 'src'),
          path.resolve(__dirname, 'tests'),
        ],
        exclude:[
          path.resolve(__dirname, 'node_modules'),
          path.resolve(__dirname, 'bower_modules'),
        ]
      }
    ],
    
    
    /* 
    noParse 配置项可以让 Webpack 忽略对部分没采用模块化的文件的递归解析和处理，这样做的好处是能提高构建性能。 原因是一些库例如 jQuery 、ChartJS 它们庞大又没有采用模块化标准，
    让 Webpack 去解析这些文件耗时又没有意义。
    noParse 是可选配置项，类型需要是 RegExp、[RegExp]、function 其中一个。
    */
    // noParse: /jquery|chartjs/,
    // 被忽略掉的文件里不应该包含 import 、 require 、 define 等模块化语句
    // 使用函数，从 Webpack 3.0.0 开始支持
    noParse: (content)=> {
      // content 代表一个模块的文件路径
      // 返回 true or false
      return /jquery|chartjs/.test(content);
    },
  },

  // 配置webpack如何找寻模块对应的文件，wp内置js模块语法解析功能，默认采用标准里的解析规则，但也可以自己配置。
  resolve: {
    // 原路径映射为新的导入路径, 还支持 $ 符号来缩小范围到只命中以关键字结尾的导入语句：
    alias: {
      '@': path.resolve(__dirname, 'src'),
      // 命中以vue结尾的导入语句 import 'vue' 会替换成import 'vue/dist/vue.esm.js'
      // 'vue$': 'vue/dist/vue.esm.js',
    },
    /* 
    有一些第三方模块会针对不同环境提供几分代码。 例如分别提供采用 ES5 和 ES6 的2份代码，这2份代码的位置写在 package.json 文件里，如下：
    {
      "jsnext:main": "es/index.js",// 采用 ES6 语法的代码入口文件
      "main": "lib/index.js" // 采用 ES5 语法的代码入口文件
    }
    Webpack 会根据 mainFields 的配置去决定优先采用那份代码，mainFields 默认如下：
    mainFields: ['browser', 'main']
    
    Webpack 会按照数组里的顺序去package.json 文件里寻找，只会使用找到的第一个。
    假如你想优先采用 ES6 的那份代码，可以这样配置：
    */
    mainFields: ['jsnext:main', 'browser', 'main'],
    // 导入语句没带后缀时，Webpack 会自动带上后缀后去尝试访问文件是否存在。 
    // extensions 用于配置在尝试过程中用到的后缀列表
    extensions: ['.js', '.vue', '.json'],

    // 配置webpack去哪些目录下查找  第三方  模块，默认node_modules。
    // 当模块会被其他模块大量引用，其他模块分布不均，导入路径不相同，可以如下配置：只用import 'button', 相当于import '/src/components/button'
    modules:['./src/components','node_modules'],

    // 配置描述第三方模块的文件名称，即 package.json 文件
    descriptionFiles: ['package.json'],
    enforceExtension: false, // 导入语句是否必须带文件后缀
    // 只对 node_modules 下的模块生效,通常搭配 enforceExtension 使用，在 enforceExtension:true 时，因为安装的第三方模块中大多数导入语句没带文件后缀， 所以这时通过配置 enforceModuleExtension:false 来兼容第三方模块
    enforceModuleExtension: false

  },

  // 数组中每一项都是要是用的plugin实例, plugin需要的参数通过构造函数传入,难点在于掌握 Plugin 本身提供的配置项
  plugins: [new MiniCssTextPlugin({
    // filename: '[name]_[contenthash:8].css'
    filename: '[name].css'
  })]
}