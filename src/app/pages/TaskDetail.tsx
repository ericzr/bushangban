import { useParams, Link, useNavigate, useSearchParams } from 'react-router';
import { MOCK_TASKS } from '../data/mock';
import { Calendar, MapPin, Tag, Heart, Share2, ArrowLeft, Star, Clock, Users, MessageCircle, Sparkles, DollarSign, Search, CheckCircle2, Copy, Zap, Wifi, Bot, AlertCircle, FileText, Shield, ChevronRight, X } from 'lucide-react';
import { TASK_TYPE_CONFIG, getTaskTypeLabel } from '../data/mock';
import { formatDistanceToNow } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { useState, useEffect } from 'react';
import { cn } from '../../lib/utils';

export function TaskDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const task = MOCK_TASKS.find(t => t.id === id);
  const [liked, setLiked] = useState(false);
  const [followed, setFollowed] = useState(false);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [applied, setApplied] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState<{ text: string; time: string }[]>([]);
  const [showChatToast, setShowChatToast] = useState(false);
  const [showAcceptModal, setShowAcceptModal] = useState(false);
  const [acceptStep, setAcceptStep] = useState<'confirm' | 'success'>('confirm');
  const [accepted, setAccepted] = useState(false);

  useEffect(() => {
    if (searchParams.get('accept') === '1' && task && (task.type === 'crowdsourcing' || task.type === 'agent')) {
      setAcceptStep('confirm');
      setShowAcceptModal(true);
    }
  }, [searchParams, task]);

  if (!task) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <Search className="h-10 w-10 mx-auto mb-3 text-muted-foreground/50" />
          <p className="text-muted-foreground mb-4">未找到该任务</p>
          <Link to="/" className="rounded-full bg-primary px-6 py-2 text-sm text-primary-foreground">返回首页</Link>
        </div>
      </div>
    );
  }

  const handleApply = () => {
    setApplied(true);
    setShowApplyModal(false);
    setTimeout(() => setApplied(false), 3000);
  };

  const handleChat = () => {
    setShowChatToast(true);
    setTimeout(() => {
      setShowChatToast(false);
      navigate('/messages');
    }, 800);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: task.title, url: window.location.href });
    } else {
      setShowShareModal(true);
    }
  };

  const handleComment = () => {
    if (!commentText.trim()) return;
    setComments(prev => [{ text: commentText.trim(), time: '刚刚' }, ...prev]);
    setCommentText('');
  };

  const isAgentType = task.type === 'agent';
  const isCrowdsourcing = task.type === 'crowdsourcing';
  const isIntern = task.type === 'intern';
  const isInstantType = isAgentType || (isCrowdsourcing && task.isInstant);
  const typeConfig = TASK_TYPE_CONFIG[task.type];
  const typeLabel = getTaskTypeLabel(task.type);

  const handleAcceptOrder = () => {
    setShowAcceptModal(true);
    setAcceptStep('confirm');
  };

  const confirmAcceptOrder = () => {
    setAcceptStep('success');
    setAccepted(true);
  };

  return (
    <div className="flex flex-col pb-24" style={{ paddingTop: "calc(var(--safe-top) + 49px)" }}>
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between bg-white/80 backdrop-blur-md px-4 py-3 border-b border-border" style={{ paddingTop: "var(--safe-top)" }}>
        <Link to="/" className="text-muted-foreground"><ArrowLeft className="h-5 w-5" /></Link>
        <h1 className="text-sm text-foreground">任务详情</h1>
        <div className="flex gap-2">
          <button onClick={() => setLiked(!liked)} className={cn('transition-colors', liked ? 'text-coral' : 'text-muted-foreground')}>
            <Heart className={cn('h-5 w-5', liked && 'fill-current')} />
          </button>
          <button onClick={handleShare} className="text-muted-foreground"><Share2 className="h-5 w-5" /></button>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 pt-4">
        {/* Author */}
        <div className="flex items-center gap-3 mb-4">
          <div className="relative">
            <img src={task.author.avatar} alt={task.author.name} className="h-11 w-11 rounded-full object-cover ring-1 ring-border" />
            {task.author.isOnline && <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-background bg-success" />}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h3 className="text-sm text-foreground">{task.author.name}</h3>
              <div className="flex items-center gap-0.5"><Star className="h-3 w-3 fill-warning text-warning" /><span className="text-xs text-muted-foreground">{task.author.rating}</span></div>
            </div>
            <p className="text-xs text-muted-foreground">{task.author.role} · {task.author.city}</p>
          </div>
          <button
            onClick={() => setFollowed(!followed)}
            className={cn(
              'rounded-full px-3 py-1 text-xs transition-colors',
              followed ? 'bg-secondary text-muted-foreground' : 'bg-primary text-primary-foreground'
            )}
          >
            {followed ? '已关注' : '关注'}
          </button>
        </div>

        {/* Title & Status */}
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <span className={cn('rounded-full px-2 py-0.5 text-xs', task.status === 'open' ? 'bg-success-light text-success' : task.status === 'in-progress' ? 'bg-info-light text-info' : 'bg-secondary text-muted-foreground')}>
              {task.status === 'open' ? '开放中' : task.status === 'in-progress' ? '进行中' : '已完成'}
            </span>
            <span className={cn('rounded-full px-2 py-0.5 text-xs', typeConfig.badgeClass)}>{typeLabel}</span>
            {task.isInstant && (
              <span className="inline-flex items-center gap-0.5 rounded-full bg-amber-50 text-amber-600 px-2 py-0.5 text-xs font-medium">
                <Zap className="h-3 w-3" />即时
              </span>
            )}
            {(isAgentType || isCrowdsourcing) && task.deliveryMode && (
              <span className={cn('inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-xs font-medium',
                task.deliveryMode === 'offline' ? 'bg-teal-50 text-teal-600' : 'bg-blue-50 text-blue-600'
              )}>
                {task.deliveryMode === 'offline' ? <MapPin className="h-3 w-3" /> : <Wifi className="h-3 w-3" />}
                {task.deliveryMode === 'offline' ? '线下' : task.deliveryMode === 'online' ? '线上' : '线上/线下'}
              </span>
            )}
            <span className="text-xs text-muted-foreground">发布于 {formatDistanceToNow(new Date(task.createdAt), { addSuffix: true, locale: zhCN })}</span>
          </div>
          <h2 className="text-xl text-foreground mb-2">{task.title}</h2>
          <div className={cn('inline-flex items-center gap-1 rounded-full px-3 py-1 text-sm', task.matchScore >= 80 ? 'bg-match-high-bg text-match-high' : task.matchScore >= 60 ? 'bg-match-mid-bg text-match-mid' : 'bg-match-low-bg text-match-low')}>
            <Sparkles className="h-3.5 w-3.5" /><span>与你匹配度 {task.matchScore}%</span>
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {task.tags.map(tag => (
            <span key={tag} className="flex items-center gap-0.5 rounded-full bg-secondary px-2.5 py-1 text-xs text-foreground"><Tag className="h-3 w-3" />{tag}</span>
          ))}
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          <div className="rounded-2xl bg-white border border-border p-3">
            <div className="flex items-center gap-2 mb-1"><DollarSign className="h-3.5 w-3.5 text-warning" /><span className="text-xs text-muted-foreground">报酬</span></div>
            <p className="text-sm text-foreground">¥{task.budgetMin.toLocaleString()}-{task.budgetMax.toLocaleString()}</p>
          </div>
          {isInstantType && task.estimatedDuration ? (
            <div className="rounded-2xl bg-white border border-border p-3">
              <div className="flex items-center gap-2 mb-1"><Clock className="h-3.5 w-3.5 text-amber-500" /><span className="text-xs text-muted-foreground">预计耗时</span></div>
              <p className="text-sm text-foreground">{task.estimatedDuration}</p>
            </div>
          ) : (
            <div className="rounded-2xl bg-white border border-border p-3">
              <div className="flex items-center gap-2 mb-1"><Calendar className="h-3.5 w-3.5 text-info" /><span className="text-xs text-muted-foreground">截止日期</span></div>
              <p className="text-sm text-foreground">{task.deadline}</p>
            </div>
          )}
          <div className="rounded-2xl bg-white border border-border p-3">
            <div className="flex items-center gap-2 mb-1"><MapPin className="h-3.5 w-3.5 text-muted-foreground" /><span className="text-xs text-muted-foreground">地点</span></div>
            <p className="text-sm text-foreground">{task.location || '远程'}</p>
          </div>
          <div className="rounded-2xl bg-white border border-border p-3">
            <div className="flex items-center gap-2 mb-1">
              {task.type === 'agent' ? <Bot className="h-3.5 w-3.5 text-rose-500" /> : <Clock className="h-3.5 w-3.5 text-success" />}
              <span className="text-xs text-muted-foreground">类型</span>
            </div>
            <p className="text-sm text-foreground">{typeLabel}</p>
          </div>
        </div>

        {/* Description */}
        <div className="mb-4">
          <h3 className="text-sm text-foreground mb-2">项目介绍</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">{task.description}</p>
        </div>

        {/* Milestones — delivery & payment rhythm */}
        {task.milestones && task.milestones.length > 0 && (
          <div className="mb-4">
            <h3 className="text-sm text-foreground mb-2">交付里程碑</h3>
            <div className="rounded-2xl bg-white border border-border overflow-hidden">
              {task.milestones.map((ms, i) => (
                <div key={ms.id} className={cn('flex items-center gap-3 px-4 py-3', i > 0 && 'border-t border-border')}>
                  <div className={cn('flex items-center justify-center h-6 w-6 rounded-full text-[10px] font-semibold flex-shrink-0',
                    ms.status === 'completed' ? 'bg-success text-white'
                    : ms.status === 'in-progress' ? 'bg-info text-white'
                    : 'bg-secondary text-muted-foreground'
                  )}>
                    {ms.status === 'completed' ? '✓' : i + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-foreground truncate">{ms.name}</p>
                    <p className="text-[11px] text-muted-foreground">占比 {ms.percentage}%</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-sm font-medium text-foreground">¥{ms.amount.toLocaleString()}</p>
                    <p className={cn('text-[10px]',
                      ms.isPaid ? 'text-success' : ms.status === 'completed' ? 'text-amber-500' : 'text-muted-foreground'
                    )}>
                      {ms.isPaid ? '已打款' : ms.status === 'completed' ? '待打款' : '验收后付'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-[11px] text-muted-foreground mt-2 px-1">
              共 {task.milestones.length} 个里程碑，每阶段验收通过后打款，保障双方权益
            </p>
          </div>
        )}

        {/* Skill Requirements */}
        <div className="mb-4">
          <h3 className="text-sm text-foreground mb-2">技能要求</h3>
          <div className="flex flex-wrap gap-1.5">
            {task.skillRequirements.map(skill => (
              <span key={skill} className="rounded-full bg-primary/10 px-3 py-1 text-xs text-foreground">{skill}</span>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-4 text-muted-foreground mb-6">
          <span className="flex items-center gap-1 text-xs"><Heart className="h-3.5 w-3.5" /> {task.likes + (liked ? 1 : 0)} 收藏</span>
          <span className="flex items-center gap-1 text-xs"><MessageCircle className="h-3.5 w-3.5" /> {task.comments + comments.length} 评论</span>
          <span className="flex items-center gap-1 text-xs"><Users className="h-3.5 w-3.5" /> {task.applicants} 人申请</span>
        </div>

        {/* Discussion */}
        <div className="border-t border-border pt-4">
          <h3 className="text-sm text-foreground mb-3">讨论 ({task.comments + comments.length})</h3>

          {/* New comments */}
          {comments.map((c, i) => (
            <div key={i} className="flex gap-3 mb-3">
              <img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop" className="h-8 w-8 rounded-full flex-shrink-0" />
              <div className="flex-1 rounded-2xl bg-secondary/50 p-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-foreground">我</span>
                  <span className="text-[10px] text-muted-foreground">{c.time}</span>
                </div>
                <p className="text-sm text-muted-foreground">{c.text}</p>
              </div>
            </div>
          ))}

          {/* Comment input */}
          <div className="flex gap-3">
            <img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop" className="h-8 w-8 rounded-full flex-shrink-0" />
            <div className="flex-1">
              <textarea
                value={commentText}
                onChange={e => setCommentText(e.target.value)}
                className="w-full rounded-2xl border border-border bg-secondary/50 p-3 text-sm outline-none focus:ring-2 focus:ring-primary/10 resize-none"
                placeholder="说点什么..."
                rows={2}
              />
              <button
                onClick={handleComment}
                disabled={!commentText.trim()}
                className={cn('mt-2 rounded-full px-4 py-1.5 text-xs transition-colors', commentText.trim() ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground')}
              >
                发表
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Action Bar */}
      <div className="fixed bottom-16 left-0 right-0 z-40 flex gap-3 bg-white/90 backdrop-blur-md px-4 py-3 border-t border-border">
        {(isAgentType || isCrowdsourcing) ? (
          <>
            <div className="flex flex-col justify-center">
              <p className="text-base font-semibold text-foreground">¥{task.budgetMin.toLocaleString()}-{task.budgetMax.toLocaleString()}</p>
              {task.estimatedDuration
                ? <p className="text-[10px] text-muted-foreground">{task.estimatedDuration}</p>
                : task.milestones && <p className="text-[10px] text-muted-foreground">{task.milestones.length}期交付</p>
              }
            </div>
            <button
              onClick={handleAcceptOrder}
              disabled={accepted}
              className={cn('flex items-center justify-center gap-1.5 flex-1 rounded-xl py-2.5 text-sm font-medium transition-colors shadow-sm',
                accepted
                  ? 'bg-success-light text-success'
                  : isAgentType
                    ? 'bg-rose-500 text-white hover:bg-rose-600'
                    : 'bg-teal-500 text-white hover:bg-teal-600'
              )}
            >
              {accepted ? <><CheckCircle2 className="h-4 w-4" /> 已接单</> : <><Zap className="h-4 w-4" /> 立即接单</>}
            </button>
          </>
        ) : isIntern ? (
          <>
            <div className="flex flex-col justify-center">
              <p className="text-base font-semibold text-foreground">¥{task.budgetMin.toLocaleString()}-{task.budgetMax.toLocaleString()}</p>
              <p className="text-[10px] text-muted-foreground">/月 · 实习岗位</p>
            </div>
            <button onClick={handleChat} className="flex items-center justify-center gap-1.5 flex-1 rounded-xl bg-secondary py-2.5 text-sm text-foreground hover:bg-secondary/80 transition-colors">
              <MessageCircle className="h-4 w-4" /> 咨询详情
            </button>
            <button
              onClick={() => setShowApplyModal(true)}
              disabled={applied}
              className={cn('flex items-center justify-center gap-1.5 flex-1 rounded-xl py-2.5 text-sm transition-colors shadow-sm', applied ? 'bg-success-light text-success' : 'bg-blue-500 text-white hover:bg-blue-600')}
            >
              {applied ? <><CheckCircle2 className="h-4 w-4" /> 已申请</> : <><Sparkles className="h-4 w-4" /> 申请实习</>}
            </button>
          </>
        ) : (
          <>
            <button onClick={handleChat} className="flex items-center justify-center gap-1.5 flex-1 rounded-xl bg-secondary py-2.5 text-sm text-foreground hover:bg-secondary/80 transition-colors">
              <MessageCircle className="h-4 w-4" /> 立即沟通
            </button>
            <button
              onClick={() => setShowApplyModal(true)}
              disabled={applied}
              className={cn('flex items-center justify-center gap-1.5 flex-1 rounded-xl py-2.5 text-sm transition-colors shadow-sm', applied ? 'bg-success-light text-success' : 'bg-primary text-primary-foreground hover:bg-primary/80')}
            >
              {applied ? <><CheckCircle2 className="h-4 w-4" /> 已申请</> : <><Sparkles className="h-4 w-4" /> 申请任务</>}
            </button>
          </>
        )}
      </div>

      {/* Apply Modal */}
      {showApplyModal && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/30 backdrop-blur-sm" onClick={() => setShowApplyModal(false)}>
          <div className="w-full max-w-lg rounded-t-3xl bg-white p-6 shadow-xl" onClick={e => e.stopPropagation()}>
            <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-border" />
            <h3 className="text-base text-foreground mb-2">确认申请</h3>
            <p className="text-sm text-muted-foreground mb-4">你将申请「{task.title}」，雇主会收到你的个人资料和技能信息。</p>
            <div className="rounded-2xl bg-secondary/50 p-3 mb-4">
              <p className="text-xs text-muted-foreground mb-1">报酬范围</p>
              <p className="text-sm text-foreground">¥{task.budgetMin.toLocaleString()} - ¥{task.budgetMax.toLocaleString()}</p>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setShowApplyModal(false)} className="flex-1 rounded-xl bg-secondary py-2.5 text-sm text-foreground">取消</button>
              <button onClick={handleApply} className="flex-1 rounded-xl bg-primary py-2.5 text-sm text-primary-foreground">确认申请</button>
            </div>
          </div>
        </div>
      )}

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm" onClick={() => setShowShareModal(false)}>
          <div className="w-72 rounded-3xl bg-white p-6 shadow-xl text-center" onClick={e => e.stopPropagation()}>
            <h3 className="text-sm text-foreground mb-3">分享任务</h3>
            <div className="rounded-xl bg-secondary/50 p-3 mb-3 text-xs text-muted-foreground break-all">{window.location.href}</div>
            <button
              onClick={() => { navigator.clipboard.writeText(window.location.href); setShowShareModal(false); }}
              className="flex items-center justify-center gap-1.5 w-full rounded-xl bg-primary py-2 text-sm text-primary-foreground"
            >
              <Copy className="h-4 w-4" /> 复制链接
            </button>
          </div>
        </div>
      )}

      {/* Chat Toast */}
      {showChatToast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 rounded-full bg-primary px-4 py-2 text-sm text-primary-foreground shadow-lg">
          正在跳转到消息...
        </div>
      )}

      {/* Accept Order Modal */}
      {showAcceptModal && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/30 backdrop-blur-sm" onClick={() => { if (acceptStep === 'success') { setShowAcceptModal(false); } }}>
          <div className="w-full max-w-lg rounded-t-3xl bg-white shadow-xl animate-slide-up" onClick={e => e.stopPropagation()}>
            <div className="mx-auto mt-3 mb-2 h-1 w-10 rounded-full bg-border" />

            {acceptStep === 'confirm' ? (
              <div className="px-5 pb-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-base font-semibold text-foreground">确认接单</h3>
                  <button onClick={() => setShowAcceptModal(false)} className="rounded-full p-1 hover:bg-secondary"><X className="h-4 w-4 text-muted-foreground" /></button>
                </div>

                {/* Task summary */}
                <div className={cn('rounded-2xl p-3.5 mb-4', isAgentType ? 'bg-rose-50' : 'bg-teal-50')}>
                  <div className="flex items-start gap-3">
                    <div className={cn('flex items-center justify-center h-10 w-10 rounded-xl flex-shrink-0', isAgentType ? 'bg-rose-100' : 'bg-teal-100')}>
                      {isAgentType ? <Bot className="h-5 w-5 text-rose-500" /> : <FileText className="h-5 w-5 text-teal-600" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{task.title}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{task.author.name} · {typeLabel}</p>
                    </div>
                  </div>
                </div>

                {/* Key info grid */}
                <div className="grid grid-cols-2 gap-2.5 mb-4">
                  <div className="rounded-xl bg-secondary/60 p-3">
                    <p className="text-[11px] text-muted-foreground mb-0.5">报酬</p>
                    <p className="text-sm font-semibold text-foreground">¥{task.budgetMin.toLocaleString()}-{task.budgetMax.toLocaleString()}</p>
                  </div>
                  {isAgentType && task.estimatedDuration ? (
                    <div className="rounded-xl bg-secondary/60 p-3">
                      <p className="text-[11px] text-muted-foreground mb-0.5">预计耗时</p>
                      <p className="text-sm font-semibold text-foreground">{task.estimatedDuration}</p>
                    </div>
                  ) : (
                    <div className="rounded-xl bg-secondary/60 p-3">
                      <p className="text-[11px] text-muted-foreground mb-0.5">截止日期</p>
                      <p className="text-sm font-semibold text-foreground">{task.deadline}</p>
                    </div>
                  )}
                  {(isAgentType || isCrowdsourcing) && task.deliveryMode && (
                    <div className="rounded-xl bg-secondary/60 p-3">
                      <p className="text-[11px] text-muted-foreground mb-0.5">交付方式</p>
                      <p className="text-sm font-semibold text-foreground">
                        {task.deliveryMode === 'offline' ? '线下' : task.deliveryMode === 'online' ? '线上' : '线上/线下'}
                      </p>
                    </div>
                  )}
                  <div className="rounded-xl bg-secondary/60 p-3">
                    <p className="text-[11px] text-muted-foreground mb-0.5">地点</p>
                    <p className="text-sm font-semibold text-foreground">{task.location || '远程'}</p>
                  </div>
                </div>

                {/* Milestones for crowdsourcing */}
                {isCrowdsourcing && task.milestones && task.milestones.length > 0 && (
                  <div className="mb-4">
                    <p className="text-xs font-medium text-foreground mb-2">交付与打款节奏</p>
                    <div className="rounded-xl border border-border overflow-hidden">
                      {task.milestones.map((ms, i) => (
                        <div key={ms.id} className={cn('flex items-center gap-2.5 px-3 py-2', i > 0 && 'border-t border-border')}>
                          <div className="flex items-center justify-center h-5 w-5 rounded-full bg-teal-100 text-[10px] font-semibold text-teal-700 flex-shrink-0">
                            {i + 1}
                          </div>
                          <p className="flex-1 text-xs text-foreground truncate">{ms.name}</p>
                          <p className="text-xs font-medium text-foreground flex-shrink-0">¥{ms.amount.toLocaleString()}</p>
                          <span className="text-[10px] text-muted-foreground flex-shrink-0">{ms.percentage}%</span>
                        </div>
                      ))}
                    </div>
                    <p className="text-[10px] text-muted-foreground mt-1.5">每阶段验收通过后平台自动打款</p>
                  </div>
                )}

                {/* Agent instant task notice */}
                {isAgentType && (
                  <div className="flex items-start gap-2.5 rounded-xl bg-amber-50 p-3 mb-4">
                    <AlertCircle className="h-4 w-4 text-amber-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-medium text-amber-700">即时任务须知</p>
                      <p className="text-[11px] text-amber-600 mt-0.5">接单后需在约定时间内完成，完成后上传凭证即可获得报酬。超时未完成可能影响信用评分。</p>
                    </div>
                  </div>
                )}

                {/* Platform guarantee */}
                <div className="flex items-center gap-2 rounded-xl bg-secondary/40 px-3 py-2.5 mb-5">
                  <Shield className="h-4 w-4 text-success flex-shrink-0" />
                  <p className="text-[11px] text-muted-foreground">平台担保交易，资金由平台托管，验收通过后打款</p>
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                  <button onClick={() => setShowAcceptModal(false)} className="flex-1 rounded-xl bg-secondary py-2.5 text-sm text-foreground">
                    再想想
                  </button>
                  <button
                    onClick={confirmAcceptOrder}
                    className={cn('flex items-center justify-center gap-1.5 flex-1 rounded-xl py-2.5 text-sm font-medium text-white',
                      isAgentType ? 'bg-rose-500 hover:bg-rose-600' : 'bg-teal-500 hover:bg-teal-600'
                    )}
                  >
                    <Zap className="h-4 w-4" /> 确认接单
                  </button>
                </div>
              </div>
            ) : (
              /* Success state */
              <div className="px-5 pb-8 text-center">
                <div className={cn('mx-auto mt-2 mb-4 flex items-center justify-center h-16 w-16 rounded-full', isAgentType ? 'bg-rose-50' : 'bg-teal-50')}>
                  <CheckCircle2 className={cn('h-8 w-8', isAgentType ? 'text-rose-500' : 'text-teal-500')} />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-1">接单成功！</h3>
                <p className="text-sm text-muted-foreground mb-5">
                  {isAgentType
                    ? '请在约定时间内完成任务，完成后上传凭证'
                    : '雇主将很快与你确认详情，请留意消息通知'
                  }
                </p>

                {/* Next steps */}
                <div className="rounded-2xl border border-border overflow-hidden text-left mb-5">
                  {(isAgentType ? [
                    { icon: MessageCircle, label: '联系雇主确认细节', desc: '沟通具体要求和注意事项' },
                    { icon: MapPin, label: task.deliveryMode === 'offline' ? '前往指定地点' : '在线完成任务', desc: task.deliveryMode === 'offline' ? task.location || '查看任务详情中的地址' : '按要求完成并提交成果' },
                    { icon: FileText, label: '上传完成凭证', desc: '拍照或截图上传，等待验收' },
                  ] : [
                    { icon: MessageCircle, label: '与雇主沟通需求细节', desc: '确认第一个里程碑的具体要求' },
                    { icon: FileText, label: '按里程碑分阶段交付', desc: `共${task.milestones?.length || 0}个里程碑，逐步完成` },
                    { icon: DollarSign, label: '验收通过自动打款', desc: '每阶段验收后资金自动到账' },
                  ]).map((step, i) => (
                    <div key={i} className={cn('flex items-center gap-3 px-4 py-3', i > 0 && 'border-t border-border')}>
                      <div className={cn('flex items-center justify-center h-8 w-8 rounded-full flex-shrink-0', isAgentType ? 'bg-rose-50' : 'bg-teal-50')}>
                        <step.icon className={cn('h-4 w-4', isAgentType ? 'text-rose-500' : 'text-teal-500')} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-foreground">{step.label}</p>
                        <p className="text-[11px] text-muted-foreground">{step.desc}</p>
                      </div>
                      <ChevronRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    </div>
                  ))}
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => { setShowAcceptModal(false); navigate('/messages'); }}
                    className={cn('flex items-center justify-center gap-1.5 flex-1 rounded-xl py-2.5 text-sm font-medium text-white',
                      isAgentType ? 'bg-rose-500' : 'bg-teal-500'
                    )}
                  >
                    <MessageCircle className="h-4 w-4" /> 联系雇主
                  </button>
                  <button
                    onClick={() => setShowAcceptModal(false)}
                    className="flex-1 rounded-xl bg-secondary py-2.5 text-sm text-foreground"
                  >
                    返回详情
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
