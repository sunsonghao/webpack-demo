const path = require('path')
const DllPlugin = require('webpack/lib/DllPlugin')

module.exports = {
  mode: 'none',
  entry: {
    vue: ['vue']
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].dll.js',
    library: '_dll_[name]'
  },
  plugins: [
    new DllPlugin({
      // 动态链接库的全局变量名称，需要和 output.library 中保持一致
      // 该字段的值也就是输出的 manifest.json 文件 中 name 字段的值
      // 例如 vue.manifest.json 中就有 "name": "_dll_vue"
      name: '_dll_[name]', // 影响manifest中name值
      // 描述动态链接库的 manifest.json 文件输出时的文件名称
      path: path.resolve(__dirname, 'dist', '[name].manifest.json')
    })
  ]
}