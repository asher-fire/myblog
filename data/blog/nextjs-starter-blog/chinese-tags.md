---
title: 'nextjs-starter-blog项目：中文tags'
date: '2025-08-31'
tags: ['next-js', 'nextjs-starter-blog']
draft: false
summary: "nextjs-starter-blog v2 版本，在tag-data.json基础上实现中文tags的一种方案"
---

## ❌ 报错情况

项目部署方式是 **`next build(windows 环境build)` + `SSG 静态部署` + `nginx` + `cdn`**，部署后访问发现，某些中文tag 无法正确使用，会跳转到默认页面 (也有可能是404或不显示)：
![中文tags跳转失败截图](/static/images/nextjs-starter-blog/chinese-tags/err1.png)


## 🚨 原因分析

### 1. 中文路径的特殊性
   - 在实际上网过程中我们一般**很少遇见`中文路径`**（这里**特指`中文路径`**， 而不是问号后面的中文参数）。
   - 中文路径分享的时候过程会被转码
   - 在ios webview里面，如果加载的h5 url有中文, 会导致白屏。一般开发的时候，会使用 encodeURL 进行URL 转码。

### 2. 中文tags build 产物
   回到当前项目的当前版本，我们会发现build以后，中文tags和英文tags的产物是不一样的：
   
   - 英文tags build以后是 一个文件夹 + 一个html + 一个txt。  
     - 拿`github`这个英文tag举例，就是`github`文件夹 +  `github.html` + `github.txt`。

   - 中文tags build以后是 一个中文文件夹 + 一个中文编码文件夹 + 一个中文编码html + 一个中文编码txt。      
      - 拿`产品`这个中文tag举例，就是`产品`文件夹 + `%E4%BA%A7%E5%93%81`文件夹 +  `%E4%BA%A7%E5%93%81.html` + `%E4%BA%A7%E5%93%81.txt`。     
      - tips1:
      ```javascript
         encodeURI('产品'); // '%E4%BA%A7%E5%93%81'
      ```
      - tip2:
        当我们从浏览器里面复制`https://blog.hackerbank.cn/tags/产品`这个url的时候，再粘贴到浏览器里面会发现变成了`https://blog.hackerbank.cn/tags/%E4%BA%A7%E5%93%81`

   - 下面和英文tag、中文tag build以后out的文件夹截图：
   ![中文tags build截图](/static/images/nextjs-starter-blog/chinese-tags/err3.png)
   ![中文tags build截图](/static/images/nextjs-starter-blog/chinese-tags/err2.png)
   

