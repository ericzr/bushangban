// ─── 基础类型 ────────────────────────────────────────────

export type TaskType = 'fulltime' | 'parttime' | 'crowdsourcing' | 'agent';
export type TaskSubType = 'regular' | 'intern';
export type PriceType = 'monthly' | 'hourly' | 'total' | 'milestone' | 'negotiable';
export type TaskStatus = 'open' | 'matched' | 'in-progress' | 'reviewing' | 'completed' | 'settled';
export type UserRole = 'employer' | 'worker';

export interface Skill {
  name: string;
  level: '入门' | '熟练' | '专业';
}

export interface EnterpriseInfo {
  name: string;
  industry: string;
  size: string;
  verified: boolean;
}

export interface User {
  id: string;
  name: string;
  avatar: string;
  role: string;
  rating: number;
  city: string;
  isOnline: boolean;
  lastActive: string;
  identity: '学生' | '自由职业' | '公司';
  bio: string;
  skills: Skill[];
  completedProjects: number;
  fulfillmentRate: number;
  responseTime: string;
  tags: string[];
  activeRole?: UserRole;
  isEnterpriseCertified?: boolean;
  enterpriseInfo?: EnterpriseInfo;
}

export interface Milestone {
  id: string;
  name: string;
  percentage: number;
  amount: number;
  status: 'pending' | 'in-progress' | 'reviewing' | 'completed';
  isPaid: boolean;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  budgetMin: number;
  budgetMax: number;
  tags: string[];
  status: TaskStatus;
  type: TaskType;
  subType?: TaskSubType;
  priceType: PriceType;
  author: User;
  createdAt: string;
  applicants: number;
  likes: number;
  comments: number;
  matchScore: number;
  deadline: string;
  location: string;
  skillRequirements: string[];
  isUrgent?: boolean;
  milestones?: Milestone[];
  shifts?: { date: string; time: string; slots: number }[];
  agentCycle?: string;
}

export interface Talent {
  id: string;
  user: User;
  acceptTypes: string[];
  matchScore: number;
  portfolio: string[];
  hourlyRate?: string;
  description?: string;
  completedProjects?: number;
  completionRate?: number;
  rating?: number;
}

export interface Message {
  id: string;
  user: User;
  lastMessage: string;
  timestamp: string;
  unread: number;
  type: 'private' | 'system' | 'group';
}

export interface Planet {
  id: string;
  name: string;
  emoji: string;
  color: string;
  memberCount: number;
}

export interface Review {
  id: string;
  reviewer: User;
  rating: number;
  content: string;
  project: string;
  createdAt: string;
}

export interface Wallet {
  balance: number;
  frozen: number;
  inTransit: number;
  totalIncome: number;
  totalExpense: number;
}

export interface WalletTransaction {
  id: string;
  type: 'income' | 'expense' | 'freeze' | 'unfreeze' | 'withdraw';
  amount: number;
  description: string;
  createdAt: string;
  status: 'completed' | 'pending' | 'failed';
}

// ─── 任务类型配置 ──────────────────────────────────────────

export const TASK_TYPE_CONFIG: Record<TaskType, {
  label: string;
  color: string;
  bgColor: string;
  barColor: string;
  badgeClass: string;
}> = {
  fulltime:      { label: '全职', color: 'text-info', bgColor: 'bg-info-light', barColor: 'bg-blue-500', badgeClass: 'bg-blue-50 text-blue-600' },
  parttime:      { label: '兼职', color: 'text-warning', bgColor: 'bg-warning-light', barColor: 'bg-amber-500', badgeClass: 'bg-amber-50 text-amber-600' },
  crowdsourcing: { label: '众包', color: 'text-purple', bgColor: 'bg-purple-light', barColor: 'bg-purple-500', badgeClass: 'bg-purple-50 text-purple-600' },
  agent:         { label: 'Agent', color: 'text-coral', bgColor: 'bg-coral-light', barColor: 'bg-rose-500', badgeClass: 'bg-rose-50 text-rose-600' },
};

export const TASK_TYPE_TABS: { key: TaskType | 'all'; label: string }[] = [
  { key: 'all', label: '全部' },
  { key: 'fulltime', label: '全职' },
  { key: 'parttime', label: '兼职' },
  { key: 'crowdsourcing', label: '众包' },
  { key: 'agent', label: 'Agent' },
];

