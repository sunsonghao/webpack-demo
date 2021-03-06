import Vue from 'vue';
import hello from '@/components/hello.vue';

new Vue({
  el: "#app1",
  render: h => h(hello)
})


// 不认识css文件，需要loader解析
require('./main.scss');
const show = require('./show');

class Point {
  constructor (x, y) {
    this.x = 0;
    this.y = 0;
  }
}

let content = `
  DevServer 会启动一个 HTTP 服务器用于服务网页请求，同时会帮助启动 Webpack ，并接收 Webpack 发出的文件更变信号，通过 WebSocket 协议自动刷新网页做到实时预览

  核心概念：
    Chunk：代码块，一个 Chunk 由多个模块组合而成，用于代码合并与分割。
    Plugin：扩展插件，在 Webpack 构建流程中的特定时机注入扩展逻辑来改变构建结果或做你想要的事情。

    webpack启动后会从Entry里配置的模块文件 递归解析 Entry文件所依赖的模块。每找到一个模块Module就根据配置的Loader转换，转换后再解析出依赖的Module。
    这些模块会以Entry为单位进行分组，一个Entry和其所依赖的Module被分到一个组也就是一个chunk。
    最后webpack会把所有的chunk转换为输出文件。
    在整个流程中webpack会在恰当的时机执行Plugin中定义的逻辑。

  第2章：配置
  配置webpack的方式有2种
    1.通过JS文件描述配置,例如：使用webpack.config.js里的配置
    2.执行webpack可执行文件时通过命令行参数传入，例：webpack --devtool source-map
    这两种方式可以相互搭配使用

  按照配置所影响的功能来划分，可分为：
    2-1 Entry 配置模块的入口；
    2-2 Output 配置如何输出最终想要的代码；
    2-3 Module 配置处理模块的规则；
    2-4 Resolve 配置寻找模块的规则；
    2-5 Plugins 配置扩展插件；
    2-6 DevServer 配置 DevServer；
    2-7 其它配置项 其它零散的配置项；
    2-8 整体配置结构 整体地描述各配置项的结构；
    2-9 多种配置类型 配置文件不止可以返回一个 Object，还有其他返回形式；
    2-10 配置总结 寻找配置 Webpack 的规律，减少思维负担。

    2-10 从前面的配置看来选项很多，Webpack 内置了很多功能。 你不必都记住它们，只需要大概明白 Webpack 原理和核心概念去判断选项大致属于哪个大模块下，再去查详细的使用文档。

    通常你可用如下经验去判断如何配置 Webpack：
    
    想让源文件加入到构建流程中去被 Webpack 控制，配置 entry。
    想自定义输出文件的位置和名称，配置 output。
    想自定义寻找依赖模块时的策略，配置 resolve。
    想自定义解析和转换文件的策略，配置 module，通常是配置 module.rules 里的 Loader。
    其它的大部分需求可能要通过 Plugin 去实现，配置 plugin。

  第3章 实战
    使用新语言来开发项目：

    3-1 使用 ES6 语言
    3-2 使用 TypeScript 语言
    3-3 使用 Flow 检查器
    3-4 使用 SCSS 语言
    3-5 使用 PostCSS
    使用新框架来开发项目：

    3-6 使用 React 框架
    3-7 使用 Vue 框架
    3-8 使用 Angular2 框架
    用 Webpack 构建单页应用：

    3-9 为单页应用生成 HTML
    3-10 管理多个单页应用
    用 Webpack 构建不同运行环境的项目：

    3-11 构建同构应用
    3-12 构建 Electron 应用
    3-13 构建 Npm 模块
    3-14 构建离线应用
    Webpack 结合其它工具搭配使用，各取所长：

    3-15 搭配 Npm Script
    3-16 检查代码
    3-17 通过 Node.js API 启动 Webpack
    3-18 使用 Webpack Dev Middleware
    用 Webpack 加载特殊类型的资源：

    3-19 加载图片
    3-20 加载SVG
    3-21 加载 Source Map
    3-22 实战总结

    实战总结
    你自己需要有能力去分析遇到的问题，然后去寻找对应的解决方案，你可以按照以下思路去分析和解决问题：
      对所面临的问题本身要了解。例如在用 Webpack 去构建 React 应用时你需要先掌握 React 的基础知识。
      找出现实和目标之间的差异。例如在 React 应用的源码中用到了 JSX 语法和 ES6 语法，需要把源码转换成 ES5。
      找出从现实到目标的可能路径。例如把新语法转换成 ES5 可以使用 Babel 去转换源码。
      搜索社区中有没有现成的针对可能路径的 Webpack 集成方案。例如社区中已经有 babel-loader。
      如果找不到现成的方案说明你的需求非常特别，这时候你就需要编写自己的 Loader 或者 Plugin 了。在 第5章中会介绍如何编写它们。
    在解决问题的过程中有以下2点能力很重要：
      从一个知识你需要尽可能多的联想到其相关连的知识，这有利于打通你的知识体系,从经验中更快地得出答案。
      善于使用搜索引擎去寻找你所面临的问题，这有利于借助他人的经验更快地得出答案，而不是自己重新探索。
    最重要的是你需要多实战，自己去解决问题，这有利于加深你的影响和理解，而不是只看不做。

  第4章 优化
    优化可以分为优化开发体验和优化输出质量两部分， 本章进一步深入，教你如何优化 Webpack 构建。

    1.优化开发体验
      优化开发体验的目的是为了提升开发时的效率，其中又可以分为以下几点：
      
      优化构建速度。在项目庞大时构建耗时可能会变的很长，每次等待构建的耗时加起来也会是个大数目。
        4-1 缩小文件搜索范围
        4-2 使用 DllPlugin
        4-3 使用 HappyPack
        4-4 使用 ParallelUglifyPlugin
      优化使用体验。通过自动化手段完成一些重复的工作，让我们专注于解决问题本身。
        4-5 使用自动刷新
        4-6 开启模块热替换
    2.优化输出质量
      优化输出质量目的是 为了给用户呈现体验更好的网页，本质是 优化构建输出的要发布到线上的代码，分为以下几点：
      
      减少用户能感知到的加载时间，也就是首屏加载时间。
        4-7 区分环境
        4-8 压缩代码
        4-9 CDN 加速
        4-10 使用 Tree Shaking
        4-11 提取公共代码
        4-12 按需加载
      提升流畅度，也就是提升代码性能。
        4-13 使用 Prepack
        4-14 开启 Scope Hoisting
    优化的关键 是找出问题所在，这样才能一针见血，4-15 输出分析 教你如何利用工具快速找出问题所在。
    
    4-16 优化总结 对以上的优化方法做一个总结。

  第5章 原理
    在找不到解决方案时，需要编写自己的 Loader 或 Plugin，前提是需要了解 Webpack 的工作原理。
    了解 Webpack 整体架构、工作流程，学会区分一个功能的实现是通过 Loader 合适还是 Plugin 更合适：
      5-1 工作原理概括
      5-2 输出文件分析
    如何开发、调试 Loader 和 Plugin：
      5-3 编写 Loader
      5-4 编写 Plugin
      5-5 调试 Webpack
    5-6 原理总结 对本章做一个总结
  `
show(content);