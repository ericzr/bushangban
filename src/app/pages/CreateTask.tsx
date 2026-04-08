import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router';
import {
  ArrowLeft, Camera, Plus, X, CalendarDays, MapPin, Clock, Briefcase, DollarSign, Users, Zap,
  Info, CheckCircle2, Palette, Code, PenTool, Video, Megaphone, Languages, Lightbulb, MoreHorizontal,
  Home, Building2, RefreshCw, Sparkles, Bot, Target, GraduationCap,
} from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router';
import { cn } from '../../lib/utils';
import { TASK_TYPE_CONFIG, type TaskType } from '../data/mock';

const TASK_CATEGORIES = [
  { value: 'design', label: '设计', Icon: Palette },
  { value: 'development', label: '开发', Icon: Code },
  { value: 'writing', label: '文案', Icon: PenTool },
  { value: 'video', label: '视频', Icon: Video },
  { value: 'marketing', label: '市场营销', Icon: Megaphone },
  { value: 'translation', label: '翻译', Icon: Languages },
  { value: 'consulting', label: '咨询', Icon: Lightbulb },
  { value: 'other', label: '其他', Icon: MoreHorizontal },
];

const WORK_MODES = [
  { value: 'remote', label: '远程', Icon: Home },
  { value: 'onsite', label: '线下', Icon: Building2 },
  { value: 'hybrid', label: '混合', Icon: RefreshCw },
];

const URGENCY_LEVELS = [
  { value: 'normal', label: '不急', colorClass: 'text-success bg-success-light' },
  { value: 'soon', label: '较急', colorClass: 'text-warning bg-warning-light' },
  { value: 'urgent', label: '加急', colorClass: 'text-coral bg-coral-light' },
];

const TASK_TYPE_OPTIONS: { key: TaskType; label: string; desc: string; Icon: React.ElementType }[] = [
  { key: 'intern',        label: '实习',    desc: '实习岗位，培养新人',           Icon: GraduationCap },
  { key: 'parttime',      label: '兼职',    desc: '灵活时间，按时计费',           Icon: Clock },
  { key: 'crowdsourcing', label: '众包任务', desc: '按成果付费，支持里程碑',       Icon: Target },
  { key: 'agent',         label: 'Agent任务', desc: '自动化Agent，周期持续服务', Icon: Bot },
];

const AGENT_CYCLES = ['每周', '每两周', '每月', '每季度'];