export function getTaskTypeLabel(type: TaskType, subType?: TaskSubType): string {
  if (type === 'fulltime' && subType === 'intern') return '实习';
  return TASK_TYPE_CONFIG[type].label;
}

// ─── 用户数据 ──────────────────────────────────────────────

export const CURRENT_USER: User = {
  id: 'u1',
  name: '陈晓文',
  avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop',
  role: 'UI设计师',
  rating: 4.8,
  city: '上海',
  isOnline: true,
  lastActive: '刚刚',
  identity: '自由职业',
  bio: '5年UI/UX设计经验，擅长移动端产品设计，热爱二次元文化。曾服务过多个互联网头部产品。',
  skills: [
    { name: 'UI设计', level: '专业' },
    { name: 'Figma', level: '专业' },
    { name: '插画', level: '熟练' },
    { name: 'React', level: '熟练' },
    { name: '动效设计', level: '入门' },
  ],
  completedProjects: 48,
  fulfillmentRate: 98,
  responseTime: '通常1小时内回复',
  tags: ['靠谱', '高效', '沟通顺畅'],
  activeRole: 'worker',
  isEnterpriseCertified: false,
};

const users: User[] = [
  {
    id: 'u2', name: '王莎莎',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
    role: '品牌策划', rating: 4.9, city: '北京', isOnline: true, lastActive: '5分钟前',
    identity: '公司', bio: '专注品牌设计与策划，为100+品牌提供过视觉方案。',
    skills: [{ name: '品牌设计', level: '专业' }, { name: '平面设计', level: '专业' }, { name: '市场策划', level: '熟练' }],
    completedProjects: 86, fulfillmentRate: 99, responseTime: '通常30分钟内回复', tags: ['靠谱', '创意强'],
    isEnterpriseCertified: true,
    enterpriseInfo: { name: '莎莎创意工作室', industry: '品牌设计', size: '10-50人', verified: true },
  },
  {
    id: 'u3', name: '李明',
    avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&h=100&fit=crop',
    role: '全栈开发', rating: 4.5, city: '深圳', isOnline: false, lastActive: '2小时前',
    identity: '自由职业', bio: '全栈工程师，精通React/Node.js/Python，喜欢做有趣的副业项目。',
    skills: [{ name: 'React', level: '专业' }, { name: 'Node.js', level: '专业' }, { name: 'Python', level: '熟练' }, { name: '小程序', level: '熟练' }],
    completedProjects: 32, fulfillmentRate: 95, responseTime: '通常2小时内回复', tags: ['技术强', '高效'],
  },
  {
    id: 'u4', name: '张艾米',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&h=100&fit=crop',
    role: '内容创作者', rating: 4.7, city: '杭州', isOnline: true, lastActive: '刚刚',
    identity: '自由职业', bio: '小红书/B站内容创作者，擅长种草文案和短视频脚本撰写。',
    skills: [{ name: '文案撰写', level: '专业' }, { name: '短视频', level: '熟练' }, { name: '小红书运营', level: '专业' }],
    completedProjects: 67, fulfillmentRate: 97, responseTime: '通常1小时内回复', tags: ['沟通顺畅', '文笔好'],
  },
  {
    id: 'u5', name: '赵天宇',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
    role: '视频剪辑师', rating: 4.6, city: '成都', isOnline: false, lastActive: '1小时前',
    identity: '学生', bio: '大四影视专业学生，熟练使用PR/AE/达芬奇，承接各类视频剪辑。',
    skills: [{ name: '视频剪辑', level: '专业' }, { name: 'AE特效', level: '熟练' }, { name: '调色', level: '熟练' }],
    completedProjects: 21, fulfillmentRate: 93, responseTime: '通常3小时内回复', tags: ['有创意', '价格实惠'],
  },
  {
    id: 'u6', name: '林小雨',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop',
    role: '插画师', rating: 4.9, city: '广州', isOnline: true, lastActive: '刚刚',
    identity: '自由职业', bio: '自由插画师，二次元风格为主，也接商业插画和IP设计。',
    skills: [{ name: '插画', level: '专业' }, { name: 'IP设计', level: '专业' }, { name: '二次元', level: '专业' }],
    completedProjects: 54, fulfillmentRate: 96, responseTime: '通常1小时内回复', tags: ['画风好', '靠谱', '高效'],
  },
];

