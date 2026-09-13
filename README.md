# AI News Radar

基于 Horizon 的新闻雷达，每周生成科技、财经、时政、艺术新闻简报。

- 前端：Vite + Vue 3 + Tailwind CSS
- 后端：Horizon（多源抓取 + AI 打分 + 简报生成）
- 部署：GitHub Pages

🙏 此致感谢
---

## 📁 目录结构
```text
Ai-news-radar/
│
├── .github/
│   └── workflows/
│       └── weekly-summary.yml         # GitHub Actions 工作流（跑 Horizon + 构建 + 部署）
│
├── data/                              # Horizon 的配置和数据
│   ├── config.github.json             # 主配置（源、AI、分组、webhook）
│   └── config.json                    # 本地运行时用（由 workflow 复制）
│
├── docs/                              # 前端项目（Vite + Vue 3）
│   ├── public/
│   │   ├── assets/
│   │   │   └── data/                  # 构建时生成（JSON / feed.xml，不进 git）
│   │   ├── data/
│   │   │   └── raw/                   # Horizon 生成的简报 md（输入源）
│   │   └── favicon.svg                # 网站图标
│   ├── scripts/
│   │   ├── md-to-json.mjs             # md → JSON（前端读的卡片数据）
│   │   └── md-to-rss.mjs              # md → feed.xml（RSS 订阅源）
│   ├── src/
│   │   ├── App.vue                    # 前端主页面
│   │   ├── main.js                    # 入口
│   │   └── style.css                  # 全局样式
│   ├── index.html                     # HTML 模板
│   ├── package.json                   # 前端依赖
│   ├── postcss.config.js              # PostCSS 配置
│   ├── tailwind.config.js             # Tailwind 配置
│   └── vite.config.js                 # Vite 配置
│
├── profiles/                          # Horizon 的打分规则
│   ├── tech-news/                     # 科技新闻打分规则
│   ├── tech-blog/                     # 科技博客打分规则
│   ├── finance-news/                  # 财经新闻打分规则
│   ├── politics/                      # 时政观察打分规则
│   └── art-news/                      # 艺术新闻打分规则
│
├── src/                               # Horizon 源码（Python）
│   ├── ai/                            # AI 调用、打分、富化
│   ├── scrapers/                      # 各源抓取器（RSS、HN、Reddit...）
│   ├── processing/                    # 内容处理和分类
│   ├── storage/                       # 文件读写
│   ├── services/                      # 邮件、Webhook
│   ├── orchestrator.py                # 主流程编排
│   └── main.py                        # CLI 入口
│
├── tests/                             # Horizon 单元测试
├── .gitignore                         # Git 忽略规则
├── pyproject.toml                     # Python 依赖
├── uv.lock                            # 依赖锁定
└── README.md
```

