---
title: '渲染工作流'
date: '2025-10-08'
tags: ['AI', 'Workflow']
draft: false
summary: "在AI项目中，如何渲染工作流"
---

## 一，工作流（Workflow）

### 1. 基本了解

“工作流（Workflow）”在 AI 定制化系统里，是一个核心概念。
它把原本“一次性对话”，变成“能自动执行一系列智能步骤”的系统。

工作流就是一个 有顺序、有逻辑的任务流程，由多个 节点（Node） 组成，每个节点执行一个动作（Action）。这些节点通过“连接线”自动流转数据。这样，AI 就不是单纯聊天，而是执行一个完整任务。

在实际AI定制系统中，工作流往往以 可视化流程图（Flow Editor） 或 JSON配置文件 的形式存在。

一个典型的 AI 工作流包括以下几种节点：

| 类型                     | 功能            | 举例                     |
| ---------------------- | ------------- | ---------------------- |
| **输入节点 (Input)/开始节点（Start）**       | 接收用户输入或触发事件   | 用户提问、表单提交、Webhook触发    |
| **知识检索节点 (Retriever)** | 在知识库中查找相关资料   | 从文档中找出与问题最相关的段落        |
| **大模型节点 (LLM)**        | 调用语言模型生成回答或分析 | 调用 GPT、Qween、DeepSeek 等 |
| **条件节点 (Condition)**   | 判断分支逻辑        | 如果用户情绪是负面 → 走安抚流程      |
| **API节点 (API Call)**   | 调用外部接口        | 调CRM、天气、股票、数据库等        |
| **输出节点 (Output)/结束节点（End）**      | 输出到前端或发送结果    | 回复用户、发送邮件、生成报告         |


### 2. 知识库和工作流
知识库和工作流两者经常结合使用：
👉 知识库提供“内容”，工作流决定“怎么用内容”。

比如：用户问：“帮我生成一份销售提案。”
系统会走一个工作流：
【接收输入】→【从知识库取产品信息】→【调用GPT生成提案】→【输出PDF】。

### 3. 渲染已经配置的工作流

那么要怎么渲染已经配置好的工作流呢？使用 [`reactflow`](https://reactflow.dev/)。

## 二，reactflow

### 1. reactflow 不同版本
reactflow12（不含12）之前的包名是[reactflow](https://www.npmjs.com/package/reactflow)。

reactflow12（含12）以后的包名是包名是[@xyflow/react](https://www.npmjs.com/package/@xyflow/react)。

具体可以阅读一下 [迁移到 React Flow 12](https://reactflow.dev/learn/troubleshooting/migrate-to-v12)

### 2. reactflow和xyflow区别

关于两者区别，kmini如是说：
> **ReactFlow 是“库”，xyflow 是“品牌 + 全家桶”；ReactFlow 12 之后，库的名字也改成 `@xyflow/react`，但代码还是同一套，只是换了个 npm 坐标。**
> 
> 把关系按时间线展开：
> 
> 1. 2019-2022  
>    只有一个 npm 包 `react-flow-renderer`（后改名 `reactflow`），大家口头上把> 它叫 “ReactFlow”。
> 
> 2. 2023  
>    团队把组织名升级为 **xyflow**，开始做多框架战略，于是  
>    - 品牌：xyflow（涵盖 React / Svelte / 未来 Vue 等）  
>    - React 版：仍叫 ReactFlow，但仓库、官网、Twitter 一律挂 xyflow 牌子。
> 
> 3. 2024-07 发布 ReactFlow 12  
>    彻底把 npm 包名改成 `@xyflow/react`，Svelte 版对应 `@xyflow/svelte`。  
>    所以“xyflow vs reactflow”其实不再是对比，而是 **“@xyflow/react 就是 > ReactFlow 12+ 的新包名”**。
> 
> 功能差异？  
>
> 没有本质差异，只是 12 大版本带来的新特性（SSR、节点 `measured` 属性、统一 > `onDelete` 等）都落在 `@xyflow/react` 里，老包 `reactflow` 停止更新。


### 3. 使用reactflow11

关于xyflow并没有实际使用过，所以这里还是以reactflow11为准：

```shell
pnpm add reactflow  
```

这样添加的是版本是11.11.4

```json
  "dependencies": {
    "reactflow": "^11.11.4",
  },
```

渲染下面这个工作流：
```shell
Start(输入) → Retrieval(检索知识库) → LLM(调用大模型) → End(结束)
```

```tsx
import { useCallback } from 'react';
import ReactFlow, {
  addEdge,
  Background,
  Controls,
  useEdgesState,
  useNodesState,
} from 'reactflow';
import 'reactflow/dist/style.css';

const initialNodes = [
  {
    id: 'start',
    type: 'Start',
    data: { label: '开始节点' },
    position: { x: 0, y: 100 },
  },
  {
    id: 'retrieval',
    type: 'Retrieval',
    data: { label: '检索组件' },
    position: { x: 300, y: 100 },
  },
  {
    id: 'llm',
    type: 'LLM',
    data: { label: '大语言模型' },
    position: { x: 600, y: 100 },
  },
  {
    id: 'end',
    type: 'End',
    data: { label: '结束节点' },
    position: { x: 900, y: 100 },
  },
];

const initialEdges = [
  {
    id: 'e1',
    source: 'start',
    target: 'retrieval',
    animated: true,
  },
  {
    id: 'e2',
    source: 'retrieval',
    target: 'llm',
    animated: true,
  },
  {
    id: 'e3',
    source: 'llm',
    target: 'end',
    animated: true,
  },
];

const Index: React.FC = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge({ ...params, animated: true }, eds)),
    [setEdges],
  );

  return (
    <div style={{ height: 800 }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitView
      >
        <Controls />
        <Background />
      </ReactFlow>
    </div>
  );
};

export default Index;
```
效果：
![渲染工作流效果图](/static/images/ai-devs/workflow/flow-editor/01.png)

其中`type: 'Start'`、`type: 'Retrieval',`、`type: 'LLM',`、`type: 'End',` 这些节点是需要去自定义的，具体可以看一下 [Node type "Start" not found. Using fallback type "default". Help: https://reactflow.dev/error#003 ](https://reactflow.dev/learn/troubleshooting/common-errors#003) 和 [custom-nodes](https://reactflow.dev/learn/customization/custom-nodes)

在`输入(Input/Start)组件`和`输出(Output/End)组件`之间除了`检索知识库组件(Retrieval)`和`调用大模型组件(LLM)组件`，还有很多`业务类型的组件`，比如错别字识别、文生图、图生文、文字转语音、语音转文件、敏感字识别等等。后续可能会新开一篇文章展开讨论。