// ─── 任务数据 ──────────────────────────────────────────────

export const MOCK_TASKS: Task[] = [
  {
    id: 't1', title: '新茶饮品牌全套VI设计', type: 'crowdsourcing', priceType: 'milestone',
    description: '我们是一家新锐茶饮品牌，需要一位设计师为我们打造完整的品牌视觉系统，包括Logo、色彩体系、包装设计等。希望风格年轻、有活力。',
    budgetMin: 5000, budgetMax: 15000, tags: ['UI设计', '品牌', '包装设计'], status: 'open',
    author: users[0], createdAt: '2026-03-03T10:00:00Z', applicants: 5, likes: 23, comments: 8,
    matchScore: 92, deadline: '2026-04-15', location: '远程', skillRequirements: ['品牌设计', 'UI设计', '插画'],
    milestones: [
      { id: 'ms1', name: 'Logo设计', percentage: 30, amount: 4500, status: 'pending', isPaid: false },
      { id: 'ms2', name: '色彩体系', percentage: 30, amount: 4500, status: 'pending', isPaid: false },
      { id: 'ms3', name: '包装落地', percentage: 40, amount: 6000, status: 'pending', isPaid: false },
    ],
  },
  {
    id: 't2', title: '小程序前端开发（电商类）', type: 'crowdsourcing', priceType: 'total',
    description: '需要一位有经验的小程序开发者，完成一个电商小程序的前端开发。已有UI稿和后端接口，预计2-3周工期。',
    budgetMin: 8000, budgetMax: 12000, tags: ['开发', '小程序', '电商'], status: 'open',
    author: users[1], createdAt: '2026-03-02T15:30:00Z', applicants: 3, likes: 15, comments: 4,
    matchScore: 78, deadline: '2026-03-25', location: '远程', skillRequirements: ['小程序', 'React', 'TypeScript'],
  },
  {
    id: 't3', title: '小红书种草文案撰写（长期兼职）', type: 'parttime', priceType: 'hourly',
    description: '美妆品牌寻找长期合作的文案写手，每周3-5篇小红书种草笔记。需要熟悉小红书平台规则，有过爆款笔记经验优先。',
    budgetMin: 200, budgetMax: 500, tags: ['文案', '小红书', '美妆'], status: 'open',
    author: users[2], createdAt: '2026-03-01T09:15:00Z', applicants: 12, likes: 34, comments: 11,
    matchScore: 65, deadline: '长期有效', location: '远程', skillRequirements: ['文案撰写', '小红书运营'],
    shifts: [
      { date: '每周一至五', time: '灵活安排', slots: 2 },
    ],
  },
  {
    id: 't4', title: '产品宣传视频剪辑', type: 'parttime', priceType: 'total',
    description: '需要剪辑一个3分钟的产品宣传视频，素材已准备好。需要加特效、字幕和背景音乐。风格参考苹果产品发布会。',
    budgetMin: 2000, budgetMax: 4000, tags: ['视频剪辑', '特效', '后期'], status: 'in-progress',
    author: users[0], createdAt: '2026-02-28T14:00:00Z', applicants: 7, likes: 18, comments: 5,
    matchScore: 45, deadline: '2026-03-10', location: '远程', skillRequirements: ['视频剪辑', 'AE特效', '调色'],
  },
  {
    id: 't5', title: '二次元IP形象设计', type: 'crowdsourcing', priceType: 'milestone',
    description: '为我们的虚拟主播设计一套二次元IP形象，包含三视图、表情包、立绘。风格参考Hololive。',
    budgetMin: 3000, budgetMax: 8000, tags: ['插画', '二次元', 'IP设计'], status: 'open',
    author: users[1], createdAt: '2026-03-04T08:00:00Z', applicants: 9, likes: 45, comments: 16,
    matchScore: 88, deadline: '2026-04-01', location: '远程', skillRequirements: ['插画', '二次元', 'IP设计'],
    milestones: [
      { id: 'ms4', name: '概念草图', percentage: 20, amount: 1600, status: 'pending', isPaid: false },
      { id: 'ms5', name: '三视图', percentage: 40, amount: 3200, status: 'pending', isPaid: false },
      { id: 'ms6', name: '表情包+立绘', percentage: 40, amount: 3200, status: 'pending', isPaid: false },
    ],
  },
  {
    id: 't6', title: 'React后台管理系统开发', type: 'crowdsourcing', priceType: 'total',
    description: '需要基于React+Ant Design开发一个企业级后台管理系统，包含权限管理、数据看板、CRUD模块。需要有丰富的后台开发经验。',
    budgetMin: 15000, budgetMax: 25000, tags: ['开发', 'React', '后台'], status: 'open',
    author: users[3], createdAt: '2026-03-03T16:00:00Z', applicants: 4, likes: 12, comments: 3,
    matchScore: 71, deadline: '2026-05-01', location: '深圳优先', skillRequirements: ['React', 'Node.js', 'TypeScript'],
  },
  {
    id: 't7', title: '高级产品经理', type: 'fulltime', subType: 'regular', priceType: 'monthly',
    description: '寻找一位有3年以上B端产品经验的产品经理，负责SaaS平台核心模块的规划与落地。需具备数据分析能力和良好的跨部门沟通能力。',
    budgetMin: 25000, budgetMax: 40000, tags: ['产品经理', 'B端', 'SaaS'], status: 'open',
    author: users[0], createdAt: '2026-03-05T09:00:00Z', applicants: 8, likes: 20, comments: 6,
    matchScore: 55, deadline: '长期有效', location: '上海', skillRequirements: ['产品设计', '数据分析', '项目管理'],
    isUrgent: true,
  },
  {
    id: 't8', title: 'UI设计实习生', type: 'fulltime', subType: 'intern', priceType: 'monthly',
    description: '设计团队招收UI设计实习生1名，需在校生，每周至少出勤4天，有Figma基础优先。实习期3-6个月，表现优秀可转正。',
    budgetMin: 3000, budgetMax: 5000, tags: ['UI设计', '实习', 'Figma'], status: 'open',
    author: users[0], createdAt: '2026-03-06T10:00:00Z', applicants: 15, likes: 38, comments: 9,
    matchScore: 80, deadline: '2026-04-30', location: '上海', skillRequirements: ['UI设计', 'Figma'],
  },
  {
    id: 't9', title: '数据分析Agent-周期服务', type: 'agent', priceType: 'milestone',
    description: '需要一位数据分析专家作为我们的Agent，每周提供业务数据报告、用户行为分析和增长建议。要求熟悉SQL/Python数据处理，有电商行业经验优先。',
    budgetMin: 8000, budgetMax: 15000, tags: ['数据分析', 'Agent', 'Python'], status: 'open',
    author: users[1], createdAt: '2026-03-05T14:00:00Z', applicants: 3, likes: 16, comments: 5,
    matchScore: 62, deadline: '长期有效', location: '远程', skillRequirements: ['数据分析', 'SQL', 'Python'],
    agentCycle: '每周',
  },
  {
    id: 't10', title: '私域运营Agent-品牌顾问', type: 'agent', priceType: 'milestone',
    description: '寻找一位私域运营专家，作为品牌的长期运营顾问。负责社群策略制定、内容日历规划、关键节点活动策划。每月固定交付运营报告。',
    budgetMin: 6000, budgetMax: 12000, tags: ['运营', 'Agent', '私域'], status: 'open',
    author: users[2], createdAt: '2026-03-04T16:30:00Z', applicants: 6, likes: 22, comments: 7,
    matchScore: 70, deadline: '长期有效', location: '远程', skillRequirements: ['社群运营', '内容策划', '活动策划'],
    agentCycle: '每月',
  },
];

