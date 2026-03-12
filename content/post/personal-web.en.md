---
title: How to Build Personal-Web
categories: ["projects"]
tags: ["Projects","Web","Hugo","CloudFlare","GitHub","Waline","Algolia","MoeCounter"]
cover: /images/covers/post/personal-web/personal-web.jpg
description: Quickly build your personal website based on open source projects
banner: /images/covers/post/personal-web/personal-web-banner.png
date: 2026-03-09T13:00:00+08:00
lastmod: 2026-03-12T19:00:00+08:00
---

# CrimsonSeraph Personal Website Building Tutorial

This tutorial will guide you to quickly build a fully functional personal blog based on my personal website repository [CrimsonSeraph/Personal-Web](https://github.com/CrimsonSeraph/Personal-Web). My website is built with the **Hugo** static site generator and the **Reimu** theme, and integrates common features such as comments, search, and visit statistics, with some customized template modifications.

> `Note`: This tutorial is based on my personal website repository [CrimsonSeraph/Personal-Web](https://github.com/CrimsonSeraph/Personal-Web). You can visit [D-Sketon/hugo-theme-reimu](https://github.com/D-Sketon/hugo-theme-reimu) to check the theme's tutorial.
  This tutorial only covers the content involved in building this website. The original theme provides `more features`, such as a `music player`, `Valine`-based comment service, etc.
  Since I have modified some of the generated files in `layouts`, some content may need to be based on my repository, but basically you can use [D-Sketon/hugo-theme-reimu](https://github.com/D-Sketon/hugo-theme-reimu) and refer to its `README.md`.
  You can use the theme repository and copy some files from my repository into yours to achieve modifications.

## 📝 Preface

Before starting, make sure you have the following ready. If something is temporarily unavailable, you can skip it or refer to a separate tutorial later.

- **Cloudflare account** – for domain hosting, Pages deployment (optional, you can also deploy elsewhere).
- **GitHub account** – for repository management, automated deployment.
- **Hugo program** – It is recommended to use **Hugo version 0.121.2 or higher**, and it must be the **Extended version** (the theme uses SCSS).
  > Download: [Hugo](https://github.com/gohugoio/hugo)
- **Git** – for version management and cloning repositories.
  > Download: [Git](https://git-scm.com/)
- **Domain** – if you want to bind your own domain, you need to prepare it in advance.

  **Note: Subdomains cannot be used to enable the comment feature; you need your own domain**
  > If not, you can use the default domain provided by Cloudflare Pages `xxx.pages.dev`, but note that this domain has some issues, such as difficulty accessing in some regions.

---

## Step 1: Get the Source Code

You can choose to clone my entire repository directly (not recommended, as it downloads a lot of unrelated content), or download the release package (recommended, does not contain personal content like articles).

### Method 1: Download the Release Package (Recommended)

1. Go to the [Personal-Web Releases](https://github.com/CrimsonSeraph/Personal-Web/releases) page and download the latest `Source code` archive (usually named `Personal-Web-x.x.x.zip`).
2. Extract it to a local directory, e.g., `D:\MyBlog`.

> This method does not include my personal articles and images; it only retains the website framework and configuration files, suitable for building from scratch.

### Method 2: Clone the Repository

```bash
git clone https://github.com/CrimsonSeraph/Personal-Web.git
cd Personal-Web
```

Cloning will include all my articles and images. You may need to delete the sample articles under `content/post` and replace the images in `static/images`.

---

## Step 2: Start Local Preview

Open the command line (CMD or PowerShell), go to the project root directory, and execute:

```bash
hugo server
```

If everything goes well, you will see output similar to:

```
Web Server is available at http://localhost:1313/ (bind address 127.0.0.1)
```

As shown in the figure:
 ![Image](/images/covers/post/personal-web/cmd.png)

Visit `http://localhost:1313` in your browser to preview the website.

> If you get a message that `hugo` is not an internal or external command, check if Hugo is correctly installed and added to the environment variables, or copy `hugo.exe` to the project root directory.

---

## Step 3: Project Structure Overview

```
Personal-Web/
├── archetypes/             # Article templates
├── assets/                 # Custom CSS/JS (rarely used in this project)
├── config/
│   └── _default/
│       └── params.yml      # Theme configuration file (core!)
├── content/                # Website content
│   ├── archives/           # Archive page (required)
│   ├── post/               # Articles storage
│   ├── about.md            # About page
│   ├── friend.md           # Friends page
│   └── ...                 # Other custom pages
├── data/                   # Data files
│   ├── covers.yml          # Random cover image list
│   ├── friends.yml         # Friends data
│   └── vendor.yml          # Third-party CDN configuration
├── i18n/                   # Multi-language translation files
│   ├── en.yml
│   ├── zh-CN.yml
│   └── ...
├── layouts/                # Custom templates (override theme)
│   ├── partials/
│   └── ...
├── static/                 # Static resources
│   ├── avatar/             # Avatar
│   ├── images/             # Website images (banner, covers, etc.)
│   ├── favicon.ico         # Website icon
│   └── ...
├── hugo.toml               # Hugo main configuration file
├── README.md               # Project description file
└── ...
```

> The detailed role of each directory will be explained in subsequent articles. For now, you just need to know that most configurations are done in `config/_default/params.yml`.

---

## Step 4: Integrate Common Features

This project integrates three major features: comments, search, and visit statistics. You only need to fill in your own service information in `params.yml`.

### 4.1 Comment System – Waline

I use the [Waline](https://waline.js.org/) comment system, which needs to be deployed on the backend (LeanCloud or Vercel). Assuming you have deployed it and bound a domain, you have obtained the `serverURL`.

> Note: You can use other methods or not use the `comment feature`. See the `README.md` of [D-Sketon/hugo-theme-reimu](https://github.com/D-Sketon/hugo-theme-reimu) for other options.

Find the `waline` section in `params.yml`:

```yaml
waline:
  enable: true                         # Whether to enable
  serverURL: https://your-comment-domain.com   # Replace with your serverURL
  # Other configurations can remain default
```

> For a detailed Waline deployment tutorial, please refer to: [How to Deploy Waline Comment System](post/waline)
  or the official documentation: [Quick Start](https://waline.js.org/guide/get-started/)

### 4.2 Site Search – Algolia

The website search is based on [Algolia](https://www.algolia.com/).

> Note: You can use other methods or not use `site search`. See the `README.md` of [D-Sketon/hugo-theme-reimu](https://github.com/D-Sketon/hugo-theme-reimu) for other options.

You need to register an account, create an Index, and obtain the following information:

- `appID`
- `apiKey` (**Search-Only Key only**, never use the Admin Key)
- `indexName`

Then configure it in `params.yml`:

```yaml
algolia_search:
  enable: true # Switch
  appID: "Your App ID"
  apiKey: "Your Search-Only Key"
  indexName: "Your Index Name"
  hits:
    per_page: 10
```

Meanwhile, the Hugo main configuration file `hugo.toml` already includes the Algolia output format. Running `hugo` will generate `algolia.json` in the `public` directory, which you need to upload to Algolia.

You can use tools like [atomic-algolia](https://github.com/chrisdmacrae/atomic-algolia) to upload automatically, or refer to the [GitHub workflow](https://github.com/CrimsonSeraph/Personal_Web/tree/main/.github) in my project.

> For detailed Algolia configuration and upload tutorial: [Algolia Site Search Configuration Guide](post/algolia)

### 4.3 Visit Statistics – MoeCounter-Worker_D1

I use [MoeCounter-Worker_D1](https://github.com/CrimsonSeraph/MoeCounter-Worker_D1) to deploy a cute counter on Cloudflare Workers.

> Note: You can use other methods or not use `visit statistics`. See the `README.md` of [D-Sketon/hugo-theme-reimu](https://github.com/D-Sketon/hugo-theme-reimu) for other options.

After deployment, you will get an address like `https://moe-counter-cf.your-username.workers.dev`.

In `layouts/partials/footer.html`, the `footer.busuanzi` part has been replaced with a custom counter image:
```yaml
    {{- if .Site.Params.footer.busuanzi -}}
      <div style="display: flex; align-items: center; justify-content: center; gap: 8px; flex-wrap: wrap;">
        <span class="icon-eye" style="margin-right: 2px;"></span>
        <span>Total visits:</span>
        <span id="moe-counter-container" style="display: flex; gap: 2px; align-items: center; height: 6rem;">
          <!-- dynamically insert digit images -->
        </span>
      </div>

      <script>
        (async function() {
          const DIGIT_IMAGES_PATH = '/theme/'; // Path to digit images, you need to prepare 0.gif ~ 9.gif
          const COUNTER_API = 'https://moe-counter-cf.crimsonseraph.top/api/MyCounter?add=1'; // Worker address
          const PAD_LENGTH = 7; // Zero padding length

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

Since I directly modified `layouts/partials/footer.html`, you only need to change `COUNTER_API` to your counter address and control it via the `footer.busuanzi` switch in `params.yml`.

```yaml
footer:
  busuanzi: true # Switch
```

> For a detailed MoeCounter-Worker_D1 deployment tutorial: [How to Use MoeCounter-Worker_D1](post/moe-counter)

---

## Step 5: Custom Configuration (params.yml)

`params.yml` is the core configuration file for the theme; almost all appearance and behavior adjustments are made here. Below are some common configuration items.

### 5.1 Menu Bar

```yaml
menu:
  - name: home              # Menu item identifier, used for i18n translation
    url: ""                 # Home path is empty
    icon: f015              # FontAwesome icon hex code
  - name: archives
    url: "archives"
    icon: f187
  - name: projects          # New menu item
    url: "projects"
    icon: f07c
  - name: about
    url: "about"
    icon: f2bb
  - name: friend
    url: "friend"
    icon: f0c0
```

After adding a new menu item, remember to add the corresponding translation key in the `i18n` files (e.g., `projects: "Projects"`). You can also delete menu items.

Or if you don't want internationalization, you can disable translation-related features in `hugo.toml` in the `root` directory. For example:

```yaml
[languages]
  [languages.zh-CN]
    languageName = '简体中文'
    weight = 1
    hasCJKLanguage = true
  [languages.en]
    languageName = 'English'
    weight = 2
```

To remove `English`, delete the `[languages.en]` related entries.

### 5.2 Social Links

```yaml
social:
  email: your.email@example.com
  github: https://github.com/yourname
  twitter: https://x.com/yourname
  bilibili: https://space.bilibili.com/yourid
  steam: https://steamcommunity.com/id/yourname/
  # More can be added, the theme will automatically recognize and display the corresponding icons
```

### 5.3 Sidebar Widgets

```yaml
widgets:
  - category
  - tag
  - tagcloud
  - recent_posts

category_limits: 10         # Number of categories to display
tag_limits: 10              # Number of tags to display
recent_posts_limits: 5      # Number of recent posts to display
tagcloud_limits: 20         # Number of tags in the tag cloud
```

### 5.4 Home Categories Cards

If you want to display category cards on the homepage, like my website:
 ![Image](/images/covers/post/personal-web/home_categories.jpg)

You can enable:

```yaml
home_categories:
  enable: true
  content:
    - categories: "life"    # Category identifier (must match the categories in articles)
      cover: "/images/covers/cover-1.jpg"  # Card cover
    - categories: "projects"
      cover: "/images/covers/cover-2.jpg"
```

### 5.5 Other Common Settings

```yaml
author: "Your Name"
description: "Website description"
avatar: "avatar.webp"           # Avatar image path
banner: "images/banner.webp"    # Website header image
toc: true                       # Whether to display table of contents in articles
dark_mode:
  enable: auto                  # Dark mode: true/false/auto
```

For more configuration items, refer to the theme's [README](https://github.com/D-Sketon/hugo-theme-reimu) or directly view the comments in `params.yml`.

---

## Step 6: Adding Articles

Articles are all placed in the `content/post` directory. You can create Markdown files, and it's recommended to name them in English with hyphens, e.g., `my-first-post.md`.

Each article must start with **Front-matter**, for example:

```yaml
---
title: "My First Article"
date: 2026-03-09T10:00:00+08:00
lastmod: 2026-03-09T10:00:00+08:00
categories: ["life"]
tags: ["随笔", "生活"]
cover: "/images/covers/post/my-first-post/cover.jpg"
description: "This is the article summary"
---

Here is the main content...
```

- `categories` and `tags` support multiple values.
- `cover` can specify the article cover; if left empty, a random cover will be used.
- `math: true` can enable math formula support (must be enabled in the theme first).
- `mermaid: true` can enable flowchart support.

---

## Step 7: Introduction to Theme Built-in Features

The Reimu theme provides many useful shortcodes that can be called directly in articles.

- **Friend Link Card** `{{</* friendsLink */>}}` – Automatically reads `data/friends.yml` to generate a list of friend links.
- **Internal/External Link Card** `{{</* link title="Title" path="/about/" cover="auto" */>}}` – Generates a beautiful link card.
- **Tag Roulette** `{{</* tagRoulette tags="tag1,tag2" */>}}` – Randomly displays tags.
- **Gallery** `{{</* gallery */>}}` – Displays multiple images in a waterfall layout.
- **Tabs** `{{</* tabs */>}}` – Creates switchable tabs.
- **Collapsible Panel** `{{</* details summary="Title" */>}}` – Collapses content.

For specific usage, refer to the theme's [official documentation](https://github.com/D-Sketon/hugo-theme-reimu#内置shortcode) or sample articles in my blog.

---

## Next Steps

Now you have a fully functional personal website prototype. Next, you can:

- Modify `params.yml` to deeply customize the appearance.
- Add friend links in `data/friends.yml`.
- Replace resources such as avatar, banner, favicon in `static`.
- Deploy to Cloudflare Pages or GitHub Pages (follow-up tutorial).

If you encounter any issues during the setup process, feel free to raise them on [GitHub Issues](https://github.com/CrimsonSeraph/Personal-Web/issues), or refer to my other detailed tutorials (links to be added).

Hope you have a beautiful personal website!