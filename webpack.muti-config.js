// 除了通过Object描述webpack配置外，还有以下几种方式

// 1.导出function

/* 当需要从同一份源代码中构建出多份代码，例如一份用于开发时，一份用于发布到线上时，
如果采用导出一个 Object 来描述 Webpack 配置的方法，需要写两个文件。 一个用于开发环境，
一个用于线上环境。再在启动时通过 webpack --config webpack.config.js 指定使用哪个配置文件。 

采用导出Function的方式，能通过js灵活的控制配置，完成一个文件实现以上要求。
*/
const path = require('path');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

module.exports = function (env = {}, argv) {
  console.log(env) // { production: true }, 在package.json中build:dist中配置

  const plugins = [];
  const isProduction = env['production'];

  if (isProduction) {
    plugins.push(
      // 压缩输出的JS代码
      new UglifyJsPlugin({
        uglifyOptions: {
          // 最紧凑的输出
          beautify: false,
          // 删除所有的注释
          comments: false,
          compress: {
            // 在UglifyJs删除没有用到的代码时不输出警告
            // warnings: false,
            // 删除所有的 `console` 语句，可以兼容ie浏览器
            drop_console: true,
            // 内嵌定义了但是只用到一次的变量
            collapse_vars: true,
            // 提取出出现多次但是没有定义成变量去引用的静态值
            reduce_vars: true,
          }
        }
      })
    )
  }

  return {
    mode: 'none',
    context: path.resolve(__dirname, 'src'),
    entry: {
      main: './main.js'
    },
    output: {
      // 把所有依赖的模块合并输出到一个 bundle.js 文件
      filename: 'bundle.js',
      // 输出文件都放到 dist 目录下
      path: path.resolve(__dirname, './dist'),
    },
    module: {
      rules: [
        {
          test: /\.css$/,
          use: ['style-loader', 'css-loader']
        },
        {
          test: /\.js$/,
          use: [{
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env']
            }
          }],
          exclude: path.resolve(__dirname, 'node_modules')
        }
      ]
    },
    plugins: plugins,
    devtool: isProduction ? undefined : 'source-map'
  }
}


// 2. 支持导出一个返回Promise的函数
// module.exports = wpConfig;

function wpConfig(env = {}, argv) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve({
        // ...
      });
    }, 2000);
  })
}

// 3. 导出多份配置
// 除了只导出一份配置外，Webpack 还支持导出一个数组，数组中可以包含每份配置，并且每份配置都会执行一遍构建。
var mutiArray = [
  // 采用 Object 描述的一份配置
  {
    // ...
  },
  // 采用函数描述的一份配置
  function() {
    return {
      // ...
    }
  },
  // 采用异步函数描述的一份配置
  function() {
    return Promise();
  }
]
// module.exports = mutiArray;
/* 以上配置会导致 Webpack 针对这三份配置执行三次不同的构建。

这特别适合于用 Webpack 构建一个要上传到 Npm 仓库的库，因为库中可能需要包含多种模块化格式的代码，例如 CommonJS、UMD。 */