// ─── 评价数据 ──────────────────────────────────────────────

export const MOCK_REVIEWS: Review[] = [
  { id: 'r1', reviewer: users[0], rating: 5, content: '非常专业的设计师！沟通顺畅，交付质量超出预期，改稿耐心细致，下次还合作！', project: '品牌VI设计', createdAt: '2026-02-20' },
  { id: 'r2', reviewer: users[1], rating: 5, content: '效率很高，一周内完成了全部页面设计，风格把握准确，推荐！', project: '电商App设计', createdAt: '2026-01-15' },
  { id: 'r3', reviewer: users[2], rating: 4, content: '整体不错，创意很好，就是时间上稍微有点赶，但最终成品很满意。', project: '小红书运营物料', createdAt: '2025-12-28' },
  { id: 'r4', reviewer: users[3], rating: 5, content: '合作非常愉快，对需求理解到位，出品速度快，强烈推荐！', project: '产品宣传海报', createdAt: '2025-11-10' },
];

// ─── 作品集 ────────────────────────────────────────────────

export const PORTFOLIO_IMAGES: Record<string, string[]> = {
  'tal1': ['https://images.unsplash.com/photo-1760071744047-5542cbfda184?w=400&h=300&fit=crop', 'https://images.unsplash.com/photo-1616205255812-c07c8102cc02?w=400&h=300&fit=crop', 'https://images.unsplash.com/photo-1618761714954-0b8cd0026356?w=400&h=300&fit=crop', 'https://images.unsplash.com/photo-1748801583975-720cb5e4985e?w=400&h=300&fit=crop'],
  'tal2': ['https://images.unsplash.com/photo-1618761714954-0b8cd0026356?w=400&h=300&fit=crop', 'https://images.unsplash.com/photo-1748801583975-720cb5e4985e?w=400&h=300&fit=crop'],
  'tal3': ['https://images.unsplash.com/photo-1760071744047-5542cbfda184?w=400&h=300&fit=crop', 'https://images.unsplash.com/photo-1668775589980-58f9f0021ce5?w=400&h=300&fit=crop'],
  'tal4': ['https://images.unsplash.com/photo-1736175549681-c24c552da1e2?w=400&h=300&fit=crop', 'https://images.unsplash.com/photo-1668775589980-58f9f0021ce5?w=400&h=300&fit=crop'],
  'tal5': ['https://images.unsplash.com/photo-1736175549681-c24c552da1e2?w=400&h=300&fit=crop', 'https://images.unsplash.com/photo-1616205255812-c07c8102cc02?w=400&h=300&fit=crop', 'https://images.unsplash.com/photo-1760071744047-5542cbfda184?w=400&h=300&fit=crop'],
  'tal6': ['https://images.unsplash.com/photo-1616205255812-c07c8102cc02?w=400&h=300&fit=crop', 'https://images.unsplash.com/photo-1668775589980-58f9f0021ce5?w=400&h=300&fit=crop', 'https://images.unsplash.com/photo-1618761714954-0b8cd0026356?w=400&h=300&fit=crop'],
};

