---
title: 'nextjs-starter-blog项目：标签页跳转导致崩溃'
date: '2025-08-19'
tags: ['nextjs', 'nextjs-starter-blog']
draft: false
summary: "点击标签页的 tag 跳转触发客户端异常，页面报 'Cannot read properties of undefined' 错误"
---

## ❌ 报错情况

我在 **tags 页面** 点击某个 tag 时遇到了奇怪的问题：  

- tag 名字原本是 `weChat-mini-program`。  
- 部署方式是 **`next build` + `SSG 静态部署`**。  
- 点击该 tag 时，页面直接报错： 

```javascript
Application error: a client-side exception has occurred while loading blog.hackerbank.cn
(see the browser console for more information).
webpack-f47f6a07d2567a0e.js:1 
Uncaught TypeError: Cannot read properties of undefined (reading 'call')
    at r (...)
    at c (...)
    at D (...)
    at R (...)
    ...
```

## 📝 现象总结

1. **在本地开发 (`dev`)** 或 `npx serve out` 静态服务下点击这个tag都没有问题。
2. **生产环境 build + ssg 部署后**：
   * 在 **blog 页面点击这个 tag** → 正常。
   * 在 **tags 页面点击这个 tag** → 报错。
3. 报错的特殊现象：
   * 刷新页面后正常。
   * 在 DevTools 里复制一份 a 标签再点击 → 也正常。
   * 说明问题只出在原始生成的标签链接上。

## ✅ 问题解决

参考源码里面的blog，都是下划线命名方式，没有驼峰 + 下划线的方式，所以把tag 从 "weChat-mini-program"修改为 "wechat-mini-program"，重新 **`next build` + `SSG 静态部署`** 以后，问题解决了。

推测是 **tag 命名大小写混用** 导致 `nextjs-starter-blog` 的 slug 生成或静态路由匹配出现异常。
在生产构建下，大小写可能会引发路径不一致，最终导致客户端找不到正确的模块。
