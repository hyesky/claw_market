const AGENT_FILE_MAP = {
  '前端开发者': 'engineering/engineering-frontend-developer.md',
  '后端架构师': 'engineering/engineering-backend-architect.md',
  'AI 工程师': 'engineering/engineering-ai-engineer.md',
  'DevOps 自动化师': 'engineering/engineering-devops-automator.md',
  '安全工程师': 'engineering/engineering-security-engineer.md',
  'UI 设计师': 'design/design-ui-designer.md',
  'UX 研究员': 'design/design-ux-researcher.md',
  'UX 架构师': 'design/design-ux-architect.md',
  '品牌守护者': 'design/design-brand-guardian.md',
  '图像提示词工程师': 'design/design-image-prompt-engineer.md',
  '视觉叙事师': 'design/design-visual-storyteller.md',
  '趣味注入师': 'design/design-whimsy-injector.md',
  '包容性视觉专家': 'design/design-inclusive-visuals-specialist.md',
  '小红书运营专家': 'marketing/marketing-xiaohongshu-operator.md',
  '抖音策略师': 'marketing/marketing-douyin-strategist.md',
  '微信公众号运营': 'marketing/marketing-wechat-official-account.md',
  'B站内容策略师': 'marketing/marketing-bilibili-strategist.md',
  '快手策略师': 'marketing/marketing-kuaishou-strategist.md',
  '中国电商运营专家': 'marketing/marketing-china-ecommerce-operator.md',
  '电商运营师': 'marketing/marketing-ecommerce-operator.md',
  '百度 SEO 专家': 'marketing/marketing-baidu-seo-specialist.md',
  '私域流量运营师': 'marketing/marketing-private-domain-operator.md',
  '直播电商主播教练': 'marketing/marketing-livestream-commerce-coach.md',
  '跨境电商运营专家': 'marketing/marketing-cross-border-ecommerce.md',
  '短视频剪辑指导师': 'marketing/marketing-short-video-editing-coach.md',
  '微博运营策略师': 'marketing/marketing-weibo-strategist.md',
  '播客内容策略师': 'marketing/marketing-podcast-strategist.md',
  '微信视频号运营策略师': 'marketing/marketing-weixin-channels-strategist.md',
  '知识付费产品策划师': 'marketing/marketing-knowledge-commerce-strategist.md',
  '中国市场本地化策略师': 'marketing/marketing-china-market-localization-strategist.md',
  '新闻情报官': 'marketing/marketing-daily-news-briefing.md',
  '小红书专家': 'marketing/marketing-xiaohongshu-specialist.md',
  '微信公众号管理': 'marketing/marketing-wechat-operator.md',
  '知乎策略师': 'marketing/marketing-zhihu-strategist.md',
  'TikTok 策略师': 'marketing/marketing-tiktok-strategist.md',
  'Twitter 互动官': 'marketing/marketing-twitter-engager.md',
  'Instagram 策展师': 'marketing/marketing-instagram-curator.md',
  'Reddit 社区运营': 'marketing/marketing-reddit-community-builder.md',
  '应用商店优化师': 'marketing/marketing-app-store-optimizer.md',
  '视频优化专家': 'marketing/marketing-video-optimization-specialist.md',
  '增长黑客': 'marketing/marketing-growth-hacker.md',
  '内容创作者': 'marketing/marketing-content-creator.md',
  '社交媒体策略师': 'marketing/marketing-social-media-strategist.md',
  'SEO 专家': 'marketing/marketing-seo-specialist.md',
  '轮播图增长引擎': 'marketing/marketing-carousel-growth-engine.md',
  'LinkedIn 内容创作专家': 'marketing/marketing-linkedin-content-creator.md',
  '图书联合作者': 'marketing/marketing-book-co-author.md',
  '智能搜索优化师': 'marketing/marketing-agentic-search-optimizer.md',
  'AI 引文策略师': 'marketing/marketing-ai-citation-strategist.md',
  '付费媒体审计师': 'paid-media/paid-media-auditor.md',
  '广告创意策略师': 'paid-media/paid-media-creative-strategist.md',
  '社交广告策略师': 'paid-media/paid-media-paid-social-strategist.md',
  'PPC 竞价策略师': 'paid-media/paid-media-ppc-strategist.md',
  '程序化广告采买专家': 'paid-media/paid-media-programmatic-buyer.md',
  '搜索词分析师': 'paid-media/paid-media-search-query-analyst.md',
  '追踪与归因专家': 'paid-media/paid-media-tracking-specialist.md',
  '客户拓展策略师': 'sales/sales-account-strategist.md',
  '销售教练': 'sales/sales-coach.md',
  '赢单策略师': 'sales/sales-deal-strategist.md',
  'Discovery 教练': 'sales/sales-discovery-coach.md',
  '售前工程师': 'sales/sales-engineer.md',
  'Outbound 策略师': 'sales/sales-outbound-strategist.md',
  'Pipeline 分析师': 'sales/sales-pipeline-analyst.md',
  '投标策略师': 'sales/sales-proposal-strategist.md',
  '簿记与财务总监': 'finance/finance-bookkeeper-controller.md',
  '财务分析师': 'finance/finance-financial-analyst.md',
  '财务预测分析师': 'finance/finance-financial-forecaster.md',
  'FP&A 分析师': 'finance/finance-fpa-analyst.md',
  '金融风控分析师': 'finance/finance-fraud-detector.md',
  '投资研究员': 'finance/finance-investment-researcher.md',
  '发票管理专家': 'finance/finance-invoice-manager.md',
  '税务策略师': 'finance/finance-tax-strategist.md',
  '招聘专家': 'specialized/recruitment-specialist.md',
  '绩效管理专家': 'hr/hr-performance-reviewer.md',
  '合同审查专家': 'legal/legal-contract-reviewer.md',
  '制度文件撰写专家': 'legal/legal-policy-writer.md',
  '库存预测专家': 'supply-chain/supply-chain-inventory-forecaster.md',
  '供应商评估专家': 'supply-chain/supply-chain-vendor-evaluator.md',
  '物流路线优化师': 'supply-chain/supply-chain-route-optimizer.md',
  '供应链采购策略师': 'supply-chain/supply-chain-strategist.md',
  'Sprint 排序师': 'product/product-sprint-prioritizer.md',
  '趋势研究员': 'product/product-trend-researcher.md',
  '反馈分析师': 'product/product-feedback-synthesizer.md',
  '行为助推引擎': 'product/product-behavioral-nudge-engine.md',
  '产品经理': 'product/product-manager.md',
  '高级项目经理': 'project-management/project-manager-senior.md',
  '项目牧羊人': 'project-management/project-management-project-shepherd.md',
  '实验追踪员': 'project-management/project-management-experiment-tracker.md',
  '工作室制片人': 'project-management/project-management-studio-producer.md',
  '工作室运营': 'project-management/project-management-studio-operations.md',
  'Jira 工作流管家': 'project-management/project-management-jira-workflow-steward.md',
  '证据收集者': 'testing/testing-evidence-collector.md',
  '现实检验者': 'testing/testing-reality-checker.md',
  'API 测试员': 'testing/testing-api-tester.md',
  '性能基准师': 'testing/testing-performance-benchmarker.md',
  '无障碍审核员': 'testing/testing-accessibility-auditor.md',
  '测试结果分析师': 'testing/testing-test-results-analyzer.md',
  '工具评估师': 'testing/testing-tool-evaluator.md',
  '工作流优化师': 'testing/testing-workflow-optimizer.md',
  '嵌入式测试工程师': 'testing/testing-embedded-qa-engineer.md',
  '客服响应者': 'support/support-support-responder.md',
  '数据分析师': 'support/support-analytics-reporter.md',
  '法务合规员': 'support/support-legal-compliance-checker.md',
  '高管摘要师': 'support/support-executive-summary-generator.md',
  '财务追踪员': 'support/support-finance-tracker.md',
  '基础设施运维师': 'support/support-infrastructure-maintainer.md',
  '招聘运营专家': 'support/support-recruitment-specialist.md',
  '智能体编排者': 'specialized/agents-orchestrator.md',
  '提示词工程师': 'specialized/prompt-engineer.md',
  '身份信任架构师': 'specialized/agentic-identity-trust.md',
  '数据整合师': 'specialized/data-consolidation-agent.md',
  'LSP 索引工程师': 'specialized/lsp-index-engineer.md',
  '报告分发师': 'specialized/report-distribution-agent.md',
  '销售数据提取师': 'specialized/sales-data-extraction-agent.md',
  '合规审计师': 'specialized/compliance-auditor.md',
  '应付账款智能体': 'specialized/accounts-payable-agent.md',
  '身份图谱操作员': 'specialized/identity-graph-operator.md',
  '文化智能策略师': 'specialized/specialized-cultural-intelligence-strategist.md',
  '开发者布道师': 'specialized/specialized-developer-advocate.md',
  '模型 QA 专家': 'specialized/specialized-model-qa.md',
  'ZK 管家': 'specialized/zk-steward.md',
  '区块链安全审计师': 'specialized/blockchain-security-auditor.md',
  '留学规划顾问': 'specialized/study-abroad-advisor.md',
  '政务数字化售前顾问': 'specialized/government-digital-presales-consultant.md',
  '企业培训课程设计师': 'specialized/corporate-training-designer.md',
  'MCP 构建器': 'specialized/specialized-mcp-builder.md',
  '文档生成器': 'specialized/specialized-document-generator.md',
  '工作流架构师': 'specialized/specialized-workflow-architect.md',
  '自动化治理架构师': 'specialized/automation-governance-architect.md',
  'Salesforce 架构师': 'specialized/specialized-salesforce-architect.md',
  '医疗健康营销合规师': 'specialized/healthcare-marketing-compliance.md',
  '高考志愿填报顾问': 'specialized/gaokao-college-advisor.md',
  '动态定价策略师': 'specialized/specialized-pricing-optimizer.md',
  'AI 治理政策专家': 'specialized/specialized-ai-policy-writer.md',
  '企业风险评估师': 'specialized/specialized-risk-assessor.md',
  '会议效率专家': 'specialized/specialized-meeting-assistant.md',
  '土木工程师': 'specialized/specialized-civil-engineer.md',
  '法国咨询市场专家': 'specialized/specialized-french-consulting-market.md',
  '韩国商务专家': 'specialized/specialized-korean-business-navigator.md',
  '技术翻译专家': 'specialized/technical-translator-agent.md',
  '医疗客服专家': 'specialized/healthcare-customer-service.md',
  '酒店宾客服务专家': 'specialized/hospitality-guest-services.md',
  'HR 入职管理专家': 'specialized/hr-onboarding.md',
  '语言翻译专家': 'specialized/language-translator.md',
  '律所计费与工时专家': 'specialized/legal-billing-time-tracking.md',
  '律所客户接案专家': 'specialized/legal-client-intake.md',
  '法律文书审查专家': 'specialized/legal-document-review.md',
  '信贷经理助手': 'specialized/loan-officer-assistant.md',
  '房地产经纪助手': 'specialized/real-estate-buyer-seller.md',
  '零售退货专家': 'specialized/retail-customer-returns.md',
  '幕僚长': 'specialized/specialized-chief-of-staff.md',
  'visionOS 空间工程师': 'spatial-computing/visionos-spatial-engineer.md',
  'macOS Metal 空间工程师': 'spatial-computing/macos-spatial-metal-engineer.md',
  'XR 界面架构师': 'spatial-computing/xr-interface-architect.md',
  'XR 沉浸式开发者': 'spatial-computing/xr-immersive-developer.md',
  'XR 座舱交互专家': 'spatial-computing/xr-cockpit-interaction-specialist.md',
  '终端集成专家': 'spatial-computing/terminal-integration-specialist.md',
  '游戏设计师': 'game-development/game-designer.md',
  '关卡设计师': 'game-development/level-designer.md',
  '叙事设计师': 'game-development/narrative-designer.md',
  '技术美术': 'game-development/technical-artist.md',
  '游戏音频工程师': 'game-development/game-audio-engineer.md',
  'Unity 架构师': 'game-development/unity/unity-architect.md',
  'Unity 编辑器工具开发者': 'game-development/unity/unity-editor-tool-developer.md',
  'Unity 多人游戏工程师': 'game-development/unity/unity-multiplayer-engineer.md',
  'Unity Shader Graph 美术师': 'game-development/unity/unity-shader-graph-artist.md',
  'Unreal 多人游戏架构师': 'game-development/unreal-engine/unreal-multiplayer-architect.md',
  'Unreal 系统工程师': 'game-development/unreal-engine/unreal-systems-engineer.md',
  'Unreal 技术美术': 'game-development/unreal-engine/unreal-technical-artist.md',
  'Unreal 世界构建师': 'game-development/unreal-engine/unreal-world-builder.md',
  'Blender 插件工程师': 'game-development/blender/blender-addon-engineer.md',
  'Godot 游戏脚本开发者': 'game-development/godot/godot-gameplay-scripter.md',
  'Godot 多人游戏工程师': 'game-development/godot/godot-multiplayer-engineer.md',
  'Godot Shader 开发者': 'game-development/godot/godot-shader-developer.md',
  'Roblox 虚拟形象创作者': 'game-development/roblox-studio/roblox-avatar-creator.md',
  'Roblox 体验设计师': 'game-development/roblox-studio/roblox-experience-designer.md',
  'Roblox 系统脚本工程师': 'game-development/roblox-studio/roblox-systems-scripter.md',
  '人类学家': 'academic/academic-anthropologist.md',
  '地理学家': 'academic/academic-geographer.md',
  '历史学家': 'academic/academic-historian.md',
  '叙事学家': 'academic/academic-narratologist.md',
  '心理学家': 'academic/academic-psychologist.md',
  '学习规划师': 'academic/academic-study-planner.md',
};

