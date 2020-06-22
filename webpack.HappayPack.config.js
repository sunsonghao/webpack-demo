const path = require('path');
// https://github.com/amireh/happypack
// 由于 JavaScript 是单线程模型，要想发挥多核 CPU 的能力，只能通过多进程去实现，而无法通过多线程实现。
// HappyPack 就能让 Webpack 把任务分解给多个子进程去并发的执行，子进程处理完后再把结果发送给主进程。

const HappyPack = require('happypack');
// 构造出共享进程池，进程池中包含5个子进程
const happyThreadPool = HappyPack.ThreadPool({ size: 5 });

module.exports = {
  mode: 'none',
  context: path.resolve(__dirname, 'src'),
  entry: {
    main: './main.js'
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, './dist'),
    publicPath: ''
  },
  module: {
    rules: [
      {
        test: /\.js$/,
         // 把对 .js 文件的处理转交给 id 为 babel 的 HappyPack 实例
         use: ['happypack/loader?id=babel'],
         // 排除 node_modules 目录下的文件，node_modules 目录下的文件都是采用的 ES5 语法，没必要再通过 Babel 去转换
         exclude: path.resolve(__dirname, 'node_modules'),
      }
    ]
  },
  plugins: [
    new HappyPack({
      // 用唯一的标识符 id 来代表当前的 HappyPack 是用来处理一类特定的文件
      id: 'babel',
      // 如何处理 .js 文件，用法和 Loader 配置中一样
      loaders: ['babel-loader?cacheDirectory'],
      // ... 其它配置项
      // 使用共享进程池中的子进程去处理任务
      threadPool: happyThreadPool,
    }),
  ]
}
