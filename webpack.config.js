const path = require('path');

// commonjs 规范,导出配置项
module.exports = {
  mode: 'none',
  entry: './main.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, './dist')
  },
  module: {
    // 一组规则，告诉webpack遇到哪些文件用哪些loader加载和转换
    rules: [
      {
        test: /\.css$/,
        // 在引用css的地方require('style-loader!css-loader?minimize!.main.css')
        // 或者
        use: ['style-loader', {
          loader: 'css-loader',
          options: {
            // minimize: true
          }
        }]
      }
    ]
  }
}