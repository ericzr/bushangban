import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { ArrowLeft, Camera, Check, Plus, Trash2, GraduationCap, Briefcase, Link2, Sparkles, X } from 'lucide-react';
import { CURRENT_USER } from '../data/mock';
import { cn } from '../../lib/utils';

/* ---- 类型 ---- */
interface Education { school: string; major: string; degree: string; years: string; }
interface WorkExp { company: string; position: string; period: string; type: string; }
interface PortfolioLink { url: string; desc: string; }
interface SkillItem { name: string; level: string; }

/* ---- 初始数据（与 Profile 简历 Tab 对齐） ---- */
const INIT_EDU: Education[] = [
  { school: '中国美术学院', major: '视觉传达设计', degree: '本科', years: '2017-2021' },
];
const INIT_WORK: WorkExp[] = [
  { company: '自由设计师', position: '', period: '2023年至今', type: '自由职业' },
  { company: '某互联网大厂', position: 'UI设计师', period: '2021-2023', type: '全职' },
];
const INIT_LINKS: PortfolioLink[] = [
  { url: 'dribbble.com/chenxiaowen', desc: 'Dribbble 作品集' },
];

/* ---- 通用输入样式 ---- */
const inputCls = 'w-full rounded-xl border border-border bg-secondary/30 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/10';
const halfInputCls = 'flex-1 rounded-xl border border-border bg-secondary/30 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/10';

