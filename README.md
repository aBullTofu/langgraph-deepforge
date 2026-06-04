# ⚡ LangGraph DeepForge

[English](#english) | [中文](#中文)

---

<a id="english"></a>
**Learn LangGraph like an engineer, not a tourist.**

Build production-grade LangGraph agents through hands-on quests, failure patterns, interview drills, and real deployment workflows. Zero dependencies, zero build. Open `index.html` and start forging.

<a id="中文"></a>
**像工程师一样学 LangGraph，而不是像游客一样看教程。**

用闯关实战、反模式、面试题和生产部署流程，锻造真正能上线的 LangGraph Agent 能力。零依赖，零构建，打开 `index.html` 即可开练。

---

## ✨ Features / 特性

| Feature | 说明 |
|---------|------|
| 🔒 **Stage-Gated Progression** / 阶段锁闯关 | 3 stages (Foundation → Professional → Expert), 12 lessons unlocked sequentially / 三阶段渐进解锁，12 课逐一闯关 |
| 🧩 **6-Phase Learning Engine** / 六阶段学习引擎 | Ignition → Fable → GodView → Combat → Forge → Echo — grounded in cognitive science / 融合认知科学的六阶段引擎 |
| 📝 **Notes & Progress** / 笔记与进度 | localStorage-based notes with JSON export/import; streak tracking / 基于 localStorage 的笔记系统，支持 JSON 导入导出 |
| 🍅 **Pomodoro Timer** / 番茄钟 | Built-in floating timer with auto work/break cycling / 内置浮动番茄钟，自动工作休息循环 |
| 🎯 **100-Question Interview Bank** / 百题面试库 | 5-layer pyramid (25+22+20+18+15), sourced from 25+ real interview datasets / 五层金字塔题库，来源 25+ 真实面经 |
| 📖 **Concept Fables** / 概念寓言集 | 12 allegories explaining complex CS concepts through storytelling / 12 篇寓言故事，用叙事理解抽象概念 |
| ⚠️ **Anti-Pattern Guide** / 避坑指南 | 7 common pitfalls + 11 error codes with diagnostic flowcharts / 7 大反模式 + 11 错误码速查 |
| 🌐 **Bilingual** / 中英双语 | One-click language switch (Chinese / English) / 一键切换中英文 |

## 🚀 Quick Start / 快速开始

```
open index.html
```

That's it. Everything runs in the browser via `localStorage`. No `npm install`, no `pip install`.

就这么简单。一切在浏览器中运行，基于 `localStorage`，无需安装任何东西。

### Optional: Python Examples / 可选：Python 示例

The `examples/` directory contains Python scripts that complement the course:

`examples/` 目录包含配套课程的 Python 脚本：

```bash
uv sync
uv run python examples/hello_graph.py
```

## 📚 Course Outline / 课程大纲

### 🔵 Foundation / 基础篇 (L01–L04)
| # | Lesson / 课题 | Topic / 内容 |
|---|---------------|-------------|
| L01 | State / Node / Edge | Graph programming mindset / 图式编程思维 |
| L02 | First LLM Agent | ReAct pattern, model integration / ReAct 模式，模型集成 |
| L03 | Tools | Tool definition, binding, error handling / 工具定义、绑定、错误处理 |
| L04 | Agent Loop | Routing, conditional edges, recursion limit / 路由、条件边、递归限制 |

### 🟡 Professional / 专业篇 (L05–L08)
| # | Lesson / 课题 | Topic / 内容 |
|---|---------------|-------------|
| L05 | Memory & Persistence / 记忆与持久化 | Checkpointing, MemorySaver, Postgres |
| L06 | Human-in-the-Loop | `interrupt()`, `Command(resume=)`, approval flows / 中断、恢复、审批流 |
| L07 | Streaming / 流式输出 | 4 streaming modes, token-level vs message-level / 四种流式模式选型 |
| L08 | Error Handling / 错误处理 | GRAPH_RECURSION_LIMIT, silent exit debugging, retry / 递归限制、静默退出调试、重试 |

### 🔴 Expert / 专家篇 (L09–L12)
| # | Lesson / 课题 | Topic / 内容 |
|---|---------------|-------------|
| L09 | Subgraphs / 子图 | Isolated state, parent-child communication / 隔离状态、父子通信 |
| L10 | Multi-Agent / 多 Agent | Swarm, supervisor, hierarchical patterns / Swarm、Supervisor、层级模式 |
| L11 | Parallel & Send / 并行 | Map-reduce parallelism, dynamic fan-out / Map-Reduce 并行、动态扇出 |
| L12 | Production / 生产部署 | `langgraph deploy`, LangSmith, cost optimization / 部署、监控、成本优化 |

## 📂 Project Structure / 项目结构

```
langgraph-deepforge/
├── index.html                  ← Entry point / 入口仪表盘
├── css/style.css               ← Design system / 设计系统（暗色主题）
├── js/
│   ├── store.js                ← Data layer / 数据层 (localStorage)
│   ├── app.js                  ← UI components / UI 组件
│   ├── pomodoro.js             ← Pomodoro timer / 番茄钟
│   ├── i18n.js                 ← i18n engine / 国际化引擎
│   └── i18n-data.js            ← Translation data / 翻译数据
├── lessons/                    ← 12 course lessons / 12 课
├── reference/                  ← 6 reference pages / 6 个参考页面
│   ├── learning-path.html      ← Learning roadmap / 学习路线图
│   ├── fables.html             ← 12 concept fables / 12 篇概念寓言
│   ├── pitfalls.html           ← Anti-patterns & errors / 反模式与错误码
│   ├── meta-learning-guide.html← Mental models & blind-spot tests / 思维模型与盲区测试
│   ├── interview-bank.html     ← 100-question pyramid / 百题面试库
│   └── answer-bank.html        ← Full answers & scoring rubrics / 答案与评分标准
├── examples/                   ← Python code examples / Python 代码示例
├── docs/setup-guide.md         ← uv environment setup guide / uv 环境搭建指南
├── pyproject.toml
└── uv.lock
```

## 🧠 Learning Methodology / 学习方法论

The 6-phase engine integrates / 六阶段引擎融合：

- **Amanda Askell's Fable Pedagogy / Askell 寓言教学法** — explain before you define / 先讲故事再给定义
- **MIT Metacognition Research / MIT 元认知研究** — self-explanation, interleaving, retrieval practice / 自我解释、交错练习、检索练习
- **Goal Gradient Effect / 目标梯度效应** — unlock milestones create momentum / 解锁里程碑创造动力
- **Hick's Law / 希克定律** — progressive disclosure reduces choice paralysis (6 → 10 → 14 nav links) / 渐进展示减少选择困难

## 🛠 Tech Stack / 技术栈

Vanilla HTML + CSS + JavaScript + localStorage. No frameworks, no build tools, no server.

纯静态 HTML + 原生 JS + localStorage。无框架，无构建工具，无需服务器。

## 📄 License / 许可

MIT — see [LICENSE](LICENSE) for details.