// ─── 人才数据 ──────────────────────────────────────────────

export const MOCK_TALENTS: Talent[] = [
  { id: 'tal1', user: CURRENT_USER, acceptTypes: ['UI设计', '品牌设计', '插画'], matchScore: 95, portfolio: [], hourlyRate: '200-400', description: '5年专业UI/UX设计经验，服务过多个互联网头部产品，擅长移动端体验设计与品牌视觉系统搭建。追求像素级完美，注重用户体验细节。', completedProjects: 48, completionRate: 98, rating: 4.8 },
  { id: 'tal2', user: users[1], acceptTypes: ['全栈开发', '小程序', 'Web应用'], matchScore: 82, portfolio: [], hourlyRate: '300-500', description: '全栈工程师，8年开发经验，精通React/Node.js/Python技术栈。热爱技术，擅长将复杂需求拆解为清晰的技术方案。', completedProjects: 86, completionRate: 99, rating: 4.9 },
  { id: 'tal3', user: users[2], acceptTypes: ['文案', '内容策划', '社媒运营'], matchScore: 76, portfolio: [], hourlyRate: '150-300', description: '资深内容创作者，小红书/B站双平台达人，多篇爆款笔记经验。擅长种草文案、品牌故事叙述和社媒内容策划。', completedProjects: 32, completionRate: 95, rating: 4.5 },
  { id: 'tal4', user: users[3], acceptTypes: ['视频剪辑', '短视频', '后期制作'], matchScore: 68, portfolio: [], hourlyRate: '100-250', description: '影视专业科班出身，精通PR/AE/达芬奇，擅长商业宣传片、短视频和Vlog剪辑。注重画面质感与节奏把控。', completedProjects: 67, completionRate: 97, rating: 4.7 },
  { id: 'tal5', user: users[4], acceptTypes: ['插画', 'IP设计', '漫画'], matchScore: 91, portfolio: [], hourlyRate: '250-500', description: '自由插画师，二次元风格为主，也接商业插画和IP形象设计。画风治愈可爱，曾为多个知名IP创作过官方周边。', completedProjects: 21, completionRate: 93, rating: 4.6 },
  { id: 'tal6', user: users[0], acceptTypes: ['品牌策划', '视觉设计', '市场推广'], matchScore: 85, portfolio: [], hourlyRate: '350-600', description: '专注品牌全案策划10年+，从品牌定位到视觉落地一站式服务。为100+品牌提供过成功的品牌升级方案。', completedProjects: 54, completionRate: 96, rating: 4.9 },
];