// 智能体头像映射
const AGENT_AVATAR_MAP = {
  '前端开发者': '/profiles/cowork.jpg',
  '后端架构师': '/profiles/excel-creator.jpg',
  'AI 工程师': '/profiles/pitch-deck-creator.jpg',
  'DevOps 自动化师': '/profiles/openclaw-setup.jpg',
  '安全工程师': '/profiles/star-office-helper.jpg',
  'UI 设计师': '/profiles/academic-paper.jpg',
  'UX 研究员': '/profiles/ui-ux-pro-max.jpg',
  'UX 架构师': '/profiles/cowork.jpg',
  '品牌守护者': '/profiles/human-3-coach.jpg',
  '图像提示词工程师': '/profiles/planning-with-files.jpg',
  '视觉叙事师': '/profiles/ppt-creator.jpg',
  '趣味注入师': '/profiles/cowork.jpg',
  '包容性视觉专家': '/profiles/planning-with-files.jpg',
  '小红书运营专家': '/profiles/financial-model-creator.jpg',
  '抖音策略师': '/profiles/pitch-deck-creator.jpg',
  '微信公众号运营': '/profiles/ppt-creator.jpg',
  'B站内容策略师': '/profiles/excel-creator.jpg',
  '快手策略师': '/profiles/academic-paper.jpg',
  '中国电商运营专家': '/profiles/word-creator.jpg',
  '电商运营师': '/profiles/planning-with-files.jpg',
  '百度 SEO 专家': '/profiles/academic-paper.jpg',
  '私域流量运营师': '/profiles/human-3-coach.jpg',
  '直播电商主播教练': '/profiles/morph-ppt.jpg',
  '跨境电商运营专家': '/profiles/morph-ppt-3d.jpg',
  '短视频剪辑指导师': '/profiles/openclaw-setup.jpg',
  '微博运营策略师': '/profiles/openclaw-setup.jpg',
  '播客内容策略师': '/profiles/social-job-publisher.jpg',
  '微信视频号运营策略师': '/profiles/ui-ux-pro-max.jpg',
  '知识付费产品策划师': '/profiles/social-job-publisher.jpg',
  '中国市场本地化策略师': '/profiles/social-job-publisher.jpg',
  '新闻情报官': '/profiles/pitch-deck-creator.jpg',
  '小红书专家': '/profiles/moltbook.jpg',
  '微信公众号管理': '/profiles/morph-ppt-3d.jpg',
  '知乎策略师': '/profiles/morph-ppt-3d.jpg',
  'TikTok 策略师': '/profiles/dashboard-creator.jpg',
  'Twitter 互动官': '/profiles/pitch-deck-creator.jpg',
  'Instagram 策展师': '/profiles/star-office-helper.jpg',
  'Reddit 社区运营': '/profiles/morph-ppt-3d.jpg',
  '应用商店优化师': '/profiles/academic-paper.jpg',
  '视频优化专家': '/profiles/ui-ux-pro-max.jpg',
  '增长黑客': '/profiles/financial-model-creator.jpg',
  '内容创作者': '/profiles/planning-with-files.jpg',
  '社交媒体策略师': '/profiles/story-roleplay.jpg',
  'SEO 专家': '/profiles/social-job-publisher.jpg',
  '轮播图增长引擎': '/profiles/cowork.jpg',
  'LinkedIn 内容创作专家': '/profiles/openclaw-setup.jpg',
  '图书联合作者': '/profiles/academic-paper.jpg',
  '智能搜索优化师': '/profiles/game-3d.jpg',
  'AI 引文策略师': '/profiles/ppt-creator.jpg',
  '付费媒体审计师': '/profiles/excel-creator.jpg',
  '广告创意策略师': '/profiles/word-creator.jpg',
  '社交广告策略师': '/profiles/excel-creator.jpg',
  'PPC 竞价策略师': '/profiles/word-creator.jpg',
  '程序化广告采买专家': '/profiles/moltbook.jpg',
  '搜索词分析师': '/profiles/planning-with-files.jpg',
  '追踪与归因专家': '/profiles/social-job-publisher.jpg',
  '客户拓展策略师': '/profiles/ui-ux-pro-max.jpg',
  '销售教练': '/profiles/financial-model-creator.jpg',
  '赢单策略师': '/profiles/moltbook.jpg',
  'Discovery 教练': '/profiles/story-roleplay.jpg',
  '售前工程师': '/profiles/financial-model-creator.jpg',
  'Outbound 策略师': '/profiles/morph-ppt-3d.jpg',
  'Pipeline 分析师': '/profiles/dashboard-creator.jpg',
  '投标策略师': '/profiles/ppt-creator.jpg',
  '簿记与财务总监': '/profiles/excel-creator.jpg',
  '财务分析师': '/profiles/cowork.jpg',
  '财务预测分析师': '/profiles/star-office-helper.jpg',
  'FP&A 分析师': '/profiles/cowork.jpg',
  '金融风控分析师': '/profiles/word-creator.jpg',
  '投资研究员': '/profiles/planning-with-files.jpg',
  '发票管理专家': '/profiles/pitch-deck-creator.jpg',
  '税务策略师': '/profiles/financial-model-creator.jpg',
  '招聘专家': '/profiles/planning-with-files.jpg',
  '绩效管理专家': '/profiles/pitch-deck-creator.jpg',
  '合同审查专家': '/profiles/dashboard-creator.jpg',
  '制度文件撰写专家': '/profiles/cowork.jpg',
  '库存预测专家': '/profiles/excel-creator.jpg',
  '供应商评估专家': '/profiles/planning-with-files.jpg',
  '物流路线优化师': '/profiles/dashboard-creator.jpg',
  '供应链采购策略师': '/profiles/game-3d.jpg',
  'Sprint 排序师': '/profiles/morph-ppt-3d.jpg',
  '趋势研究员': '/profiles/star-office-helper.jpg',
  '反馈分析师': '/profiles/story-roleplay.jpg',
  '行为助推引擎': '/profiles/dashboard-creator.jpg',
  '产品经理': '/profiles/human-3-coach.jpg',
  '高级项目经理': '/profiles/star-office-helper.jpg',
  '项目牧羊人': '/profiles/cowork.jpg',
  '实验追踪员': '/profiles/ppt-creator.jpg',
  '工作室制片人': '/profiles/academic-paper.jpg',
  '工作室运营': '/profiles/word-creator.jpg',
  'Jira 工作流管家': '/profiles/moltbook.jpg',
  '证据收集者': '/profiles/word-creator.jpg',
  '现实检验者': '/profiles/dashboard-creator.jpg',
  'API 测试员': '/profiles/planning-with-files.jpg',
  '性能基准师': '/profiles/moltbook.jpg',
  '无障碍审核员': '/profiles/planning-with-files.jpg',
  '测试结果分析师': '/profiles/planning-with-files.jpg',
  '工具评估师': '/profiles/human-3-coach.jpg',
  '工作流优化师': '/profiles/word-creator.jpg',
  '嵌入式测试工程师': '/profiles/human-3-coach.jpg',
  '客服响应者': '/profiles/openclaw-setup.jpg',
  '数据分析师': '/profiles/story-roleplay.jpg',
  '法务合规员': '/profiles/game-3d.jpg',
  '高管摘要师': '/profiles/human-3-coach.jpg',
  '财务追踪员': '/profiles/word-creator.jpg',
  '基础设施运维师': '/profiles/game-3d.jpg',
  '招聘运营专家': '/profiles/openclaw-setup.jpg',
  '智能体编排者': '/profiles/morph-ppt-3d.jpg',
  '提示词工程师': '/profiles/morph-ppt.jpg',
  '身份信任架构师': '/profiles/beautiful-mermaid.jpg',
  '数据整合师': '/profiles/cowork.jpg',
  'LSP 索引工程师': '/profiles/ui-ux-pro-max.jpg',
  '报告分发师': '/profiles/openclaw-setup.jpg',
  '销售数据提取师': '/profiles/beautiful-mermaid.jpg',
  '合规审计师': '/profiles/human-3-coach.jpg',
  '应付账款智能体': '/profiles/star-office-helper.jpg',
  '身份图谱操作员': '/profiles/ppt-creator.jpg',
  '文化智能策略师': '/profiles/dashboard-creator.jpg',
  '开发者布道师': '/profiles/pitch-deck-creator.jpg',
  '模型 QA 专家': '/profiles/word-creator.jpg',
  'ZK 管家': '/profiles/word-creator.jpg',
  '区块链安全审计师': '/profiles/moltbook.jpg',
  '留学规划顾问': '/profiles/ppt-creator.jpg',
  '政务数字化售前顾问': '/profiles/word-creator.jpg',
  '企业培训课程设计师': '/profiles/social-job-publisher.jpg',
  'MCP 构建器': '/profiles/story-roleplay.jpg',
  '文档生成器': '/profiles/word-creator.jpg',
  '工作流架构师': '/profiles/ppt-creator.jpg',
  '自动化治理架构师': '/profiles/excel-creator.jpg',
  'Salesforce 架构师': '/profiles/academic-paper.jpg',
  '医疗健康营销合规师': '/profiles/morph-ppt-3d.jpg',
  '高考志愿填报顾问': '/profiles/ui-ux-pro-max.jpg',
  '动态定价策略师': '/profiles/social-job-publisher.jpg',
  'AI 治理政策专家': '/profiles/word-creator.jpg',
  '企业风险评估师': '/profiles/word-creator.jpg',
  '会议效率专家': '/profiles/excel-creator.jpg',
  '土木工程师': '/profiles/beautiful-mermaid.jpg',
  '法国咨询市场专家': '/profiles/moltbook.jpg',
  '韩国商务专家': '/profiles/social-job-publisher.jpg',
  '招聘专家': '/profiles/game-3d.jpg',
  '技术翻译专家': '/profiles/beautiful-mermaid.jpg',
  '医疗客服专家': '/profiles/excel-creator.jpg',
  '酒店宾客服务专家': '/profiles/cowork.jpg',
  'HR 入职管理专家': '/profiles/dashboard-creator.jpg',
  '语言翻译专家': '/profiles/ui-ux-pro-max.jpg',
  '律所计费与工时专家': '/profiles/social-job-publisher.jpg',
  '律所客户接案专家': '/profiles/cowork.jpg',
  '法律文书审查专家': '/profiles/planning-with-files.jpg',
  '信贷经理助手': '/profiles/excel-creator.jpg',
  '房地产经纪助手': '/profiles/ui-ux-pro-max.jpg',
  '零售退货专家': '/profiles/planning-with-files.jpg',
  '幕僚长': '/profiles/academic-paper.jpg',
  'visionOS 空间工程师': '/profiles/word-creator.jpg',
  'macOS Metal 空间工程师': '/profiles/social-job-publisher.jpg',
  'XR 界面架构师': '/profiles/story-roleplay.jpg',
  'XR 沉浸式开发者': '/profiles/social-job-publisher.jpg',
  'XR 座舱交互专家': '/profiles/word-creator.jpg',
  '终端集成专家': '/profiles/pitch-deck-creator.jpg',
  '游戏设计师': '/profiles/openclaw-setup.jpg',
  '关卡设计师': '/profiles/excel-creator.jpg',
  '叙事设计师': '/profiles/excel-creator.jpg',
  '技术美术': '/profiles/openclaw-setup.jpg',
  '游戏音频工程师': '/profiles/openclaw-setup.jpg',
  'Unity 架构师': '/profiles/ppt-creator.jpg',
  'Unity 编辑器工具开发者': '/profiles/openclaw-setup.jpg',
  'Unity 多人游戏工程师': '/profiles/human-3-coach.jpg',
  'Unity Shader Graph 美术师': '/profiles/star-office-helper.jpg',
  'Unreal 多人游戏架构师': '/profiles/beautiful-mermaid.jpg',
  'Unreal 系统工程师': '/profiles/story-roleplay.jpg',
  'Unreal 技术美术': '/profiles/star-office-helper.jpg',
  'Unreal 世界构建师': '/profiles/story-roleplay.jpg',
  'Blender 插件工程师': '/profiles/human-3-coach.jpg',
  'Godot 游戏脚本开发者': '/profiles/pitch-deck-creator.jpg',
  'Godot 多人游戏工程师': '/profiles/financial-model-creator.jpg',
  'Godot Shader 开发者': '/profiles/human-3-coach.jpg',
  'Roblox 虚拟形象创作者': '/profiles/pitch-deck-creator.jpg',
  'Roblox 体验设计师': '/profiles/human-3-coach.jpg',
  'Roblox 系统脚本工程师': '/profiles/star-office-helper.jpg',
  '人类学家': '/profiles/morph-ppt.jpg',
  '地理学家': '/profiles/pitch-deck-creator.jpg',
  '历史学家': '/profiles/cowork.jpg',
  '叙事学家': '/profiles/excel-creator.jpg',
  '心理学家': '/profiles/ui-ux-pro-max.jpg',
  '学习规划师': '/profiles/pitch-deck-creator.jpg',
}

