---
title: How to Deploy Algolia Search Functionality
categories: ["projects"]
tags: ["Projects","Algolia"]
cover: /images/covers/post/algolia/algolia.jpg
description: How to deploy Algolia search functionality (referencing official documentation)
banner: /images/covers/post/algolia/algolia.jpg
date: 2026-03-12T20:00:00+08:00
lastmod: 2026-03-12T20:00:00+08:00
---

# How to Deploy Algolia Search Functionality

> Note: Since the website [CrimsonSeraph/Personal-Web](https://github.com/CrimsonSeraph/Personal-Web) has an automated program that generates `json` files of articles and uploads them to `Algolia`, 
  only the `Application ID`, `Search API Key`, and `Admin API Key` are needed here.

## 1. Register for Algolia

> Go to the official website to register: [Algolia](https://dashboard.algolia.com/)

![Image](/images/covers/post/algolia/step-1.png)

It is recommended to register using GitHub, though other methods are also acceptable.

## 2. Obtain the `Keys`, etc.

* ### Open the settings page:

![Image](/images/covers/post/algolia/step-2.png)

* ### Find the `Application` option:

![Image](/images/covers/post/algolia/step-3.png)

* #### Click to create:

![Image](/images/covers/post/algolia/step-4.png)

> Select a plan (there is a free one), set a name, then confirm and create.

* ### On the start page, click to skip for now:

![Image](/images/covers/post/algolia/step-5.png)

* ### Then you can see the three key elements!

They are: `Application ID`, `Search API Key`, `Admin API Key`

![Image](/images/covers/post/algolia/step-6.png)

* ### Return to the Hugo-built website and fill in the relevant information.