// ─── 消息数据 ──────────────────────────────────────────────

export const MOCK_MESSAGES: Message[] = [
  { id: 'm1', user: users[0], lastMessage: '好的，那我们明天下午3点视频面试？', timestamp: '2026-03-04T13:20:00Z', unread: 2, type: 'private' },
  { id: 'm2', user: users[1], lastMessage: '作品集已经发给你了，请查收～', timestamp: '2026-03-04T11:45:00Z', unread: 0, type: 'private' },
  { id: 'm3', user: users[4], lastMessage: '关于IP设计的报价，我想再讨论一下', timestamp: '2026-03-04T09:30:00Z', unread: 1, type: 'private' },
  { id: 'm4', user: { ...users[2], name: '系统通知', avatar: '' }, lastMessage: '恭喜！你的任务"新茶饮品牌VI设计"收到了新的申请', timestamp: '2026-03-03T18:00:00Z', unread: 3, type: 'system' },
  { id: 'm5', user: users[3], lastMessage: '视频已经剪辑好了，你看一下效果', timestamp: '2026-03-03T15:10:00Z', unread: 0, type: 'private' },
];

// ─── 兴趣岛数据 ────────────────────────────────────────────

export const MOCK_PLANETS: Planet[] = [
  { id: 'p1', name: '设计星球', emoji: '🎨', color: '#4A8C3F', memberCount: 2341 },
  { id: 'p2', name: '开发星球', emoji: '💻', color: '#1A1A2E', memberCount: 1892 },
  { id: 'p3', name: '文案星球', emoji: '✏️', color: '#6B8C5A', memberCount: 1456 },
  { id: 'p4', name: '视频星球', emoji: '🎬', color: '#7C3AED', memberCount: 987 },
  { id: 'p5', name: '游戏开发星球', emoji: '🎮', color: '#0D9488', memberCount: 654 },
  { id: 'p6', name: '音乐星球', emoji: '🎵', color: '#D97706', memberCount: 432 },
  { id: 'p7', name: 'Agent星球', emoji: '🤖', color: '#F43F5E', memberCount: 1128 },
];

export interface Bubble {
  id: string;
  type: 'talent' | 'task' | 'agent';
  title: string;
  matchScore: number;
  avatar?: string;
  tags: string[];
  refId: string;
  planetId: string;
}