const DEPTS = [
{id:'engineering',icon:'🛠️',name:'工程部',desc:'构建未来',agents:[
{name:'前端开发者',d:'精通 React/Vue/Angular 的前端工程专家',src:'翻译',avatar:'/profiles/dashboard-creator.jpg'},
{name:'后端架构师',d:'精通可扩展系统设计',src:'翻译',avatar:'/profiles/word-creator.jpg'},
{name:'AI 工程师',d:'精通机器学习模型开发',src:'翻译',avatar:'/profiles/pitch-deck-creator.jpg'},
{name:'DevOps 自动化师',d:'精通 CI/CD 流水线',src:'翻译',avatar:'/profiles/planning-with-files.jpg'},
{name:'安全工程师',d:'专注威胁建模和安全架构',src:'翻译',avatar:'/profiles/game-3d.jpg'}
]},
{id:'design',icon:'🎨',name:'设计部',desc:'让产品好看好用',agents:[
{name:'UI 设计师',d:'精通视觉设计系统',src:'翻译',avatar:'/profiles/ppt-creator.jpg'},
{name:'UX 研究员',d:'专精用户行为分析',src:'翻译',avatar:'/profiles/game-3d.jpg'},
{name:'UX 架构师',d:'技术架构与 UX 专家',src:'翻译',avatar:'/profiles/academic-paper.jpg'},
{name:'品牌守护者',d:'品牌形象开发和维护',src:'翻译',avatar:'/profiles/game-3d.jpg'},
{name:'图像提示词工程师',d:'精通摄影美学和 AI 图像生成',src:'翻译',avatar:'/profiles/word-creator.jpg'},
{name:'视觉叙事师',d:'把复杂信息转化成视觉故事',src:'翻译',avatar:'/profiles/openclaw-setup.jpg'},
{name:'趣味注入师',d:'给品牌体验注入个性',src:'翻译',avatar:'/profiles/dashboard-creator.jpg'},
{name:'包容性视觉专家',d:'消除 AI 生成图像的偏见',src:'翻译',avatar:'/profiles/beautiful-mermaid.jpg'}
]},
{id:'marketing',icon:'📢',name:'营销部',desc:'一个真实互动一个粉丝地增长',agents:[
{name:'小红书运营专家',d:'种草笔记创作',src:'原创',avatar:'/profiles/star-office-helper.jpg'},
{name:'抖音策略师',d:'短视频策划',src:'原创',avatar:'/profiles/star-office-helper.jpg'},
{name:'微信公众号运营',d:'公众号内容策略',src:'原创',avatar:'/profiles/morph-ppt-3d.jpg'},
{name:'B站内容策略师',d:'UP主运营',src:'原创',avatar:'/profiles/word-creator.jpg'},
{name:'快手策略师',d:'下沉市场用户运营',src:'原创',avatar:'/profiles/cowork.jpg'},
{name:'中国电商运营专家',d:'淘宝天猫京东运营',src:'原创',avatar:'/profiles/planning-with-files.jpg'},
{name:'电商运营师',d:'直播带货大促运营',src:'原创',avatar:'/profiles/morph-ppt-3d.jpg'},
{name:'百度 SEO 专家',d:'百度搜索生态优化',src:'原创',avatar:'/profiles/beautiful-mermaid.jpg'},
{name:'私域流量运营师',d:'企微 SCRM 运营',src:'原创',avatar:'/profiles/morph-ppt.jpg'},
{name:'直播电商主播教练',d:'直播话术选品',src:'原创',avatar:'/profiles/moltbook.jpg'},
{name:'跨境电商运营专家',d:'Amazon 平台运营',src:'原创',avatar:'/profiles/pitch-deck-creator.jpg'},
{name:'短视频剪辑指导师',d:'剪映 PR 技术指导',src:'原创',avatar:'/profiles/morph-ppt-3d.jpg'},
{name:'微博运营策略师',d:'热搜运营',src:'原创',avatar:'/profiles/cowork.jpg'},
{name:'播客内容策略师',d:'小宇宙平台生态',src:'原创',avatar:'/profiles/morph-ppt-3d.jpg'},
{name:'微信视频号运营策略师',d:'视频号直播',src:'原创',avatar:'/profiles/beautiful-mermaid.jpg'},
{name:'知识付费产品策划师',d:'得到知识星球',src:'原创',avatar:'/profiles/ppt-creator.jpg'},
{name:'中国市场本地化策略师',d:'抖音小红书全栈本地化',src:'原创',avatar:'/profiles/human-3-coach.jpg'},
{name:'新闻情报官',d:'国内外新闻采集',src:'原创',avatar:'/profiles/beautiful-mermaid.jpg'},
{name:'小红书专家',d:'生活方式内容',src:'翻译',avatar:'/profiles/pitch-deck-creator.jpg'},
{name:'微信公众号管理',d:'订阅者运营',src:'翻译',avatar:'/profiles/social-job-publisher.jpg'},
{name:'知乎策略师',d:'知识型内容',src:'翻译',avatar:'/profiles/morph-ppt.jpg'},
{name:'TikTok 策略师',d:'病毒式内容',src:'翻译',avatar:'/profiles/pitch-deck-creator.jpg'},
{name:'Twitter 互动官',d:'实时互动',src:'翻译',avatar:'/profiles/morph-ppt.jpg'},
{name:'Instagram 策展师',d:'视觉叙事',src:'翻译',avatar:'/profiles/moltbook.jpg'},
{name:'Reddit 社区运营',d:'社区文化',src:'翻译',avatar:'/profiles/morph-ppt-3d.jpg'},
{name:'应用商店优化师',d:'ASO',src:'翻译',avatar:'/profiles/openclaw-setup.jpg'},
{name:'视频优化专家',d:'YouTube 算法',src:'翻译',avatar:'/profiles/morph-ppt-3d.jpg'},
{name:'增长黑客',d:'数据驱动增长',src:'翻译',avatar:'/profiles/openclaw-setup.jpg'},
{name:'内容创作者',d:'多平台内容创作',src:'翻译',avatar:'/profiles/planning-with-files.jpg'},
{name:'社交媒体策略师',d:'跨平台策略',src:'翻译',avatar:'/profiles/morph-ppt-3d.jpg'},
{name:'SEO 专家',d:'搜索引擎优化',src:'翻译',avatar:'/profiles/story-roleplay.jpg'},
{name:'轮播图增长引擎',d:'短视频轮播图',src:'翻译',avatar:'/profiles/beautiful-mermaid.jpg'},
{name:'LinkedIn 内容创作专家',d:'LinkedIn 个人品牌',src:'翻译',avatar:'/profiles/word-creator.jpg'},
{name:'图书联合作者',d:'思想领袖力图书',src:'翻译',avatar:'/profiles/cowork.jpg'},
{name:'智能搜索优化师',d:'WebMCP 就绪度',src:'翻译',avatar:'/profiles/moltbook.jpg'},
{name:'AI 引文策略师',d:'AEO/GEO 优化',src:'翻译',avatar:'/profiles/story-roleplay.jpg'}
]},
{id:'paid-media',icon:'💰',name:'付费媒体部',desc:'精准投放',agents:[
{name:'付费媒体审计师',d:'系统化评估 Google Ads',src:'翻译',avatar:'/profiles/openclaw-setup.jpg'},
{name:'广告创意策略师',d:'广告文案优化',src:'翻译',avatar:'/profiles/game-3d.jpg'},
{name:'社交广告策略师',d:'Meta 社交广告',src:'翻译',avatar:'/profiles/morph-ppt.jpg'},
{name:'PPC 竞价策略师',d:'Google Ads',src:'翻译',avatar:'/profiles/story-roleplay.jpg'},
{name:'程序化广告采买专家',d:'DSP 程序化购买',src:'翻译',avatar:'/profiles/morph-ppt.jpg'},
{name:'搜索词分析师',d:'搜索词挖掘',src:'翻译',avatar:'/profiles/morph-ppt-3d.jpg'},
{name:'追踪与归因专家',d:'转化追踪',src:'翻译',avatar:'/profiles/word-creator.jpg'}
]},
{id:'sales',icon:'💼',name:'销售部',desc:'从线索到成交',agents:[
{name:'客户拓展策略师',d:'售后客户拓展',src:'翻译',avatar:'/profiles/dashboard-creator.jpg'},
{name:'销售教练',d:'销售团队能力提升',src:'翻译',avatar:'/profiles/planning-with-files.jpg'},
{name:'赢单策略师',d:'MEDDPICC 资质审查',src:'翻译',avatar:'/profiles/planning-with-files.jpg'},
{name:'Discovery 教练',d:'需求挖掘',src:'翻译',avatar:'/profiles/cowork.jpg'},
{name:'售前工程师',d:'技术 Discovery',src:'翻译',avatar:'/profiles/word-creator.jpg'},
{name:'Outbound 策略师',d:'多渠道触达',src:'翻译',avatar:'/profiles/social-job-publisher.jpg'},
{name:'Pipeline 分析师',d:'Pipeline 健康诊断',src:'翻译',avatar:'/profiles/human-3-coach.jpg'},
{name:'投标策略师',d:'RFP 赢标叙事',src:'翻译',avatar:'/profiles/star-office-helper.jpg'}
]},
{id:'finance',icon:'🏦',name:'金融部',desc:'让每一笔钱都清清楚楚',agents:[
{name:'簿记与财务总监',d:'日常记账到月末结账',src:'翻译',avatar:'/profiles/excel-creator.jpg'},
{name:'财务分析师',d:'财务建模估值',src:'翻译',avatar:'/profiles/ui-ux-pro-max.jpg'},
{name:'财务预测分析师',d:'收入预测现金流管理',src:'原创',avatar:'/profiles/ppt-creator.jpg'},
{name:'FP&A 分析师',d:'预算编制滚动预测',src:'翻译',avatar:'/profiles/social-job-publisher.jpg'},
{name:'金融风控分析师',d:'支付宝微信支付风控',src:'原创',avatar:'/profiles/planning-with-files.jpg'},
{name:'投资研究员',d:'行业分析公司估值',src:'翻译',avatar:'/profiles/social-job-publisher.jpg'},
{name:'发票管理专家',d:'增值税发票管理',src:'原创',avatar:'/profiles/excel-creator.jpg'},
{name:'税务策略师',d:'企业税务筹划',src:'翻译',avatar:'/profiles/dashboard-creator.jpg'}
]},
{id:'hr',icon:'👔',name:'人力资源部',desc:'找对人用好人留住人',agents:[
{name:'招聘专家',d:'Boss 直聘猎聘',src:'原创',avatar:'/profiles/cowork.jpg'},
{name:'绩效管理专家',d:'OKR/KPI 双轨制',src:'原创',avatar:'/profiles/beautiful-mermaid.jpg'}
]},
{id:'legal',icon:'⚖️',name:'法务部',desc:'合规是底线',agents:[
{name:'合同审查专家',d:'《民法典》合同编',src:'原创',avatar:'/profiles/dashboard-creator.jpg'},
{name:'制度文件撰写专家',d:'PIPL 数据安全法',src:'原创',avatar:'/profiles/excel-creator.jpg'}
]},
{id:'supply-chain',icon:'🚚',name:'供应链部',desc:'从工厂到用户',agents:[
{name:'库存预测专家',d:'需求预测安全库存',src:'原创',avatar:'/profiles/morph-ppt.jpg'},
{name:'供应商评估专家',d:'1688 供应商',src:'原创',avatar:'/profiles/star-office-helper.jpg'},
{name:'物流路线优化师',d:'顺丰通达系冷链',src:'原创',avatar:'/profiles/word-creator.jpg'},
{name:'供应链采购策略师',d:'1688 采购质检',src:'原创',avatar:'/profiles/ui-ux-pro-max.jpg'}
]},
{id:'product',icon:'📦',name:'产品部',desc:'在正确的时间做正确的事',agents:[
{name:'Sprint 排序师',d:'需求优先级排序',src:'翻译',avatar:'/profiles/planning-with-files.jpg'},
{name:'趋势研究员',d:'行业趋势分析',src:'翻译',avatar:'/profiles/dashboard-creator.jpg'},
{name:'反馈分析师',d:'用户反馈收集分类',src:'翻译',avatar:'/profiles/dashboard-creator.jpg'},
{name:'行为助推引擎',d:'行为心理学用户引导',src:'翻译',avatar:'/profiles/planning-with-files.jpg'},
{name:'产品经理',d:'产品全生命周期',src:'翻译',avatar:'/profiles/human-3-coach.jpg'}
]},
{id:'project-management',icon:'📋',name:'项目管理部',desc:'让项目按时按质交付',agents:[
{name:'高级项目经理',d:'需求拆解范围管控',src:'翻译',avatar:'/profiles/beautiful-mermaid.jpg'},
{name:'项目牧羊人',d:'跨团队协调',src:'翻译',avatar:'/profiles/cowork.jpg'},
{name:'实验追踪员',d:'A/B 测试实验管理',src:'翻译',avatar:'/profiles/morph-ppt.jpg'},
{name:'工作室制片人',d:'创意项目管理',src:'翻译',avatar:'/profiles/social-job-publisher.jpg'},
{name:'工作室运营',d:'工作室日常运营',src:'翻译',avatar:'/profiles/morph-ppt.jpg'},
{name:'Jira 工作流管家',d:'Jira 配置优化',src:'翻译',avatar:'/profiles/moltbook.jpg'}
]},
{id:'testing',icon:'🧪',name:'测试部',desc:'打破一切',agents:[
{name:'证据收集者',d:'截图 QA 视觉验证',src:'翻译',avatar:'/profiles/ui-ux-pro-max.jpg'},
{name:'现实检验者',d:'证据驱动认证',src:'翻译',avatar:'/profiles/star-office-helper.jpg'},
{name:'API 测试员',d:'API 验证集成测试',src:'翻译',avatar:'/profiles/financial-model-creator.jpg'},
{name:'性能基准师',d:'性能测试优化',src:'翻译',avatar:'/profiles/morph-ppt-3d.jpg'},
{name:'无障碍审核员',d:'WCAG 审核',src:'翻译',avatar:'/profiles/story-roleplay.jpg'},
{name:'测试结果分析师',d:'测试数据分析',src:'翻译',avatar:'/profiles/morph-ppt-3d.jpg'},
{name:'工具评估师',d:'工具选型功能对比',src:'翻译',avatar:'/profiles/planning-with-files.jpg'},
{name:'工作流优化师',d:'流程分析自动化',src:'翻译',avatar:'/profiles/cowork.jpg'},
{name:'嵌入式测试工程师',d:'HIL 测试固件自动化',src:'原创',avatar:'/profiles/story-roleplay.jpg'}
]},
{id:'support',icon:'🤝',name:'支持部',desc:'运营的中流砥柱',agents:[
{name:'客服响应者',d:'客户服务工单处理',src:'翻译',avatar:'/profiles/ui-ux-pro-max.jpg'},
{name:'数据分析师',d:'数据分析仪表盘',src:'翻译',avatar:'/profiles/human-3-coach.jpg'},
{name:'法务合规员',d:'合规审查法规检查',src:'翻译',avatar:'/profiles/human-3-coach.jpg'},
{name:'高管摘要师',d:'业务摘要战略沟通',src:'翻译',avatar:'/profiles/beautiful-mermaid.jpg'},
{name:'财务追踪员',d:'财务分析预算管理',src:'翻译',avatar:'/profiles/morph-ppt-3d.jpg'},
{name:'基础设施运维师',d:'系统运维可靠性工程',src:'翻译',avatar:'/profiles/morph-ppt-3d.jpg'},
{name:'招聘运营专家',d:'Boss 直聘劳动法',src:'原创',avatar:'/profiles/word-creator.jpg'}
]},
{id:'specialized',icon:'🔬',name:'专项部',desc:'不走寻常路的专家',agents:[
{name:'智能体编排者',d:'多智能体协调',src:'翻译',avatar:'/profiles/pitch-deck-creator.jpg'},
{name:'提示词工程师',d:'LLM 提示词设计优化',src:'原创',avatar:'/profiles/cowork.jpg'},
{name:'身份信任架构师',d:'AI 身份验证信任框架',src:'翻译',avatar:'/profiles/beautiful-mermaid.jpg'},
{name:'数据整合师',d:'多源数据整合',src:'翻译',avatar:'/profiles/star-office-helper.jpg'},
{name:'LSP 索引工程师',d:'代码智能语义索引',src:'翻译',avatar:'/profiles/academic-paper.jpg'},
{name:'报告分发师',d:'报告分发多渠道推送',src:'翻译',avatar:'/profiles/beautiful-mermaid.jpg'},
{name:'销售数据提取师',d:'销售数据采集结构化',src:'翻译',avatar:'/profiles/dashboard-creator.jpg'},
{name:'合规审计师',d:'SOC 2 ISO 27001 HIPAA 合规',src:'翻译',avatar:'/profiles/moltbook.jpg'},
{name:'应付账款智能体',d:'发票处理付款自动化',src:'翻译',avatar:'/profiles/planning-with-files.jpg'},
{name:'身份图谱操作员',d:'身份解析多源匹配',src:'翻译',avatar:'/profiles/academic-paper.jpg'},
{name:'文化智能策略师',d:'文化洞察跨文化设计',src:'翻译',avatar:'/profiles/social-job-publisher.jpg'},
{name:'开发者布道师',d:'开发者关系 DX 工程',src:'翻译',avatar:'/profiles/morph-ppt-3d.jpg'},
{name:'模型 QA 专家',d:'ML 模型审计质量验证',src:'翻译',avatar:'/profiles/moltbook.jpg'},
{name:'ZK 管家',d:'Zettelkasten 知识管理',src:'翻译',avatar:'/profiles/social-job-publisher.jpg'},
{name:'区块链安全审计师',d:'智能合约审计漏洞检测',src:'翻译',avatar:'/profiles/planning-with-files.jpg'},
{name:'留学规划顾问',d:'多国申请策略选校定位',src:'原创',avatar:'/profiles/human-3-coach.jpg'},
{name:'政务数字化售前顾问',d:'方案设计标书等保信创',src:'原创',avatar:'/profiles/financial-model-creator.jpg'},
{name:'企业培训课程设计师',d:'ADDIE/SAM 企业学习平台',src:'原创',avatar:'/profiles/pitch-deck-creator.jpg'},
{name:'MCP 构建器',d:'MCP 服务器工具设计',src:'翻译',avatar:'/profiles/pitch-deck-creator.jpg'},
{name:'文档生成器',d:'PDF/PPTX/DOCX/XLSX 生成',src:'翻译',avatar:'/profiles/social-job-publisher.jpg'},
{name:'工作流架构师',d:'工作流树设计交接契约',src:'翻译',avatar:'/profiles/word-creator.jpg'},
{name:'自动化治理架构师',d:'自动化审计 n8n 工作流治理',src:'翻译',avatar:'/profiles/pitch-deck-creator.jpg'},
{name:'Salesforce 架构师',d:'Salesforce 多云设计集成',src:'翻译',avatar:'/profiles/excel-creator.jpg'},
{name:'医疗健康营销合规师',d:'医疗广告法 NMPA',src:'原创',avatar:'/profiles/excel-creator.jpg'},
{name:'高考志愿填报顾问',d:'平行志愿位次法',src:'原创',avatar:'/profiles/morph-ppt-3d.jpg'},
{name:'动态定价策略师',d:'淘宝京东拼多多定价',src:'原创',avatar:'/profiles/excel-creator.jpg'},
{name:'AI 治理政策专家',d:'算法备案生成式 AI 管理',src:'原创',avatar:'/profiles/academic-paper.jpg'},
{name:'企业风险评估师',d:'COSO 本土化国企风控 ESG',src:'原创',avatar:'/profiles/academic-paper.jpg'},
{name:'会议效率专家',d:'飞书钉钉腾讯会议',src:'原创',avatar:'/profiles/human-3-coach.jpg'},
{name:'土木工程师',d:'Eurocode DIN ACI GB 多标准结构分析',src:'翻译',avatar:'/profiles/morph-ppt-3d.jpg'},
{name:'法国咨询市场专家',d:'ESN SI 生态 Malt 平台',src:'翻译',avatar:'/profiles/morph-ppt.jpg'},
{name:'韩国商务专家',d:'품의流程 KakaoTalk 礼仪',src:'翻译',avatar:'/profiles/word-creator.jpg'},
{name:'招聘专家',d:'国内招聘平台人才评估劳动法',src:'原创',avatar:'/profiles/morph-ppt-3d.jpg'},
{name:'技术翻译专家',d:'中英文双向翻译编程 AI 云计算',src:'翻译',avatar:'/profiles/beautiful-mermaid.jpg'},
{name:'医疗客服专家',d:'预约保险处方紧急分诊',src:'翻译',avatar:'/profiles/financial-model-creator.jpg'},
{name:'酒店宾客服务专家',d:'预订客房服务礼宾投诉',src:'翻译',avatar:'/profiles/morph-ppt-3d.jpg'},
{name:'HR 入职管理专家',d:'入职文档合规追踪文化融入',src:'翻译',avatar:'/profiles/beautiful-mermaid.jpg'},
{name:'语言翻译专家',d:'实时语言翻译文化语境',src:'翻译',avatar:'/profiles/human-3-coach.jpg'},
{name:'律所计费与工时专家',d:'工时录入账单生成客户沟通',src:'翻译',avatar:'/profiles/social-job-publisher.jpg'},
{name:'律所客户接案专家',d:'初步咨询利益冲突检查',src:'翻译',avatar:'/profiles/moltbook.jpg'},
{name:'法律文书审查专家',d:'合同摘要风险条款标记',src:'翻译',avatar:'/profiles/financial-model-creator.jpg'},
{name:'信贷经理助手',d:'申请预审合规检查利率锁定',src:'翻译',avatar:'/profiles/game-3d.jpg'},
{name:'房地产经纪助手',d:'市场分析报价策略谈判',src:'翻译',avatar:'/profiles/word-creator.jpg'},
{name:'零售退货专家',d:'退货受理退款欺诈检测',src:'翻译',avatar:'/profiles/moltbook.jpg'},
{name:'幕僚长',d:'战略运营跨部门协调 OKR',src:'翻译',avatar:'/profiles/pitch-deck-creator.jpg'}
]},
{id:'spatial-computing',icon:'🥽',name:'空间计算部',desc:'构建下一代空间交互体验',agents:[
{name:'visionOS 空间工程师',d:'visionOS SwiftUI 空间 UI',src:'翻译',avatar:'/profiles/ppt-creator.jpg'},
{name:'macOS Metal 空间工程师',d:'Metal GPU 渲染',src:'翻译',avatar:'/profiles/financial-model-creator.jpg'},
{name:'XR 界面架构师',d:'空间 UI 架构交互设计',src:'翻译',avatar:'/profiles/pitch-deck-creator.jpg'},
{name:'XR 沉浸式开发者',d:'WebXR 沉浸式体验',src:'翻译',avatar:'/profiles/academic-paper.jpg'},
{name:'XR 座舱交互专家',d:'座舱 UI 多模态交互',src:'翻译',avatar:'/profiles/moltbook.jpg'},
{name:'终端集成专家',d:'终端模拟系统集成',src:'翻译',avatar:'/profiles/ppt-creator.jpg'}
]},
{id:'game-development',icon:'🎮',name:'游戏开发部',desc:'从独立游戏到 3A 大作',agents:[
{name:'游戏设计师',d:'游戏机制系统设计平衡性',src:'翻译',avatar:'/profiles/game-3d.jpg'},
{name:'关卡设计师',d:'关卡布局节奏控制',src:'翻译',avatar:'/profiles/pitch-deck-creator.jpg'},
{name:'叙事设计师',d:'剧情设计对话系统世界观',src:'翻译',avatar:'/profiles/social-job-publisher.jpg'},
{name:'技术美术',d:'Shader 渲染管线美术工具',src:'翻译',avatar:'/profiles/openclaw-setup.jpg'},
{name:'游戏音频工程师',d:'音效设计音频引擎空间音频',src:'翻译',avatar:'/profiles/word-creator.jpg'},
{name:'Unity 架构师',d:'Unity 架构 ECS 性能优化',src:'翻译',avatar:'/profiles/academic-paper.jpg'},
{name:'Unity 编辑器工具开发者',d:'编辑器扩展自定义工具',src:'翻译',avatar:'/profiles/openclaw-setup.jpg'},
{name:'Unity 多人游戏工程师',d:'Netcode 同步网络架构',src:'翻译',avatar:'/profiles/moltbook.jpg'},
{name:'Unity Shader Graph 美术师',d:'Shader Graph URP HDRP',src:'翻译',avatar:'/profiles/cowork.jpg'},
{name:'Unreal 多人游戏架构师',d:'Replication 网络同步',src:'翻译',avatar:'/profiles/cowork.jpg'},
{name:'Unreal 系统工程师',d:'Gameplay 框架 C++ 系统',src:'翻译',avatar:'/profiles/dashboard-creator.jpg'},
{name:'Unreal 技术美术',d:'材质 Niagara 渲染管线',src:'翻译',avatar:'/profiles/ppt-creator.jpg'},
{name:'Unreal 世界构建师',d:'开放世界地形关卡串流',src:'翻译',avatar:'/profiles/beautiful-mermaid.jpg'},
{name:'Blender 插件工程师',d:'Python 插件资源验证',src:'翻译',avatar:'/profiles/dashboard-creator.jpg'},
{name:'Godot 游戏脚本开发者',d:'GDScript 场景树信号系统',src:'翻译',avatar:'/profiles/excel-creator.jpg'},
{name:'Godot 多人游戏工程师',d:'MultiplayerAPI 网络同步',src:'翻译',avatar:'/profiles/word-creator.jpg'},
{name:'Godot Shader 开发者',d:'Godot Shader Language',src:'翻译',avatar:'/profiles/social-job-publisher.jpg'},
{name:'Roblox 虚拟形象创作者',d:'虚拟形象 UGC 资产',src:'翻译',avatar:'/profiles/pitch-deck-creator.jpg'},
{name:'Roblox 体验设计师',d:'体验设计游戏循环',src:'翻译',avatar:'/profiles/ui-ux-pro-max.jpg'},
{name:'Roblox 系统脚本工程师',d:'Luau 脚本数据存储',src:'翻译',avatar:'/profiles/ui-ux-pro-max.jpg'}
]},
{id:'academic',icon:'📖',name:'学术部',desc:'为叙事设计世界构建和文化研究提供学术级支撑',agents:[
{name:'人类学家',d:'文化体系仪式民族志',src:'翻译',avatar:'/profiles/moltbook.jpg'},
{name:'地理学家',d:'自然与人文地理空间分析',src:'翻译',avatar:'/profiles/morph-ppt.jpg'},
{name:'历史学家',d:'历史分析史料考证',src:'翻译',avatar:'/profiles/beautiful-mermaid.jpg'},
{name:'叙事学家',d:'叙事理论故事结构',src:'翻译',avatar:'/profiles/cowork.jpg'},
{name:'心理学家',d:'行为心理人格理论',src:'翻译',avatar:'/profiles/star-office-helper.jpg'},
{name:'学习规划师',d:'考研考公法考备考学习方法论',src:'原创',avatar:'/profiles/morph-ppt.jpg'}
]}
];

