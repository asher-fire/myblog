---
title: 'nextjs-starter-blog项目：跳转导致崩溃'
date: '2025-08-19'
tags: ['next-js', 'nextjs-starter-blog']
draft: false
summary: "点击某些tag 或 某些文章， 进行跳转时会触发客户端异常，页面报 'Cannot read properties of undefined' 错误"
---

## ❌ 报错情况

项目部署方式是 **`next build` + `SSG 静态部署` + `nginx` + `cdn`**，部署后访问发现：  
   
点击某些tag 或 某些文章时， 会触发报错:  

* 偶尔出现，非必现。
* 刷新页面后正常。

页面上的报错：
```javascript
Application error: a client-side exception has occurred     
while loading blog.hackerbank.cn    
(see the browser console for more information).
```

控制台上的报错：
```javascript
Uncaught ChunkLoadError: Loading chunk 602 failed.
(error: https://blog.hackerbank.cn/_next/static/chunks/602-9f41d42ee3cdb281.js)
    at r.f.j (webpack-f47f6a07d2567a0e.js:1:2946)
    at webpack-f47f6a07d2567a0e.js:1:1226
    at Array.reduce (<anonymous>)
    at r.e (webpack-f47f6a07d2567a0e.js:1:1205)
    at i (684-ea1dc4863da3d336.js:1:139812)
    at 684-ea1dc4863da3d336.js:1:152386
    at 684-ea1dc4863da3d336.js:1:152590
    at t (684-ea1dc4863da3d336.js:1:153843)
```

## 🚨 原因分析

 `Loading chunk 602 failed`错误通常与 **资源加载失败** 和 **缓存策略** 有关，问题很可能出在CDN缓存配置或浏览器缓存了旧版本的chunk文件上。所以问题出现的原因可能是：

1. 浏览器缓存了旧的 HTML 或 Webpack 清单文件（如 webpack-f47f6a07d2567a0e.js），导致它尝试加载一个 已不存在的旧版本 JS 分块（如 602-9f41d42ee3cdb281.js）

2. CDN 缓存策略或部署流程导致新旧文件混合存在

3. Nginx 配置可能未正确处理缓存失效

## 🔎 分析确认

1. 当我们手动去请求 [602-9f41d42ee3cdb281.js](https://blog.hackerbank.cn/_next/static/chunks/602-9f41d42ee3cdb281.js) 这个文件的时候，会发现的确是404

![文件请求404截图](/static/images/nextjs-starter-blog/tag-nav-error/err1.png)

2. 在/out文件夹使用`tree` 命令查看 目录tree，会发现的确没有602-9f41d42ee3cdb281.js 这个文件：
```shell
tree
.
├── 404.html
├── about.html
├── about.txt
├── blog
│   ├── nextjs-starter-blog
│   │   ├── blog-link-incorrect.html
│   │   ├── blog-link-incorrect.txt
│   │   ├── tag-nav-error.html
│   │   └── tag-nav-error.txt
│   ├── page
│   │   ├── 1.html
│   │   └── 1.txt
│   └── works
│       ├── rich-woman.html
│       └── rich-woman.txt
├── blog.html
├── blog.txt
├── feed.xml
├── index.html
├── index.txt
├── _next
│   ├── 0gXTOLaB3jr-mutXn6Zms
│   └── static
│       ├── 0gXTOLaB3jr-mutXn6Zms
│       │   ├── _buildManifest.js
│       │   └── _ssgManifest.js
│       ├── chunks
│       │   ├── 341.62bb6d0b4fc1521a.js
│       │   ├── 408.a9361fa171495218.js
│       │   ├── 472.bb96caec2ba2da96.js
│       │   ├── 496-0e57bfdfe9ca84ee.js
│       │   ├── 4bd1b696-fd9f9c1f05277fc8.js
│       │   ├── 602-caaa402421a8b87f.js
│       │   ├── 63-740f78f75738eaad.js
│       │   ├── 684-ea1dc4863da3d336.js
│       │   ├── 874-df267709252ebb11.js
│       │   ├── app
....
```

## 🛠️ 问题解决
1. cdn **正则刷新**（先使用**正则刷新**刷新整站，来看一下，是不是cdn缓存的问题）;
 后续正常以后再使用 **url刷新** 和 **目录刷新 (_next/)**

![cdn刷新](/static/images/nextjs-starter-blog/cdn-refresh.png)

2. 清除nginx 缓存
```shell
rm -rf /var/cache/nginx/*
```
3. `ctrl + f5` 清除浏览器缓存
