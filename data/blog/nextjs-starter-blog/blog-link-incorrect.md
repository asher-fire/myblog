---
title: 'nextjs-starter-blog 项目：文章链接跳转到默认页的问题'
date: '2025-08-19'
tags: ['next-js', 'nextjs-starter-blog']
draft: false
summary: "点击某篇文章的链接，并没有跳转到对应文章详情页，而是跳转到了默认页面（最近文章列表）。"
---

## 🐛 问题描述

项目部署方式是 **`next build` + `SSG 静态部署` + `nginx` + `cdn`**，部署后发现：  
- 点击某些文章的链接时，并没有进入文章详情页；  
- 而是跳转到了 **默认的博客列表页（显示最近文章）**；  
- 但是剩余文章点击都能正常跳转。  

---

## 🔎 原因分析

当访问一个不存在的文章的时候，比如
[https://blog.hackerbank.cn/blog/zzzz1](https://blog.hackerbank.cn/blog/zzzz1)，会跳转到默认页（最近文章页）

所以可以从下面两个方面来考虑：

1. 文章链接配置错误。这种情况一般会出现在/data/projectsData.ts，这个文件下的herf是手动配置的，可能会配置错误。

2. 缓存：浏览器的缓存、nginx缓存、cdn缓存。
---

## ✅ 解决方法
1. 确认文章链接配置正确

2. cdn **正则刷新**（先使用**正则刷新**刷新整站，来看一下，是不是cdn缓存的问题）;   
 后续正常以后再使用 **url刷新**

![cdn刷新](/static/images/nextjs-starter-blog/cdn-refresh.png)

3. 清除nginx 缓存
```shell
rm -rf /var/cache/nginx/*
```
4. `ctrl + f5` 清除浏览器缓存