// 初始化渲染部门列表
document.getElementById('dept-list').innerHTML = renderDepts(DEPTS);

// 搜索功能
var allAgents = [];
DEPTS.forEach(function(d) {
  d.agents.forEach(function(a) {
    allAgents.push({ name: a.name, dept: d.name, desc: a.d, src: a.src });
  });
});

document.getElementById('searchInput').addEventListener('input', function(e) {
  var query = e.target.value.toLowerCase().trim();
  if (!query) {
    document.getElementById('dept-list').innerHTML = renderDepts(DEPTS);
    return;
  }
  var filtered = DEPTS.map(function(d) {
    var matchedAgents = d.agents.filter(function(a) {
      return a.name.toLowerCase().indexOf(query) !== -1 ||
             a.d.toLowerCase().indexOf(query) !== -1 ||
             d.name.toLowerCase().indexOf(query) !== -1;
    });
    if (matchedAgents.length > 0) {
      return { ...d, agents: matchedAgents };
    }
    return null;
  }).filter(Boolean);
  document.getElementById('dept-list').innerHTML = renderDepts(filtered);
});

function renderDepts(depts) {
  return depts.map(function(d) {
    var html = '';
    html += '<div class="dept-card" data-dept-id="' + d.id + '">';
    html += '<div class="dept-name">' + d.icon + ' ' + d.name + '</div>';
    html += '<div class="dept-count">' + d.agents.length + ' 位专家</div>';
    html += '<div class="dept-desc">' + d.desc + '</div>';
    html += '</div>';
    return html;
  }).join('');
}