export const MOCK_BUBBLES: Bubble[] = [
  // ── 设计星球 p1 ──
  { id: 'b1', type: 'talent', title: '林小雨', matchScore: 95, avatar: users[4].avatar, tags: ['插画', 'IP设计'], refId: 'tal5', planetId: 'p1' },
  { id: 'b2', type: 'task', title: '二次元IP设计', matchScore: 88, tags: ['插画', '二次元'], refId: 't5', planetId: 'p1' },
  { id: 'b4', type: 'task', title: 'Logo设计', matchScore: 82, tags: ['品牌', '设计'], refId: 't1', planetId: 'p1' },
  { id: 'b9', type: 'talent', title: '王莎莎', matchScore: 85, avatar: users[0].avatar, tags: ['品牌', '策划'], refId: 'tal1', planetId: 'p1' },
  { id: 'b20', type: 'task', title: 'APP界面设计', matchScore: 76, tags: ['UI', 'APP'], refId: 't1', planetId: 'p1' },
  { id: 'b21', type: 'talent', title: '陈设计', matchScore: 68, avatar: users[2].avatar, tags: ['UI', '交互'], refId: 'tal3', planetId: 'p1' },
  // ── 开发星球 p2 ──
  { id: 'b3', type: 'talent', title: '李明', matchScore: 72, avatar: users[1].avatar, tags: ['React', '全栈'], refId: 'tal2', planetId: 'p2' },
  { id: 'b6', type: 'task', title: '小程序开发', matchScore: 78, tags: ['开发', '小程序'], refId: 't2', planetId: 'p2' },
  { id: 'b10', type: 'task', title: 'React后台开发', matchScore: 71, tags: ['React', '后台'], refId: 't4', planetId: 'p2' },
  { id: 'b11', type: 'talent', title: '周全栈', matchScore: 80, avatar: users[3].avatar, tags: ['Node', 'Vue'], refId: 'tal4', planetId: 'p2' },
  { id: 'b12', type: 'task', title: 'H5活动页', matchScore: 65, tags: ['前端', 'H5'], refId: 't2', planetId: 'p2' },
  { id: 'b22', type: 'talent', title: '张后端', matchScore: 58, avatar: users[0].avatar, tags: ['Java', '微服务'], refId: 'tal1', planetId: 'p2' },
  // ── 文案星球 p3 ──
  { id: 'b5', type: 'talent', title: '张艾米', matchScore: 65, avatar: users[2].avatar, tags: ['文案', '小红书'], refId: 'tal3', planetId: 'p3' },
  { id: 'b13', type: 'task', title: '品牌文案策划', matchScore: 74, tags: ['文案', '品牌'], refId: 't1', planetId: 'p3' },
  { id: 'b14', type: 'talent', title: '刘文案', matchScore: 82, avatar: users[4].avatar, tags: ['公众号', '种草'], refId: 'tal5', planetId: 'p3' },
  { id: 'b23', type: 'task', title: '小红书代运营', matchScore: 70, tags: ['小红书', '运营'], refId: 't3', planetId: 'p3' },
  { id: 'b24', type: 'talent', title: '李编辑', matchScore: 60, avatar: users[1].avatar, tags: ['编辑', '校对'], refId: 'tal2', planetId: 'p3' },
  // ── 视频星球 p4 ──
  { id: 'b7', type: 'talent', title: '赵天宇', matchScore: 58, avatar: users[3].avatar, tags: ['剪辑', '特效'], refId: 'tal4', planetId: 'p4' },
  { id: 'b8', type: 'task', title: '品牌宣传视频', matchScore: 45, tags: ['视频', '后期'], refId: 't3', planetId: 'p4' },
  { id: 'b15', type: 'task', title: '短视频拍摄', matchScore: 80, tags: ['短视频', '拍摄'], refId: 't3', planetId: 'p4' },
  { id: 'b16', type: 'talent', title: '孙导演', matchScore: 72, avatar: users[0].avatar, tags: ['导演', '编剧'], refId: 'tal1', planetId: 'p4' },
  { id: 'b25', type: 'task', title: '产品演示动画', matchScore: 66, tags: ['动画', 'MG'], refId: 't5', planetId: 'p4' },
  // ── 游戏开发星球 p5 ──
  { id: 'b17', type: 'talent', title: '吴游戏', matchScore: 88, avatar: users[1].avatar, tags: ['Unity', 'C#'], refId: 'tal2', planetId: 'p5' },
  { id: 'b18', type: 'task', title: '休闲小游戏', matchScore: 75, tags: ['游戏', '休闲'], refId: 't4', planetId: 'p5' },
  { id: 'b26', type: 'talent', title: '郑建模', matchScore: 62, avatar: users[4].avatar, tags: ['3D', '建模'], refId: 'tal5', planetId: 'p5' },
  { id: 'b27', type: 'task', title: '游戏UI设计', matchScore: 70, tags: ['游戏UI', '像素'], refId: 't5', planetId: 'p5' },
  // ── 音乐星球 p6 ──
  { id: 'b19', type: 'talent', title: '钱音乐', matchScore: 70, avatar: users[3].avatar, tags: ['编曲', '混音'], refId: 'tal4', planetId: 'p6' },
  { id: 'b28', type: 'task', title: '广告配乐', matchScore: 78, tags: ['配乐', '广告'], refId: 't3', planetId: 'p6' },
  { id: 'b29', type: 'talent', title: '何歌手', matchScore: 55, avatar: users[2].avatar, tags: ['演唱', '录音'], refId: 'tal3', planetId: 'p6' },
  { id: 'b30', type: 'task', title: '播客片头曲', matchScore: 63, tags: ['音乐', '播客'], refId: 't1', planetId: 'p6' },
  // ── Agent星球 p7 ──
  { id: 'b31', type: 'agent', title: '数据分析Agent', matchScore: 85, tags: ['数据', 'Agent'], refId: 't9', planetId: 'p7' },
  { id: 'b32', type: 'agent', title: '私域运营Agent', matchScore: 78, tags: ['运营', 'Agent'], refId: 't10', planetId: 'p7' },
  { id: 'b33', type: 'talent', title: '李明', matchScore: 72, avatar: users[1].avatar, tags: ['全栈', 'Agent'], refId: 'tal2', planetId: 'p7' },
  { id: 'b34', type: 'agent', title: '设计顾问Agent', matchScore: 90, tags: ['设计', '顾问'], refId: 't9', planetId: 'p7' },
  { id: 'b35', type: 'talent', title: '张艾米', matchScore: 68, avatar: users[2].avatar, tags: ['内容', 'Agent'], refId: 'tal3', planetId: 'p7' },
];

