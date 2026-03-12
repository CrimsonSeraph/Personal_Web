---
title: 如何部署 Algolia 搜索功能
categories: ["projects"]
tags: ["Projects","Algolia"]
cover: /images/covers/post/algolia/algolia.jpg
description: 如何部署 Algolia 搜索功能（参考官方文档）
banner: /images/covers/post/algolia/algolia.jpg
date: 2026-03-12T20:00:00+08:00
lastmod: 2026-03-12T20:00:00+08:00
---

# 如何部署 Algolia 搜索功能

> 注意：由于网站 [CrimsonSeraph/Personal-Web](https://github.com/CrimsonSeraph/Personal-Web) 有自动化程序生成文章的 `json` 并上传 `Algolia`，
  所以此处仅需要 `应用ID` `搜索API密钥` `写入API密钥` 即可。

## 1. 注册 Algolia

> 前往官网进行注册：[Algolia](https://dashboard.algolia.com/)

![图片](/images/covers/post/algolia/step-1.png)

推荐使用 GitHub 进行注册，当然，你用其他也行

## 2. 获取 `key` 等

* ### 打开设置页面：

![图片](/images/covers/post/algolia/step-2.png)

* ### 找到 `Application` 选项：

![图片](/images/covers/post/algolia/step-3.png)

* #### 点击创建：

![图片](/images/covers/post/algolia/step-4.png)

> 选择套餐（有免费的）并设置名字，然后确定并创建

* ### 开始页面点击暂时跳过：

![图片](/images/covers/post/algolia/step-5.png)

* ### 然后你就可以看到关键的三个要素了！

他们分别是：`应用ID` `搜索API密钥` `写入API密钥`

![图片](/images/covers/post/algolia/step-6.png)

* ### 返回 Hugo 制作的网站中填入相关信息