---
title: '渲染markdown'
date: '2025-10-04'
tags: ['AI', 'markdown']
draft: false
summary: "在AI项目中，如何渲染后端输出的markdown"
---

## 一，react-markdown
在AI项目中，如何渲染后端输出的markdown ? 

使用 [`react-markdown`](https://github.com/remarkjs/react-markdown) 来渲染。

## 二，2个插件系统
`react-markdown` 有2个插件系统:   

① `remark` 用于 **增强Markdown**  ( 比如remarkGfm支持下划线、任务列表、表格、直接链接等； 比如 remarkMath支持数学语法； )   

② `rehype` 用于 **HTML** ( 比如rehypeRaw支持渲染Markdown中的html；比如rehypeKatex用于渲染html中的公示; )

## 三，基本使用
```shell
pnpm add react-markdown rehype-raw remark-gfm github-markdown-css remark-math rehype-katex
```

组件：
```javascript
import 'github-markdown-css/github-markdown-light.css';
import React from 'react';
import Markdown from 'react-markdown';
import rehypeKatex from 'rehype-katex';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';

interface Props {
  content: string;
}
const ShowMarkdown: React.FC<Props> = ({ content }) => {
  return (
    <div className="markdown-body">
      <div className="markdown-body-normal">
        <Markdown
          remarkPlugins={[remarkGfm, remarkMath]}
          rehypePlugins={[rehypeRaw, rehypeKatex]}
        >
          {content}
        </Markdown>
      </div>
    </div>
  );
};
export default ShowMarkdown;
```

使用：
```tsx
import React from 'react';
import ShowMarkdown from './ShowMarkdown';

const Index: React.FC = () => {
    const content = `# 111    

  <p>666</p>

http://www.nasa.gov

This ~is not~ strikethrough, but ~~this is~~!


* Lists
* [ ] todo
* [x] done

A table:
| a | b |
| - | - |

The lift coefficient ($C_L$) is a dimensionless coefficient.
`;
  return (
    <>
      <ShowMarkdown content={content}/>
    </>
  );
};
export default Index;
```
效果：
![渲染markdown效果图](/static/images/ai-devs/render-markdown/01.png)

## 四，小tips

### 1. 不使用rehypeRaw

rehypeRaw用来渲染Markdown 中的 HTML。

这里的hype = Hypertext ( html的全称是超文本标记语言 = Hypertext Markup Language )

如果不使用，那么markdown里面的html会直接以字符串的形式渲染出来：

```javascript
import 'github-markdown-css/github-markdown-light.css';
import React from 'react';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const ShowMarkdown: React.FC = () => {
  const content = `# 111    

  <p>666</p>

  # 222
`;
  return (
    <div className="markdown-body">
      <div className="markdown-body-normal">
        <Markdown 
            remarkPlugins={[remarkGfm]} 
            // rehypePlugins={[rehypeRaw]}
        >
          {content}
        </Markdown>
      </div>
    </div>
  );
};
export default ShowMarkdown;
```
效果：
![渲染markdown效果图](/static/images/ai-devs/render-markdown/02.png)

### 2. 不使用remarkGfm

remarkGfm 添加了对脚注、删除线、表格、任务列表和直接 URL（所谓直接URL就是**直接一个链接**， 而不是`[...](http://)`这种语法） 的支持。

Gfm = GitHub Flavored Markdown (GFM)

如果不使用，那么markdown里面的这些无法显示:

```javascript
import 'github-markdown-css/github-markdown-light.css';
import React from 'react';
import Markdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';

const ShowMarkdown: React.FC = () => {
  const content = `# 111    

  <p>666</p>

http://www.nasa.gov

This ~is not~ strikethrough, but ~~this is~~!


* Lists
* [ ] todo
* [x] done

A table:
| a | b |
| - | - |

The lift coefficient ($C_L$) is a dimensionless coefficient.
`;
  return (
    <div className="markdown-body">
      <div className="markdown-body-normal">
        <Markdown 
            // remarkPlugins={[remarkGfm]} 
            rehypePlugins={[rehypeRaw]}
        >
          {content}
        </Markdown>
      </div>
    </div>
  );
};
export default ShowMarkdown;
```
效果：
![渲染markdown效果图](/static/images/ai-devs/render-markdown/03.png)

使用remarkGfm以后的效果：
```javascript
   <Markdown 
        remarkPlugins={[remarkGfm]} 
        rehypePlugins={[rehypeRaw]}
    >
```
![渲染markdown效果图](/static/images/ai-devs/render-markdown/04.png)

### 3. 真实后端返回的字符串
```javascript
import 'github-markdown-css/github-markdown-light.css';
import React from 'react';
import Markdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';

const ShowMarkdown: React.FC = () => {
  const content =
    '这句诗出自唐代王勃的《滕王阁序》，被誉为千古绝句，展现了极其壮美的自然景象和深远的意境。以下是对这句诗的多维度分析：\n\n1. **意象组合**：\n- "落霞"与"孤鹜"（晚霞与野鸭）构成动态画面，一静一动，霞光铺展与孤鸟飞翔形成空间上的呼应\n- "秋水"与"长天"通过色彩融合（水天相接的湛蓝）达到视觉上的浑然一体\n\n2. **艺术手法**：\n- 运用了"齐飞""一色"的对称句式，形成音律美\n- 远近景的巧妙搭配（近处的飞鸟与远处的天际线）\n- 色彩学运用：霞光的红、秋水的碧、天空的蓝形成自然调色盘\n\n3. **哲学意境**：\n- 体现了天人合一的传统宇宙观\n- 通过有限物象（飞鸟）展现无限时空（长天）\n- 动静结合中暗含人生际遇的思考（孤鹜的孤独与天地的永恒）\n\n4. **语言创新**：\n突破六朝骈文的绮靡之风，以简练文字构建宏大意境，开创了唐代诗文的新气象。\n\n这句诗之所以流传千年，正在于其将物理空间、视觉美感与精神境界完美融合，达到了"言有尽而意无穷"的艺术高度。';
  return (
    <div className="markdown-body">
      <div className="markdown-body-normal">
        <Markdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
          {content}
        </Markdown>
      </div>
    </div>
  );
};
export default ShowMarkdown;
```
效果: 
![渲染markdown效果图](/static/images/ai-devs/render-markdown/05.png)