export function CreateTask() {
  const { register, handleSubmit, formState: { errors }, watch } = useForm({
    defaultValues: { title: '', description: '', budgetMin: '', budgetMax: '', category: '', location: '', deadline: '', contactWechat: '', requirements: '' },
  });
  const navigate = useNavigate();

  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [workMode, setWorkMode] = useState('remote');
  const [urgency, setUrgency] = useState('normal');
  const [headcount, setHeadcount] = useState(1);
  const [step, setStep] = useState(1);
  const [showSuccess, setShowSuccess] = useState(false);

  const [taskType, setTaskType] = useState<TaskType>('crowdsourcing');
  const [milestones, setMilestones] = useState<{ name: string; pct: number }[]>([{ name: '', pct: 100 }]);
  const [agentCycle, setAgentCycle] = useState('每月');

  const typeConfig = TASK_TYPE_CONFIG[taskType];

  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim()) && tags.length < 8) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };
  const removeTag = (tag: string) => setTags(tags.filter(t => t !== tag));

  const onSubmit = (data: any) => {
    console.log({ ...data, tags, workMode, urgency, headcount, selectedCategory, taskType, milestones, agentCycle });
    setShowSuccess(true);
    setTimeout(() => { setShowSuccess(false); navigate('/'); }, 2000);
  };

  const suggestedTags = ['UI设计', '前端开发', '后端开发', '文案撰写', '视频剪辑', '插画绘制', '小程序', '品牌设计', '数据分析', '运营'];
  const totalSteps = 3;
  const progress = (step / totalSteps) * 100;

  const pricePlaceholder = () => {
    if (taskType === 'intern') return { min: '3000', max: '6000', unit: '/月' };
    if (taskType === 'parttime') return { min: '100', max: '300', unit: '/时' };
    if (taskType === 'agent') return { min: '5000', max: '15000', unit: '/周期' };
    return { min: '1000', max: '5000', unit: '' };
  };
  const pp = pricePlaceholder();

  return (
    <div className="flex flex-col pb-8 min-h-screen" style={{ paddingTop: 'calc(var(--safe-top) + 49px)' }}>
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 z-40 bg-white/80 backdrop-blur-md border-b border-border" style={{ paddingTop: 'var(--safe-top)' }}>
        <div className="flex items-center gap-3 px-4 py-3">
          <Link to="/" className="text-muted-foreground"><ArrowLeft className="h-5 w-5" /></Link>
          <h1 className="text-sm text-foreground flex-1">发布新工作</h1>
          <span className={cn('rounded-md px-2 py-0.5 text-[11px]', typeConfig.badgeClass)}>{typeConfig.label}</span>
          <span className="text-xs text-foreground">{step}/{totalSteps}</span>
        </div>
        <div className="h-0.5 bg-secondary">
          <div className={cn('h-full transition-all duration-500', typeConfig.barColor)} style={{ width: `${progress}%` }} />
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5 px-4 pt-5 flex-1">

        {/* ========= Step 1 ========= */}
        {step === 1 && (
          <>
            {/* Task Type Selector */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="h-5 w-1 rounded-full bg-primary" />
                <span className="text-sm text-foreground">选择任务类型</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {TASK_TYPE_OPTIONS.map(opt => {
                  const cfg = TASK_TYPE_CONFIG[opt.key];
                  const active = taskType === opt.key;
                  return (
                    <button key={opt.key} type="button" onClick={() => setTaskType(opt.key)}
                      className={cn('flex items-center gap-3 rounded-2xl p-3 text-left border transition-all',
                        active ? `border-current ${cfg.badgeClass} shadow-sm` : 'border-border bg-white/60'
                      )}>
                      <div className={cn('rounded-xl p-2', active ? 'bg-white/60' : cfg.bgColor)}>
                        <opt.Icon className={cn('h-5 w-5', cfg.color)} />
                      </div>
                      <div>
                        <p className={cn('text-sm font-medium', active ? '' : 'text-foreground')}>{opt.label}</p>
                        <p className={cn('text-[10px]', active ? 'opacity-70' : 'text-muted-foreground')}>{opt.desc}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Title */}
            <div>
              <label className="text-sm text-foreground mb-1.5 flex items-center gap-1">
                <Briefcase className="h-3.5 w-3.5 text-foreground" />
                {taskType === 'intern' ? '实习岗位名称' : taskType === 'agent' ? 'Agent 服务名称' : '任务标题'} <span className="text-coral">*</span>
              </label>
              <input {...register('title', { required: true })}
                placeholder={taskType === 'intern' ? '例如：UI设计实习生' : taskType === 'agent' ? '例如：数据分析Agent-周期服务' : '例如：为我的品牌设计一套VI系统'}
                maxLength={50}
                className="w-full rounded-2xl border border-border bg-secondary/30 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary/10 transition-all"
              />
              <div className="flex justify-between mt-1">
                {errors.title ? <span className="text-xs text-coral">请填写标题</span> : <span className="text-xs text-muted-foreground">简洁描述你需要完成的工作</span>}
                <span className="text-xs text-muted-foreground">{(watch('title') || '').length}/50</span>
              </div>
            </div>

            {/* Category */}
            <div>
              <label className="text-sm text-foreground mb-2 block">分类 <span className="text-coral">*</span></label>
              <div className="grid grid-cols-4 gap-2">
                {TASK_CATEGORIES.map(cat => (
                  <button key={cat.value} type="button" onClick={() => setSelectedCategory(cat.value)}
                    className={cn('flex flex-col items-center gap-1 rounded-2xl py-3 text-xs transition-all border',
                      selectedCategory === cat.value ? 'bg-primary/5 border-primary text-foreground shadow-sm' : 'bg-white/60 border-border text-muted-foreground'
                    )}>
                    <cat.Icon className="h-5 w-5" /><span>{cat.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="text-sm text-foreground mb-1.5 block">详细描述 <span className="text-coral">*</span></label>
              <textarea {...register('description', { required: true })}
                placeholder={taskType === 'agent' ? '描述你需要Agent提供的持续服务内容、交付要求、沟通频率...' : '详细描述你需要完成的工作内容、具体要求和期望效果...'}
                rows={5}
                className="w-full rounded-2xl border border-border bg-secondary/30 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary/10 resize-none transition-all"
              />
              {errors.description && <span className="text-xs text-coral mt-1">请填写描述</span>}
            </div>

            {/* Attachments */}
            <div>
              <label className="text-sm text-foreground mb-1.5 block">参考附件</label>
              <div className="flex gap-3">
                <div className="flex h-20 w-20 items-center justify-center rounded-2xl border-2 border-dashed border-border hover:border-primary hover:bg-secondary/30 transition-colors cursor-pointer">
                  <div className="flex flex-col items-center"><Camera className="h-5 w-5 text-foreground/30" /><p className="text-[10px] text-muted-foreground mt-1">添加图片</p></div>
                </div>
                <div className="flex h-20 w-20 items-center justify-center rounded-2xl border-2 border-dashed border-border hover:border-primary hover:bg-secondary/30 transition-colors cursor-pointer">
                  <div className="flex flex-col items-center"><Plus className="h-5 w-5 text-foreground/30" /><p className="text-[10px] text-muted-foreground mt-1">添加文件</p></div>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-1.5">支持图片、PDF，最多5个文件</p>
            </div>
          </>
        )}

        {/* ========= Step 2 ========= */}
        {step === 2 && (
          <>
            <div className="flex items-center gap-2">
              <div className="h-5 w-1 rounded-full bg-primary" />
              <span className="text-sm text-foreground">详细设置</span>
            </div>

            {/* Budget */}
            <div>
              <label className="text-sm text-foreground mb-1.5 flex items-center gap-1">
                <DollarSign className="h-3.5 w-3.5 text-foreground" />
                {taskType === 'intern' ? '实习薪资 (¥/月)' : taskType === 'parttime' ? '时薪范围 (¥/时)' : taskType === 'agent' ? '服务费范围 (¥/周期)' : '预算范围 (¥)'}
              </label>
              <div className="grid grid-cols-2 gap-3">
                <input type="number" {...register('budgetMin')} placeholder={pp.min}
                  className="w-full rounded-2xl border border-border bg-secondary/30 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary/10" />
                <input type="number" {...register('budgetMax')} placeholder={pp.max}
                  className="w-full rounded-2xl border border-border bg-secondary/30 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary/10" />
              </div>
            </div>

            {/* Agent Cycle */}
            {taskType === 'agent' && (
              <div>
                <label className="text-sm text-foreground mb-2 flex items-center gap-1"><RefreshCw className="h-3.5 w-3.5" /> 服务周期</label>
                <div className="flex flex-wrap gap-2">
                  {AGENT_CYCLES.map(c => (
                    <button key={c} type="button" onClick={() => setAgentCycle(c)}
                      className={cn('rounded-full px-3.5 py-1.5 text-sm border transition-all',
                        agentCycle === c ? 'bg-rose-50 border-rose-300 text-rose-600' : 'bg-white/60 border-border text-muted-foreground'
                      )}>{c}</button>
                  ))}
                </div>
              </div>
            )}

            {/* Milestones for crowdsourcing */}
            {taskType === 'crowdsourcing' && (
              <div>
                <label className="text-sm text-foreground mb-2 flex items-center gap-1"><Target className="h-3.5 w-3.5" /> 里程碑</label>
                <div className="space-y-2">
                  {milestones.map((ms, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <input value={ms.name} onChange={e => { const arr = [...milestones]; arr[i].name = e.target.value; setMilestones(arr); }}
                        placeholder={`阶段 ${i + 1} 名称`}
                        className="flex-1 rounded-xl border border-border bg-secondary/30 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/10" />
                      <div className="flex items-center gap-1 w-20">
                        <input type="number" min={1} max={100} value={ms.pct}
                          onChange={e => { const arr = [...milestones]; arr[i].pct = Number(e.target.value); setMilestones(arr); }}
                          className="w-full rounded-xl border border-border bg-secondary/30 px-2 py-2 text-sm text-center outline-none" />
                        <span className="text-xs text-muted-foreground">%</span>
                      </div>
                      {milestones.length > 1 && (
                        <button type="button" onClick={() => setMilestones(milestones.filter((_, j) => j !== i))} className="text-muted-foreground"><X className="h-4 w-4" /></button>
                      )}
                    </div>
                  ))}
                </div>
                {milestones.length < 5 && (
                  <button type="button" onClick={() => setMilestones([...milestones, { name: '', pct: 0 }])}
                    className="flex items-center gap-1 mt-2 text-xs text-primary"><Plus className="h-3 w-3" /> 添加里程碑</button>
                )}
                <p className="text-xs text-muted-foreground mt-1">比例合计应为 100%，当前 {milestones.reduce((s, m) => s + m.pct, 0)}%</p>
              </div>
            )}

            {/* Work Mode */}
            <div>
              <label className="text-sm text-foreground mb-2 flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> 工作方式</label>
              <div className="flex gap-2">
                {WORK_MODES.map(wm => (
                  <button key={wm.value} type="button" onClick={() => setWorkMode(wm.value)}
                    className={cn('flex-1 flex items-center justify-center gap-1.5 rounded-xl py-2.5 text-sm transition-all border',
                      workMode === wm.value ? 'bg-primary/5 border-primary text-foreground' : 'bg-white/60 border-border text-muted-foreground'
                    )}><wm.Icon className="h-4 w-4" />{wm.label}</button>
                ))}
              </div>
            </div>

            {workMode !== 'remote' && (
              <div>
                <label className="text-sm text-foreground mb-1.5 block">工作城市</label>
                <input {...register('location')} placeholder="例如：上海、北京"
                  className="w-full rounded-2xl border border-border bg-secondary/30 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary/10" />
              </div>
            )}

            {/* Deadline */}
            <div>
              <label className="text-sm text-foreground mb-1.5 flex items-center gap-1"><CalendarDays className="h-3.5 w-3.5" /> {taskType === 'fulltime' ? '截止投递日期' : '截止日期'}</label>
              <input type="date" {...register('deadline')}
                className="w-full rounded-2xl border border-border bg-secondary/30 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary/10" />
            </div>

            {/* Urgency */}
            <div>
              <label className="text-sm text-foreground mb-2 flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> 紧急程度</label>
              <div className="flex gap-2">
                {URGENCY_LEVELS.map(ul => (
                  <button key={ul.value} type="button" onClick={() => setUrgency(ul.value)}
                    className={cn('flex-1 rounded-xl py-2.5 text-sm transition-all border',
                      urgency === ul.value ? `shadow-sm ${ul.colorClass} border-current` : 'bg-white/60 border-border text-muted-foreground'
                    )}>{ul.label}</button>
                ))}
              </div>
            </div>

            {/* Headcount */}
            <div>
              <label className="text-sm text-foreground mb-2 flex items-center gap-1"><Users className="h-3.5 w-3.5" /> 招募人数</label>
              <div className="flex items-center gap-4">
                <button type="button" onClick={() => setHeadcount(Math.max(1, headcount - 1))} className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary text-foreground">-</button>
                <span className="text-lg text-foreground w-8 text-center">{headcount}</span>
                <button type="button" onClick={() => setHeadcount(Math.min(10, headcount + 1))} className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary text-foreground">+</button>
                <span className="text-xs text-muted-foreground">人</span>
              </div>
            </div>

            {/* Skill Tags */}
            <div>
              <label className="text-sm text-foreground mb-1.5 block">技能标签</label>
              <div className="flex items-center gap-2 mb-2">
                <input value={tagInput} onChange={e => setTagInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addTag())}
                  placeholder="输入标签后回车添加..."
                  className="flex-1 rounded-full border border-border bg-secondary/30 px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/10" />
                <button type="button" onClick={addTag} className="rounded-full bg-primary p-2 text-primary-foreground"><Plus className="h-4 w-4" /></button>
              </div>
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {tags.map(tag => (
                    <span key={tag} className="flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-1 text-xs text-foreground">
                      {tag}<button type="button" onClick={() => removeTag(tag)}><X className="h-3 w-3" /></button>
                    </span>
                  ))}
                </div>
              )}
              <div className="flex flex-wrap gap-1.5">
                {suggestedTags.filter(t => !tags.includes(t)).map(tag => (
                  <button key={tag} type="button" onClick={() => tags.length < 8 && setTags([...tags, tag])}
                    className="rounded-full bg-secondary px-2.5 py-1 text-xs text-muted-foreground hover:bg-primary/10 hover:text-foreground transition-colors">+ {tag}</button>
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-1">最多8个标签，已添加 {tags.length}/8</p>
            </div>
          </>
        )}

        {/* ========= Step 3 ========= */}
        {step === 3 && (
          <>
            <div className="flex items-center gap-2">
              <div className="h-5 w-1 rounded-full bg-primary" />
              <span className="text-sm text-foreground">预览确认</span>
            </div>

            <div className="rounded-2xl bg-white border border-border overflow-hidden">
              <div className="p-4 pb-3 border-b border-border">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-sm text-foreground flex-1 pr-2">{watch('title') || '未填写标题'}</h3>
                  <div className="flex gap-1.5">
                    <span className={cn('rounded-md px-2 py-0.5 text-[11px]', typeConfig.badgeClass)}>
                      {taskType === 'fulltime' && subType === 'intern' ? '实习' : typeConfig.label}
                    </span>
                    <span className={cn('rounded-full px-2 py-0.5 text-xs flex-shrink-0', URGENCY_LEVELS.find(u => u.value === urgency)?.colorClass)}>
                      {URGENCY_LEVELS.find(u => u.value === urgency)?.label}
                    </span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                  {selectedCategory && (() => { const cat = TASK_CATEGORIES.find(c => c.value === selectedCategory); return cat ? <span className="flex items-center gap-0.5"><cat.Icon className="h-3 w-3" />{cat.label}</span> : null; })()}
                  {(() => { const wm = WORK_MODES.find(w => w.value === workMode); return wm ? <span className="flex items-center gap-0.5"><wm.Icon className="h-3 w-3" /> {wm.label}</span> : null; })()}
                  <span className="flex items-center gap-0.5"><Users className="h-3 w-3" /> {headcount}人</span>
                  {taskType === 'agent' && <span className="flex items-center gap-0.5"><RefreshCw className="h-3 w-3" /> {agentCycle}</span>}
                </div>
              </div>
              <div className="p-4 space-y-3">
                <p className="text-xs text-muted-foreground line-clamp-3">{watch('description') || '未填写描述'}</p>
                <div className="flex items-center gap-2">
                  <DollarSign className="h-3.5 w-3.5 text-warning" />
                  <span className="text-sm text-foreground">¥{watch('budgetMin') || '?'} - ¥{watch('budgetMax') || '?'}{pp.unit}</span>
                </div>
                {taskType === 'crowdsourcing' && milestones.filter(m => m.name).length > 0 && (
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">里程碑：</p>
                    {milestones.filter(m => m.name).map((ms, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs">
                        <div className="h-1.5 w-1.5 rounded-full bg-purple-400" />
                        <span className="text-foreground">{ms.name}</span>
                        <span className="text-muted-foreground">{ms.pct}%</span>
                      </div>
                    ))}
                  </div>
                )}
                {watch('deadline') && (
                  <div className="flex items-center gap-2"><CalendarDays className="h-3.5 w-3.5 text-foreground" /><span className="text-xs text-muted-foreground">截止：{watch('deadline')}</span></div>
                )}
                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {tags.map(tag => <span key={tag} className="rounded-full bg-secondary px-2.5 py-0.5 text-xs text-foreground">{tag}</span>)}
                  </div>
                )}
              </div>
            </div>

            <div className="rounded-2xl bg-white/90 border border-border p-4 space-y-3">
              <label className="text-sm text-foreground mb-1.5 block">补充要求（选填）</label>
              <textarea {...register('requirements')} placeholder="其他需要告知接单者的要求..." rows={3}
                className="w-full rounded-2xl border border-border bg-secondary/30 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary/10 resize-none" />
            </div>

            <div className="rounded-2xl bg-white/90 border border-border p-4">
              <label className="text-sm text-foreground mb-1.5 block">联系方式（选填）</label>
              <input {...register('contactWechat')} placeholder="微信号（仅双方确认后可见）"
                className="w-full rounded-2xl border border-border bg-secondary/30 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary/10" />
              <div className="flex items-start gap-1.5 mt-2">
                <Info className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0 mt-0.5" />
                <p className="text-xs text-muted-foreground">联系方式仅在双方达成意向后展示，保护你的隐私安全</p>
              </div>
            </div>

            <div className="rounded-2xl bg-success-light border border-success/20 p-3 flex items-start gap-2">
              <Zap className="h-4 w-4 text-success flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-xs text-foreground">发布后将进入「任务广场」</p>
                <p className="text-xs text-muted-foreground mt-0.5">系统会自动为你匹配合适的人才，你也可以在兴趣岛看到气泡推荐</p>
              </div>
            </div>
          </>
        )}

        {/* Actions */}
        <div className="flex gap-3 pt-2 pb-4 mt-auto">
          {step > 1 && <button type="button" onClick={() => setStep(step - 1)} className="flex-1 rounded-xl bg-secondary py-3 text-sm text-muted-foreground">上一步</button>}
          {step === 1 && <button type="button" onClick={() => navigate('/')} className="flex-1 rounded-xl bg-secondary py-3 text-sm text-muted-foreground">取消</button>}
          {step < totalSteps ? (
            <button type="button" onClick={() => setStep(step + 1)} className="flex-1 rounded-xl bg-primary py-3 text-sm text-primary-foreground shadow-sm">下一步</button>
          ) : (
            <button type="submit" className="flex items-center justify-center gap-1.5 flex-1 rounded-xl bg-primary py-3 text-sm text-primary-foreground shadow-sm">
              <Sparkles className="h-4 w-4" /> 发布工作
            </button>
          )}
        </div>
      </form>

      {showSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
          <div className="flex flex-col items-center gap-3 rounded-3xl bg-white px-10 py-8 shadow-xl">
            <CheckCircle2 className="h-14 w-14 text-success" />
            <h3 className="text-base text-foreground">发布成功！</h3>
            <p className="text-xs text-muted-foreground text-center">你的工作已进入广场<br />等待人才来接单吧～</p>
          </div>
        </div>
      )}
    </div>
  );
}