// ─── 技能与分类 ────────────────────────────────────────────

export const SKILL_CATEGORIES = [
  '全部', 'UI设计', '视频剪辑', '文案', '开发', '插画', '品牌', '小红书', '短视频', '摄影', '翻译', '音乐', '数据分析', '运营',
];

// ─── 世界喇叭 ──────────────────────────────────────────────

export const WORLD_MESSAGES = [
  '🎉 林小雨 刚刚完成了"二次元IP设计"项目，获得5星好评！',
  '🔥 新任务发布："新茶饮品牌VI设计"，预算 ¥5,000-15,000',
  '✨ 赵天宇 成功匹配了"产品宣传视频剪辑"任务！',
  '💫 欢迎新用户 周思琪 加入设计星球！',
  '🌟 张艾米 的履约率达到了 97%，获得"金牌创作者"徽章！',
  '🤖 新Agent需求："数据分析Agent"正在招募，周期服务！',
  '🚀 李明 成功接单"私域运营Agent"，开始周期服务！',
];

// ─── Banner数据 ────────────────────────────────────────────

export interface Banner {
  id: string;
  title: string;
  subtitle: string;
  gradient: string;
  link?: string;
}

export const MOCK_BANNERS: Banner[] = [
  { id: 'bn1', title: '雇佣人类Agent', subtitle: '让专业的人为你持续服务', gradient: 'from-rose-500 to-purple-600', link: '/?taskType=agent' },
  { id: 'bn2', title: '众包任务大厅', subtitle: '按结果付费，分阶段交付', gradient: 'from-purple-500 to-indigo-600', link: '/?taskType=crowdsourcing' },
  { id: 'bn3', title: '灵活兼职', subtitle: '自由安排时间，轻松赚外快', gradient: 'from-amber-500 to-orange-600', link: '/?taskType=parttime' },
];

// ─── 钱包数据 ──────────────────────────────────────────────

export const MOCK_WALLET: Wallet = {
  balance: 12580.50,
  frozen: 3000.00,
  inTransit: 5000.00,
  totalIncome: 86350.00,
  totalExpense: 23400.00,
};

export const MOCK_TRANSACTIONS: WalletTransaction[] = [
  { id: 'tx1', type: 'income', amount: 5000, description: '品牌VI设计-第一阶段验收', createdAt: '2026-03-04T10:00:00Z', status: 'completed' },
  { id: 'tx2', type: 'freeze', amount: 3000, description: '任务担保金冻结-小程序开发', createdAt: '2026-03-03T14:00:00Z', status: 'completed' },
  { id: 'tx3', type: 'income', amount: 2000, description: '视频剪辑-全额结算', createdAt: '2026-03-02T16:00:00Z', status: 'completed' },
  { id: 'tx4', type: 'withdraw', amount: 8000, description: '提现到银行卡 ****8842', createdAt: '2026-03-01T09:00:00Z', status: 'completed' },
  { id: 'tx5', type: 'income', amount: 3500, description: 'Agent服务费-数据分析周报', createdAt: '2026-02-28T18:00:00Z', status: 'completed' },
  { id: 'tx6', type: 'expense', amount: 1200, description: '世界喇叭曝光费', createdAt: '2026-02-27T12:00:00Z', status: 'completed' },
];
