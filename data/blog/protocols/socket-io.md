---
title: 'ai项目中使用socket.io'
date: '2025-10-06'
tags: ['AI', 'protocols']
draft: true
summary: '讨论在ai项目中使用socket.io的情况'
---

## 一，简单介绍

> WebSocket 是一种 网络通信协议，提供 **全双工**、低延迟 的通信通道，允许客户端和服务器之间 持久连接，**实时双向** 数据传输。

> [Socket.IO](https://socket.io/zh-CN/docs/v4/) 是一个库，**封装了 WebSocket**，但 **不仅限于 WebSocket**，提供了 自动降级机制（如轮询、长轮询），确保在 WebSocket 不可用时仍能通信，有内置心跳、自动重连等功能。

之前ai项目使用的是`socket.io`，后续基本上都是换成了`sse`，这里是整理一些之前使用`socket.io`的一些问题。

## 二，简单使用

```shell
yarn add socket.io-client
```

```javascript
import React, { useRef } from 'react'
import { io } from 'socket.io-client'

const JSONParam = {
  task_id: 123,
  info: {
    outline: [
      {
        children: [],
        header: '2',
        keypoint: '3',
        no_output: false,
        paragraph_id: 'aaabbb1',
        paragraph_instruction: '4',
      },
    ],
    tags: [],
    docs: [],
    title: '1',
    instruction: '',
  },
}

const socketRef = useRef()
const requestpath = process.env.NODE_ENV === 'development' ? 'ws://10.0.0.1:666/chat' : '/chat';

socketRef.current = io(requestpath, {
  extraHeaders: {
    Authorization: `Bearer xxx`,
  },
})

console.log(socketRef)

socketRef.current.on('error', (err) => {
  console.log('ws错误：', err)
  socketRef.current.disconnect()
})

socketRef.current.on('connect_error', (err) => {
  console.log(err, 'err')
})

socketRef.current.on('connect', () => {
  console.log('连接成功')
  socketRef.current.emit('estimate', JSONParam)
  console.log(JSONParam)
})

socketRef.current.on('disconnect', () => {
  socketRef.current?.disconnect()
  console.log('disconnect 连接断开')
})

socketRef.current.on('estimate_response', (data) => {
  console.log('data.data')
  console.log(data.data)
})
```

![socket.io运行图](/static/images/protocols/socket-io/01.png)
![socket.io运行图](/static/images/protocols/socket-io/02.png)

## 三，观察请求

### 1. 表面的请求

通过dev-tools的network tab下面的Fetch/XHR tab 可以看到一些socket.io格式的http请求：

```
/socket.io/?EIO=4&transport=polling&t=xxxx
```

不同于`sse`，这些http请求的`reponse header`里面有`Transfer-Encoding:
chunked`，没有`content-type
text/event-stream;`，

![socket.io运行图](/static/images/protocols/socket-io/03.png)
![socket.io运行图](/static/images/protocols/socket-io/04.png)

而且单个请求的tab没有`EventStream tab`:

![socket.io运行图](/static/images/protocols/socket-io/05.png)

### 2. 真正的请求

通过dev-tools的network tab下面的WS tab 可以看到真正的请求：
![socket.io运行图](/static/images/protocols/socket-io/06.png)
![socket.io运行图](/static/images/protocols/socket-io/07.png)
![socket.io运行图](/static/images/protocols/socket-io/08.png)
![socket.io运行图](/static/images/protocols/socket-io/09.png)

### 3. 为什么会这样

为什么没有请求的url是ws协议，但是在network的Fetch/XHR tab里面却变处理http协议，甚至http的url都不是底代码的原始url: 原始url里面有/chat，但是Fetch/XHR tab看到的http请求里面没有这/chat.

具体可以看看 [socket.io 运作原理](https://socket.io/zh-CN/docs/v4/how-it-works/)：

>Socket.IO 代码库分为两个不同的层：
>- 底层通道：我们称之为Engine.IO，Socket.IO内部的引擎 (Engine.IO 负责建立服务器和客户端之间的低级连接)
>- 高级 API：Socket.IO 本身

也可以看看 [Socket.IO 与 WebTransport](https://socket.io/zh-CN/get-started/webtransport)
> By default, the Socket.IO client will always try HTTP long-polling first, since it is the transport which is the most likely to successfully establish a connection. It will then quietly upgrade to more performant transports, like WebSocket or WebTransport.   
> 默认情况下 Socket.IO 客户端将始终`首先尝试 HTTP 长轮询`，因为它是最有可能成功建立连接的传输方式。然后它会悄悄`升级到性能更高的传输`，例如 WebSocket 或 WebTransport。


这些HTTP 请求是 `engine.io` 的 `轮询（polling） 握手`，路径固定是 /socket.io/，是用来完成 `升级协商（Upgrade）`。http请求返回的`40/chat,{"sid":"xxxx"}`
表示“我连到命名空间 /chat 啦”，后面就可以
`socket.emit('hello', data)`

/chat 被 封装在 Socket.IO 协议帧里（40/chat），不会出现在network的Fetch/XHR tab里面；升级成功后走的是 WebSocket 帧。

## 四，遇到的问题

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

### 2. 联调
`socker.io` 用`postman`调试的时候，要比`sse`麻烦很多：`sse`的copy url过来，然后直接`send`就可以。

`socker.io` 则要经过下面这些步骤：
![postman调试socket.io图](/static/images/protocols/socket-io/11.png)

① header 配置正确的token;    
注意如果是ip是ws:// （ws://xxx/chat）   
如果是域名则是wss:// (wss://xxx/chat)

![postman调试socket.io图](/static/images/protocols/socket-io/12.png)

② 点击connect，连接成功:

![postman调试socket.io图](/static/images/protocols/socket-io/13.png)

③ 发送参数：
![postman调试socket.io图](/static/images/protocols/socket-io/14.png)

对应代码上是这样：

![postman调试socket.io图](/static/images/protocols/socket-io/15.png)


④ 点击send：    

从这里的操作就可以看出，websocket和sse的不同:   
- sse是服务端单方面发送消息到客户端，是单工的。  
- websocket是双工的，客户端是可以发送消息(emit)到服务器端的。

![postman调试socket.io图](/static/images/protocols/socket-io/16.png)


### 3. 部署

如果部署的时候，使用到了nginx， 流程是：前端-->nginx-->后端接口。那么nginx的配置文件还需要增加一条配置:

```nginx
location /socket.io {
    proxy_set_header   X-Real-IP $remote_addr;
    proxy_set_header   X-Real-PORT $remote_port;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "Upgrade";

    # 这是为了防止连接，经过一层nginx，断开或连接失败
    proxy_pass ${PROXY_PASS}/socket.io;

    # 这是禁用代理缓存，直接进行流式输出；设置 Nginx 不对 SSE 响应进行缓冲，直接透传给客户端； 不设置的时候可能会出现流式效果丢失的问题
    proxy_buffering off;
}
```
