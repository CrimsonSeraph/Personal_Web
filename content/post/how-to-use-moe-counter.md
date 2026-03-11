---
title: MoeCounter-Worker_D1 是如何使用的
categories: ["projects"]
tags: ["Projects","Web","CloudFlare","MoeCounter"]
cover: /images/covers/post/how-to-use-moe-counter/cover-banner.png
description: 将 MoeCounter-Worker_D1 部署在 Cloudflare 上
banner: /images/covers/post/how-to-use-moe-counter/cover-banner.png
date: 2026-03-11T19:00:00+08:00
lastmod: 2026-03-11T19:00:00+08:00
---

# MoeCounter-Worker_D1 使用教程

MoeCounter-Worker_D1 是一个基于 Cloudflare Workers、D1 数据库和 KV 存储的极简风格计数器。它可以动态生成 SVG 图片（类似经典的网络计数器）或提供纯文本 API，支持多主题切换、自定义数字长度，适合用于网站访客统计、页面浏览量展示等场景。

## 特性

- 🖼️ **动态 SVG 图片** – 显示计数数字，可直接嵌入网页
- 🔢 **纯文本 API** – 方便程序调用
- 🎨 **多主题切换** – 内置 gelbooru 等主题，可扩展
- 📏 **自定义数字长度** – 自动或固定位数（补零）
- ⚡ **D1 + KV 存储** – D1 持久化计数，KV 缓存 SVG 减少重复生成
- 🚀 **基于 Hono 框架** – 轻量快速

## 准备工作

在开始之前，你需要准备：

