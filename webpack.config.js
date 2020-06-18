const path = require('path');
const MiniCssTextPlugin = require('mini-css-extract-plugin');
const DefinePlugin = require('webpack/lib/DefinePlugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin')
// 为单页应用生成html, https://github.com/gwuhaolin/web-webpack-plugin
const { WebPlugin, AutoWebPlugin } = require('web-webpack-plugin')
// 管理多个单页应用
// 需要目录机构如下
/* 
  ├── pages
  │   ├── index
  │   │   ├── index.css // 该页面单独需要的 CSS 样式
  │   │   └── index.js // 该页面的入口文件
  │   └── login
  │       ├── index.css
  │       └── index.js
  ├── common.css // 所有页面都需要的公共 CSS 样式
  ├── google_analytics.js
  ├── template.html
  └── webpack.config.js

  从目录结构中可以看成出下几点要求：
    所有单页应用的代码都需要放到一个目录下，例如都放在 pages 目录下；
    一个单页应用一个单独的文件夹，例如最后生成的 index.html 相关的代码都在 index 目录下，login.html 同理；
    每个单页应用的目录下都有一个 index.js 文件作为入口执行文件。
*/

// 使用AutoWebPlugin自动寻找 pages 目录下的所有目录，把每一个目录看成一个单页应用
const autoWebPlugin = new AutoWebPlugin('./src/pages', {
  template: './template_muti.html', // HTML 模版文件所在的文件路径
  // postEntrys: ['./common.css'],// 所有页面都依赖这份通用的 CSS 样式文件
  // 提取出所有页面公共的代码
  commonsChunk: {
    name: 'common',// 提取出公共代码 Chunk 的名称
  },
})

