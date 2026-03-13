import { useParams, Link, useNavigate } from 'react-router';
import { MOCK_TASKS } from '../data/mock';
import { Calendar, MapPin, Tag, Heart, Share2, ArrowLeft, Star, Clock, Users, MessageCircle, Sparkles, DollarSign, Search, CheckCircle2, Copy } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { useState } from 'react';
import { cn } from '../../lib/utils';

export function TaskDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const task = MOCK_TASKS.find(t => t.id === id);
  const [liked, setLiked] = useState(false);
  const [followed, setFollowed] = useState(false);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [applied, setApplied] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState<{ text: string; time: string }[]>([]);
  const [showChatToast, setShowChatToast] = useState(false);

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
          <div className="flex items-center gap-2 mb-2">
            <span className={cn('rounded-full px-2 py-0.5 text-xs', task.status === 'open' ? 'bg-success-light text-success' : task.status === 'in-progress' ? 'bg-info-light text-info' : 'bg-secondary text-muted-foreground')}>
              {task.status === 'open' ? '开放中' : task.status === 'in-progress' ? '进行中' : '已完成'}
            </span>
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
          <div className="rounded-2xl bg-white border border-border p-3">
            <div className="flex items-center gap-2 mb-1"><Calendar className="h-3.5 w-3.5 text-info" /><span className="text-xs text-muted-foreground">截止日期</span></div>
            <p className="text-sm text-foreground">{task.deadline}</p>
          </div>
          <div className="rounded-2xl bg-white border border-border p-3">
            <div className="flex items-center gap-2 mb-1"><MapPin className="h-3.5 w-3.5 text-muted-foreground" /><span className="text-xs text-muted-foreground">地点</span></div>
            <p className="text-sm text-foreground">{task.location}</p>
          </div>
          <div className="rounded-2xl bg-white border border-border p-3">
            <div className="flex items-center gap-2 mb-1"><Clock className="h-3.5 w-3.5 text-success" /><span className="text-xs text-muted-foreground">类型</span></div>
            <p className="text-sm text-foreground">{task.type}</p>
          </div>
        </div>

        {/* Description */}
        <div className="mb-4">
          <h3 className="text-sm text-foreground mb-2">项目介绍</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">{task.description}</p>
        </div>

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
    </div>
  );
}
