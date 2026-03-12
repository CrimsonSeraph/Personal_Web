---
title: 项目
description: 项目
translationKey: "projects"
date: 2026-03-08T14:00:00+08:00
lastmod: 2026-03-09T12:00:00+08:00
---

### 项目列表

* **Personal-Web**

项目仓库: **[Personal_Web](https://github.com/CrimsonSeraph/Personal_Web)** | 项目文章: **[Personal-Web 是如何搭建的](post/personal-web)**

**CrimsonSeraph 的个人网站** 是一个基于 [Hugo](https://gohugo.io/) 构建的静态博客站点，采用 [D-Sketon/hugo-theme-reimu](https://github.com/D-Sketon/hugo-theme-reimu) 主题，用于记录个人生活、学习与项目展示。网站已集成 [Waline](https://waline.js.org/) 评论系统、[Algolia](https://www.algolia.com/) 全文搜索和自部署的 [moe-counter-cf](https://github.com/SunDoge/moe-counter-cf) 访问计数器，通过 Cloudflare Pages 自动部署，可通过 [https://personal-web.crimsonseraph.top/](https://personal-web.crimsonseraph.top/) 访问。  
代码部分采用 MIT 许可证开放，但原创 Logo（`/favicon.ico`）保留所有权利，未经许可不得使用。

* **MoeCounter-Worker_D1**

项目仓库: **[MoeCounter-Worker_D1](https://github.com/CrimsonSeraph/MoeCounter-Worker_D1)** | 项目文章: **[MoeCounter-Worker_D1 是如何使用的](post/moe-counter)**

**MoeCounter-Worker_D1** 是一个基于 **Cloudflare Workers** 的轻量级计数器服务，支持通过 **SVG 图片**或**纯文本 API** 获取计数。它使用 **D1 数据库**持久化存储计数数据，并通过 **KV 缓存**生成的 SVG 图片以减少重复渲染开销。项目内置了多种主题风格（如 gelbooru），支持自定义数字位数、是否增加计数、像素风格渲染等，适合用于网站访客统计、页面浏览量展示等场景。整体基于 **Hono 框架**构建，部署简单，适合 Cloudflare 生态下的无服务器应用。