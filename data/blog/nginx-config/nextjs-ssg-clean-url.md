---
title: 'Next.js SSG 部署后如何支持根路径 / 访问'
date: '2025-08-31'
tags: ['nextjs', 'nextjs-starter-blog', 'nginx']
draft: false
summary: "Next.js SSG 部署到 Nginx 后，如何通过 / 访问页面而不必显式加上 .html 后缀。"
---

当我们使用 **Next.js** 的 **SSG（静态站点生成）** 模式进行构建并部署到 **Nginx** 时，默认情况下只能直接访问生成的 `.html` 文件，例如：

```
https://blog.hackerbank.cn/blog.html
```

但这样会显得不够优雅，也不符合常见的站点访问习惯。

对此，我们可以在 `nginx.conf` 中，通过配置 `try_files` 来优化：

```nginx
location / {
    try_files $uri $uri.html $uri/index.html /index.html;
}
```

### 配置说明

这个配置会按顺序尝试：

* `$uri`：首先直接**精确匹配**用户请求的**路径**。
* `$uri.html`：**匹配URI加上`.html`后缀**。
* `$uri/index.html`：**匹配URI作为目录**，尝试**加载该目录下的 `index.html`**。
* `/index.html`：如果都失败，则**兜底到站点根目录首页**。

这样，用户就可以直接通过以下方式访问：

```
https://blog.hackerbank.cn/blog
```

而无需手动输入 `.html` 后缀。

---