### 3. github Issues 讨论

   tailwind-nextjs-starter-blog 项目已有多个 issue 讨论非英文标签失效问题，例如：

   [Blogs with Chinese tag do not show in tag page #993](https://github.com/timlrx/tailwind-nextjs-starter-blog/issues/993)   

   [部署在vercel之后，中文tag点击无效，但是在开发环境中没问题 #1181](https://github.com/timlrx/tailwind-nextjs-starter-blog/issues/1181)  

   [feat: support chinese tag name #771](https://github.com/timlrx/tailwind-nextjs-starter-blog/pull/771)      

   [A bug occurs when a tag is registered in Korean. #1170](https://github.com/timlrx/tailwind-nextjs-starter-blog/pull/1170)

   [tags is not working with Vietnamese characters #1042](https://github.com/timlrx/tailwind-nextjs-starter-blog/issues/1042)


## ✅ 问题解决

### 方案一、去掉encodeURI   
  上面一些issue的解决方案一般是说把tags相关的`encodeURI` 相关代码注释掉。     
  这种方案可以修改`app\tags\[tag]\page.tsx`和`app\tags\[tag]\page\[page]\page.tsx` 2个文件里面的：
  ```javascript
  // 原代码：
  tag: encodeURI(tag),

  // 修改为：
  tag, // 把encodeURI去掉：
  ```
  - 我看大家提及的一般都是说修改`app\tags\[tag]\page.tsx`这一个文件。  
  但是等以后一个tag下面的文章多了以后会有分页，也会使用到`app\tags\[tag]\page\[page]\page.tsx`。比如 [https://tailwind-nextjs-starter-blog.vercel.app/tags/next-js/page/2](https://tailwind-nextjs-starter-blog.vercel.app/tags/next-js/page/2)。

  - 也就是说修改`app\tags\[tag]\page.tsx`，解决的是`https://blog.hackerbank.cn/tags/产品`;  
  修改`app\tags\[tag]\page\[page]\page.tsx`，解决的是`https://blog.hackerbank.cn/tags/产品/page/1` 。

  - 但是我把`app\tags\[tag]\page\[page]\page.tsx`里面的`encodeURI` 去掉以后，build的时候会报错：
     ![中文tags build截图](/static/images/nextjs-starter-blog/chinese-tags/err4.png)

   这可能和我的环境或配置有点关系，也可能本身是一种bug。

### 方案二、中文tag-英文URL
   我没有去深究上面build报错的问题，是因为感觉中文路径本身是不太合理的，正如之前所说: 我们在开发或实际上网过程中，一般很少遇到url中文路径的情况。

   在一般的生产中，一般都是一个中文菜单，点击以后去到一个完全英文路径的URL。 

   所以方案二就是 `中文tag-英文URL`, 就是点击`产品` 这个中文tag，跳转的是 [https://blog.hackerbank.cn/tags/products](https://blog.hackerbank.cn/tags/products)

   ![中文tags build截图](/static/images/nextjs-starter-blog/chinese-tags/err5.png)

   具体做法是：   
      1.1 新增`tag-data-map.json` (和`tag-data.json`同级目录即可)
    
      ```javascript
      {
         "wechat-mini-program": "微信小程序",
         "products": "产品"
      }
      ```
      1.2 修改`components\Tag.tsx`:
      ```javascript
      // 原代码：
      {text.split(' ').join('-')}
      
      // 修改为：    
      import tagMapData from 'app/tag-data-map.json'  

      {(tagMapData[text.toLocaleLowerCase()] || text).split(' ').join('-')}
      ```    

      1.3 修改`layouts\ListLayoutWithTags.tsx`:
      ```javascript
      // 原代码：
      {`${t} (${tagCounts[t]})`}
      
      // 修改为： 
      import tagMapData from 'app/tag-data-map.json' 

      {`${tagMapData[t.toLocaleLowerCase()] || t} (${tagCounts[t]})`}
      ```

      1.4 在blog里面的头部tags里面也需要使用中文tag对应的英文tag：
      ```
      title: '富婆排行榜'
      date: '2025-08-10'
      tags: ['wechat-mini-program', 'products']  // 注意这里也应该是英文tags
      draft: false
      layout: PostLayout
      summary: '分享“富婆排行榜”微信小程序的开发故事：从居家办公灵感到项目转型、上线挑战，揭秘技术栈、用户数据和未来计划。'
     ```
      
### 方案三、借鉴其它blog
   [https://github.com/timlrx/tailwind-nextjs-starter-blog?tab=readme-ov-file#examples-v2](https://github.com/timlrx/tailwind-nextjs-starter-blog?tab=readme-ov-file#examples-v2)
   
   源项目有很多中文的blog，大家可以看看其它人是怎么解决中文tags的问题的。我看了几个：
   - 有的tags没有分页（可能是把`app\tags\[tag]\page\[page]\page.tsx` 删除了）
   - 有的blog代码版本比较久了，比如使用nextjs-12
   - 有的blog代码版本不够新，比如使用v1版本、比如没有tag-data.json

### 方案总结
   
   我采用的是方案二，但是方案二也不一定完全对，而且有点不够智能，不能做到`tag-data.json`一样自动根据文章更新，还要手动维护。

   大家也可以试试方案一和方案三，也看看上面那些issues或自己查查解决方案。
   