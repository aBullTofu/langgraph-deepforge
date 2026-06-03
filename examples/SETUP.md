# 01 — 项目初始化与第一个 LangGraph 图

> 当前环境：uv 0.11.8 / Python 3.12.10 / CMD 终端 / DeepSeek API

## 1. 初始化项目

```bash
uv init --python 3.12
```

执行后会生成以下文件：

| 文件 | 作用 |
|------|------|
| `pyproject.toml` | 项目元数据 + 依赖声明 |
| `README.md` | 项目说明（可删除或保留） |
| `main.py` | uv 生成的 hello world（可删除，我们将用自己的） |
| `.python-version` | 固定 Python 版本为 3.12 |
| `.gitignore` | Git 忽略规则 |
| `.git/` | Git 仓库 |

> `uv.lock` 在 `uv init` 时**不会生成**，它会在第一次 `uv add` 或 `uv sync` 时自动创建。

## 2. 添加依赖

```bash
uv add langgraph langchain langchain-deepseek
```

| 包 | 作用 |
|---|------|
| `langgraph` | 核心编排框架 |
| `langchain` | 模型封装 + 工具定义 |
| `langchain-deepseek` | DeepSeek 原生集成（无需手动配 base_url） |

## 3. 设置 API Key

在 CMD 终端中执行（**每次新开终端都要重新设置**）：

```cmd
set DEEPSEEK_API_KEY=sk-你的DeepSeek-Key
```

> 如果想持久化：创建 `.env` 文件写入 `DEEPSEEK_API_KEY=sk-xxx`，后续用 `python-dotenv` 加载即可。记得把 `.env` 加入 `.gitignore`。

## 4. 第一个 LangGraph 程序

创建 `hello_graph.py`（纯字符串处理，不需要 LLM）：

```python
from typing import TypedDict
from langgraph.graph import StateGraph, START, END

# 1. 定义 State —— 图中所有节点共享的数据
class State(TypedDict):
    text: str

# 2. 定义节点 —— 接收 state，返回部分更新
def to_upper(state: State) -> dict:
    return {"text": state["text"].upper()}

def add_prefix(state: State) -> dict:
    return {"text": f"Result: {state['text']}"}

# 3. 构建图
builder = StateGraph(State)
builder.add_node("to_upper", to_upper)
builder.add_node("add_prefix", add_prefix)

# 4. 连接流程：START → to_upper → add_prefix → END
builder.add_edge(START, "to_upper")
builder.add_edge("to_upper", "add_prefix")
builder.add_edge("add_prefix", END)

# 5. 编译
graph = builder.compile()

# 6. 运行
result = graph.invoke({"text": "hello langgraph"})
print(result)  # {'text': 'Result: HELLO LANGGRAPH'}
```

## 5. 运行

```cmd
uv run python hello_graph.py
```

预期输出：

```
{'text': 'Result: HELLO LANGGRAPH'}
```

## 6. 日常命令速查

```cmd
uv add <package>          # 添加新依赖
uv add --dev <package>    # 添加开发依赖
uv sync                   # 根据 uv.lock 安装所有依赖
uv run python xxx.py      # 在项目 venv 中运行脚本
uv lock --upgrade         # 升级所有依赖到最新兼容版本
uv python list            # 查看已安装的 Python 版本
```

## 踩坑提醒

| 问题 | 解决 |
|------|------|
| `uv init` 找不到 Python 3.12 | `uv python install 3.12` 先安装 |
| 国内网络下载慢 | 设置镜像 `set UV_INDEX_URL=https://pypi.tuna.tsinghua.edu.cn/simple` |
| import 报错找不到包 | 确保用 `uv run python` 而不是直接 `python` |
| `DEEPSEEK_API_KEY` 不生效 | CMD 用 `set`，PowerShell 用 `$env:`，确认终端类型 |