// commonjs 规范,导出配置项
module.exports = {
  mode: 'none',

  // webpack在寻找相对文件路径时，会以context为根目录(绝对路径,默认为CWD)。也可以配置在启动命令后
  context: path.resolve(__dirname, 'src'),

  // AutoWebPlugin 会为寻找到的所有单页应用，生成对应的入口配置，
  // autoWebPlugin.entry 方法可以获取到所有由 autoWebPlugin 生成的入口配置
  entry: autoWebPlugin.entry({
    // 这里可以加入你额外需要的 Chunk 入口
  }), /* 返回
    {
      "index":["./pages/index/index.js","./common.css"],
      "login":["./pages/login/index.js","./common.css"]
    }
  */
  
  // entry: './main.js',
  /* entry: {
    main: './main.js' // key是chunk的名称，描述chunk的入口
  }, */
  // 动态入口, 设置为一个函数动态返回配置
  // entry: () =>'./main.js', // 同步函数
  // entry: () => new Promise((resolve) => resolve(['./main.js'])), // 异步函数

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
    libraryTarget: 'var', // 配置以何种方式导出库，枚举类型，如下：
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
        /* 
        # Vue 框架运行需要的库
          npm i -S vue
        # 构建所需的依赖
          npm i -D vue-loader css-loader vue-template-compiler
        */
        test: /\.vue$/,
        use: 'vue-loader'
      },
      {
        test: /\.ts$/,
        use: ['awesome-typescript-loader']
      },
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
          commonjs: true, // 禁用 CommonJS
          system: false, // 禁用 SystemJS
          harmony: true, // 禁用 ES6 import/export
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
        test: /\.(scss|sass)$/,
        use: ['style-loader', {loader: 'css-loader'}, 'sass-loader']
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
        },
        'postcss-loader'
        ] */
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
    extensions: ['ts', '.js', '.vue', '.json'],

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
  }), 
  new VueLoaderPlugin(),
  /* new WebPlugin({
    template: './template.html', // HTML 模版文件所在的文件路径
    filename: 'index.html' // 输出的 HTML 的文件名称
  }), */
  autoWebPlugin,
  new DefinePlugin({
    'process.env': {
      'NODE_ENV': JSON.stringify('production')
    }
  })
  ],

  // wds，实时预览通过注入到客户端的代理接收wds的指令来刷新页面。
  devServer: {
    // 配置模块热替换，wds默认发现文件更新自动刷新页面，开启后不刷新页面用新模块替换旧模块。
    hot: true,
    // 配置是否自动注入代理客户端到将运行在页面里的 Chunk 里去，默认自动注入
    // 关闭 inline，wds将无法直接控制要开发的网页。这时它通过 iframe 的方式去运行要开发的网页，当构建完变化后的代码时通过刷新 iframe 来实现实时预览。 
    // 但这时你需要去 http://localhost:8080/webpack-dev-server/ 实时预览你的网页了
    inline: true,

    // 配置使用了 HTML5 History API 的单页应用。 这类单页应用要求服务器在针对任何命中的路由时都返回一个对应的 HTML 文件，例如在访问 http://localhost/user 
    // 和 http://localhost/home 时都返回 index.html 文件， 浏览器端的 JavaScript 代码会从 URL 里解析出当前页面的状态，显示出对应的界面。
    // 多个单页应用
    // historyApiFallback: {
		// 	rewrites: [
    //     // 正则匹配命中的路由，以customer开头的都返回customer.html页面
    //     { from: /^\/customer/, to: '/customer.html' },
		// 		{ from: /.*/, to: path.posix.join('/', 'index.html') } // vue-cli中的配置
		// 	]
    // },
    // 或者
    // historyApiFallback: true, // 任何请求都返回index.html，适合只有一个html的文件

    // 配置wds http服务器的文件根目录，默认为当前执行目录，通常是项目根目录。
    // wds http服务暴露2类文件：本地文件和交给wds的构建结果，所以本地找不到构建结果。
    // contentBase: false, // 关闭暴露本地文件（只能用于配置暴露本地文件）

    // 配置在http响应中注入http响应头
    headers: {
      'X-sun': 'sh'
    },

    // Various Dev Server settings
    // 想要局域网中的其它设备访问你本地的服务，可以在启动 DevServer 时带上 --host 0.0.0.0
		host: '127.0.0.1', // can be overwritten by process.env.HOST // 172.23.204.45
		port: 8080, // can be overwritten by process.env.PORT, if port is in use, a free one will be determined
    // autoOpenBrowser: true // 已改为open配置项，见最后一行
    
    // 配置一个白名单列表，只有 HTTP 请求的 HOST 在列表里才正常返回
    allowedHosts: [
      // 匹配单个域名
      'host.com',
      'sub.host.com',
      // host2.com 和所有的子域名 *.host2.com 都将匹配
      '.host2.com'
    ],

    // 配置是否关闭用于 DNS 重绑定的 HTTP 请求的 HOST 检查。 DevServer 默认只接受来自本地的请求，关闭后可以接受来自任何 HOST 的请求。 
    // 它通常用于搭配 --host 0.0.0.0 使用，因为你想要其它设备访问你本地的服务，但访问时是直接通过 IP 地址访问而不是 HOST 访问，所以需要关闭 HOST 检查。
    disableHostCheck: false,

    // HTTP2 和 Service Worker 必须运行在 HTTPS 之上。 切换成 HTTPS 服务
    https: false,
    // 如果想用自己的证书,配置如下：
    /* https: {
      key: fs.readFileSync('path/to/server.key'),
      cert: fs.readFileSync('path/to/server.crt'),
      ca: fs.readFileSync('path/to/ca.pem')
    } */

    // 配置在客户端的日志等级,可取如下之一的值 none | error | warning | info。 默认为 info 级别，即输出所有类型的日志，设置成 none 可以不输出任何日志
    clientLogLevel: 'info',

    // 配置是否启用 gzip 压缩
    compress: true,

    // 在 DevServer 启动且第一次构建完时自动用你系统上默认的浏览器去打开要开发的网页。 
    // 同时还提供 devServer.openPage 配置项用于打开指定 URL 的网页
    open: true
  },

  /* 其他常用配置项 */

  // 配置项让 Webpack 构建出针对不同运行环境的代码
    /* web	针对浏览器 (默认)，所有代码都集中在一个文件里
    node	针对 Node.js，使用 require 语句加载 Chunk 代码
    async-node	针对 Node.js，异步加载 Chunk 代码
    webworker	针对 WebWorker
    electron-main	针对 Electron 主线程
    electron-renderer	针对 Electron 渲染线程 */
  target: 'web',

  // 配置wp如何生成sourceMap, 默认false
  // https://webpack.js.org/configuration/devtool/#production
  devtool: 'source-map',

  // wp监听模式， wp的watch默认是关闭的，wds的监听默认是开启的
  watch: true,
  // 监听模式运行时的参数
  // 在开启监听模式时，才有意义
  watchOptions: {
    // 不监听的文件或文件夹，支持正则匹配
    // 默认为空
    ignored: /node_modules/,
    // 监听到变化发生后会等300ms再去执行动作，防止文件更新太快导致重新编译频率太高
    // 默认为 300ms  
    aggregateTimeout: 300,
    // 判断文件是否发生变化是通过不停的去询问系统指定文件有没有变化实现的
    // 默认每隔1000毫秒询问一次
    poll: 1000
  },

  // 该配置项常用于加载本地的 Loader
  // 告诉 Webpack 如何去寻找 Loader，因为在使用 Loader 时是通过其包名称去引用的， 
  // Webpack 需要根据配置的 Loader 包名去找到 Loader 的实际代码，以调用 Loader 去处理源文件
  resolveLoader:{
    // 去哪个目录下寻找 Loader
    modules: ['node_modules'],
    // 入口文件的后缀
    extensions: ['.js', '.json'],
    // 指明入口文件位置的字段
    mainFields: ['loader', 'main']
  },

  // 告诉 Webpack JavaScript 运行环境已经内置了那些全局变量，针对这些全局变量不用打包进代码中而是直接使用全局变量
  externals: {
    // 把导入语句里的 jquery 替换成运行环境里的全局变量 jQuery, jq引入可以用providerPlugin或者exposePlugin
    // jquery: 'jQuery'
  }
}


