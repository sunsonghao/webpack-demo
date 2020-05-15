const path = require('path');

// commonjs 规范,导出配置项
module.exports = {
  mode: 'none',
  entry: './main.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, './dist')
  }
}