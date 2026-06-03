# ⚡ LangGraph DeepForge

**从入门到精通 · 游戏化学习 · 闯关式 Agent 工程训练**

A gamified, stage-gated learning system for LangGraph — from writing your first StateGraph to deploying production multi-agent systems. Zero dependencies, zero build. Open `index.html` and start learning.

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🔒 **Stage-Gated Progression** | 3 stages (Foundation → Professional → Expert), 12 lessons unlocked sequentially |
| 🧩 **6-Phase Learning Engine** | Ignition → Fable → GodView → Combat → Forge → Echo — grounded in cognitive science |
| 📝 **Notes & Progress** | localStorage-based notes with JSON export/import; streak tracking |
| 🍅 **Pomodoro Timer** | Built-in floating timer with auto work/break cycling |
| 🎯 **100-Question Interview Bank** | 5-layer pyramid (25+22+20+18+15), sourced from 25+ real interview datasets |
| 📖 **Concept Fables** | 12 allegories explaining complex CS concepts through storytelling |
| ⚠️ **Anti-Pattern Guide** | 7 common pitfalls + 11 error codes with diagnostic flowcharts |
| 🌐 **Zero Dependencies** | Pure HTML + Vanilla JS + CSS — works offline, no server needed |

## 🚀 Quick Start

```
open index.html
```

That's it. Everything runs in the browser via `localStorage`. No `npm install`, no `pip install`.

### Optional: Python Examples

The `examples/` directory contains Python scripts that complement the course:

```bash
uv sync
uv run python examples/hello_graph.py
```

## 📚 Course Outline

### 🔵 Foundation (L01–L04)
| # | Lesson | Topic |
|---|--------|-------|
| L01 | State / Node / Edge | Graph programming mindset |
| L02 | First LLM Agent | ReAct pattern, model integration |
| L03 | Tools | Tool definition, binding, error handling |
| L04 | Agent Loop | Routing, conditional edges, recursion limit |

### 🟡 Professional (L05–L08)
| # | Lesson | Topic |
|---|--------|-------|
| L05 | Memory & Persistence | Checkpointing, MemorySaver, Postgres |
| L06 | Human-in-the-Loop | `interrupt()`, `Command(resume=)`, approval flows |
| L07 | Streaming | 4 streaming modes, token-level vs message-level |
| L08 | Error Handling | GRAPH_RECURSION_LIMIT, silent exit debugging, retry |

### 🔴 Expert (L09–L12)
| # | Lesson | Topic |
|---|--------|-------|
| L09 | Subgraphs | Isolated state, parent-child communication |
| L10 | Multi-Agent | Swarm, supervisor, hierarchical patterns |
| L11 | Parallel & Send | Map-reduce parallelism, dynamic fan-out |
| L12 | Production | `langgraph deploy`, LangSmith, cost optimization |

## 📂 Project Structure

```
langgraph-deepforge/
├── index.html                  ← Entry point: course dashboard
├── css/style.css               ← Design system (dark theme, CSS variables)
├── js/
│   ├── store.js                ← Data layer (localStorage)
│   ├── app.js                  ← UI components (nav, phase lock, dashboard)
│   └── pomodoro.js             ← Pomodoro timer
├── lessons/                    ← 12 course lessons
├── reference/                  ← 6 reference pages
│   ├── learning-path.html      ← Learning roadmap + progress dashboard
│   ├── fables.html             ← 12 concept fables
│   ├── pitfalls.html           ← Anti-patterns & error codes
│   ├── meta-learning-guide.html← 6 mental models + blind-spot tests
│   ├── interview-bank.html     ← 100-question pyramid
│   └── answer-bank.html        ← Full answers + scoring rubrics
├── examples/                   ← Python code examples
├── docs/setup-guide.md         ← uv environment setup guide
├── pyproject.toml
└── uv.lock
```

## 🧠 Learning Methodology

The 6-phase engine integrates:

- **Amanda Askell's Fable Pedagogy** — explain before you define
- **MIT Metacognition Research** — self-explanation, interleaving, retrieval practice
- **Goal Gradient Effect** — unlock milestones create momentum
- **Hick's Law** — progressive disclosure reduces choice paralysis (6 → 10 → 14 nav links)

## 🛠 Tech Stack

Vanilla HTML + CSS + JavaScript + localStorage. No frameworks, no build tools, no server.

## 📄 License

MIT — see [LICENSE](LICENSE) for details.
