/* ============================================================
   LangGraph DeepForge — i18n-data.js
   Translation dictionary for UI strings, nav, phases, dashboard
   ============================================================ */

window.__I18N_DATA = {

  /* ── Navigation ── */
  'nav.overview':          { zh: '🏠 总览',               en: '🏠 Overview' },
  'nav.roadmap':           { zh: '🗺 路线',               en: '🗺 Roadmap' },
  'nav.fables':            { zh: '📖 寓言',               en: '📖 Fables' },
  'nav.pitfalls':          { zh: '⚠ 避坑',               en: '⚠ Pitfalls' },
  'nav.meta':              { zh: '🧠 元学习',             en: '🧠 Meta' },
  'nav.interview':         { zh: '🏔 面试',               en: '🏔 Interview' },
  'nav.answers':           { zh: '📖 答案',               en: '📖 Answers' },

  /* ── Phase Names ── */
  'phase.ignition':        { zh: 'Ignition',       en: 'Ignition' },
  'phase.fable':           { zh: 'Fable',          en: 'Fable' },
  'phase.godview':         { zh: 'GodView',        en: 'GodView' },
  'phase.combat':          { zh: 'Combat',         en: 'Combat' },
  'phase.forge':           { zh: 'Forge',          en: 'Forge' },
  'phase.echo':            { zh: 'Echo',           en: 'Echo' },
  'phase.ignition.full':   { zh: '⚡ IGNITION · 认知点火',   en: '⚡ IGNITION · Cognitive Ignition' },
  'phase.fable.full':      { zh: '📖 FABLE · 概念寓言',       en: '📖 FABLE · Concept Fable' },
  'phase.godview.full':    { zh: '🔭 GODVIEW · 上帝视角',     en: '🔭 GODVIEW · The Full Picture' },
  'phase.combat.full':     { zh: '⚔ COMBAT · 代码实战',      en: '⚔ COMBAT · Code Combat' },
  'phase.forge.full':      { zh: '🔨 FORGE · 锻造反思',      en: '🔨 FORGE · Reflection Forge' },
  'phase.echo.full':       { zh: '🔄 ECHO · 间隔回响',       en: '🔄 ECHO · Spaced Echo' },

  /* ── Phase Labels (short) ── */
  'phase.ignition.label':  { zh: '认知点火',         en: 'Ignition' },
  'phase.fable.label':     { zh: '概念寓言',         en: 'Fable' },
  'phase.godview.label':   { zh: '上帝视角',         en: 'God View' },
  'phase.combat.label':    { zh: '代码实战',         en: 'Combat' },
  'phase.forge.label':     { zh: '锻造反思',         en: 'Forge' },
  'phase.echo.label':      { zh: '间隔回响',         en: 'Echo' },

  /* ── Phase Buttons ── */
  'phase.done':            { zh: '✓ 已完成',            en: '✓ Done' },
  'phase.mark':            { zh: '☐ 确认完成此阶段',     en: '☐ Mark phase complete' },
  'phase.completed_toast': { zh: '✓ {{name}} 完成！',   en: '✓ {{name}} completed!' },

  /* ── Lesson Complete Button ── */
  'lesson.mark_done':      { zh: '☐ 标记为已完成',           en: '☐ Mark as completed' },
  'lesson.mark_undo':      { zh: '✅ 已完成 · 点击撤销',     en: '✅ Completed · Click to undo' },
  'lesson.next_hidden':    { zh: '(完成本课后解锁下一课)',    en: '(Complete this lesson to unlock the next)' },

  /* ── Confirmation Dialog ── */
  'confirm.title':         { zh: '确认完成？',              en: 'Confirm Completion?' },
  'confirm.body':          { zh: '你确定已经走完了 Ignition → Fable → GodView → Combat → Forge → Echo 六个阶段吗？',
                             en: 'Have you completed all six phases: Ignition → Fable → GodView → Combat → Forge → Echo?' },
  'confirm.cancel':        { zh: '取消',                    en: 'Cancel' },
  'confirm.ok':            { zh: '确认完成',                en: 'Confirm' },

  /* ── Celebrations ── */
  'celebrate.professional': { zh: '🔥 专业篇通关！生产级 Agent 技能已掌握。专家篇已解锁 →',
                              en: '🔥 Professional tier cleared! Production-grade Agent skills unlocked. Expert tier available →' },
  'celebrate.expert':       { zh: '🏆 专家篇通关！你已能设计生产级多 Agent 系统。',
                              en: '🏆 Expert tier cleared! You can now design production multi-agent systems.' },

  /* ── Dashboard ── */
  'dashboard.continue':    { zh: '继续学习',               en: 'Continue Learning' },
  'dashboard.start':       { zh: '开始学习',               en: 'Start Learning' },
  'dashboard.phase':       { zh: '继续 Phase {{n}}',       en: 'Continue Phase {{n}}' },
  'dashboard.all_done':    { zh: '全部内容',               en: 'All Content' },
  'dashboard.progress':    { zh: '总进度',                 en: 'Overall Progress' },
  'dashboard.streak':      { zh: '🔥 连续学习 {{n}} 天',   en: '🔥 {{n}}-day streak' },
  'dashboard.more_unlock': { zh: '再完成 <strong>{{n}}</strong> 课解锁 {{stage}}',
                             en: '<strong>{{n}}</strong> more lesson(s) to unlock {{stage}}' },
  'dashboard.view_progress': { zh: '查看学习进度',         en: 'View Progress' },

  /* ── Stage Names ── */
  'stage.foundation':      { zh: '基础篇',                 en: 'Foundation' },
  'stage.professional':    { zh: '专业篇',                 en: 'Professional' },
  'stage.expert':          { zh: '专家篇',                 en: 'Expert' },

  /* ── Pomodoro ── */
  'pomo.work':             { zh: '工作',                   en: 'Work' },
  'pomo.break':            { zh: '休息',                   en: 'Break' },
  'pomo.minutes':          { zh: '分钟',                   en: ' min' },
  'pomo.auto_start':       { zh: '自动开始',               en: 'Auto start' },
  'pomo.apply':            { zh: '应用',                   en: 'Apply' },
  'pomo.toggle':           { zh: '暂停/继续',              en: 'Pause/Resume' },
  'pomo.skip':             { zh: '跳过',                   en: 'Skip' },
  'pomo.settings':         { zh: '设置',                   en: 'Settings' },
  'pomo.toast_break':      { zh: '🍅 该休息了！站起来走动一下。', en: '🍅 Time for a break! Stand up and stretch.' },
  'pomo.toast_work':       { zh: '💪 休息结束，继续学习！',       en: '💪 Break over, back to learning!' },
  'pomo.toast_updated':    { zh: '⚙ 设置已更新',                en: '⚙ Settings updated' },

  /* ── Data Import/Export ── */
  'data.loaded':           { zh: '✅ 数据已加载',           en: '✅ Data loaded' },
  'data.format_error':     { zh: '❌ 文件格式错误',         en: '❌ Invalid file format' },
  'data.notes_placeholder':{ zh: '在这里记录你的学习心得、疑问、代码片段...',
                             en: 'Write your notes, questions, code snippets here...' },

  /* ── Index Page ── */
  'index.title':           { zh: 'LangGraph DeepForge — 从入门到精通', en: 'LangGraph DeepForge — From Zero to Production' },
  'index.hero_title':      { zh: '⚡ LangGraph DeepForge',  en: '⚡ LangGraph DeepForge' },
  'index.hero_subtitle':   { zh: '从入门到精通 · 游戏化学习 · 闯关式 Agent 工程训练',
                             en: 'Zero to Production · Gamified Learning · Stage-Gated Agent Engineering' },
  'index.six_phase_title': { zh: '🔥 六阶段深度学习引擎',   en: '🔥 Six-Phase Deep Learning Engine' },
  'index.six_phase_desc':  { zh: '融合 Amanda Askell 寓言教学 + MIT 元认知法 + 50分钟实战循环 + 间隔强化。',
                             en: 'Integrates Amanda Askell fable pedagogy + MIT metacognition + 50-min deliberate practice + spaced reinforcement.' },
  'index.skill_tree':      { zh: '🌳 技能树',               en: '🌳 Skill Tree' },
  'index.foundation_title':{ zh: '🟢 基础篇 — 构建你的第一个 Agent', en: '🟢 Foundation — Build Your First Agent' },
  'index.professional_title':{ zh: '🟡 专业篇 — 让 Agent 可靠运行', en: '🟡 Professional — Make Agents Reliable' },
  'index.expert_title':    { zh: '🔴 专家篇 — 多 Agent 与生产部署', en: '🔴 Expert — Multi-Agent & Production' },
  'index.env_check':       { zh: '✅ 环境检查',             en: '✅ Environment Check' },
  'index.env_python':      { zh: 'Python 3.12 + uv',        en: 'Python 3.12 + uv' },
  'index.env_langgraph':   { zh: 'langgraph / langchain',   en: 'langgraph / langchain' },
  'index.env_apikey':      { zh: 'LLM API Key',             en: 'LLM API Key' },
  'index.env_ready':       { zh: '✓ Ready',                 en: '✓ Ready' },
  'index.env_installed':   { zh: '✓ Installed',             en: '✓ Installed' },
  'index.env_configured':  { zh: '✓ Configured',            en: '✓ Configured' },
  'index.footer':          { zh: '课程设计：MIT 元认知 + 50min 实战循环 + 间隔强化 · 2026',
                             en: 'Design: MIT Metacognition + 50min Deliberate Practice + Spaced Repetition · 2026' },

  /* ── Lesson Titles ── */
  'lesson.L01.title':      { zh: 'State / Node / Edge',             en: 'State / Node / Edge' },
  'lesson.L02.title':      { zh: 'LLM 节点 + 条件边',               en: 'LLM Nodes + Conditional Edges' },
  'lesson.L03.title':      { zh: '工具调用（Tool Calling）',        en: 'Tool Calling' },
  'lesson.L04.title':      { zh: 'Agent 循环与路由',                en: 'Agent Loop & Routing' },
  'lesson.L05.title':      { zh: '记忆与持久化',                    en: 'Memory & Persistence' },
  'lesson.L06.title':      { zh: 'Human-in-the-Loop',               en: 'Human-in-the-Loop' },
  'lesson.L07.title':      { zh: '流式输出（Streaming）',           en: 'Streaming' },
  'lesson.L08.title':      { zh: '错误处理与调试',                  en: 'Error Handling & Debugging' },
  'lesson.L09.title':      { zh: '子图（Subgraphs）',              en: 'Subgraphs' },
  'lesson.L10.title':      { zh: '多 Agent 协作',                  en: 'Multi-Agent Collaboration' },
  'lesson.L11.title':      { zh: '并行与 Send API',                en: 'Parallelism & Send API' },
  'lesson.L12.title':      { zh: '生产部署',                       en: 'Production Deployment' },

  /* ── Lesson Descriptions (for skill tree) ── */
  'lesson.L01.desc':       { zh: '解锁图式编程思维',                en: 'Unlock graph-based programming thinking' },
  'lesson.L02.desc':       { zh: 'DeepSeek 接入 — 让 LLM 决定走哪条路', en: 'DeepSeek integration — let the LLM decide which path' },
  'lesson.L03.desc':       { zh: '让 Agent 调用外部工具',           en: 'Enable Agents to call external tools' },
  'lesson.L04.desc':       { zh: '构建完整的 Agent 决策循环',       en: 'Build a complete Agent decision loop' },
  'lesson.L05.desc':       { zh: '让 Agent 记住对话历史',           en: 'Give Agents persistent memory' },
  'lesson.L06.desc':       { zh: '在关键节点插入人工审批',          en: 'Insert human approval at critical nodes' },
  'lesson.L07.desc':       { zh: '四种流式模式选型',                en: 'Choose among 4 streaming modes' },
  'lesson.L08.desc':       { zh: '静默退出、递归限制与降级策略',    en: 'Silent exits, recursion limits & fallback strategies' },
  'lesson.L09.desc':       { zh: '隔离状态，父-子通信',             en: 'Isolated state, parent-child communication' },
  'lesson.L10.desc':       { zh: 'Supervisor + Swarm 模式',        en: 'Supervisor + Swarm patterns' },
  'lesson.L11.desc':       { zh: 'Map-Reduce 并行与动态扇出',      en: 'Map-Reduce parallelism & dynamic fan-out' },
  'lesson.L12.desc':       { zh: 'langgraph deploy 与 LangSmith',  en: 'langgraph deploy & LangSmith' },

  /* ── Boss Cards ── */
  'boss.foundation.name':  { zh: '👾 Boss：意图路由 + 工具调用综合 Agent',
                             en: '👾 Boss: Intent Router + Tool-Calling Agent' },
  'boss.foundation.desc':  { zh: '综合运用 L01-L04 所学，构建一个能理解用户意图、自主选择工具、动态路由的完整 Agent。',
                             en: 'Combine L01-L04 skills: build an Agent that understands user intent, selects tools autonomously, and routes dynamically.' },
  'boss.foundation.reward':{ zh: '🏆 通关：解锁专业篇',            en: '🏆 Clear: Unlock Professional Tier' },
  'boss.professional.name':{ zh: '👾 Boss：生产级客服 Agent',
                             en: '👾 Boss: Production-Grade Support Agent' },
  'boss.professional.desc':{ zh: '综合运用 L05-L08，构建带记忆、人工审核、流式输出和容错机制的生产级客服 Agent。',
                             en: 'Combine L05-L08: build a production support Agent with memory, human review, streaming, and fault tolerance.' },
  'boss.professional.reward':{ zh: '🏆 通关：解锁专家篇',          en: '🏆 Clear: Unlock Expert Tier' },
  'boss.final.name':       { zh: '👾 最终 Boss：多 Agent 协作系统',
                             en: '👾 Final Boss: Multi-Agent Collaboration System' },
  'boss.final.desc':       { zh: '综合运用 L09-L12，设计一个 Supervisor + 多 Worker Agent 的协作系统并部署到生产环境。',
                             en: 'Combine L09-L12: design a Supervisor + multi-Worker Agent system and deploy it to production.' },
  'boss.final.reward':     { zh: '🏆 通关：LangGraph 大师',        en: '🏆 Clear: LangGraph Master' },

  /* ── Learning Path ── */
  'path.title':            { zh: '🗺 LangGraph 学习路线图',        en: '🗺 LangGraph Learning Roadmap' },
  'path.milestone':        { zh: '里程碑',                         en: 'Milestone' },
  'path.status':           { zh: '状态',                           en: 'Status' },
  'path.completed':        { zh: '✅ 已完成',                      en: '✅ Completed' },
  'path.pending':          { zh: '⏳ 待完成',                      en: '⏳ Pending' },
  'path.locked':           { zh: '🔒 未解锁',                      en: '🔒 Locked' },
  'path.quick_links':      { zh: '快速链接',                       en: 'Quick Links' },
  'path.course_overview':  { zh: '🏠 课程总览',                    en: '🏠 Course Overview' },
  'path.course_overview_desc': { zh: '查看全部课程列表 + 六阶段引擎说明', en: 'View all lessons + six-phase engine overview' },
  'path.course_overview_when': { zh: '开始学习前、需要导航时',      en: 'Before starting, when you need navigation' },

  /* ── Fables ── */
  'fables.title':          { zh: '📖 LangGraph 概念寓言集',        en: '📖 LangGraph Concept Fables' },
  'fables.subtitle':       { zh: '用故事理解抽象概念',             en: 'Understanding abstract concepts through stories' },
  'fables.fable':          { zh: '寓言',                           en: 'Fable' },
  'fables.concept':        { zh: '对应概念',                       en: 'Concept' },
  'fables.of':             { zh: '共 12 篇',                      en: 'of 12' },

  /* ── Pitfalls ── */
  'pitfalls.title':        { zh: '⚠️ 避坑指南 — LangGraph 常见错误与调试',
                             en: '⚠️ Pitfall Guide — Common LangGraph Errors & Debugging' },
  'pitfalls.anti':         { zh: '反模式',                         en: 'Anti-Pattern' },
  'pitfalls.error_codes':  { zh: '错误码速查',                     en: 'Error Code Reference' },
  'pitfalls.silent_exit':  { zh: '静默退出原因',                   en: 'Silent Exit Causes' },
  'pitfalls.debug':        { zh: '调试策略',                       en: 'Debugging Strategies' },

  /* ── Meta Learning ── */
  'meta.title':            { zh: '🧠 元学习指南 — 如何高效学习 LangGraph',
                             en: '🧠 Meta-Learning Guide — How to Learn LangGraph Efficiently' },
  'meta.models':           { zh: '思维模型',                       en: 'Mental Models' },
  'meta.landscape':        { zh: '领域全貌',                       en: 'Domain Landscape' },
  'meta.blindspot':        { zh: '盲区测试',                       en: 'Blind Spot Test' },

  /* ── Interview Bank ── */
  'interview.title':       { zh: '🏔 LangGraph 面试题库 — 100 题金字塔',
                             en: '🏔 LangGraph Interview Bank — 100-Question Pyramid' },
  'interview.search':      { zh: '🔍 搜索题目...',                 en: '🔍 Search questions...' },
  'interview.layer':       { zh: '第 {{n}} 层',                    en: 'Layer {{n}}' },
  'interview.total':       { zh: '共 100 题',                     en: '100 questions' },
  'interview.hint':        { zh: '💡 提示',                       en: '💡 Hint' },
  'interview.links_to':    { zh: '📎 相关课程',                    en: '📎 Related Lessons' },
  'interview.view_answer': { zh: '查看答案 →',                     en: 'View Answer →' },

  /* ── Answer Bank ── */
  'answer.title':          { zh: '📖 LangGraph 面试答案库',
                             en: '📖 LangGraph Interview Answer Bank' },
  'answer.scoring':        { zh: '评分标准',                       en: 'Scoring Rubric' },
  'answer.level_junior':   { zh: '初级',                           en: 'Junior' },
  'answer.level_mid':      { zh: '中级',                           en: 'Mid-Level' },
  'answer.level_senior':   { zh: '高级',                           en: 'Senior' },
  'answer.level_expert':   { zh: '专家',                           en: 'Expert' },
  'answer.code_example':   { zh: '代码示例',                       en: 'Code Example' },
  'answer.key_points':     { zh: '要点',                           en: 'Key Points' },
  'answer.back_to_bank':   { zh: '← 返回题库',                     en: '← Back to Question Bank' },

  /* ── Phase Descriptions ── */
  'phase.ignition.desc':   { zh: '课前预热：一个故意设错的代码片段、一个无法用现有知识解决的问题。制造认知失调，激发学习欲望。',
                             en: 'Pre-class warmup: a deliberately broken code snippet, a problem unsolvable with current knowledge. Creates cognitive dissonance to spark learning desire.' },
  'phase.fable.desc':      { zh: '用一个生动的寓言故事解释核心概念。在接触技术细节之前，先建立直觉理解。',
                             en: 'Explain the core concept through a vivid fable. Build intuitive understanding before touching technical details.' },
  'phase.godview.desc':    { zh: '俯瞰全貌：架构图、API 速览表、最佳实践清单。把 Zoom In 之前的全景地图给你。',
                             en: 'The full picture: architecture diagram, API overview, best-practice checklist. The panoramic map before you zoom in.' },
  'phase.combat.desc':     { zh: '核心实战环节：跟着写代码、跑示例、改 bug。从 copy-paste 到独立编写的 30 分钟刻意练习。',
                             en: 'Core hands-on session: follow along with code, run examples, fix bugs. 30 minutes of deliberate practice from copy-paste to independent coding.' },
  'phase.forge.desc':      { zh: '锻造反思：回答 3 个深度问题，记录学习笔记，用自己的话复述关键概念。费曼技巧的应用。',
                             en: 'Reflection forge: answer 3 deep questions, write learning notes, restate key concepts in your own words. Applying the Feynman Technique.' },
  'phase.echo.desc':       { zh: '下次课前的回响：复习上次笔记，做一道相关面试题，保持神经回路的活跃。间隔强化的关键。',
                             en: 'Echo before the next lesson: review last notes, solve one related interview question, keep neural pathways active. The key to spaced repetition.' },

  /* ── Misc ── */
  'misc.home':             { zh: '课程总览',                       en: 'Course Overview' },
  'misc.next_lesson':      { zh: '下一课 →',                       en: 'Next Lesson →' },
  'misc.back':             { zh: '← 返回',                         en: '← Back' },
  'misc.loading':          { zh: '加载中...',                      en: 'Loading...' },
  'misc.none':             { zh: '无',                             en: 'None' },
  'misc.days':             { zh: '天',                             en: 'd' },
};

/* Also expose as a global for the I18N module to detect */
window.__I18N_READY = true;
