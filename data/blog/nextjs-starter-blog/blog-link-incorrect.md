---
title: 'nextjs-starter-blog 项目：文章链接跳转到默认页的问题'
date: '2025-08-19'
tags: ['nextjs', 'nextjs-starter-blog']
draft: false
summary: "点击某篇文章的链接，并没有跳转到对应文章详情页，而是跳转到了默认页面（最近文章列表）。"
---

## 🐛 问题描述

我新建了一篇文章，路径是： `data\blog\projects\rich-woman.mdx`

部署后发现：  
- 点击该文章的链接时，并没有进入文章详情页；  
- 页面跳转到了 **默认的博客列表页（显示最近文章）**；  
- 但是其它示例文章（项目自带的 blog）点击都能正常跳转。  

---

## 🔎 原因分析

`nextjs-starter-blog` 会根据 `data/blog/` 下的目录和文件生成路由。  
其中某些目录名（如 `projects`、`tags`、`about` 等）**已经在项目内部被占用**，对应了固定的路由页面。  

当把文章放在 `data/blog/projects/` 下时，路由系统就把 `projects` 识别成了已有的路由入口，  
结果导致点击文章时，页面跳转到默认的博客列表，而不是文章详情页。

---

## ✅ 解决方法

避免使用项目中已有的路由名作为文章目录。  
比如，把文章目录从`data/blog/works/`改成 `data/blog/works/`，链接就能正常工作。  

![文章存储路径截图](/static/images/nextjs-starter-blog/blog-link-incorrect/e1.png)

---

## 📌 总结

- 在 `nextjs-starter-blog` 中，文章路径会直接映射到路由。  
- **不要用保留关键词（如 `projects`, `tags`, `about`）作为子目录名**，否则会出现路由冲突。  
- 建议统一使用自定义目录名，例如：  
  - `my-projects`  
  - `case-study`  
  - `tech-notes`  

这样可以避免和框架默认路由冲突，保证文章链接能正确跳转。
