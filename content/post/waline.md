---
title: 如何部署 Waline 评论系统
categories: ["projects"]
tags: ["Projects","Waline"]
cover: /images/covers/post/waline/waline.png
description: 如何部署 Waline 评论系统（参考官方文档）
banner: /images/covers/post/waline/waline.png
date: 2026-03-11T20:00:00+08:00
lastmod: 2026-03-12T20:00:00+08:00
---

# 如何部署 Waline 评论系统

欢迎使用 **Waline**！这是一个简洁、安全的评论系统，支持评论与浏览量服务。只需几个步骤，你就可以在你的网站中启用它。

本教程将引导你完成从服务端部署到前端引入的完整流程，参考自 [Waline 官方快速上手文档](https://waline.js.org/guide/get-started/)。

## 1. 部署服务端 (Vercel)

首先，我们需要将 Waline 的服务端部署到 Vercel 平台。

1.  **点击部署**：在 Waline 官网文档页，找到并点击一键部署至 Vercel 的按钮。
2.  **登录/注册**：如果你未登录 Vercel，它会提示你注册或登录。**建议使用 GitHub 账户进行快捷登录**。
3.  **创建项目**：登录后，Vercel 会让你输入一个喜欢的**项目名称**，然后点击 `Create` 按钮。Vercel 会自动基于 Waline 模板创建一个 Git 仓库并初始化项目。
4.  **部署成功**：等待约一分钟后，你会看到满屏的烟花庆祝部署成功。此时点击 `Go to Dashboard` 进入应用控制台，为下一步配置数据库做准备。

## 2. 创建并配置数据库

Waline 需要数据库来存储评论数据。我们将使用 Vercel 集成的 Neon (PostgreSQL) 服务。

1.  **进入存储页面**：在 Vercel 项目控制台顶部，点击 **`Storage`** 标签页，进入存储服务配置页。
2.  **创建数据库**：点击 **`Create Database`** 按钮。在数据库服务提供商选项中，选择 **Neon**，然后点击 `Continue`。
3.  **关联账号**：此时会提示你创建或关联 Neon 账号，直接选择 `Accept and Create` 接受并创建。
4.  **选择配置**：后续会让你选择数据库的套餐、地区等，通常可以直接保持默认，一路点击 `Continue` 下一步，直到完成数据库创建。
5.  **初始化表结构**：此时，在 Vercel 的 `Storage` 页面下方会列出你刚创建的数据库。点击它进入详情页，然后点击 **`Open in Neon`** 跳转到 Neon 的控制台。
6.  **执行 SQL**：在 Neon 界面左侧，选择 **`SQL Editor`**。将 Waline 文档中提供的 `waline.pgsql` 文件里的 SQL 语句**粘贴到编辑器中**，点击 **`Run`** 执行，以创建程序运行所需的数据库表。
7.  **重新部署**：SQL 执行成功后，返回 Vercel 项目控制台。点击顶部的 **`Deployments`** 标签页，找到**最新的一次部署**记录，点击其右侧的 **`Redeploy`** 按钮进行重新部署。**这一步至关重要，能让刚才配置的数据库环境变量生效。**
8.  **获取服务端地址**：等待重新部署完成，状态变为 `Ready`。此时，点击 **`Visit`** 按钮，弹出的新标签页地址即为你的**服务端地址 (ServerURL)**，格式类似 `https://你的项目名.vercel.app`。请记下它。

## 3. (可选) 绑定自定义域名

如果你不想使用 Vercel 提供的域名，可以绑定自己的域名。

1.  **进入域名设置**：在 Vercel 项目控制台顶部，点击 **`Settings`** -> **`Domains`**。
2.  **添加域名**：在输入框中输入你想要绑定的域名（例如 `comments.yourdomain.com`），点击 `Add`。
3.  **配置 DNS**：根据 Vercel 提供的提示，在你的域名DNS服务商处，为你的域名添加一条 `CNAME` 解析记录：
    *   **Type**: `CNAME`
    *   **Name**: 你填写的域名前缀 (如 `comments`)
    *   **Value**: `cname.vercel-dns.com`
4.  **生效**：等待 DNS 解析生效后，你就可以通过自己的域名访问 Waline 了：
    *   评论系统：`http://你的域名`
    *   评论管理后台：`http://你的域名/ui`

## 4. 在前端页面引入 Waline

现在，将评论功能添加到你的网站页面中。你需要在 HTML 文件中引入 Waline 的样式文件和 JavaScript 模块。

1.  **引入样式**：在页面的 `<head>` 部分，添加 `<link>` 标签引入 Waline 的 CSS 文件。
2.  **创建容器**：在你想显示评论框的位置，放置一个 `<div>` 元素，并为其设置一个 ID（例如 `waline`）。
3.  **初始化脚本**：在页面底部或合适位置，添加 `<script type="module">` 标签，从 CDN 导入 `init` 函数，并调用它，传入**容器选择器**和你的**服务端地址**。

以下是一个完整的 HTML 示例代码：

```html
<head>
  <!-- ... 其他头部内容 ... -->
  <!-- 1. 引入 Waline 样式 -->
  <link rel="stylesheet" href="https://unpkg.com/@waline/client@v3/dist/waline.css" />
  <!-- ... -->
</head>
<body>
  <!-- ... 页面内容 ... -->

  <!-- 2. 创建评论容器 -->
  <div id="waline"></div>

  <!-- 3. 引入 Waline 脚本并初始化 -->
  <script type="module">
    import { init } from 'https://unpkg.com/@waline/client@v3/dist/waline.js';

    init({
      el: '#waline', // 容器选择器
      serverURL: 'https://你的项目名.vercel.app', // 你的服务端地址
    });
  </script>
</body>
```

保存文件并在浏览器中打开，你应该就能看到 Waline 评论框已经成功运行了 🎉

## 5. 评论管理

Waline 提供了方便的后台管理功能。

1.  **注册管理员**：部署完成后，请先在浏览器中访问 **`<你的服务端地址>/ui/register`** 进行注册。**系统中首个注册的用户将被自动设置为管理员。**
2.  **登录管理**：注册后，在同一个地址 (`/ui`) 登录，即可进入评论管理界面。在这里，你可以查看、编辑、标记或删除所有评论。
3.  **用户功能**：普通访问者也可以通过评论框下方的链接进行注册和登录。登录后，他们可以查看自己的个人信息和评论历史。

> **请注意**：本文档主要基于官方“快速上手”指南编写，旨在帮助你快速部署。如果在使用中遇到问题或需要更高级的配置，建议查阅 [Waline 官方文档](https://waline.js.org/) 或在 [GitHub Discussion](https://github.com/walinejs/waline/discussions) 中寻求帮助。
