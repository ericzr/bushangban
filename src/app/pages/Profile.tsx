import { useState } from 'react';
import { CURRENT_USER, MOCK_TASKS, MOCK_WALLET, MOCK_TRANSACTIONS, MY_ACCEPTED_ORDERS, TASK_TYPE_CONFIG, type UserRole } from '../data/mock';
import { cn } from '../../lib/utils';
import {
  MapPin, Star, Award, Clock, CheckCircle, ChevronRight, Settings, Edit,
  Shield, Briefcase, BookOpen, FileText, Plus, X, GraduationCap, Link2,
  Wallet, ArrowUpRight, ArrowDownLeft, Snowflake, TrendingUp, RefreshCw, Building2,
  Users, Heart, Send, Handshake, Zap, Bot, Target, AlertCircle,
} from 'lucide-react';
import { Link } from 'react-router';
import { formatDistanceToNow } from 'date-fns';
import { zhCN } from 'date-fns/locale';

const TX_ICON: Record<string, { icon: React.ElementType; color: string; bg: string; prefix: string }> = {
  income:   { icon: ArrowDownLeft, color: 'text-success', bg: 'bg-success-light', prefix: '+' },
  expense:  { icon: ArrowUpRight, color: 'text-coral',   bg: 'bg-coral-light',   prefix: '-' },
  freeze:   { icon: Snowflake,     color: 'text-info',    bg: 'bg-info-light',    prefix: '-' },
  unfreeze: { icon: RefreshCw,     color: 'text-purple',  bg: 'bg-purple-light',  prefix: '+' },
  withdraw: { icon: ArrowUpRight, color: 'text-warning', bg: 'bg-warning-light', prefix: '-' },
};

