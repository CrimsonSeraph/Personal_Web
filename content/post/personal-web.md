---
title: Personal-Web 是如何搭建的
categories: ["projects"]
tags: ["Projects","Web","Hugo","CloudFlare","Waline","Algolia","MoeCounter"]
cover: /images/covers/post/personal-web/personal-web.jpg
description: 在开源项目基础上快速搭建自己的个人网站 
banner: /images/covers/post/personal-web/personal-web-banner.png
date: 2026-03-09T13:00:00+08:00
lastmod: 2026-03-11T19:00:00+08:00
---

# CrimsonSeraph 个人网站搭建教程

本教程将引导你基于我的个人网站仓库 [CrimsonSeraph/Personal-Web](https://github.com/CrimsonSeraph/Personal-Web) 快速搭建一个功能完备的个人博客。我的网站基于 **Hugo** 静态站点生成器和 **Reimu** 主题构建，并集成了评论、搜索、访问统计等常用功能，且对部分模板进行了定制化修改。

  > `注意`：本教程在我的个人网站仓库 [CrimsonSeraph/Personal-Web](https://github.com/CrimsonSeraph/Personal-Web) 基础上开展，你可以前往 [D-Sketon/hugo-theme-reimu](https://github.com/D-Sketon/hugo-theme-reimu) 查阅模板的教程。
    本教程仅提供此网站搭建过程中涉及的内容，原模板提供了 `更多内容` ，例如 `音乐播放器` 、基于 `Valine` 的评论服务等。
    由于我修改了部分 `layout` 中的生成文件，所以可能有些内容需要基于我的仓库，但基本可以使用 [D-Sketon/hugo-theme-reimu](https://github.com/D-Sketon/hugo-theme-reimu) 并参考其 `README.md`。
    你可以使用模板仓库，并将我仓库的部分文件复制进你的仓库以实现修改。

## 📝 前言

在开始之前，请确保你已经准备好以下内容。如果某项暂时没有，可以跳过或参考后续的单独教程。

- **Cloudflare 账号** – 用于域名托管、Pages 部署（可选）。
  > 如果没有，可以参考 [如何注册 Cloudflare](链接待补充)。
- **GitHub 账号** – 用于仓库管理、自动化部署。
  > 如果没有，可以参考 [GitHub 注册与基本使用](链接待补充)。
- **Hugo 程序** – 推荐使用 **Hugo 0.121.2 及以上版本**，且必须是 **Extended 版本**（主题使用 SCSS）。
  > 如果没有，可以参考 [Hugo 安装指南](链接待补充)
- **Git** – 用于版本管理和克隆仓库。
  > 下载地址：[Git](https://git-scm.com/)
- **域名** – 如果你希望绑定自己的域名，需要提前准备好，且评论功能需要一个你自己的域名。

  **注：子域名不可用于开启评论功能，需要你自己的域名**
  > 如果没有，可以使用 Cloudflare Pages 提供的默认域名 `xxx.pages.dev`。

---

## 第一步：获取源码

你可以选择直接克隆我的整个仓库（不推荐，这会下载较多无关内容），或者下载发布包（推荐，不含文章等个人内容）。

### 方式一：下载发布包（推荐）

1. 前往 [Personal-Web Releases](https://github.com/CrimsonSeraph/Personal-Web/releases) 页面，下载最新的 `Source code` 压缩包（通常名为 `Personal-Web-x.x.x.zip`）。
2. 解压到本地目录，例如 `D:\MyBlog`。

> 这种方式不会包含我的个人文章和图片，只保留网站框架和配置文件，适合从头搭建。

### 方式二：克隆仓库

```bash
git clone https://github.com/CrimsonSeraph/Personal-Web.git
cd Personal-Web
```

克隆会包含我所有的文章和图片，你可能需要删除 `content/post` 下的示例文章，并替换 `static/images` 中的图片。

---

## 第二步：启动本地预览

打开命令行（CMD 或 PowerShell），进入项目根目录，执行：

```bash
hugo server
```

如果一切正常，你会看到类似输出：

```
Web Server is available at http://localhost:1313/ (bind address 127.0.0.1)
```

用浏览器访问 `http://localhost:1313` 即可预览网站。

> 如果提示 `hugo` 不是内部或外部命令，请检查 Hugo 是否正确安装并添加到环境变量，或将 `hugo.exe` 复制到项目根目录。

---

## 第三步：项目结构概览

```
Personal-Web/
├── archetypes/             # 文章模板
├── assets/                 # 自定义 CSS/JS（本项目中很少使用）
├── config/
│   └── _default/
│       └── params.yml      # 主题配置文件（核心！）
├── content/                # 网站内容
│   ├── archives/           # 归档页面（必须）
│   ├── post/               # 文章存放处
│   ├── about.md            # 关于页面
│   ├── friend.md           # 友链页面
│   └── ...                 # 其他自定义页面
├── data/                   # 数据文件
│   ├── covers.yml          # 随机封面图片列表
│   ├── friends.yml         # 友链数据
│   └── vendor.yml          # 第三方 CDN 配置
├── i18n/                   # 多语言翻译文件
│   ├── en.yml
│   ├── zh-CN.yml
│   └── ...
├── layouts/                # 自定义模板（覆盖主题）
│   ├── partials/
│   └── ...
├── static/                 # 静态资源
│   ├── avatar/             # 头像
│   ├── images/             # 网站用图（banner、封面等）
│   └── favicon.ico         # 网站图标
├── hugo.toml               # Hugo 主配置文件
└── README.md               # 本项目的说明文件
```

> 详细的目录作用将在后续文章中展开，现在你只需知道大部分配置都在 `config/_default/params.yml` 中完成。

---

## 第四步：集成常用功能

本项目已集成评论、搜索、访问统计三大功能，你只需要在 `params.yml` 中填入自己的服务信息即可。

### 4.1 评论系统 – Waline

我使用的是 [Waline](https://waline.js.org/) 评论系统，它需要部署在后端（LeanCloud 或 Vercel）。假设你已经部署好并绑定了域名，获得了 `serverURL`。

在 `params.yml` 中找到 `waline` 部分：

```yaml
waline:
  enable: true
  serverURL: https://你的评论域名.com   # 改为你的 serverURL
  # 其他配置保持默认即可
```

> 详细 Waline 部署教程请参考：[如何部署 Waline 评论系统](链接待补充)

### 4.2 站内搜索 – Algolia

网站搜索基于 [Algolia](https://www.algolia.com/)。你需要先注册账号，创建一个 Index，并获取以下信息：

- `appID`
- `apiKey`（**仅限 Search-Only Key**，切勿使用 Admin Key）
- `indexName`

然后在 `params.yml` 中配置：

```yaml
algolia_search:
  enable: true
  appID: "你的 App ID"
  apiKey: "你的 Search-Only Key"
  indexName: "你的 Index 名称"
  hits:
    per_page: 10
```

同时，Hugo 主配置文件 `hugo.toml` 中已添加了 Algolia 输出格式，运行 `hugo` 会在 `public` 目录生成 `algolia.json`，你需要将其上传到 Algolia。可以使用 [atomic-algolia](https://github.com/chrisdmacrae/atomic-algolia) 等工具自动上传。

> 详细 Algolia 配置与上传教程：[Algolia 站内搜索配置指南](链接待补充)

### 4.3 访问统计 – MoeCounter-Worker_D1

我使用 [MoeCounter-Worker_D1](https://github.com/CrimsonSeraph/MoeCounter-Worker_D1) 在 Cloudflare Workers 上部署了可爱的计数器。部署后你会获得一个类似 `https://moe-counter-cf.你的用户名.workers.dev` 的地址。

在 `layouts/partials/footer.html` 中 `footer.busuanzi` 部分已经替换为自定义计数器图片：
```yaml
    {{- if .Site.Params.footer.busuanzi -}}
      <div style="display: flex; align-items: center; justify-content: center; gap: 8px; flex-wrap: wrap;">
        <span class="icon-eye" style="margin-right: 2px;"></span>
        <span>总访问量:</span>
        <span id="moe-counter-container" style="display: flex; gap: 2px; align-items: center; height: 6rem;">
          <!-- 动态插入数字图片 -->
        </span>
      </div>

      <script>
        (async function() {
          const DIGIT_IMAGES_PATH = '/theme/'; // 数字图片存放路径，需自行准备 0.gif ~ 9.gif
          const COUNTER_API = 'https://moe-counter-cf.crimsonseraph.top/api/MyCounter?add=1'; // Worker 地址
          const PAD_LENGTH = 7; // 补零位数

          try {
            const res = await fetch(COUNTER_API);
            const text = await res.text();
            const count = parseInt(text, 10) || 0;
            const padded = count.toString().padStart(PAD_LENGTH, '0');
            const container = document.getElementById('moe-counter-container');
            container.innerHTML = '';

            padded.split('').forEach(char => {
              const img = document.createElement('img');
              img.src = `${DIGIT_IMAGES_PATH}${char}.gif`;
              img.alt = char;
              img.style.height = '6rem';
              container.appendChild(img);
            });
          } catch (err) {
            console.error('Failed to load counter:', err);
          }
        })();
      </script>
    {{- end -}}
```

由于我直接修改了 `layouts/partials/footer.html`，你只需要将 `COUNTER_API` 改为你的计数器地址,通过 `params.yml` 中的 `footer.busuanzi` 开关控制即可。

```yaml
footer:
  busuanzi: true
```

> 详细 MoeCounter-Worker_D1 部署教程：[MoeCounter-Worker_D1 是如何使用的](post/how-to-use-moe-counter)

---

## 第五步：自定义配置 (params.yml)

`params.yml` 是主题的核心配置文件，几乎所有的外观和行为都在这里调整。以下是一些常用配置项。

### 5.1 菜单栏

```yaml
menu:
  - name: home              # 菜单项标识，用于 i18n 翻译
    url: ""                 # 首页路径为空
    icon: f015              # FontAwesome 图标十六进制代码
  - name: archives
    url: "archives"
    icon: f187
  - name: projects          # 新增菜单项
    url: "projects"
    icon: f07c
  - name: about
    url: "about"
    icon: f2bb
  - name: friend
    url: "friend"
    icon: f0c0
```

添加新菜单项后，记得在 `i18n` 文件中加入对应的翻译键（例如 `projects: "项目"`）。

### 5.2 社交链接

```yaml
social:
  email: your.email@example.com
  github: https://github.com/yourname
  twitter: https://x.com/yourname
  bilibili: https://space.bilibili.com/yourid
  steam: https://steamcommunity.com/id/yourname/
  # 可添加更多，主题会自动识别并显示对应图标
```

### 5.3 侧边栏小部件

```yaml
widgets:
  - category
  - tag
  - tagcloud
  - recent_posts

category_limits: 10         # 显示的分类数量
tag_limits: 10              # 显示的标签数量
recent_posts_limits: 5      # 显示的最新文章数量
tagcloud_limits: 20         # 标签云显示的标签数量
```

### 5.4 首页分类卡片

如果你想在首页展示分类卡片（类似我的网站），可以开启：

```yaml
home_categories:
  enable: true
  content:
    - categories: "life"    # 分类标识符（必须与文章中的 categories 一致）
      cover: "/images/covers/cover-1.jpg"  # 卡片封面
    - categories: "projects"
      cover: "/images/covers/cover-2.jpg"
```

### 5.5 其他常用设置

```yaml
author: "你的名字"
description: "网站描述"
avatar: "avatar.webp"           # 头像图片路径
banner: "images/banner.webp"    # 网站头图
toc: true                       # 是否显示文章目录
dark_mode:
  enable: auto                  # 暗黑模式：true/false/auto
```

更多配置项请参考主题的 [README](https://github.com/D-Sketon/hugo-theme-reimu) 或直接查看 `params.yml` 中的注释。

---

## 第六步：添加文章

文章统一放在 `content/post` 目录下。你可以创建 Markdown 文件，文件名建议使用英文短横线连接，例如 `my-first-post.md`。

每篇文章需要以 **Front-matter** 开头，例如：

```yaml
---
title: "我的第一篇文章"
date: 2026-03-09T10:00:00+08:00
lastmod: 2026-03-09T10:00:00+08:00
categories: ["life"]
tags: ["随笔", "生活"]
cover: "/images/covers/post/my-first-post/cover.jpg"
description: "这是文章摘要"
---

这里是正文内容...
```

- `categories` 和 `tags` 支持多个值。
- `cover` 可指定文章封面，留空则使用随机封面。
- `math: true` 可开启数学公式支持（需先在主题中启用）。
- `mermaid: true` 可开启流程图支持。

---

## 第七步：主题内置功能简介

Reimu 主题提供了许多实用的 shortcode，可以在文章中直接调用。

- **友链卡片** `{{</* friendsLink */>}}` – 自动读取 `data/friends.yml` 生成友链列表。
- **内链/外链卡片** `{{</* link title="标题" path="/about/" cover="auto" */>}}` – 生成美观的链接卡片。
- **标签轮盘** `{{</* tagRoulette tags="标签1,标签2" */>}}` – 随机展示标签。
- **照片墙** `{{</* gallery */>}}` – 将多张图片以瀑布流形式展示。
- **标签页** `{{</* tabs */>}}` – 创建可切换的选项卡。
- **折叠面板** `{{</* details summary="标题" */>}}` – 折叠内容。

具体用法可参考主题 [官方文档](https://github.com/D-Sketon/hugo-theme-reimu#内置shortcode) 或我的博客中的示例文章。

---

## 下一步

现在你已经拥有了一个功能完整的个人网站雏形。接下来你可以：

- 修改 `params.yml` 深度定制外观。
- 在 `data/friends.yml` 中添加友链。
- 替换 `static` 中的头像、banner、favicon 等资源。
- 部署到 Cloudflare Pages 或 GitHub Pages（后续教程）。

如果在搭建过程中遇到任何问题，欢迎在 [GitHub Issues](https://github.com/CrimsonSeraph/Personal-Web/issues) 提出，或参考我的其他详细教程（链接待补充）。

祝你拥有一个漂亮的个人网站！