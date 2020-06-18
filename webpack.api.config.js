// Webpack 除了提供可执行的命令行工具外，还提供可在 Node.js 环境中调用的库。 通过 Webpack 暴露的 API，可直接在 Node.js 程序中调用 Webpack 执行构建。
const webpack = require('webpack')
const config = require('./webpack.config')
const callback = (err, states) => {
  if (err || stats.hasErrors()) {
    // 构建过程出错
  }
  // 成功执行完构建
}

// webpack(config, callback) // 只能执行一次构建

// 不传回调函数，就会返回一个 Compiler 实例，让你去控制启动，不像上面那样立即启动
const complier = webpack(config)

// 调用 compiler.watch 以监听模式启动，返回的 watching 用于关闭监听
const watching = compiler.watch({
  // watchOptions
  aggregateTimeout: 300,
},(err, stats)=>{
  // 每次因文件发生变化而重新执行完构建后
});

// 调用 watching.close 关闭监听 
watching.close(()=>{
  // 在监听关闭后
});