export function Profile() {
  const [activeTab, setActiveTab] = useState<'projects' | 'resume' | 'reviews'>('projects');
  const [customSkills, setCustomSkills] = useState<{ name: string; level: string }[]>([]);
  const [showAddTag, setShowAddTag] = useState(false);
  const [newTagName, setNewTagName] = useState('');
  const [newTagLevel, setNewTagLevel] = useState('入门');
  const [activeRole, setActiveRole] = useState<UserRole>(CURRENT_USER.activeRole || 'worker');
  const [showWalletDetail, setShowWalletDetail] = useState(false);

  return (
    <div className="flex flex-col pb-4">
      {/* Header */}
      <div className="relative bg-gradient-to-br from-success-light via-emerald-50 to-secondary px-4 pb-6" style={{ paddingTop: 'calc(var(--safe-top) + 1rem)' }}>
        <div className="flex justify-between items-center mb-4">
          {/* Role Switch */}
          <div className="flex rounded-full bg-white/60 backdrop-blur-sm p-0.5">
            {([['worker', '接单者'], ['employer', '雇主']] as [UserRole, string][]).map(([role, label]) => (
              <button
                key={role}
                onClick={() => setActiveRole(role)}
                className={cn(
                  'rounded-full px-3 py-1 text-xs transition-all',
                  activeRole === role ? 'bg-foreground text-background shadow-sm' : 'text-muted-foreground'
                )}
              >
                {label}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <Link to="/edit-profile" className="rounded-full bg-white/60 p-2 backdrop-blur-sm">
              <Edit className="h-4 w-4 text-muted-foreground" />
            </Link>
            <Link to="/settings" className="rounded-full bg-white/60 p-2 backdrop-blur-sm">
              <Settings className="h-4 w-4 text-muted-foreground" />
            </Link>
          </div>
        </div>

        {/* Profile Card */}
        <div className="flex items-center gap-4">
          <div className="relative">
            <img src={CURRENT_USER.avatar} alt={CURRENT_USER.name} className="h-18 w-18 rounded-2xl object-cover ring-3 ring-white shadow-md" />
            <div className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full bg-success-light border-2 border-background flex items-center justify-center">
              <CheckCircle className="h-3 w-3 text-success" />
            </div>
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h1 className="text-xl text-foreground">{CURRENT_USER.name}</h1>
              <span className="rounded-full bg-success-light px-2 py-0.5 text-[10px] text-success">已认证</span>
              {CURRENT_USER.isEnterpriseCertified && (
                <span className="rounded-full bg-info-light px-2 py-0.5 text-[10px] text-info flex items-center gap-0.5">
                  <Building2 className="h-2.5 w-2.5" />企业
                </span>
              )}
            </div>
            <p className="text-sm text-muted-foreground mt-0.5">{CURRENT_USER.role} · {CURRENT_USER.identity}</p>
            <div className="flex items-center gap-1 mt-1">
              <MapPin className="h-3 w-3 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">{CURRENT_USER.city}</span>
            </div>
          </div>
        </div>

        {/* Stats — role-aware */}
        <div className="flex justify-around mt-5 rounded-2xl bg-white p-3">
          {activeRole === 'worker' ? (
            <>
              <div className="text-center">
                <span className="block text-lg text-foreground">{CURRENT_USER.completedProjects}</span>
                <span className="text-xs text-muted-foreground">完成项目</span>
              </div>
              <div className="h-8 w-px bg-border" />
              <div className="text-center">
                <span className="block text-lg text-foreground">{CURRENT_USER.fulfillmentRate}%</span>
                <span className="text-xs text-muted-foreground">履约率</span>
              </div>
              <div className="h-8 w-px bg-border" />
              <div className="text-center">
                <div className="flex items-center justify-center gap-0.5">
                  <span className="text-lg text-foreground">{CURRENT_USER.rating}</span>
                  <Star className="h-3.5 w-3.5 fill-warning text-warning" />
                </div>
                <span className="text-xs text-muted-foreground">评分</span>
              </div>
              <div className="h-8 w-px bg-border" />
              <div className="text-center">
                <span className="block text-lg text-foreground">12</span>
                <span className="text-xs text-muted-foreground">关注者</span>
              </div>
            </>
          ) : (
            <>
              <div className="text-center">
                <span className="block text-lg text-foreground">8</span>
                <span className="text-xs text-muted-foreground">发布任务</span>
              </div>
              <div className="h-8 w-px bg-border" />
              <div className="text-center">
                <span className="block text-lg text-foreground">3</span>
                <span className="text-xs text-muted-foreground">进行中</span>
              </div>
              <div className="h-8 w-px bg-border" />
              <div className="text-center">
                <span className="block text-lg text-foreground">¥52k</span>
                <span className="text-xs text-muted-foreground">累计支出</span>
              </div>
              <div className="h-8 w-px bg-border" />
              <div className="text-center">
                <div className="flex items-center justify-center gap-0.5">
                  <span className="text-lg text-foreground">4.9</span>
                  <Star className="h-3.5 w-3.5 fill-warning text-warning" />
                </div>
                <span className="text-xs text-muted-foreground">雇主评分</span>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Wallet Module */}
      <div className="px-4 py-3">
        <div className="rounded-2xl bg-gradient-to-br from-foreground to-foreground/90 p-4 text-primary-foreground">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Wallet className="h-4 w-4" />
              <span className="text-sm font-medium">我的钱包</span>
            </div>
            <button onClick={() => setShowWalletDetail(!showWalletDetail)} className="text-xs text-primary-foreground/70 flex items-center gap-0.5">
              {showWalletDetail ? '收起' : '明细'} <ChevronRight className={cn('h-3 w-3 transition-transform', showWalletDetail && 'rotate-90')} />
            </button>
          </div>
          <div className="mb-3">
            <p className="text-2xl font-bold">¥{MOCK_WALLET.balance.toLocaleString('zh-CN', { minimumFractionDigits: 2 })}</p>
            <p className="text-xs text-primary-foreground/60 mt-0.5">可用余额</p>
          </div>
          <div className="flex gap-2">
            <div className="flex-1 rounded-xl bg-white/10 p-2.5 text-center">
              <p className="text-sm font-medium">¥{MOCK_WALLET.frozen.toLocaleString()}</p>
              <p className="text-[10px] text-primary-foreground/60 mt-0.5">冻结中</p>
            </div>
            <div className="flex-1 rounded-xl bg-white/10 p-2.5 text-center">
              <p className="text-sm font-medium">¥{MOCK_WALLET.inTransit.toLocaleString()}</p>
              <p className="text-[10px] text-primary-foreground/60 mt-0.5">在途中</p>
            </div>
            <div className="flex-1 rounded-xl bg-white/10 p-2.5 text-center">
              <p className="text-sm font-medium flex items-center justify-center gap-0.5"><TrendingUp className="h-3 w-3" />¥{MOCK_WALLET.totalIncome.toLocaleString()}</p>
              <p className="text-[10px] text-primary-foreground/60 mt-0.5">累计收入</p>
            </div>
          </div>

          {showWalletDetail && (
            <div className="mt-3 pt-3 border-t border-white/10 space-y-2">
              {MOCK_TRANSACTIONS.slice(0, 4).map(tx => {
                const cfg = TX_ICON[tx.type];
                return (
                  <div key={tx.id} className="flex items-center gap-2.5">
                    <div className={cn('h-7 w-7 rounded-lg flex items-center justify-center flex-shrink-0', 'bg-white/10')}>
                      <cfg.icon className="h-3.5 w-3.5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs truncate">{tx.description}</p>
                      <p className="text-[10px] text-primary-foreground/50">{formatDistanceToNow(new Date(tx.createdAt), { addSuffix: true, locale: zhCN })}</p>
                    </div>
                    <span className={cn('text-xs font-medium', tx.type === 'income' || tx.type === 'unfreeze' ? 'text-emerald-300' : 'text-primary-foreground/70')}>
                      {cfg.prefix}¥{tx.amount.toLocaleString()}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Bio — worker shows full bio+response, employer shows a short tagline */}
      <div className="px-4 py-3">
        {activeRole === 'worker' ? (
          <>
            <p className="text-sm text-foreground leading-relaxed">{CURRENT_USER.bio}</p>
            <p className="text-xs text-success mt-1">
              <Clock className="inline h-3 w-3 mr-0.5" />
              {CURRENT_USER.responseTime}
            </p>
          </>
        ) : (
          <p className="text-sm text-muted-foreground leading-relaxed">正在寻找优秀的设计师、开发者、内容创作者加入我的项目。长期合作优先。</p>
        )}
      </div>

      {/* Skills — only for worker role */}
      {activeRole === 'worker' && <div className="px-4 pb-3">
        <h3 className="text-sm text-foreground mb-2">技能标签</h3>
        <div className="flex flex-wrap gap-1.5">
          {CURRENT_USER.skills.map(skill => (
            <div key={skill.name} className="flex items-center gap-1 rounded-full bg-secondary px-3 py-1">
              <span className="text-xs text-foreground">{skill.name}</span>
              <span className={cn(
                'text-[10px] rounded-full px-1.5',
                skill.level === '专业' ? 'bg-primary/15 text-foreground' :
                skill.level === '熟练' ? 'bg-success-light text-success' :
                'bg-secondary text-muted-foreground'
              )}>{skill.level}</span>
            </div>
          ))}
          {customSkills.map(skill => (
            <div key={skill.name} className="flex items-center gap-1 rounded-full bg-secondary px-3 py-1 group">
              <span className="text-xs text-foreground">{skill.name}</span>
              <span className={cn(
                'text-[10px] rounded-full px-1.5',
                skill.level === '专业' ? 'bg-primary/15 text-foreground' :
                skill.level === '熟练' ? 'bg-success-light text-success' :
                'bg-secondary text-muted-foreground'
              )}>{skill.level}</span>
              <button onClick={() => setCustomSkills(customSkills.filter(s => s.name !== skill.name))} className="hidden group-hover:flex items-center justify-center">
                <X className="h-3 w-3 text-muted-foreground" />
              </button>
            </div>
          ))}
          {!showAddTag && (
            <button onClick={() => { setShowAddTag(true); setNewTagName(''); setNewTagLevel('入门'); }} className="flex items-center gap-1 rounded-full border border-dashed border-primary/30 bg-secondary/40 px-3 py-1 text-xs text-foreground hover:bg-secondary transition-colors">
              <Plus className="h-3 w-3" />添加标签
            </button>
          )}
        </div>
        {showAddTag && (
          <div className="mt-2 rounded-2xl bg-white border border-border p-3">
            <div className="flex items-center gap-2 mb-2">
              <input type="text" value={newTagName} onChange={e => setNewTagName(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter' && newTagName.trim()) { setCustomSkills([...customSkills, { name: newTagName.trim(), level: newTagLevel }]); setShowAddTag(false); } }}
                autoFocus placeholder="输入技能名称"
                className="flex-1 rounded-full border border-border bg-secondary/30 px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-primary/10"
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">熟练度</span>
              <div className="flex gap-1.5 flex-1">
                {['入门', '熟练', '专业'].map(level => (
                  <button key={level} type="button" onClick={() => setNewTagLevel(level)}
                    className={cn('rounded-full px-2.5 py-0.5 text-xs transition-all',
                      newTagLevel === level
                        ? level === '专业' ? 'bg-primary/15 text-foreground' : level === '熟练' ? 'bg-success-light text-success' : 'bg-secondary text-muted-foreground'
                        : 'bg-secondary/50 text-muted-foreground/50'
                    )}>{level}</button>
                ))}
              </div>
              <button onClick={() => setShowAddTag(false)} className="rounded-full px-2.5 py-1 text-xs text-muted-foreground hover:bg-secondary transition-colors">取消</button>
              <button onClick={() => { if (newTagName.trim()) { setCustomSkills([...customSkills, { name: newTagName.trim(), level: newTagLevel }]); setShowAddTag(false); } }} className="rounded-full bg-primary px-3 py-1 text-xs text-primary-foreground hover:bg-primary/80 transition-colors">确定</button>
            </div>
          </div>
        )}
      </div>}

      {/* Review Tags — only for worker */}
      {activeRole === 'worker' && (
        <div className="px-4 pb-3">
          <h3 className="text-sm text-foreground mb-2">他人评价</h3>
          <div className="flex gap-1.5">
            {CURRENT_USER.tags.map(tag => (
              <span key={tag} className="rounded-full bg-success-light px-3 py-1 text-xs text-success">{tag}</span>
            ))}
          </div>
        </div>
      )}

      {/* My Accepted Orders — worker only */}
      {activeRole === 'worker' && MY_ACCEPTED_ORDERS.length > 0 && (
        <div className="px-4 pb-3">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-foreground">进行中的任务</h3>
            <span className="text-[11px] text-muted-foreground">{MY_ACCEPTED_ORDERS.filter(o => o.status !== 'completed').length} 个任务</span>
          </div>
          <div className="space-y-2.5">
            {MY_ACCEPTED_ORDERS.filter(o => o.status !== 'completed').map(order => {
              const typeConfig = TASK_TYPE_CONFIG[order.task.type];
              const isAgent = order.task.type === 'agent';
              const isCrowdsourcing = order.task.type === 'crowdsourcing';
              const milestone = isCrowdsourcing && order.task.milestones && order.currentMilestoneIdx !== undefined
                ? order.task.milestones[order.currentMilestoneIdx]
                : null;
              return (
                <Link key={order.taskId} to={`/task/${order.taskId}`}>
                  <div className="rounded-2xl bg-white border border-border p-3.5 transition-all active:scale-[0.98]">
                    <div className="flex items-start gap-3">
                      <div className={cn('h-10 w-10 rounded-xl flex items-center justify-center flex-shrink-0', typeConfig.bgColor)}>
                        {isAgent ? <Bot className={cn('h-5 w-5', typeConfig.color)} /> : <Target className={cn('h-5 w-5', typeConfig.color)} />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-medium text-foreground truncate">{order.task.title}</h4>
                          <span className={cn('rounded-full px-2 py-0.5 text-[10px] flex-shrink-0', typeConfig.badgeClass)}>
                            {typeConfig.label}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                          <span className={cn('rounded-full px-1.5 py-0.5 text-[10px]',
                            order.status === 'in-progress' ? 'bg-info-light text-info' : 'bg-amber-50 text-amber-600'
                          )}>
                            {order.status === 'in-progress' ? '进行中' : '验收中'}
                          </span>
                          <span>¥{order.task.budgetMin.toLocaleString()}-{order.task.budgetMax.toLocaleString()}</span>
                        </div>

                        {/* Progress Bar */}
                        <div className="mt-2.5">
                          <div className="flex items-center justify-between text-[11px] mb-1">
                            <span className="text-muted-foreground">任务进度</span>
                            <span className="font-medium text-foreground">{order.progress}%</span>
                          </div>
                          <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
                            <div
                              className={cn('h-full rounded-full transition-all',
                                isAgent ? 'bg-rose-500' : isCrowdsourcing ? 'bg-purple-500' : 'bg-primary'
                              )}
                              style={{ width: `${order.progress}%` }}
                            />
                          </div>
                        </div>

                        {/* Milestone info for crowdsourcing */}
                        {milestone && (
                          <div className="flex items-center gap-1.5 mt-2 text-[11px]">
                            <div className="h-1.5 w-1.5 rounded-full bg-purple-400" />
                            <span className="text-muted-foreground">当前里程碑：</span>
                            <span className="text-foreground font-medium">{milestone.name}</span>
                            <span className="text-muted-foreground">({milestone.percentage}% · ¥{milestone.amount.toLocaleString()})</span>
                          </div>
                        )}

                        {/* Agent estimated duration */}
                        {isAgent && order.task.estimatedDuration && (
                          <div className="flex items-center gap-1.5 mt-2 text-[11px]">
                            <Zap className="h-3 w-3 text-rose-400" />
                            <span className="text-muted-foreground">预计耗时：</span>
                            <span className="text-foreground font-medium">{order.task.estimatedDuration}</span>
                          </div>
                        )}

                        {/* Next action */}
                        <div className="flex items-center gap-1.5 mt-2 rounded-lg bg-secondary/60 px-2.5 py-1.5">
                          <AlertCircle className="h-3 w-3 text-info flex-shrink-0" />
                          <span className="text-[11px] text-foreground">下一步：{order.nextAction}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {/* Quick Links — role-aware */}
      <div className="px-4 pb-3">
        <div className="rounded-2xl bg-white border border-border overflow-hidden">
          {(activeRole === 'worker' ? [
            { icon: Shield, label: '身份认证', desc: '学生/自由职业/公司', color: 'text-purple', bg: 'bg-purple-light', to: '/settings' },
            { icon: BookOpen, label: '我申请的任务', desc: '5个待回复', color: 'text-warning', bg: 'bg-warning-light', to: '/my-applications' },
            { icon: FileText, label: '签约管理', desc: '2份合约履行中', color: 'text-success', bg: 'bg-success-light', to: '/my-tasks' },
            { icon: Award, label: '我的成就', desc: '金牌设计师', color: 'text-coral', bg: 'bg-coral-light', to: '/profile' },
          ] : [
            { icon: Building2, label: '企业认证', desc: CURRENT_USER.isEnterpriseCertified ? '已认证' : '去认证，发布更多任务类型', color: 'text-info', bg: 'bg-info-light', to: '/settings' },
            { icon: Send, label: '我发布的任务', desc: '8个任务 · 3个进行中', color: 'text-coral', bg: 'bg-coral-light', to: '/my-tasks' },
            { icon: Handshake, label: '签约管理', desc: '2份合约履行中', color: 'text-success', bg: 'bg-success-light', to: '/my-tasks' },
            { icon: Heart, label: '人才收藏', desc: '已收藏 15 位人才', color: 'text-rose-500', bg: 'bg-rose-50', to: '/profile' },
            { icon: Users, label: '合作过的人才', desc: '累计合作 22 人', color: 'text-purple', bg: 'bg-purple-light', to: '/profile' },
          ]).map((item, i, arr) => (
            <Link key={item.label} to={item.to}
              className={cn('flex items-center gap-3 w-full px-4 py-3 text-left hover:bg-secondary/50 transition-colors', i < arr.length - 1 && 'border-b border-border')}>
              <div className={cn('rounded-xl p-2', item.bg)}><item.icon className={cn('h-4 w-4', item.color)} /></div>
              <div className="flex-1">
                <p className="text-sm text-foreground">{item.label}</p>
                <p className="text-xs text-muted-foreground">{item.desc}</p>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </Link>
          ))}
        </div>
      </div>

      {/* Tabs — role-aware */}
      <div className="px-4 pt-2">
        {activeRole === 'worker' ? (
          <>
            <div className="flex gap-4 border-b border-border mb-3">
              {([
                { key: 'projects', label: '参与项目' },
                { key: 'resume', label: '简历' },
                { key: 'reviews', label: '评价' },
              ] as const).map(tab => (
                <button key={tab.key} onClick={() => setActiveTab(tab.key)}
                  className={cn('pb-2 text-sm transition-colors', activeTab === tab.key ? 'text-foreground border-b-2 border-foreground' : 'text-muted-foreground')}>
                  {tab.label}
                </button>
              ))}
            </div>

            {activeTab === 'projects' && (
              <div className="space-y-3">
                {[
                  { title: '茶饮品牌VI设计', status: '进行中', rating: null, tags: ['品牌', 'UI设计'] },
                  { title: '电商App界面设计', status: '已完成', rating: 5, tags: ['UI设计', '移动端'] },
                  { title: '企业官网重设计', status: '已完成', rating: 4, tags: ['网页设计', '响应式'] },
                ].map(project => (
                  <div key={project.title} className="rounded-2xl bg-white border border-border p-3.5">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-sm text-foreground">{project.title}</h4>
                      <span className={cn('rounded-full px-2 py-0.5 text-[10px]', project.status === '进行中' ? 'bg-info-light text-info' : 'bg-success-light text-success')}>{project.status}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex gap-1">
                        {project.tags.map(tag => (<span key={tag} className="text-[10px] text-muted-foreground bg-secondary rounded-full px-2 py-0.5">{tag}</span>))}
                      </div>
                      {project.rating && (
                        <div className="flex items-center gap-0.5">
                          {[...Array(5)].map((_, i) => (<Star key={i} className={cn('h-3 w-3', i < project.rating! ? 'fill-warning text-warning' : 'fill-secondary text-secondary')} />))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'resume' && (
              <div className="space-y-4">
                <div>
                  <h4 className="flex items-center gap-1.5 text-sm text-foreground mb-2"><GraduationCap className="h-4 w-4 text-info" /> 教育背景</h4>
                  <div className="rounded-2xl bg-white border border-border p-3.5">
                    <p className="text-sm text-foreground">中国美术学院</p>
                    <p className="text-xs text-muted-foreground">视觉传达设计 · 本科 · 2017-2021</p>
                  </div>
                </div>
                <div>
                  <h4 className="flex items-center gap-1.5 text-sm text-foreground mb-2"><Briefcase className="h-4 w-4 text-purple" /> 工作经历</h4>
                  <div className="space-y-2">
                    <div className="rounded-2xl bg-white border border-border p-3.5">
                      <p className="text-sm text-foreground">自由设计师</p>
                      <p className="text-xs text-muted-foreground">2023年至今 · 自由职业</p>
                    </div>
                    <div className="rounded-2xl bg-white border border-border p-3.5">
                      <p className="text-sm text-foreground">某互联网大厂 · UI设计师</p>
                      <p className="text-xs text-muted-foreground">2021-2023 · 全职</p>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="flex items-center gap-1.5 text-sm text-foreground mb-2"><Link2 className="h-4 w-4 text-success" /> 作品链接</h4>
                  <div className="rounded-2xl bg-white border border-border p-3.5">
                    <a href="#" className="text-sm text-info underline">dribbble.com/chenxiaowen</a>
                    <p className="text-xs text-muted-foreground mt-1">Dribbble 作品集</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="space-y-3">
                {[
                  { name: '王莎莎', content: '设计能力很强，沟通效率高，按时交付，非常满意！', rating: 5, date: '2026-02-15' },
                  { name: '李明', content: '合作很愉快，设计方案很有创意，改稿也很快。', rating: 5, date: '2026-01-20' },
                  { name: '张艾米', content: '专业能力不错，就是偶尔回复稍慢一点。', rating: 4, date: '2025-12-10' },
                ].map(review => (
                  <div key={review.name + review.date} className="rounded-2xl bg-white border border-border p-3.5">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-foreground">{review.name}</span>
                      <div className="flex items-center gap-0.5">
                        {[...Array(5)].map((_, i) => (<Star key={i} className={cn('h-3 w-3', i < review.rating ? 'fill-warning text-warning' : 'fill-secondary text-secondary')} />))}
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">{review.content}</p>
                    <p className="text-[10px] text-muted-foreground mt-1.5">{review.date}</p>
                  </div>
                ))}
              </div>
            )}
          </>
        ) : (
          <>
            <div className="flex gap-4 border-b border-border mb-3">
              {([
                { key: 'projects', label: '发布的任务' },
                { key: 'resume', label: '合作记录' },
                { key: 'reviews', label: '收到评价' },
              ] as const).map(tab => (
                <button key={tab.key} onClick={() => setActiveTab(tab.key)}
                  className={cn('pb-2 text-sm transition-colors', activeTab === tab.key ? 'text-foreground border-b-2 border-foreground' : 'text-muted-foreground')}>
                  {tab.label}
                </button>
              ))}
            </div>

            {activeTab === 'projects' && (
              <div className="space-y-3">
                {[
                  { title: '品牌VI全案设计', status: '进行中', applicants: 12, budget: '¥8,000-15,000', type: '众包' },
                  { title: '前端开发工程师（React）', status: '招聘中', applicants: 28, budget: '¥15,000-25,000/月', type: '全职' },
                  { title: '帮我去门店拍摄产品照', status: '已完成', applicants: 6, budget: '¥150-300', type: 'Agent' },
                  { title: '小红书代运营', status: '已完成', applicants: 8, budget: '¥3,000-6,000', type: '兼职' },
                ].map(task => (
                  <div key={task.title} className="rounded-2xl bg-white border border-border p-3.5">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-sm text-foreground">{task.title}</h4>
                      <span className={cn('rounded-full px-2 py-0.5 text-[10px]',
                        task.status === '进行中' ? 'bg-info-light text-info' :
                        task.status === '招聘中' ? 'bg-amber-50 text-amber-600' :
                        'bg-success-light text-success'
                      )}>{task.status}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span className="bg-secondary rounded-full px-2 py-0.5 text-[10px]">{task.type}</span>
                        <span>{task.applicants}人申请</span>
                      </div>
                      <span className="text-xs font-medium text-foreground">{task.budget}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'resume' && (
              <div className="space-y-3">
                {[
                  { talent: '林小雨', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop', project: '二次元IP设计', status: '已完成', rating: 5 },
                  { talent: '李明', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop', project: '小程序开发', status: '进行中', rating: null },
                  { talent: '赵天宇', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop', project: '品牌宣传视频', status: '已完成', rating: 5 },
                ].map(record => (
                  <div key={record.talent + record.project} className="rounded-2xl bg-white border border-border p-3.5 flex items-center gap-3">
                    <img src={record.avatar} alt={record.talent} className="h-10 w-10 rounded-full object-cover ring-1 ring-border" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm text-foreground">{record.talent}</h4>
                        <span className={cn('rounded-full px-2 py-0.5 text-[10px]', record.status === '进行中' ? 'bg-info-light text-info' : 'bg-success-light text-success')}>{record.status}</span>
                      </div>
                      <p className="text-xs text-muted-foreground">{record.project}</p>
                    </div>
                    {record.rating && (
                      <div className="flex items-center gap-0.5">
                        {[...Array(5)].map((_, i) => (<Star key={i} className={cn('h-3 w-3', i < record.rating! ? 'fill-warning text-warning' : 'fill-secondary text-secondary')} />))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="space-y-3">
                {[
                  { name: '林小雨', content: '老板需求清晰，付款及时，沟通也很顺畅，推荐合作！', rating: 5, date: '2026-03-01' },
                  { name: '赵天宇', content: '很好的合作体验，需求说明详细，反馈也很快。', rating: 5, date: '2026-02-10' },
                  { name: '张艾米', content: '合作愉快，需求稳定，准时结款。', rating: 4, date: '2026-01-15' },
                ].map(review => (
                  <div key={review.name + review.date} className="rounded-2xl bg-white border border-border p-3.5">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-foreground">{review.name}</span>
                      <div className="flex items-center gap-0.5">
                        {[...Array(5)].map((_, i) => (<Star key={i} className={cn('h-3 w-3', i < review.rating ? 'fill-warning text-warning' : 'fill-secondary text-secondary')} />))}
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">{review.content}</p>
                    <p className="text-[10px] text-muted-foreground mt-1.5">{review.date}</p>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
