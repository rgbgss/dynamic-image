# dynamic-image
基于node.js express 服务，实现图片转换为gif demo; 实现图片转video demo;实现json转canvas动画，另外,doc文件中整理了更多图片转动画效果的相关链接供参考

express 服务

#### 介绍
demo A：实现图片转换为gif 

demo B:实现json文件转canvas动画

demo C:实现图片转video 代码见：https://gitee.com/rgbgss/convertImageToVideo

服务器当前调试相关配置：
热刷新/vscode断点调试

ps 更多详细情况，参见文档


#### 安装教程

1. node环境
2. 全局安装express
3. （可选）需要热刷新功能，全局安装 nodemon
4. 进入项目目录安装依赖
5. (可选)断点调试配置 vscode（runtimeExecutable的路径为自己电脑上nodemon的路径，如果未安装nodemon,则指定node路径，通过cmd中输入where node可查看到其路径）


#### 启动项目

1. 已安装nodemon和配置了断点调试的 直接点调试中的小三角即可
2. 未安装热刷新，则使用node ./bin/wwww