// 打开部门弹窗（左侧列表，右侧MD内容）
var currentDeptId = null;
var currentAgentName = null;

function openDeptModal(deptId) {
  var dept = DEPTS.find(function(d) { return d.id === deptId; });
  if (!dept) return;
  
  currentDeptId = deptId;
  currentAgentName = null;
  
  var modal = document.getElementById('detail-modal');
  var title = document.getElementById('modal-title');
  var body = document.getElementById('modal-body');
  var sidebar = document.getElementById('agent-list-container');
  
  title.textContent = dept.icon + ' ' + dept.name;
  body.innerHTML = '<div class="loading">请点击左侧智能体查看详情</div>';
  
  // 渲染左侧智能体列表
  sidebar.innerHTML = '';
  dept.agents.forEach(function(agent) {
    var item = document.createElement('div');
    item.className = 'sidebar-agent-item';
    var avatarSrc = agent.avatar || '/profiles/cowork.jpg';
    item.innerHTML = '<div class="sidebar-agent-avatar-area"><img class="sidebar-agent-avatar" src="' + avatarSrc + '" alt=""></div>' +
                     '<div class="sidebar-agent-info">' +
                     '<div class="sidebar-agent-name">' + agent.name + '</div>' +
                     '<div class="sidebar-agent-desc">' + agent.d + '</div>' +
                     '<div class="sidebar-agent-src">' + (agent.src === '原创' ? '原创' : '翻译') + '</div>' +
                     '</div>';
    item.setAttribute('data-name', agent.name);
    item.addEventListener('click', function() {
      loadAgentInSidebar(this.getAttribute('data-name'));
    });
    sidebar.appendChild(item);
  });
  
  modal.classList.add('active');
}