- [Node.js](https://nodejs.org/)（v16 或更高）
- [pnpm](https://pnpm.io/) 包管理器
- 一个 [Cloudflare 账户](https://dash.cloudflare.com/)
- 熟悉基本的命令行操作

本项目已内置 [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/)（Cloudflare 官方开发工具），无需单独安装。

## 快速开始

### 1. 克隆仓库

```bash
git clone https://github.com/yourusername/MoeCounter-Worker_D1.git
cd MoeCounter-Worker_D1
```

> 如果这是你自己的仓库，请替换 URL；如果是跟随教程，可以使用示例仓库地址（如果有）。

### 2. 安装依赖

```bash
pnpm install
```

## 配置 Cloudflare 资源

在部署前，需要在 Cloudflare 上创建 D1 数据库和 KV 命名空间，并配置 `wrangler.toml` 文件。

### 3. 创建 wrangler.toml 配置文件

复制示例配置文件：

```bash
cp wrangler.example.toml wrangler.toml
```

编辑 `wrangler.toml`，至少修改以下内容（后续步骤会填充具体的 ID）：

```toml
name = "moe-counter"                # 你的 Worker 名称（可自定义）
compatibility_date = "2023-01-01"
main = "dist/index.js"

[build]
command = "pnpm run build"

[[d1_databases]]
binding = "DB"                       # 与环境变量绑定名称，代码中使用 env.DB
database_name = "moe-counter-db"      # D1 数据库名称（可自定义）
database_id = "your-database-id"      # 稍后创建的数据库 ID，暂时留空

[[kv_namespaces]]
binding = "KV"                        # 代码中使用 env.KV
id = "your-kv-namespace-id"           # 稍后创建的 KV 命名空间 ID，暂时留空
```

### 4. 创建 D1 数据库

在终端执行以下命令创建 D1 数据库：

```bash
wrangler d1 create moe-counter-db
```

如果这是你第一次使用 Wrangler，可能会提示登录 Cloudflare，按照指引完成登录即可。创建成功后，你会看到类似输出：

```
✅ Successfully created DB 'moe-counter-db' in region WEUR
Created database 'moe-counter-db' with id: "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
```

将输出的 `database_id` 复制并粘贴到 `wrangler.toml` 的对应位置。

### 5. 创建 KV 命名空间

执行命令创建 KV 命名空间：

```bash
wrangler kv:namespace create "KV"
```

输出示例：

```
✅ Successfully created KV namespace with id: "yyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy"
```

将输出的 `id` 填入 `wrangler.toml` 中的 `kv_namespaces` 部分。

### 6. 初始化数据库表

项目需要一张表来存储计数器数据。执行 SQL 初始化文件 `schema.sql`（该文件已包含在仓库中）：

```bash
wrangler d1 execute moe-counter-db --file=./schema.sql
```

此命令会在 D1 数据库中创建所需的表结构。

## 本地开发与测试

现在可以启动本地开发服务器进行测试。

### 7. 运行开发服务器

```bash
pnpm run dev
```

启动后，访问 `http://localhost:8787`，你应该能看到 “Hello Hono!” 的提示，表示服务运行正常。

### 8. 测试计数器图片

在浏览器中打开以下地址测试图片计数器（每次访问计数加1）：

```
http://localhost:8787/test?theme=gelbooru&length=7&add=1
```

- `theme=gelbooru` 指定主题
- `length=7` 指定数字显示为7位（不足补零）
- `add=1` 表示每次访问计数增加1

你还可以测试纯文本 API：

```
http://localhost:8787/api/test
```

该 API 返回纯数字文本（例如 `42`），方便程序调用。

## 部署到 Cloudflare Workers

### 9. 通过 Wrangler 部署

确保当前目录在项目根目录，运行：

```bash
pnpm run deploy
```

部署成功后，终端会显示你的 Worker 访问地址，例如 `https://moe-counter.your-subdomain.workers.dev`。

### 10. 在 Cloudflare Dashboard 上管理

登录 [Cloudflare Dashboard](https://dash.cloudflare.com/)，进入 **Workers & Pages** 页面，可以看到刚部署的 Worker。点击 Worker 名称，可以查看日志、环境变量、触发器等信息。  
在 **D1** 页面可以查看数据库并执行 SQL 查询；在 **KV** 页面可以查看缓存的键值对（即生成的 SVG 图片）。

## 使用指南

### 图片计数器 URL 格式

```
https://你的worker域名/:name?theme=主题&length=位数&add=0/1&pixelated=pixelated
```

| 参数       | 说明                                                                 | 默认值    | 示例                |
|------------|----------------------------------------------------------------------|-----------|---------------------|
| `:name`    | 计数器名称（路径参数），不同名称独立计数                             | 必填      | `visitors`          |
| `theme`    | 图片主题，目前内置 `gelbooru` 等（见下文）                           | `gelbooru`| `theme=gelbooru`    |
| `length`   | 数字显示位数：`auto` 表示自动（不补零），数字如 `7` 表示固定7位补零  | `7`       | `length=5`          |
| `add`      | 是否增加计数：`0` 表示只读，`1` 表示访问一次加1                      | `1`       | `add=0`             |
| `pixelated`| 如果指定此参数（值任意），SVG 会添加 `style="image-rendering: pixelated"` 使图片更清晰（适合像素风格） | 无 | `pixelated=1`       |

**示例：**

- 基础访问（每次加1）：`https://moe-counter.workers.dev/visitors`
- 只查看当前计数，不加1：`https://moe-counter.workers.dev/visitors?add=0`
- 使用像素风格，5位数字：`https://moe-counter.workers.dev/visitors?theme=gelbooru&length=5&pixelated=1`

### 纯文本 API

```
https://你的worker域名/api/:name?add=0/1
```

返回纯数字文本，适合在代码中调用。

| 参数       | 说明                                         | 默认值 |
|------------|----------------------------------------------|--------|
| `:name`    | 计数器名称                                   | 必填   |
| `add`      | 是否增加计数：`0` 只读，`1` 访问一次加1      | `1`    |

**示例：**

- 获取当前值并加1：`https://moe-counter.workers.dev/api/visitors`
- 仅获取当前值：`https://moe-counter.workers.dev/api/visitors?add=0`

### 主题说明

主题定义在 `src/themes/index.ts` 中。每个主题包含：

- `width`: 单个数字图片的宽度
- `height`: 单个数字图片的高度
- `images`: 长度为10的数组，索引0~9分别对应数字0~9的 Data URI（base64 图片）

内置主题示例为 `gelbooru`，你可以在 `themes` 目录下扩展更多主题。

## 自定义主题

如果你想添加自己的数字图片主题，可以按照以下步骤操作：

1. **准备数字图片**：制作 0-9 共10张图片，建议使用 PNG 格式，尺寸一致（例如宽20px、高30px）。将图片转换为 Data URI（base64 格式），可以使用在线工具或 Node.js 脚本。
2. **创建主题文件**：在 `src/themes/` 下新建一个 ts 文件，例如 `mytheme.ts`，内容如下：

```typescript
import { Theme } from './index';

const myTheme: Theme = {
  width: 20,      // 根据你的图片宽度设置
  height: 30,     // 根据你的图片高度设置
  images: [
    'data:image/png;base64,...', // 数字0的base64
    'data:image/png;base64,...', // 数字1的base64
    // ... 直到数字9
  ],
};

export default myTheme;
```

3. **注册主题**：编辑 `src/themes/index.ts`，导入你的主题并添加到 `themes` 对象中：

```typescript
import myTheme from './mytheme';

export const themes = {
  gelbooru,
  mytheme: myTheme,   // 添加新主题，键名即为 URL 中的 theme 参数值
};
```

4. **重新构建并部署**：

```bash
pnpm run build
pnpm run deploy
```

之后就可以在 URL 中使用 `theme=mytheme` 来调用你自定义的主题了。

## 工作原理简介

1. 用户访问图片 URL，Worker 解析参数（计数器名称、主题、长度等）。
2. 从 D1 数据库查询该计数器的当前值。
3. 如果参数 `add=1`，异步更新数据库中的计数器值（不阻塞响应）。
4. 生成用于缓存的 KV key（包含版本、主题、长度、像素标志和当前数值）。
5. 尝试从 KV 获取已缓存的 SVG：
   - 若命中，直接返回。
   - 若未命中，调用 `generateImage` 生成 SVG，并异步存入 KV（TTL 1小时）。
6. 返回 SVG 响应，并设置适当的 HTTP 缓存头。

## 注意事项

- **计费**：D1 数据库按读取行数和写入次数计费，KV 按读取、写入和存储空间计费。请参考 [Cloudflare 官方定价](https://www.cloudflare.com/zh-cn/products/)。
- **缓存延迟**：默认生成的 SVG 会被 KV 缓存 1 小时（`cacheTtl: 3600`），以减少重复生成开销。如果计数器数值变化频繁，KV 缓存可能导致图片更新延迟（最多1小时）。你可以通过调整 `cacheTtl` 或移除 KV 缓存来解决（修改源码中的 `cacheTtl` 选项）。
- **数据一致性**：由于 D1 最终一致性，刚更新后的计数器可能在极短时间内读取到旧值（但通常无影响）。

## 开发命令

| 命令               | 说明                           |
|--------------------|--------------------------------|
| `pnpm run dev`     | 启动本地开发服务器 (wrangler dev) |
| `pnpm run build`   | 使用 esbuild 构建 Worker 代码    |
| `pnpm run deploy`  | 部署到 Cloudflare Workers        |

## 许可证

本项目采用 MIT 许可证。

---

如果在使用过程中遇到任何问题，欢迎提交 Issue 或 Pull Request。