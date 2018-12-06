### 打包
>用于npm发布
```
npm run build
```
### 开发模式
```
npm run build:dev
```
###### 开发模式说明，开发模式的命令，执行正常项目编译过程，只是多了一步，把对应的开发包复制到需要开发的工程项目中，开发保重包含lib文件夹，不包含es文件夹。
###### 开发模型需要在tools中创建tool.config.js文件，build过程会读取developDir属性，然后把开发包复制过去，内容如下：
```js
module.exports = {
    developDir: 
    //需要开发调试的目标工程目录
    '/Users/woder/maycur/maycur-form-web/src/mkbs/lib'
}
```
