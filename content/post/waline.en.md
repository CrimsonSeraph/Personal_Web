---
title: How to deploy the Waline comment system
categories: ["projects"]
tags: ["Projects","Web","GitHub","Waline"]
cover: /images/covers/post/personal-web/personal-web.jpg
description: How to deploy the Waline comment system (refer to the official documentation)
banner: /images/covers/post/personal-web/personal-web-banner.png
date: 2026-03-09T13:00:00+08:00
lastmod: 2026-03-11T19:00:00+08:00
---

# How to Deploy the Waline Comment System

Welcome to **Waline**! This is a simple, safe comment system that also provides page view counting. You can enable it on your website in just a few steps.

This guide will walk you through the entire process, from deploying the server-side to integrating it into your front-end. It is based on the [Waline Official Quick Start Guide](https://waline.js.org/guide/get-started/).

## 1. Deploy the Server-Side (Vercel)

First, we need to deploy the Waline server-side to the Vercel platform.

1.  **Click to Deploy**: On the Waline official documentation page, find and click the button to deploy to Vercel with one click.
2.  **Login / Sign Up**: If you're not logged into Vercel, it will prompt you to sign up or log in. **It is recommended to use your GitHub account for quick login**.
3.  **Create Project**: After logging in, Vercel will ask you to enter a **project name** you like, then click the `Create` button. Vercel will automatically create a Git repository and initialize the project based on the Waline template.
4.  **Deployment Successful**: Wait for about a minute, and you'll see fireworks on your screen celebrating a successful deployment. Click `Go to Dashboard` to enter the application console and prepare for the next step: configuring the database.

## 2. Create and Configure the Database

Waline needs a database to store comment data. We will use Neon (PostgreSQL), a service integrated with Vercel.

1.  **Go to Storage Page**: At the top of your Vercel project dashboard, click the **`Storage`** tab to enter the storage service configuration page.
2.  **Create Database**: Click the **`Create Database`** button. Under Marketplace Database Providers, select **Neon**, then click `Continue`.
3.  **Link Account**: You will be prompted to create or link a Neon account. Simply choose `Accept and Create`.
4.  **Choose Configuration**: Next, you'll select the database plan, region, etc. Usually, you can keep the defaults and click `Continue` until the database creation is complete.
5.  **Initialize Table Structure**: Now, on the Vercel `Storage` page, you'll see the database you just created. Click on it to go to the details page, then click **`Open in Neon`** to jump to the Neon console.
6.  **Execute SQL**: On the left side of the Neon interface, select **`SQL Editor`**. **Paste the SQL statements** from the `waline.pgsql` file provided in the Waline documentation into the editor, and click **`Run`** to execute them. This creates the necessary database tables for the application.
7.  **Redeploy**: After the SQL executes successfully, return to your Vercel project dashboard. Click on the **`Deployments`** tab at the top, find the **latest deployment**, and click the **`Redeploy`** button on its right. **This step is crucial** as it makes the newly configured database environment variables take effect.
8.  **Get Server Address**: Wait for the redeployment to complete and the status to become `Ready`. Then, click the **`Visit`** button. The address of the new tab that opens is your **Server URL**, formatted like `https://your-project-name.vercel.app`. Please make a note of it.

## 3. (Optional) Bind a Custom Domain

If you prefer not to use the domain provided by Vercel, you can bind your own.

1.  **Go to Domain Settings**: In your Vercel project dashboard, click **`Settings`** -> **`Domains`** at the top.
2.  **Add Domain**: Enter the domain you want to bind (e.g., `comments.yourdomain.com`) in the input field and click `Add`.
3.  **Configure DNS**: According to the提示 provided by Vercel, add a `CNAME` record for your domain at your DNS provider:
    *   **Type**: `CNAME`
    *   **Name**: The prefix of your domain (e.g., `comments`)
    *   **Value**: `cname.vercel-dns.com`
4.  **生效**: Wait for the DNS resolution to take effect. You can then access Waline using your own domain:
    *   Comment System: `http://your-domain.com`
    *   Comment Management Admin: `http://your-domain.com/ui`

## 4. Integrate Waline into Your Front-End Page

Now, let's add the comment feature to your website page. You need to include Waline's stylesheet and JavaScript module in your HTML file.

1.  **Include Stylesheet**: In the `<head>` section of your page, add a `<link>` tag to include Waline's CSS file.
2.  **Create Container**: Place a `<div>` element where you want the comment box to appear, and give it an ID (e.g., `waline`).
3.  **Initialize Script**: At the bottom of the page or in a suitable location, add a `<script type="module">` tag. Import the `init` function from the CDN, call it, and pass in the **container selector** and your **Server URL**.

Here is a complete HTML example:

```html
<head>
  <!-- ... other head content ... -->
  <!-- 1. Include Waline stylesheet -->
  <link rel="stylesheet" href="https://unpkg.com/@waline/client@v3/dist/waline.css" />
  <!-- ... -->
</head>
<body>
  <!-- ... page content ... -->

  <!-- 2. Create comment container -->
  <div id="waline"></div>

  <!-- 3. Include Waline script and initialize -->
  <script type="module">
    import { init } from 'https://unpkg.com/@waline/client@v3/dist/waline.js';

    init({
      el: '#waline', // Container selector
      serverURL: 'https://your-project-name.vercel.app', // Your Server URL
    });
  </script>
</body>
```

Save the file and open it in your browser. You should see the Waline comment box running successfully 🎉

## 5. Comment Management

Waline provides a convenient admin panel.

1.  **Register as Admin**: After deployment, first navigate to **`<your-server-url>/ui/register`** in your browser to register. **The first user to register in the system will be automatically set as the administrator.**
2.  **Login to Manage**: After registering, log in at the same address (`/ui`) to access the comment management interface. Here, you can view, edit, mark (e.g., as approved), or delete all comments.
3.  **User Features**: Regular visitors can also register and log in via the links below the comment box. After logging in, they can view their profile and comment history.

> **Please Note**: This document is primarily based on the official "Quick Start" guide, designed to help you deploy quickly. If you encounter problems during use or need more advanced configuration, it is recommended to consult the [Waline Official Documentation](https://waline.js.org/) or seek help in the [GitHub Discussion](https://github.com/walinejs/waline/discussions).