/* Npm Script 底层实现原理是通过调用 Shell 去运行脚本命令,还有一个重要的功能是能运行安装到项目目录里的 node_modules 里的可执行模块
Webpack 只是一个打包模块化代码的工具，并没有提供任何任务管理相关的功能。可能需要多个任务才能完成。
  定义三个不同的任务。
  ’scripts’: {
    ’dev’: ’webpack-dev-server --open’,
    ’dist’: ’NODE_ENV=production webpack --config webpack_dist.config.js’,
    ’pub’: ’npm run dist && rsync dist’
  },
  pub 先构建出用于发布到线上去的代码，再同步 dist 目录中的文件到发布系统(如何同步文件需根据你所使用的发布系统而定)。所以在开发完后需要发布时只需执行 npm run pub。
 */

 /* 
  把代码检查功能整合到 Webpack 中会导致以下问题：
    由于执行检查步骤计算量大，整合到 Webpack 中会导致构建变慢；
    在整合代码检查到 Webpack 后，输出的错误信息是通过行号来定位错误的，没有编辑器集成显示错误直观；
  为了避免以上问题，还可以这样做：
    使用集成了代码检查功能的编辑器，让编辑器实时直观地显示错误；
    把代码检查步骤放到代码提交时，也就是说在代码提交前去调用以上检查工具去检查代码，只有在检查都通过时才提交代码，这样就能保证提交到仓库的代码都是通过了检查的。
  如果你的项目是使用 Git 管理，Git 提供了 Hook 功能能做到在提交代码前触发执行脚本。

  husky 可以方便快速地为项目接入 Git Hook， 执行
    npm i -D husky
  安装 husky 时，husky 会通过 Npm Script Hook 自动配置好 Git Hook，你需要做的只是在 package.json 文件中定义几个脚本，方法如下：
  {
    "scripts": {
      // 在执行 git commit 前会执行的脚本  
      "precommit": "npm run lint",
      // 在执行 git push 前会执行的脚本  
      "prepush": "lint",
      // 调用 eslint、stylelint 等工具检查代码
      "lint": "eslint && stylelint"
    }
  }
  precommit 和 prepush 你需要根据自己的情况选择一个，无需两个都设置
 */