// 加载在弹窗中加载智能体详情
function loadAgentInSidebar(name) {
  currentAgentName = name;
  
  // 高亮选中的智能体
  document.querySelectorAll('.sidebar-agent-item').forEach(function(item) {
    item.classList.remove('active');
    if (item.getAttribute('data-name') === name) {
      item.classList.add('active');
    }
  });
  
  var body = document.getElementById('modal-body');
  body.innerHTML = '<div class="loading">加载中...</div>';
  
  // 查找文件路径
  var filePath = AGENT_FILE_MAP[name];
  if (!filePath) {
    body.innerHTML = '<div class="error">暂无该智能体的详细信息文件</div>';
    return;
  }
  
  // fetch md 文件
  fetch('/agents/' + filePath)
    .then(function(response) {
      if (!response.ok) throw new Error('文件未找到');
      return response.text();
    })
    .then(function(md) {
      // 简单的 markdown 转 HTML
      var html = simpleMarkdown(md);
      body.innerHTML = html;
    })
    .catch(function(err) {
      body.innerHTML = '<div class="error">加载失败：' + err.message + '</div>';
    });
}

// 简单的 markdown 转 HTML
function simpleMarkdown(md) {
  // 移除 frontmatter
  md = md.replace(/^---\n[\s\S]*?\n---\n/, '');
  
  var lines = md.split('\n');
  var html = '';
  var inList = false;
  var inOL = false;
  
  for (var i = 0; i < lines.length; i++) {
    var line = lines[i];
    
    // 标题
    if (line.startsWith('### ')) {
      if (inList) html += '</ul>';
      if (inOL) html += '</ol>';
      html += '<h3>' + simpleFormat(line.slice(4)) + '</h3>';
    } else if (line.startsWith('## ')) {
      if (inList) html += '</ul>';
      if (inOL) html += '</ol>';
      html += '<h2>' + simpleFormat(line.slice(3)) + '</h2>';
    } else if (line.startsWith('# ')) {
      if (inList) html += '</ul>';
      if (inOL) html += '</ol>';
      html += '<h1>' + simpleFormat(line.slice(2)) + '</h1>';
    } else if (line.startsWith('- ')) {
      if (!inList) { html += '<ul>'; inList = true; }
      html += '<li>' + simpleFormat(line.slice(2)) + '</li>';
    } else if (/^\d+\.\s/.test(line)) {
      if (!inOL) { html += '<ol>'; inOL = true; }
      if (inList) { html += '</ul>'; inList = false; }
      html += '<li>' + simpleFormat(line.replace(/^\d+\.\s/, '')) + '</li>';
    } else if (line.trim() === '') {
      if (inList) { html += '</ul>'; inList = false; }
      if (inOL) { html += '</ol>'; inOL = false; }
    } else {
      if (inList) { html += '</ul>'; inList = false; }
      if (inOL) { html += '</ol>'; inOL = false; }
      if (line.trim() !== '') {
        html += '<p>' + simpleFormat(line) + '</p>';
      }
    }
  }
  
  if (inList) html += '</ul>';
  if (inOL) html += '</ol>';
  
  return html;
}