/* ---- 组件 ---- */
export function EditProfile() {
  const navigate = useNavigate();
  const [saved, setSaved] = useState(false);

  // 基础信息
  const [name, setName] = useState(CURRENT_USER.name);
  const [role, setRole] = useState(CURRENT_USER.role);
  const [bio, setBio] = useState(CURRENT_USER.bio);
  const [city, setCity] = useState(CURRENT_USER.city);

  // 教育背景
  const [eduList, setEduList] = useState<Education[]>(INIT_EDU);
  // 工作经历
  const [workList, setWorkList] = useState<WorkExp[]>(INIT_WORK);
  // 作品链接
  const [linkList, setLinkList] = useState<PortfolioLink[]>(INIT_LINKS);
  // 技能标签
  const [skills, setSkills] = useState<SkillItem[]>([...CURRENT_USER.skills]);
  const [showAddSkill, setShowAddSkill] = useState(false);
  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillLevel, setNewSkillLevel] = useState('入门');

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => { setSaved(false); navigate('/profile'); }, 1000);
  };

  /* ---- 教育背景操作 ---- */
  const updateEdu = (i: number, patch: Partial<Education>) =>
    setEduList(l => l.map((e, idx) => idx === i ? { ...e, ...patch } : e));
  const addEdu = () => setEduList(l => [...l, { school: '', major: '', degree: '本科', years: '' }]);
  const removeEdu = (i: number) => setEduList(l => l.filter((_, idx) => idx !== i));

  /* ---- 工作经历操作 ---- */
  const updateWork = (i: number, patch: Partial<WorkExp>) =>
    setWorkList(l => l.map((e, idx) => idx === i ? { ...e, ...patch } : e));
  const addWork = () => setWorkList(l => [...l, { company: '', position: '', period: '', type: '全职' }]);
  const removeWork = (i: number) => setWorkList(l => l.filter((_, idx) => idx !== i));

  /* ---- 作品链接操作 ---- */
  const updateLink = (i: number, patch: Partial<PortfolioLink>) =>
    setLinkList(l => l.map((e, idx) => idx === i ? { ...e, ...patch } : e));
  const addLink = () => setLinkList(l => [...l, { url: '', desc: '' }]);
  const removeLink = (i: number) => setLinkList(l => l.filter((_, idx) => idx !== i));

  /* ---- 技能操作 ---- */
  const addSkill = () => {
    if (newSkillName.trim()) {
      setSkills(s => [...s, { name: newSkillName.trim(), level: newSkillLevel }]);
      setNewSkillName('');
      setShowAddSkill(false);
    }
  };
  const removeSkill = (i: number) => setSkills(s => s.filter((_, idx) => idx !== i));

  return (
    <div className="flex flex-col pb-8" style={{ paddingTop: "calc(var(--safe-top) + 49px)" }}>
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between bg-white/80 backdrop-blur-md px-4 py-3 border-b border-border" style={{ paddingTop: "var(--safe-top)" }}>
        <Link to="/profile" className="text-muted-foreground"><ArrowLeft className="h-5 w-5" /></Link>
        <h1 className="text-sm text-foreground">编辑资料</h1>
        <button onClick={handleSave} className={cn('rounded-full px-3 py-1 text-xs transition-colors', saved ? 'bg-success-light text-success' : 'bg-primary text-primary-foreground')}>
          {saved ? <><Check className="h-3 w-3 inline mr-1" />已保存</> : '保存'}
        </button>
      </div>

      <div className="px-4 pt-6 space-y-6">
        {/* ===== 头像 ===== */}
        <div className="flex justify-center">
          <div className="relative">
            <img src={CURRENT_USER.avatar} alt="" className="h-20 w-20 rounded-2xl object-cover ring-1 ring-border" />
            <div className="absolute -bottom-1 -right-1 rounded-full bg-primary p-1.5">
              <Camera className="h-3.5 w-3.5 text-primary-foreground" />
            </div>
          </div>
        </div>

        {/* ===== 基础信息 ===== */}
        <section className="space-y-3">
          <h3 className="text-sm text-foreground font-medium">基础信息</h3>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">昵称</label>
            <input value={name} onChange={e => setName(e.target.value)} className={inputCls} />
          </div>
          <div className="flex gap-3">
            <div className="flex-1">
              <label className="text-xs text-muted-foreground mb-1 block">职业</label>
              <input value={role} onChange={e => setRole(e.target.value)} className={inputCls} />
            </div>
            <div className="flex-1">
              <label className="text-xs text-muted-foreground mb-1 block">城市</label>
              <input value={city} onChange={e => setCity(e.target.value)} className={inputCls} />
            </div>
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">个人简介</label>
            <textarea value={bio} onChange={e => setBio(e.target.value)} rows={3} className={cn(inputCls, 'resize-none')} />
          </div>
        </section>

        {/* ===== 教育背景 ===== */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="flex items-center gap-1.5 text-sm text-foreground font-medium">
              <GraduationCap className="h-4 w-4 text-info" /> 教育背景
            </h3>
            <button onClick={addEdu} className="flex items-center gap-0.5 text-xs text-primary">
              <Plus className="h-3.5 w-3.5" /> 添加
            </button>
          </div>
          {eduList.map((edu, i) => (
            <div key={i} className="rounded-2xl bg-white border border-border p-3.5 space-y-2.5 relative group">
              <button onClick={() => removeEdu(i)} className="absolute top-3 right-3 text-muted-foreground opacity-0 group-active:opacity-100 group-hover:opacity-100 transition-opacity">
                <Trash2 className="h-3.5 w-3.5" />
              </button>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">学校</label>
                <input value={edu.school} onChange={e => updateEdu(i, { school: e.target.value })} placeholder="学校名称" className={inputCls} />
              </div>
              <div className="flex gap-2">
                <div className="flex-1">
                  <label className="text-xs text-muted-foreground mb-1 block">专业</label>
                  <input value={edu.major} onChange={e => updateEdu(i, { major: e.target.value })} placeholder="专业名称" className={halfInputCls} />
                </div>
                <div className="w-20">
                  <label className="text-xs text-muted-foreground mb-1 block">学历</label>
                  <select value={edu.degree} onChange={e => updateEdu(i, { degree: e.target.value })} className={cn(halfInputCls, 'appearance-none')}>
                    {['高中', '大专', '本科', '硕士', '博士'].map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">起止年份</label>
                <input value={edu.years} onChange={e => updateEdu(i, { years: e.target.value })} placeholder="如 2017-2021" className={inputCls} />
              </div>
            </div>
          ))}
        </section>

        {/* ===== 工作经历 ===== */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="flex items-center gap-1.5 text-sm text-foreground font-medium">
              <Briefcase className="h-4 w-4 text-purple" /> 工作经历
            </h3>
            <button onClick={addWork} className="flex items-center gap-0.5 text-xs text-primary">
              <Plus className="h-3.5 w-3.5" /> 添加
            </button>
          </div>
          {workList.map((w, i) => (
            <div key={i} className="rounded-2xl bg-white border border-border p-3.5 space-y-2.5 relative group">
              <button onClick={() => removeWork(i)} className="absolute top-3 right-3 text-muted-foreground opacity-0 group-active:opacity-100 group-hover:opacity-100 transition-opacity">
                <Trash2 className="h-3.5 w-3.5" />
              </button>
              <div className="flex gap-2">
                <div className="flex-1">
                  <label className="text-xs text-muted-foreground mb-1 block">公司/组织</label>
                  <input value={w.company} onChange={e => updateWork(i, { company: e.target.value })} placeholder="公司名称" className={halfInputCls} />
                </div>
                <div className="flex-1">
                  <label className="text-xs text-muted-foreground mb-1 block">职位</label>
                  <input value={w.position} onChange={e => updateWork(i, { position: e.target.value })} placeholder="职位名称" className={halfInputCls} />
                </div>
              </div>
              <div className="flex gap-2">
                <div className="flex-1">
                  <label className="text-xs text-muted-foreground mb-1 block">时间段</label>
                  <input value={w.period} onChange={e => updateWork(i, { period: e.target.value })} placeholder="如 2021-2023" className={halfInputCls} />
                </div>
                <div className="w-24">
                  <label className="text-xs text-muted-foreground mb-1 block">类型</label>
                  <select value={w.type} onChange={e => updateWork(i, { type: e.target.value })} className={cn(halfInputCls, 'appearance-none')}>
                    {['全职', '兼职', '实习', '自由职业', '远程'].map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
              </div>
            </div>
          ))}
        </section>

        {/* ===== 作品链接 ===== */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="flex items-center gap-1.5 text-sm text-foreground font-medium">
              <Link2 className="h-4 w-4 text-success" /> 作品链接
            </h3>
            <button onClick={addLink} className="flex items-center gap-0.5 text-xs text-primary">
              <Plus className="h-3.5 w-3.5" /> 添加
            </button>
          </div>
          {linkList.map((lk, i) => (
            <div key={i} className="rounded-2xl bg-white border border-border p-3.5 space-y-2.5 relative group">
              <button onClick={() => removeLink(i)} className="absolute top-3 right-3 text-muted-foreground opacity-0 group-active:opacity-100 group-hover:opacity-100 transition-opacity">
                <Trash2 className="h-3.5 w-3.5" />
              </button>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">链接地址</label>
                <input value={lk.url} onChange={e => updateLink(i, { url: e.target.value })} placeholder="https://..." className={inputCls} />
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">描述</label>
                <input value={lk.desc} onChange={e => updateLink(i, { desc: e.target.value })} placeholder="如 Dribbble 作品集" className={inputCls} />
              </div>
            </div>
          ))}
        </section>

        {/* ===== 技能标签 ===== */}
        <section className="space-y-3">
          <h3 className="flex items-center gap-1.5 text-sm text-foreground font-medium">
            <Sparkles className="h-4 w-4 text-warning" /> 技能标签
          </h3>
          <div className="flex flex-wrap gap-1.5">
            {skills.map((skill, i) => (
              <div key={skill.name + i} className="flex items-center gap-1 rounded-full bg-secondary px-3 py-1 group">
                <span className="text-xs text-foreground">{skill.name}</span>
                <span className={cn(
                  'text-[10px] rounded-full px-1.5',
                  skill.level === '专业' ? 'bg-primary/15 text-foreground' :
                  skill.level === '熟练' ? 'bg-success-light text-success' :
                  'bg-secondary text-muted-foreground'
                )}>{skill.level}</span>
                <button onClick={() => removeSkill(i)} className="ml-0.5 text-muted-foreground hover:text-foreground transition-colors">
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
            {!showAddSkill && (
              <button onClick={() => { setShowAddSkill(true); setNewSkillName(''); setNewSkillLevel('入门'); }}
                className="flex items-center gap-1 rounded-full border border-dashed border-primary/30 bg-secondary/40 px-3 py-1 text-xs text-foreground hover:bg-secondary transition-colors">
                <Plus className="h-3 w-3" /> 添加技能
              </button>
            )}
          </div>
          {showAddSkill && (
            <div className="rounded-2xl bg-white border border-border p-3 space-y-2">
              <input value={newSkillName} onChange={e => setNewSkillName(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') addSkill(); }}
                autoFocus placeholder="输入技能名称"
                className="w-full rounded-full border border-border bg-secondary/30 px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-primary/10" />
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">熟练度</span>
                <div className="flex gap-1.5 flex-1">
                  {['入门', '熟练', '专业'].map(level => (
                    <button key={level} type="button" onClick={() => setNewSkillLevel(level)}
                      className={cn('rounded-full px-2.5 py-0.5 text-xs transition-all',
                        newSkillLevel === level
                          ? level === '专业' ? 'bg-primary/15 text-foreground'
                            : level === '熟练' ? 'bg-success-light text-success'
                            : 'bg-secondary text-muted-foreground'
                          : 'bg-secondary/50 text-muted-foreground/50'
                      )}>{level}</button>
                  ))}
                </div>
                <button onClick={() => setShowAddSkill(false)} className="rounded-full px-2.5 py-1 text-xs text-muted-foreground">取消</button>
                <button onClick={addSkill} className="rounded-full bg-primary px-3 py-1 text-xs text-primary-foreground">确定</button>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
