---
title: How to use MoeCounter-Worker_D1
categories: ["projects"]
tags: ["Projects","Web","CloudFlare","MoeCounter"]
cover: /images/covers/post/how-to-use-moe-counter/cover-banner.png
description: M deployed MoeCounter-Worker_D1 on Cloudflare
banner: /images/covers/post/how-to-use-moe-counter/cover-banner.png
date: 2026-03-11T19:00:00+08:00
lastmod: 2026-03-11T19:00:00+08:00
---

# MoeCounter-Worker_D1 Tutorial

MoeCounter-Worker_D1 is a minimalist counter service built on Cloudflare Workers, D1 database, and KV storage. It can dynamically generate SVG images (similar to classic web counters) or provide a plain text API, supports multiple themes, and allows custom digit length. It is suitable for website visitor statistics, page view displays, and similar scenarios.

## Features

- 🖼️ **Dynamic SVG Images** – Displays count numbers, can be directly embedded in web pages
- 🔢 **Plain Text API** – Convenient for programmatic calls
- 🎨 **Multiple Themes** – Built-in gelbooru theme, extendable
- 📏 **Custom Digit Length** – Automatic or fixed length (zero-padded)
- ⚡ **D1 + KV Storage** – D1 persists counts, KV caches SVG to reduce regeneration overhead
- 🚀 **Built on Hono Framework** – Lightweight and fast

## Prerequisites

Before you begin, make sure you have:

- [Node.js](https://nodejs.org/) (v16 or higher)
- [pnpm](https://pnpm.io/) package manager
- A [Cloudflare account](https://dash.cloudflare.com/)
- Basic familiarity with the command line

This project already includes [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/) (Cloudflare's official development tool) in its devDependencies, so no separate installation is needed.

## Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/MoeCounter-Worker_D1.git
cd MoeCounter-Worker_D1
```

> If this is your own repository, replace the URL accordingly; if you are following along, you can use an example repository URL if available.

### 2. Install Dependencies

```bash
pnpm install
```

## Configure Cloudflare Resources

Before deployment, you need to create a D1 database and a KV namespace in Cloudflare, and configure the `wrangler.toml` file.

### 3. Create wrangler.toml Configuration File

Copy the example configuration file:

```bash
cp wrangler.example.toml wrangler.toml
```

Edit `wrangler.toml` and at least modify the following sections (the specific IDs will be filled in later steps):

```toml
name = "moe-counter"                # Your Worker name (can be customized)
compatibility_date = "2023-01-01"
main = "dist/index.js"

[build]
command = "pnpm run build"

[[d1_databases]]
binding = "DB"                       # Binding name for environment variables, corresponds to env.DB in code
database_name = "moe-counter-db"      # D1 database name (can be customized)
database_id = "your-database-id"      # Database ID to be created later, leave empty for now

[[kv_namespaces]]
binding = "KV"                        # Corresponds to env.KV in code
id = "your-kv-namespace-id"           # KV namespace ID to be created later, leave empty for now
```

### 4. Create D1 Database

Run the following command to create a D1 database:

```bash
wrangler d1 create moe-counter-db
```

If this is your first time using Wrangler, it may prompt you to log in to Cloudflare. Follow the instructions to complete the login. After successful creation, you will see output similar to:

```
✅ Successfully created DB 'moe-counter-db' in region WEUR
Created database 'moe-counter-db' with id: "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
```

Copy the output `database_id` and paste it into the corresponding field in `wrangler.toml`.

### 5. Create KV Namespace

Run the command to create a KV namespace:

```bash
wrangler kv:namespace create "KV"
```

Example output:

```
✅ Successfully created KV namespace with id: "yyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy"
```

Copy the output `id` and fill it in the `kv_namespaces` section of `wrangler.toml`.

### 6. Initialize Database Tables

The project needs a table to store counter data. Execute the SQL initialization file `schema.sql` (which is already included in the repository):

```bash
wrangler d1 execute moe-counter-db --file=./schema.sql
```

This command creates the required table structure in the D1 database.

## Local Development and Testing

Now you can start the local development server for testing.

### 7. Run the Development Server

```bash
pnpm run dev
```

Once started, visit `http://localhost:8787`; you should see a “Hello Hono!” message, indicating the service is running normally.

### 8. Test the Counter Image

Open the following address in your browser to test the image counter (each visit increments the count by 1):

```
http://localhost:8787/test?theme=gelbooru&length=7&add=1
```

- `theme=gelbooru` specifies the theme
- `length=7` sets the number display to 7 digits (zero-padded if necessary)
- `add=1` means each visit increments the count by 1

You can also test the plain text API:

```
http://localhost:8787/api/test
```

This API returns a plain number text (e.g., `42`), convenient for programmatic calls.

## Deploy to Cloudflare Workers

### 9. Deploy via Wrangler

Make sure you are in the project root directory, then run:

```bash
pnpm run deploy
```

After successful deployment, the terminal will display your Worker's access URL, for example `https://moe-counter.your-subdomain.workers.dev`.

### 10. Manage in Cloudflare Dashboard

Log in to the [Cloudflare Dashboard](https://dash.cloudflare.com/), go to **Workers & Pages**, and you will see the Worker you just deployed. Click on the Worker name to view logs, environment variables, triggers, etc.  
In the **D1** section, you can view the database and execute SQL queries; in the **KV** section, you can view stored key-value pairs (cached SVG images).

## Usage Guide

### Image Counter URL Format

```
https://your-worker-domain/:name?theme=theme&length=digits&add=0/1&pixelated=pixelated
```

| Parameter   | Description                                                                                       | Default   | Example             |
|-------------|---------------------------------------------------------------------------------------------------|-----------|---------------------|
| `:name`     | Counter name (path parameter); different names have independent counts                            | Required  | `visitors`          |
| `theme`     | Image theme; currently built-in `gelbooru` etc. (see below)                                       | `gelbooru`| `theme=gelbooru`    |
| `length`    | Digit display length: `auto` for automatic (no zero-padding), or a number like `7` for fixed 7-digit zero-padded | `7`       | `length=5`          |
| `add`       | Whether to increment the count: `0` for read-only, `1` to increment by 1 per visit                | `1`       | `add=0`             |
| `pixelated` | If this parameter is present (any value), the SVG will include `style="image-rendering: pixelated"` to make the image crisper (suitable for pixel style) | None      | `pixelated=1`       |

**Examples:**

- Basic access (increment each time): `https://moe-counter.workers.dev/visitors`
- View current count without increment: `https://moe-counter.workers.dev/visitors?add=0`
- Use pixel style with 5-digit numbers: `https://moe-counter.workers.dev/visitors?theme=gelbooru&length=5&pixelated=1`

### Plain Text API

```
https://your-worker-domain/api/:name?add=0/1
```

Returns a plain number text, suitable for programmatic calls.

| Parameter   | Description                                         | Default |
|-------------|-----------------------------------------------------|---------|
| `:name`     | Counter name                                        | Required|
| `add`       | Whether to increment the count: `0` read-only, `1` increment by 1 per visit | `1`     |

**Examples:**

- Get current value and increment by 1: `https://moe-counter.workers.dev/api/visitors`
- Get current value only: `https://moe-counter.workers.dev/api/visitors?add=0`

### Theme Description

Themes are defined in `src/themes/index.ts`. Each theme contains:

- `width`: width of a single digit image
- `height`: height of a single digit image
- `images`: an array of length 10, where indexes 0–9 correspond to Data URIs (base64 images) for digits 0–9

The built-in theme example is `gelbooru`. You can extend more themes in the `themes` directory.

## Custom Themes

If you want to add your own digit image theme, follow these steps:

1. **Prepare digit images**: Create 10 images for digits 0–9, preferably in PNG format, with consistent dimensions (e.g., width 20px, height 30px). Convert the images to Data URIs (base64 format); you can use online tools or Node.js scripts.
2. **Create a theme file**: Create a new ts file under `src/themes/`, e.g., `mytheme.ts`, with the following content:

```typescript
import { Theme } from './index';

const myTheme: Theme = {
  width: 20,      // Set according to your image width
  height: 30,     // Set according to your image height
  images: [
    'data:image/png;base64,...', // base64 for digit 0
    'data:image/png;base64,...', // base64 for digit 1
    // ... up to digit 9
  ],
};

export default myTheme;
```

3. **Register the theme**: Edit `src/themes/index.ts`, import your theme and add it to the `themes` object:

```typescript
import myTheme from './mytheme';

export const themes = {
  gelbooru,
  mytheme: myTheme,   // Add new theme; the key name becomes the `theme` parameter value in the URL
};
```

4. **Rebuild and deploy**:

```bash
pnpm run build
pnpm run deploy
```

After that, you can use `theme=mytheme` in the URL to invoke your custom theme.

## How It Works (Brief)

1. User accesses the image URL; the Worker parses parameters (counter name, theme, length, etc.).
2. Queries the current value of the counter from the D1 database.
3. If `add=1`, it asynchronously updates the counter value in the database (non-blocking the response).
4. Generates a KV cache key containing version, theme, length, pixelated flag, and the current value.
5. Tries to retrieve the cached SVG from KV:
   - If hit, returns it directly.
   - If miss, calls `generateImage` to generate the SVG, and asynchronously stores it in KV with a TTL of 1 hour.
6. Returns the SVG response with appropriate HTTP cache headers (forcing revalidation; actual caching is controlled by KV).

## Notes

- **Pricing**: D1 database is billed based on read rows and write operations; KV is billed based on reads, writes, and stored data. Refer to [Cloudflare Pricing](https://www.cloudflare.com/products/) for details.
- **Cache Delay**: By default, generated SVGs are cached in KV for 1 hour (`cacheTtl: 3600`) to reduce regeneration overhead. If the counter value changes frequently, KV caching may cause a delay in image updates (up to 1 hour). You can adjust `cacheTtl` or remove KV caching by modifying the `cacheTtl` option in the source code.
- **Data Consistency**: Due to D1's eventual consistency, the counter may briefly return an old value immediately after an update (but this usually has no impact).

## Development Commands

| Command            | Description                              |
|--------------------|------------------------------------------|
| `pnpm run dev`     | Start local development server (wrangler dev) |
| `pnpm run build`   | Build Worker code using esbuild          |
| `pnpm run deploy`  | Deploy to Cloudflare Workers             |

## License

This project is licensed under the MIT License.

---

If you encounter any issues during usage, feel free to submit an Issue or Pull Request.