// 简单的格式化：**bold**, *italic*, `code`
function simpleFormat(text) {
  text = text.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  text = text.replace(/\*(.+?)\*/g, '<em>$1</em>');
  text = text.replace(/`(.+?)`/g, '<code>$1</code>');
  return text;
}

// 关闭模态框
function closeModal() {
  document.getElementById('detail-modal').classList.remove('active');
}

// 点击模态框外部关闭
document.getElementById('detail-modal').addEventListener('click', function(e) {
  if (e.target === this) {
    closeModal();
  }
});

// 事件委托：部门卡片点击
document.getElementById('dept-list').addEventListener('click', function(e) {
  var card = e.target.closest('.dept-card');
  if (card) {
    var deptId = card.getAttribute('data-dept-id');
    openDeptModal(deptId);
  }
});

let countdown = 60;
let timer = null;

function openPaymentModal() {
  document.getElementById('paymentModal').classList.add('active');
  countdown = 60;
  document.getElementById('countdown').textContent = countdown;
  
  // 60 秒倒计时，结束后自动下载
  timer = setInterval(function() {
    countdown--;
    if (countdown <= 0) {
      clearInterval(timer);
      timer = null;
      countdown = 0;
      document.getElementById('countdown').textContent = '已验证';
      document.getElementById('countdown').style.color = '#00c853';
      
      // 自动触发下载
      setTimeout(function() {
        var a = document.createElement('a');
        a.href = '/download/hyexon.exe';
        a.download = 'hyexon-2.1.17-win-x64.exe';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        
        // 下载后关闭弹窗
        setTimeout(function() {
          closePaymentModal();
        }, 1000);
      }, 500);
    }
    document.getElementById('countdown').textContent = countdown;
  }, 1000);
}

