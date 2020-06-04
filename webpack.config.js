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
    crossOriginLoading: false, 

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