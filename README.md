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
### 发布说明
发布的package管理在[maycur-business-package](https://github.com/woderwang/maycur-business-package)
把当前目录下的lib,es复制到发布项目中,检查maycur-business-package的package.json，它的dependence是否完整，如果要npm发布，需要更改package.json中的version版本号。

### 相关参考
1. [npm发布流程](https://itnext.io/how-to-package-your-react-component-for-distribution-via-npm-d32d4bf71b4f)