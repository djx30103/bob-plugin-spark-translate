<div>
  <h1 align="center">XunFei Spark Translator Bob Plugin</h1>
</div>

## 简介

基于 [讯飞星火Spark API](https://xinghuo.xfyun.cn/spark) 的文本翻译、文本润色、语法纠错 Bob 插件。

### 语言模型

* `Spark4.0 Ultra` : Spark4.0 Ultra 模型（默认使用）
* `Spark Max`  : Spark Max 模型
* `Spark Pro`  : Spark Pro 模型
* `Spark Lite` : Spark Lite 模型

## 使用方法

1. 安装 [Bob](https://bobtranslate.com/guide/#%E5%AE%89%E8%A3%85) (版本 >= 1.8.0)，一款 macOS 平台的翻译和 OCR 软件

2. 下载此插件: [bob-plugin-spark-translate.bobplugin](https://github.com/djx30103/bob-plugin-spark-translate/releases/latest)

3. 安装此插件

4. 去 [讯飞星火](https://console.xfyun.cn/services) 获取你的 APIKey 和 APISecret

5. 把 API KEY 填入 Bob 偏好设置 > 服务 > 此插件配置界面的 API KEY 的输入框中

## 感谢

本仓库参考部分其他优秀源码，感谢[bob-plugin-cohere](https://github.com/missuo/bob-plugin-cohere)、[bob-plugin-gemini-translate](https://github.com/BrianShenCC/bob-plugin-gemini-translate)。

