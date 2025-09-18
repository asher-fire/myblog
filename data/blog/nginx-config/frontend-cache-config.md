---
title: '前端nginx缓存配置'
date: '2025-08-31'
tags: ['frontend', 'nginx', 'cache']
draft: false
layout: PostLayout
summary: "前端的nginx缓存配置策略"
---

## 背景

前端项目不仅仅是在浏览器里面访问，有时候也嵌入到原生webview或其它程序里面使用。         

1. 在浏览器里面访问时：  
在nginx没有特意配置缓存的情况下，前端项目可能会走浏览器的**默认缓存策略** （启发式缓存 heuritic cache），
 但是某些情况下nginx也默认会自动为静态文件生成etag和last-modified头信息。  
    
    这种情况下，会缓存所有文件(包括html入口文件和资源文件），代码更新以后，页面简单的刷新有时候更新不过来(因为html入口被缓存了)。所以当用户反馈自己浏览器看到的还是旧版本，一般会让用户**强按ctrl+f5** （Hard Reloads 硬加载）
    来清除缓存拿到最新代码版本。  
    
    这种硬加载，会给request header带上cache-control：no-cache, 从而可确保浏览器绕过缓存，从服务器请求所有资源的新副本; 这和在dev-tool勾选"Disable cache" 是一个效果。

2. 被嵌入到其它应用程序里面访问时：     
这种情况，用户**强按ctrl+f5**一般无法生效，**应用程序有自己的缓存策略**，在移动端甚至无法这样操作。  
这种情况下，缓存严重的情况下，一般只能让用户去手动清除应用程序的缓存。
但是这种方案很不太合理：一是不可能每次更新代码版本让用户去清除缓存；
二是当前前端项目可能只是大应用程序里面的一个业务模块而已，不可能其中一个模块更新了，就让用户去清除缓存。


## SPA 缓存策略

**入口 HTML 禁用缓存，静态资源长期缓存。**  

这样代码版本更新以后，用户只需要简单的刷新即可获取到最新版本。
因为SPA一般只有一个index.html入口，而该入口我们并没有缓存；html的更新会导致引用的js、css等资源的更新。

```nginx
   root /root/aaaa;  # 全局定义一次root

    # 1. HTML入口 - 禁用缓存
    location ~* \.html$ {
        gzip_static on; #
        access_log off;

        add_header Last-Modified $date_gmt;
        add_header Cache-Control 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0';
        
        if_modified_since off;
        expires 0;
        etag off;
    }

    # 2. 静态资源 - 长期缓存
    location ~* \.(?:js|css|png|jpg|jpeg|gif|ico|woff2?|ttf|eot|svg|webp)$ {
        add_header Cache-Control "public, max-age=31536000, immutable";
        expires 1y;
        access_log off;
    }

    location  / {
        try_files $uri $uri/ /index.html;
    }

```

当然也可以使用 **指纹网址（Fingerprinted URLs）** 来实现类似的效果，比如给首页后面添加`?t=时间戳`。
但是一方面某些系统的url是固定的；另外一方面一些比较正式的系统上比如toG系统，这种动态url显的不专业。

如果进一步提升用户体验，还可以在当检测到更新时，以弹窗形式通知那些**长时间停留没有刷新**的用户(相当于一个**主动推送更新**机制)：  
在前端代码版本更新以后 → 用户没有刷新页面的情况下 → 弹窗提示用户"页面内容已更新，请点击确定刷新页面" → 用户点击确认 → 调用`window.location.reload() `


## 额外的话

这里说的只是nginx缓存，如果使用了cdn，代码版本更新以后，还要走cdn刷新和预热。