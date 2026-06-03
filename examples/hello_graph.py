from typing import TypedDict
from langgraph.graph import StateGraph, START, END



# 1. 定义 State —— 图中所有节点共享的数据
class State(TypedDict):
    text: str

# 2. 定义节点 —— 接收 state，返回部分更新
def to_upper(state: State) -> dict:
    return {"text": state["text"].upper()}

def add_prefix(state: State) -> dict:
    return {"text": f"Result:{state['text']}"}


# 3. 构建图
builder = StateGraph(State)
builder.add_node("to_upper",to_upper)
builder.add_node("add_prefix",add_prefix)

# 4. 连接流程：START → to_upper → add_prefix → END
builder.add_edge(START, "to_upper")
builder.add_edge("to_upper", "add_prefix")
builder.add_edge("add_prefix", END)


# 5. 编译
graph = builder.compile()



# 6. 运行
result = graph.invoke({"text": "hello langgraph"})
print(result)



