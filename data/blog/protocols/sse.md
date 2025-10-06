---
title: 'AI项目中使用SSE'
date: '2025-10-06'
tags: ['AI', 'protocols']
draft: true
summary: '讨论在AI项目中使用SSE的情况'
---

## 一，简单介绍

[SSE (Server-Sent Events) ](https://developer.mozilla.org/zh-CN/docs/Web/API/Server-sent_events/Using_server-sent_events) 只支持服务器向客户端的**单向通信**（即SSE是 **单向连接**，因此无法将事件从客户端发送到服务器）；websocket 支持全双工通信。

关于流式输出和sse，还可以读一下 [@ant-design/pro-chat#什么是流式输出](https://pro-chat.antdigital.dev/guide/sse)。

之前ai项目使用的是`socket.io`，后续基本上都是换成了`sse`。有兴趣的可以读一下另外一篇关于`socket.io`的文章：[AI项目中使用socket.io](https://blog.hackerbank.cn/blog/protocols/socket-io)。 相比与`socket.io`，`sse`使用起来就和普通接口一样简单，不用引什么库，调试的时候也不用那么麻烦。

## 二，简单对比
### 1. 和websocket对比
[ChatGPT为什么使用SSE？](https://juejin.cn/post/7317937213379166244)
> SSE与WebSocket的比较      
>
> 你可能疑问，为什么不直接使用WebSocket，它似乎更为通用，也同样支持实时数据推送。这就是我们需要对比两者的理由。     
> 
>- 通信模式：SSE只支持服务器向客户端的单向通信，而WebSocket支持全双工通信，即服务器和客户端可以互相发送数据。对于ChatGPT这样的应用来说，大多数情况下，用户的请求是稀疏的，而服务器的响应是密集的，因此，SSE的单向通信模式更为合适。
>
>- 网络协议：SSE运行在HTTP协议上，因此，它可以提供更高的兼容性和灵活性。举个例子，如果你的产品已经部署在Web服务器上，那么你大概率无需做任何改动，就可以使用SSE技术。而WebSocket则需要单独的服务器和端口。


### 2. 和普通接口对比

sse 和 返回时间很长的普通接口 相比:
- sse是可以在断开之前持续返回内容的。
- 普通的接口则是一直等着，然后某个时间点突然全部返回。
（在postman测试的时候，选择http即可。和普通http接口唯一不同之处在返回的形式。入参和header和普通接口一样）

## 三，简单使用

```javascript
async function fetchSSE(url, onMessage) {
    const response = await fetch(url);

    // response.getReader() -- 得到二进制 BufferReader 对象
    const reader = response.body.getReader();
    const decoder = new TextDecoder("utf-8");

    let buffer = "";

    while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });

        let lines = buffer.split("\n");
        buffer = lines.pop(); // Save incomplete line

        for (const line of lines) {
            if (line.startsWith("data: ")) {
                onMessage(line.slice(6).trim()); // Extract data part
            }
        }
    }
}

fetchSSE("/stream-sse", (data) => {
    console.log("SSE Message:", data);
});
```
注意区分`TextDecoder`和`decodeURIComponent`：  
  ![TextDecoder和decodeURIComponent区别图](/static/images/protocols/sse/01.png)

## 四，观察请求

通过dev-tools的network tab下面的Fetch/XHR tab 就可以看到sse请求：

![sse运行图](/static/images/protocols/sse/02.png)

点击EventStream tab就可以看到`chunk`：

![sse运行图](/static/images/protocols/sse/03.png)
![sse运行图](/static/images/protocols/sse/04.png)

用postman调试也非常方便，就和调试正常接口一样：
![sse运行图](/static/images/protocols/sse/05.png)
![sse运行图](/static/images/protocols/sse/06.png)
![sse运行图](/static/images/protocols/sse/07.png)
![sse运行图](/static/images/protocols/sse/08.png)

点开finish，可以看到：

![sse运行图](/static/images/protocols/sse/09.png)


## 五，遇到的问题

### 1. 开发环境

开发环境的问题主要是跨域配置导致的问题。 我们在本地开发的时候一般不会直接接口，一般有一个`proxy.ts`或类似的文件，来配置代理，一般是这样配置：

```javascript
export default {
  dev: {
    '/api/': {
      target: 'http://10.0.0.1:666',
      changeOrigin: true,
      // pathRewrite: { '/api/': '' },
    },
  },
}
```

对于一般接口是没有问题，但是对于`socket.io`或`sse`类的接口，会导致 **流式输出效果** 丢失，所有结果会在最后的时刻一次性返回来。

解决办法：
- ① 使用一些chrome 跨域插件。只所以配置前端都会配置proxy，是因为会跨域。
既然这样解决跨域有问题，那么我们就换一种方式解决跨域，使用chrome插件：

    ![chrome 跨域插件](/static/images/protocols/socket-io/10.png)

    但是这样的插件不太稳定，有时候可以实现跨域。有时候实现不了跨域。

    在跨域插件有效的时候下，我们可以在 `development`环境下直连接口：
    ```javascript
    const requestpath = process.env.NODE_ENV === 'development' ? 'ws://10.0.0.1:666/chat' : '/chat';
    ```

    这样就不会出现 **流式输出效果** 丢失的问题

- ② 正如① 里面提及的，这些跨域插件不稳定，有时候还要重新找，浪费精力。这种情况下，可以调整proxy的配置：
    ```javascript
    '/chat/': {
      target,
      changeOrigin: true,
      onProxyRes: (proxyRes: any, req: any, res: any) => {
        console.log('req.headers.accept');
        console.log(req.headers.accept);
        
        if (req.headers.accept === '*/*') {  // 这里需要自行调整
          console.log('zzzzzzzzzzzzzzzzzzzzz');
          
          // res.writeHead(res.statusCode, {
          //   'Content-Type': 'text/event-stream',
          //   'Cache-Control': 'no-transform',
          //   'Connection': 'keep-alive',
          //   'X-Accel-Buffering': 'no',
          //   'Access-Control-Allow-Origin': '*'            
          // });
          // proxyRes.pipe(res);

          proxyRes.headers['content-type'] = 'text/event-stream';
          proxyRes.headers['cache-control'] = 'no-transform';
          proxyRes.headers['connection'] = 'keep-alive';
          proxyRes.headers['x-accel-buffering'] = 'no';
          proxyRes.headers['access-control-allow-origin'] = '*';
        }        
      }
      // pathRewrite: { '/proxy_agent/': '' },
    },
    ```

### 2. 部署

如果部署的时候，使用到了nginx， 流程是：前端-->nginx-->后端接口。那么nginx的配置文件还需要增加一条配置:

```nginx
location /api {
    # ... 其它配置 

    # 后端接口代理
    proxy_pass http://100.100.100.101:3000/;

    # 增加一条配置：这是禁用代理缓存，直接进行流式输出；
    # 设置 Nginx 不对 SSE 响应进行缓冲，直接透传给客户端； 
    #   不设置的时候可能会出现流式效果丢失的问题
    proxy_buffering off;
}
```

### 3. 线上问题

我遇到的线上问题，主要是chunk解析这块，比如：
- ① 由于各种情况出现的chunk粘连，比如和后端约定好了最后的finish chunk里面是包含所有内容的大json，但是有时候最后的finish chunk可能是分成2-3个返回。
- ② 要求流式输出过程中也要有样式。

这类问题，基本上都可以通过调整前端解析chunk的代码，来解决。