function closePaymentModal() {
  document.getElementById('paymentModal').classList.remove('active');
  if (timer) {
    clearInterval(timer);
    timer = null;
  }
}

// 点击遮罩关闭
document.getElementById('paymentModal').addEventListener('click', function(e) {
  if (e.target === this) closePaymentModal();
});

// ========== 模型配置指南弹窗 ==========
let guideIndex = 0;
let guideAutoplay = null;
const totalSlides = 6;

function openGuideModal() {
  document.getElementById('guideModal').classList.add('active');
  guideIndex = 0;
  updateGuide();
  startAutoplay();
}

function closeGuideModal() {
  document.getElementById('guideModal').classList.remove('active');
  stopAutoplay();
}

function startAutoplay() {
  stopAutoplay();
  guideAutoplay = setInterval(function() {
    guideIndex++;
    if (guideIndex >= totalSlides) {
      guideIndex = 0; // 循环回到第一张
    }
    updateGuide();
  }, 5000); // 5秒自动划动
}

function stopAutoplay() {
  if (guideAutoplay) {
    clearInterval(guideAutoplay);
    guideAutoplay = null;
  }
}

function updateGuide() {
  const track = document.getElementById('guideTrack');
  track.style.transform = 'translateX(-' + (guideIndex * 100) + '%)';
  // 更新圆点
  document.querySelectorAll('.guide-dots .dot').forEach(function(dot, i) {
    dot.classList.toggle('active', i === guideIndex);
  });
  // 更新计数器
  document.getElementById('guideCounter').textContent = (guideIndex + 1) + ' / ' + totalSlides;
  // 更新左右按钮状态
  document.getElementById('guidePrev').style.opacity = guideIndex === 0 ? '0.4' : '1';
  document.getElementById('guideNext').style.opacity = guideIndex === totalSlides - 1 ? '0.4' : '1';
}

function guidePrev() {
  stopAutoplay();
  if (guideIndex > 0) { guideIndex--; updateGuide(); }
  startAutoplay(); // 用户操作后重置计时器
}

function guideNext() {
  stopAutoplay();
  if (guideIndex < totalSlides - 1) { guideIndex++; updateGuide(); }
  startAutoplay(); // 用户操作后重置计时器
}

// 点击圆点也重置计时器
function goToSlide(index) {
  stopAutoplay();
  guideIndex = index;
  updateGuide();
  startAutoplay();
}

// 鼠标悬停暂停，移开继续
var swiper = document.getElementById('guideSwiper');
swiper.addEventListener('mouseenter', function() { stopAutoplay(); });
swiper.addEventListener('mouseleave', function() { startAutoplay(); });

// 点击遮罩关闭
document.getElementById('guideModal').addEventListener('click', function(e) {
  if (e.target === this) closeGuideModal();
});

// 键盘左右箭头
document.addEventListener('keydown', function(e) {
  if (document.getElementById('guideModal').classList.contains('active')) {
    if (e.key === 'ArrowLeft') guidePrev();
    if (e.key === 'ArrowRight') guideNext();
    if (e.key === 'Escape') closeGuideModal();
  }
});

// 触摸滑动支持
(function() {
  let touchStartX = 0;
  const swiper = document.getElementById('guideSwiper');
  swiper.addEventListener('touchstart', function(e) {
    touchStartX = e.changedTouches[0].screenX;
    stopAutoplay(); // 触摸时暂停
  });
  swiper.addEventListener('touchend', function(e) {
    const diff = touchStartX - e.changedTouches[0].screenX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) guideNext();
      else guidePrev();
    }
    startAutoplay(); // 触摸后继续
  });
})();

// ========== 用户反馈弹窗 ==========
let feedbackList = [];
let feedbackLoading = false;

function openFeedbackModal() {
  document.getElementById('feedbackModal').classList.add('active');
  loadFeedbackList();
}

function closeFeedbackModal() {
  document.getElementById('feedbackModal').classList.remove('active');
}

async function loadFeedbackList() {
  if (feedbackLoading) return;
  feedbackLoading = true;
  
  try {
    const response = await fetch('https://www.hyesky.com/api/feedback?limit=100');
    const data = await response.json();
    
    feedbackList = data.feedbacks || [];
    renderFeedbackList();
  } catch (e) {
    console.error('加载反馈失败:', e);
    document.getElementById('feedbackList').innerHTML = `
      <div class="feedback-empty">
        <p>加载失败，请稍后重试</p>
      </div>`;
  } finally {
    feedbackLoading = false;
  }
}

function renderFeedbackList() {
  const container = document.getElementById('feedbackList');
  
  if (feedbackList.length === 0) {
    container.innerHTML = `
      <div class="feedback-empty">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
        </svg>
        <p>暂无反馈记录</p>
      </div>`;
    return;
  }
  
  container.innerHTML = feedbackList.map(f => `
    <div class="feedback-item">
      <div class="feedback-meta">
        <span class="feedback-module">${f.module || '其他'}</span>
        <span class="feedback-time">${formatTime(f.created_at)}</span>
      </div>
      <p class="feedback-desc">${escapeHtml(f.description || '暂无描述')}</p>
      ${f.ip_address ? `<p style="font-size:12px;color:#86868b;margin-top:6px;">📍 ${escapeHtml(f.ip_address)}</p>` : ''}
    </div>
  `).join('');
}

function formatTime(timestamp) {
  if (!timestamp) return '';
  // API 返回 ISO 时间字符串（如 2026-06-22T05:50:51.818963Z）
  const d = new Date(timestamp);
  const now = new Date();
  const diff = now - d;
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  
  if (mins < 1) return '刚刚';
  if (mins < 60) return mins + ' 分钟前';
  if (hours < 24) return hours + ' 小时前';
  if (days < 30) return days + ' 天前';
  return d.toLocaleDateString('zh-CN');
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// 点击遮罩关闭
document.getElementById('feedbackModal').addEventListener('click', function(e) {
  if (e.target === this) closeFeedbackModal();
});

// ========== 产品展示轮播 ==========
let showcaseIndex = 0;
const showcaseTrack = document.getElementById('showcaseTrack');
const showcaseDots = document.querySelectorAll('.showcase-dots .dot');
const totalShowcase = 6;

function updateShowcase() {
  if (!showcaseTrack) return;
  showcaseTrack.style.transform = `translateX(-${showcaseIndex * 100}%)`;
  showcaseDots.forEach((dot, i) => {
    dot.classList.toggle('active', i === showcaseIndex);
  });
}

function nextShowcase() {
  showcaseIndex = (showcaseIndex + 1) % totalShowcase;
  updateShowcase();
}

function prevShowcase() {
  showcaseIndex = (showcaseIndex - 1 + totalShowcase) % totalShowcase;
  updateShowcase();
}

// 点击指示点切换
showcaseDots.forEach((dot) => {
  dot.addEventListener('click', () => {
    showcaseIndex = parseInt(dot.dataset.index);
    updateShowcase();
  });
});

// 自动轮播（5秒间隔，悬停暂停）
let showcaseTimer = setInterval(nextShowcase, 5000);
const showcaseEl = document.querySelector('.product-showcase');
if (showcaseEl) {
  showcaseEl.addEventListener('mouseenter', () => clearInterval(showcaseTimer));
  showcaseEl.addEventListener('mouseleave', () => {
    showcaseTimer = setInterval(nextShowcase, 5000);
  });
}

// 触摸支持
let touchStartX = 0;
let touchEndX = 0;
const viewport = document.querySelector('.showcase-viewport');
if (viewport) {
  viewport.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });
  viewport.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    const diff = touchStartX - touchEndX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) nextShowcase();
      else prevShowcase();
    }
  }, { passive: true });
}

// 键盘支持
document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowLeft') prevShowcase();
  if (e.key === 'ArrowRight') nextShowcase();
});
