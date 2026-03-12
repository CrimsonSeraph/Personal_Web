---
title: Projects
description: Projects
translationKey: "projects"
date: 2026-03-08T14:00:00+08:00
lastmod: 2026-03-09T12:00:00+08:00
---

### 项目列表

* **Personal-Web**

Project repository: **[Personal_Web](https://github.com/CrimsonSeraph/Personal_Web)** | Project article: **[How is Personal-Web set up](post/personal-web)**

**CrimsonSeraph's Personal Website** is a static blog site built with [Hugo](https://gohugo.io/), using the [D-Sketon/hugo-theme-reimu](https://github.com/D-Sketon/hugo-theme-reimu) theme. It serves as a platform to document personal life, learning experiences, and project showcases. The site integrates [Waline](https://waline.js.org/) for comments, [Algolia](https://www.algolia.com/) for full-text search, and a self-hosted [moe-counter-cf](https://github.com/SunDoge/moe-counter-cf) visitor counter. It is automatically deployed via Cloudflare Pages and accessible at [https://personal-web.crimsonseraph.top/](https://personal-web.crimsonseraph.top/).  
The code is open-sourced under the MIT License, while the original Logo (`/favicon.ico`) retains all rights and may not be used without explicit permission.

* **MoeCounter-Worker_D1**

项目仓库: **[MoeCounter-Worker_D1](https://github.com/CrimsonSeraph/MoeCounter-Worker_D1)** | 项目文章: **[MoeCounter-Worker_D1 是如何使用的](post/moe-counter)**

**MoeCounter-Worker_D1** is a lightweight counter service built on **Cloudflare Workers**, supporting counting retrieval via **SVG images** or **plain text API**. It uses **D1 database** to persistently store count data and caches generated SVG images with **KV storage** to reduce rendering overhead. The project includes multiple built-in themes (e.g., gelbooru), supports custom digit length, count increment control, and pixelated rendering, making it ideal for website visitor statistics, page view displays, and similar scenarios. Built on the **Hono framework**, it is easy to deploy and well-suited for serverless applications within the Cloudflare ecosystem.