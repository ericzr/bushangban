import { useParams, Link, useNavigate } from 'react-router';
import { MOCK_TALENTS, MOCK_REVIEWS, PORTFOLIO_IMAGES } from '../data/mock';
import { useState } from 'react';
import { cn } from '../../lib/utils';
import {
  ArrowLeft,
  Share2,
  Star,
  Clock,
  CheckCircle2,
  Zap,
  MapPin,
  Briefcase,
  Heart,
  ChevronRight,
  X,
  Shield,
  Sparkles,
  Users,
  FolderOpen,
  MessageCircle,
  Copy,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export function TalentDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const talent = MOCK_TALENTS.find((t) => t.id === id);
  const [activeTab, setActiveTab] = useState<'portfolio' | 'reviews' | 'info'>('portfolio');
  const [followed, setFollowed] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [invited, setInvited] = useState(false);
  const [showChatToast, setShowChatToast] = useState(false);

  const handleChat = () => {
    setShowChatToast(true);
    setTimeout(() => { setShowChatToast(false); navigate('/messages'); }, 800);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: talent?.user.name, url: window.location.href });
    } else {
      setShowShareModal(true);
    }
  };

  const handleInvite = () => {
    setInvited(true);
    setShowInviteModal(false);
    setTimeout(() => setInvited(false), 3000);
  };

  if (!talent) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <Users className="h-10 w-10 mx-auto mb-3 text-muted-foreground/50" />
          <p className="text-muted-foreground mb-4">未找到该人才</p>
          <Link
            to="/talents"
            className="rounded-full bg-primary px-6 py-2 text-sm text-primary-foreground"
          >
            返回人才广场
          </Link>
        </div>
      </div>
    );
  }

  const { user, acceptTypes, matchScore, hourlyRate, description } = talent;
  const portfolioImages = PORTFOLIO_IMAGES[id!] || [];
  const reviews = MOCK_REVIEWS;
  const avgRating = (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1);

  // Stat items
  const stats = [
    { label: '完成项目', value: user.completedProjects, icon: <Briefcase className="h-3.5 w-3.5 text-foreground" /> },
    { label: '履约率', value: `${user.fulfillmentRate}%`, icon: <Shield className="h-3.5 w-3.5 text-success" /> },
    { label: '评分', value: user.rating, icon: <Star className="h-3.5 w-3.5 fill-warning text-warning" /> },
    { label: '响应', value: user.responseTime.replace('通常', ''), icon: <Clock className="h-3.5 w-3.5 text-info" /> },
  ];

  const similarTalents = MOCK_TALENTS.filter((t) => t.id !== id).slice(0, 3);

  return (
    <div className="flex flex-col pb-28" style={{ paddingTop: "calc(var(--safe-top) + 49px)" }}>
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between bg-white/80 backdrop-blur-md px-4 py-3 border-b border-border" style={{ paddingTop: "var(--safe-top)" }}>
        <button onClick={() => navigate(-1)} className="text-muted-foreground">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h1 className="text-sm text-foreground">人才主页</h1>
        <button onClick={handleShare} className="text-muted-foreground">
          <Share2 className="h-5 w-5" />
        </button>
      </div>

      {/* Profile Hero */}
      <div className="relative px-4 pt-5 pb-4">
        {/* Background decoration */}
        <div className="absolute top-0 left-0 right-0 h-28 bg-gradient-to-br from-success-light via-emerald-50 to-secondary rounded-b-3xl" />

        <div className="relative flex items-start gap-4">
          {/* Avatar */}
          <div className="relative flex-shrink-0">
            <img
              src={user.avatar}
              alt={user.name}
              className="h-20 w-20 rounded-2xl object-cover ring-3 ring-white shadow-lg"
            />
            {user.isOnline && (
              <div className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full border-2 border-background bg-accent" />
            )}
            {/* Level badge */}
            <div className="absolute -top-1 -left-1 h-6 w-6 rounded-full bg-primary flex items-center justify-center shadow-sm">
              <span className="text-[10px] text-white">Pro</span>
            </div>
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0 pt-1">
            <div className="flex items-center gap-2 mb-0.5">
              <h2 className="text-lg text-foreground">{user.name}</h2>
              <span
                className={cn(
                  'rounded-full px-1.5 py-0.5 text-[10px]',
                  user.identity === '学生'
                    ? 'bg-success-light text-success'
                    : user.identity === '自由职业'
                    ? 'bg-success-light text-success'
                    : 'bg-success-light text-success'
                )}
              >
                {user.identity}
              </span>
              <button
                onClick={() => setFollowed(!followed)}
                className={cn(
                  'ml-auto flex items-center gap-1 rounded-full px-3 py-1 text-xs transition-all',
                  followed
                    ? 'bg-secondary text-foreground border border-primary/20'
                    : 'bg-white border border-border text-muted-foreground'
                )}
              >
                <Heart className={cn('h-3 w-3', followed && 'fill-foreground text-foreground')} />
                {followed ? '已关注' : '关注'}
              </button>
            </div>
            <p className="text-xs text-muted-foreground">
              {user.role} · {user.city}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              {user.isOnline ? <span className="text-success">● 在线</span> : `离线 · ${user.lastActive}`}
            </p>

            {/* Match Score */}
            <div
              className={cn(
                'inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs mt-1.5',
                matchScore >= 80
                  ? 'bg-match-high-bg text-match-high'
                  : matchScore >= 60
                  ? 'bg-match-mid-bg text-match-mid'
                  : 'bg-match-low-bg text-match-low'
              )}
            >
              <Sparkles className="h-3 w-3" />
              <span>与你匹配度 {matchScore}%</span>
            </div>
          </div>
        </div>

      </div>

      {/* Bio */}
      <div className="px-4 mb-4">
        <div className="rounded-2xl bg-white border border-border p-4">
          <p className="text-sm text-muted-foreground leading-relaxed">
            {description || user.bio}
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="px-4 mb-4">
        <div className="grid grid-cols-4 gap-2">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="flex flex-col items-center rounded-2xl bg-white border border-border py-3 px-1"
            >
              {stat.icon}
              <span className="text-sm text-foreground mt-1">{stat.value}</span>
              <span className="text-[10px] text-muted-foreground">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Skills */}
      <div className="px-4 mb-4">
        <div className="rounded-2xl bg-white border border-border p-4">
          <h3 className="text-sm text-foreground mb-3 flex items-center gap-1.5">
            <Zap className="h-4 w-4 text-foreground" />
            技能标签
          </h3>
          <div className="flex flex-wrap gap-1.5">
            {user.skills.map((skill) => (
              <span
                key={skill.name}
                className={cn(
                  'rounded-full px-3 py-1 text-xs flex items-center gap-1',
                  skill.level === '专业'
                    ? 'bg-primary/10 text-foreground'
                    : skill.level === '熟练'
                    ? 'bg-success-light text-success'
                    : 'bg-secondary text-muted-foreground'
                )}
              >
                {skill.name}
                {skill.level === '专业' && <span className="text-[10px]">MAX</span>}
                {skill.level === '熟练' && (
                  <span className="text-[9px] opacity-60">Lv.2</span>
                )}
                {skill.level === '入门' && (
                  <span className="text-[9px] opacity-60">Lv.1</span>
                )}
              </span>
            ))}
          </div>

          {/* Accept types */}
          <div className="mt-3 pt-3 border-t border-border">
            <p className="text-xs text-muted-foreground mb-1.5">接单方向</p>
            <div className="flex flex-wrap gap-1.5">
              {acceptTypes.map((type) => (
                <span
                  key={type}
                  className="rounded-full bg-secondary px-2.5 py-0.5 text-xs text-foreground"
                >
                  {type}
                </span>
              ))}
            </div>
          </div>

          {/* Hourly Rate */}
          {hourlyRate && (
            <div className="mt-3 pt-3 border-t border-border">
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">参考时薪</span>
                <span className="text-sm text-foreground">¥{hourlyRate}/小时</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* User Tags */}
      <div className="px-4 mb-4">
        <div className="flex flex-wrap gap-1.5">
          {user.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-success-light px-3 py-1 text-xs text-success border border-success/20"
            >
              🏷️ {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="sticky top-[3rem] z-30 bg-[var(--background)] border-b border-border">
        <div className="flex px-4">
          {[
            { key: 'portfolio' as const, label: '作品集', count: portfolioImages.length },
            { key: 'reviews' as const, label: '评价', count: reviews.length },
            { key: 'info' as const, label: '详细信息' },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={cn(
                'relative flex-1 py-3 text-sm text-center transition-colors',
                activeTab === tab.key
                  ? 'text-foreground'
                  : 'text-muted-foreground'
              )}
            >
              {tab.label}
              {tab.count !== undefined && (
                <span className="ml-1 text-[10px] opacity-60">({tab.count})</span>
              )}
              {activeTab === tab.key && (
                <motion.div
                  layoutId="talentTab"
                  className="absolute bottom-0 left-1/4 right-1/4 h-0.5 rounded-full bg-primary"
                />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="px-4 pt-4">
        {/* Portfolio */}
        {activeTab === 'portfolio' && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            {portfolioImages.length > 0 ? (
              <div className="grid grid-cols-2 gap-2">
                {portfolioImages.map((img, i) => (
                  <motion.div
                    key={img}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.2, delay: i * 0.05 }}
                    className={cn(
                      'overflow-hidden rounded-2xl border border-border cursor-pointer',
                      i === 0 && portfolioImages.length >= 3 ? 'col-span-2 aspect-video' : 'aspect-square'
                    )}
                    onClick={() => setPreviewImage(img)}
                  >
                    <img
                      src={img}
                      alt={`作品 ${i + 1}`}
                      className="h-full w-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <p className="text-3xl mb-2"></p>
                <p className="text-sm text-muted-foreground">暂无作品展示</p>
              </div>
            )}
          </motion.div>
        )}

        {/* Reviews */}
        {activeTab === 'reviews' && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col gap-3"
          >
            {/* Rating Summary */}
            <div className="rounded-2xl bg-white border border-border p-4 flex items-center gap-4">
              <div className="text-center">
                <p className="text-2xl text-foreground">{avgRating}</p>
                <div className="flex gap-0.5 mt-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={cn(
                        'h-3 w-3',
                        i < Math.round(Number(avgRating))
                          ? 'fill-warning text-warning'
                          : 'fill-secondary text-secondary'
                      )}
                    />
                  ))}
                </div>
                <p className="text-[10px] text-muted-foreground mt-1">{reviews.length}条评价</p>
              </div>
              <div className="flex-1">
                {[5, 4, 3, 2, 1].map((star) => {
                  const count = reviews.filter((r) => r.rating === star).length;
                  const pct = (count / reviews.length) * 100;
                  return (
                    <div key={star} className="flex items-center gap-2 mb-0.5">
                      <span className="text-[10px] text-muted-foreground w-3">{star}</span>
                      <div className="flex-1 h-1.5 rounded-full bg-secondary overflow-hidden">
                        <div
                          className="h-full rounded-full bg-accent transition-all"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <span className="text-[10px] text-muted-foreground w-4">{count}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Review List */}
            {reviews.map((review, i) => (
              <motion.div
                key={review.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: i * 0.05 }}
                className="rounded-2xl bg-white border border-border p-4"
              >
                <div className="flex items-center gap-2.5 mb-2">
                  <img
                    src={review.reviewer.avatar}
                    alt={review.reviewer.name}
                    className="h-8 w-8 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs text-foreground">{review.reviewer.name}</h4>
                      <span className="text-[10px] text-muted-foreground">{review.createdAt}</span>
                    </div>
                    <div className="flex items-center gap-1 mt-0.5">
                      <div className="flex">
                        {[...Array(5)].map((_, j) => (
                          <Star
                            key={j}
                            className={cn(
                              'h-2.5 w-2.5',
                              j < review.rating
                                ? 'fill-warning text-warning'
                                : 'fill-secondary text-secondary'
                            )}
                          />
                        ))}
                      </div>
                      <span className="text-[10px] text-foreground">· {review.project}</span>
                    </div>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">{review.content}</p>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Info */}
        {activeTab === 'info' && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col gap-3"
          >
            {/* Trust Badges */}
            <div className="rounded-2xl bg-white border border-border p-4">
              <h3 className="text-sm text-foreground mb-3 flex items-center gap-1.5">
                <Shield className="h-4 w-4 text-success" />
                信用认证
              </h3>
              <div className="flex flex-col gap-2.5">
                {[
                  { Icon: Shield, label: '实名认证', status: '已认证', ok: true },
                  { Icon: Zap, label: '手机认证', status: '已认证', ok: true },
                  { Icon: Briefcase, label: '技能认证', status: '已认证', ok: true },
                  { Icon: Star, label: '金牌人才', status: user.completedProjects >= 40 ? '已达成' : '未达成', ok: user.completedProjects >= 40 },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={cn('rounded-lg p-1.5', item.ok ? 'bg-success-light' : 'bg-secondary')}>
                        <item.Icon className={cn('h-3.5 w-3.5', item.ok ? 'text-success' : 'text-muted-foreground')} />
                      </div>
                      <span className="text-xs text-muted-foreground">{item.label}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <CheckCircle2 className={cn('h-3.5 w-3.5', item.ok ? 'text-success' : 'text-muted-foreground')} />
                      <span className={cn('text-xs', item.ok ? 'text-success' : 'text-muted-foreground')}>
                        {item.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Work Preferences */}
            <div className="rounded-2xl bg-white border border-border p-4">
              <h3 className="text-sm text-foreground mb-3 flex items-center gap-1.5">
                <Briefcase className="h-4 w-4 text-foreground" />
                工作偏好
              </h3>
              <div className="flex flex-col gap-2.5">
                {[
                  { label: '工作城市', value: user.city },
                  { label: '接单方式', value: '远程优先' },
                  { label: '身份类型', value: user.identity },
                  { label: '响应速度', value: user.responseTime },
                  { label: '可接单时间', value: '周一至周五' },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">{item.label}</span>
                    <span className="text-xs text-foreground">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Experience Timeline */}
            <div className="rounded-2xl bg-white border border-border p-4">
              <h3 className="text-sm text-foreground mb-3 flex items-center gap-1.5">
                <Clock className="h-4 w-4 text-muted-foreground" />
                经历概览
              </h3>
              <div className="flex flex-col gap-3">
                {[
                  { period: '2024 - 至今', title: '自由职业者', desc: '独立承接UI/UX设计项目' },
                  { period: '2021 - 2024', title: '某互联网大厂', desc: '高级UI设计师' },
                  { period: '2019 - 2021', title: '设计工作室', desc: '品牌视觉设计师' },
                ].map((exp, i) => (
                  <div key={i} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div className="h-2 w-2 rounded-full bg-primary mt-1.5" />
                      {i < 2 && <div className="flex-1 w-px bg-primary/20 mt-1" />}
                    </div>
                    <div className="pb-2">
                      <p className="text-[10px] text-muted-foreground">{exp.period}</p>
                      <p className="text-xs text-foreground">{exp.title}</p>
                      <p className="text-xs text-muted-foreground">{exp.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Similar Talents */}
      <div className="px-4 mt-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm text-foreground">相似人才推荐</h3>
          <Link to="/talents" className="flex items-center gap-0.5 text-xs text-foreground">
            查看更多
            <ChevronRight className="h-3 w-3" />
          </Link>
        </div>
        <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2">
          {similarTalents.map((t) => (
            <Link
              key={t.id}
              to={`/talent/${t.id}`}
              className="flex-shrink-0 w-28 rounded-2xl bg-white border border-border p-3 text-center"
            >
              <img
                src={t.user.avatar}
                alt={t.user.name}
                className="h-12 w-12 rounded-xl object-cover mx-auto ring-1 ring-border"
              />
              <p className="text-xs text-foreground mt-2 truncate">{t.user.name}</p>
              <p className="text-[10px] text-muted-foreground truncate">{t.user.role}</p>
              <div
                className={cn(
                  'inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-[9px] mt-1.5',
                  t.matchScore >= 80
                    ? 'bg-match-high-bg text-match-high'
                    : 'bg-match-mid-bg text-match-mid'
                )}
              >
                <Sparkles className="h-3 w-3 inline" /> {t.matchScore}%
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Bottom Action Bar */}
      <div className="fixed bottom-16 left-0 right-0 z-40 flex gap-3 bg-white/90 backdrop-blur-md px-4 py-3 border-t border-border">
        <button onClick={handleChat} className="flex items-center justify-center gap-1.5 flex-1 rounded-xl bg-secondary py-2.5 text-sm text-foreground hover:bg-secondary/80 transition-colors">
          <MessageCircle className="h-4 w-4" /> 立即沟通
        </button>
        <button
          onClick={() => setShowInviteModal(true)}
          disabled={invited}
          className={cn('flex items-center justify-center gap-1.5 flex-1 rounded-xl py-2.5 text-sm transition-colors shadow-sm', invited ? 'bg-success-light text-success' : 'bg-primary text-primary-foreground hover:bg-primary/80')}
        >
          {invited ? <><CheckCircle2 className="h-4 w-4" /> 已邀请</> : <><Sparkles className="h-4 w-4" /> 邀请接单</>}
        </button>
      </div>

      {/* Image Preview Modal */}
      <AnimatePresence>
        {previewImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm"
            onClick={() => setPreviewImage(null)}
          >
            <button
              className="absolute top-14 right-4 text-white/80 z-10"
              onClick={() => setPreviewImage(null)}
            >
              <X className="h-6 w-6" />
            </button>
            <motion.img
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              src={previewImage}
              alt="作品大图"
              className="max-w-[90vw] max-h-[70vh] rounded-2xl object-contain"
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm" onClick={() => setShowShareModal(false)}>
          <div className="w-72 rounded-3xl bg-white p-6 shadow-xl text-center" onClick={e => e.stopPropagation()}>
            <h3 className="text-sm text-foreground mb-3">分享人才</h3>
            <div className="rounded-xl bg-secondary/50 p-3 mb-3 text-xs text-muted-foreground break-all">{window.location.href}</div>
            <button onClick={() => { navigator.clipboard.writeText(window.location.href); setShowShareModal(false); }} className="flex items-center justify-center gap-1.5 w-full rounded-xl bg-primary py-2 text-sm text-primary-foreground">
              <Copy className="h-4 w-4" /> 复制链接
            </button>
          </div>
        </div>
      )}

      {/* Invite Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/30 backdrop-blur-sm" onClick={() => setShowInviteModal(false)}>
          <div className="w-full max-w-lg rounded-t-3xl bg-white p-6 shadow-xl" onClick={e => e.stopPropagation()}>
            <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-border" />
            <h3 className="text-base text-foreground mb-2">邀请接单</h3>
            <p className="text-sm text-muted-foreground mb-4">向 {talent?.user.name} 发送接单邀请，对方会收到通知。</p>
            <div className="flex gap-3">
              <button onClick={() => setShowInviteModal(false)} className="flex-1 rounded-xl bg-secondary py-2.5 text-sm text-foreground">取消</button>
              <button onClick={handleInvite} className="flex-1 rounded-xl bg-primary py-2.5 text-sm text-primary-foreground">确认邀请</button>
            </div>
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
