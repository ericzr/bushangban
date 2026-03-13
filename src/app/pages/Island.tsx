import { useState, useEffect, useRef } from 'react';
import { MOCK_PLANETS, MOCK_BUBBLES, WORLD_MESSAGES, type Bubble, type Planet } from '../data/mock';
import { cn } from '../../lib/utils';
import { X, Zap, Send, Megaphone, ShoppingBag, Volume2, ArrowUpToLine, Image, Sparkles, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router';

// 商城道具数据
const SHOP_ITEMS = [
  {
    id: 'full-screen-broadcast',
    name: '全屏喇叭',
    icon: Volume2,
    description: '发送一条全屏广播消息，所有在线用户都会看到醒目的全屏弹窗提示',
    price: 30,
    unit: '次',
    colorClass: 'text-coral bg-coral-light',
    features: ['全屏弹窗展示', '持续5秒', '附带音效提醒'],
  },
  {
    id: 'task-pin-card',
    name: '任务置顶卡',
    icon: ArrowUpToLine,
    description: '让你发布的任务或简历在气泡空间中置顶放大，获得更多曝光',
    price: 50,
    unit: '天',
    colorClass: 'text-success bg-success-light',
    features: ['气泡放大2倍', '金色边框高亮', '置顶24小时'],
  },
  {
    id: 'banner-slot',
    name: 'Banner位',
    icon: Image,
    description: '在兴趣岛顶部展示你的广告横幅，支持自定义图片和跳转链接',
    price: 200,
    unit: '天',
    colorClass: 'text-purple bg-purple-light',
    features: ['顶部黄金位置', '支持自定义图片', '可设跳转链接'],
  },
];

export function Island() {
  const navigate = useNavigate();
  const [selectedPlanet, setSelectedPlanet] = useState<Planet>(MOCK_PLANETS[0]);
  const [selectedBubble, setSelectedBubble] = useState<Bubble | null>(null);
  const [currentMsg, setCurrentMsg] = useState(0);
  const [showMatchAnim, setShowMatchAnim] = useState(false);
  const [broadcastText, setBroadcastText] = useState('');
  const [showBroadcastInput, setShowBroadcastInput] = useState(false);
  const [broadcastMessages, setBroadcastMessages] = useState<string[]>([]);
  const [allMessages, setAllMessages] = useState<string[]>([...WORLD_MESSAGES]);
  const [showSentToast, setShowSentToast] = useState(false);
  const [showShop, setShowShop] = useState(false);
  const [purchasedItem, setPurchasedItem] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // ---- 气泡散布坐标（人才和任务交错混合分布） ----
  const BUBBLE_POSITIONS: { x: number; y: number }[] = [
    { x: 15, y: 22 },  // b1 talent
    { x: 68, y: 65 },  // b2 task
    { x: 42, y: 8 },   // b3 talent
    { x: 82, y: 30 },  // b4 task
    { x: 28, y: 68 },  // b5 talent
    { x: 58, y: 42 },  // b6 task
    { x: 8, y: 48 },   // b7 talent
    { x: 78, y: 82 },  // b8 task
    { x: 50, y: 78 },  // b9 talent
    { x: 88, y: 12 },  // b10 task
  ];

  // 当前星球的气泡
  const planetBubbles = MOCK_BUBBLES.filter(b => b.planetId === selectedPlanet.id);

  // 逐个飘入气泡 + 循环补充新气泡的效果
  const [visibleBubbles, setVisibleBubbles] = useState<Set<string>>(new Set());
  const [enteringId, setEnteringId] = useState<string | null>(null);

  // 切换星球时重置气泡动画
  useEffect(() => {
    setVisibleBubbles(new Set());
    setEnteringId(null);
    const bubbles = MOCK_BUBBLES.filter(b => b.planetId === selectedPlanet.id);
    let idx = 0;
    const showNext = () => {
      if (idx < bubbles.length) {
        const bubble = bubbles[idx];
        setEnteringId(bubble.id);
        setVisibleBubbles(prev => new Set(prev).add(bubble.id));
        idx++;
        setTimeout(() => setEnteringId(null), 600);
      }
    };
    showNext();
    const timer = setInterval(showNext, 800);
    return () => clearInterval(timer);
  }, [selectedPlanet.id]);

  // World message rotation
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentMsg(prev => (prev + 1) % allMessages.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [allMessages.length]);

  const handleSmartMatch = () => {
    setShowMatchAnim(true);
    setTimeout(() => setShowMatchAnim(false), 2500);
  };

  const handleSendBroadcast = () => {
    if (!broadcastText.trim()) return;
    const newMsg = `[广播] 我：${broadcastText.trim()}`;
    setAllMessages(prev => [newMsg, ...prev]);
    setBroadcastMessages(prev => [newMsg, ...prev]);
    setBroadcastText('');
    setShowBroadcastInput(false);
    setCurrentMsg(0);
    // Show toast
    setShowSentToast(true);
    setTimeout(() => setShowSentToast(false), 2000);
  };

  return (
    <div className="relative flex flex-col overflow-hidden" style={{ height: 'calc(100vh - 4rem - var(--safe-top))' }}>
      {/* Planet Selector */}
      <div className="px-4 pb-2" style={{ paddingTop: 'calc(var(--safe-top) + 0.75rem)' }}>
        <div className="overflow-x-auto scrollbar-hide">
          <div className="flex gap-2">
            {MOCK_PLANETS.map(planet => (
              <button
                key={planet.id}
                onClick={() => setSelectedPlanet(planet)}
                className={cn(
                  'flex items-center gap-1.5 whitespace-nowrap rounded-full px-3 py-1.5 text-sm transition-all',
                  selectedPlanet.id === planet.id
                    ? 'shadow-sm text-primary-foreground'
                    : 'bg-white/80 text-muted-foreground border border-border'
                )}
                style={selectedPlanet.id === planet.id ? { backgroundColor: planet.color } : {}}
              >
                <span>{planet.emoji}</span>
                <span>{planet.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* World Broadcast */}
      <div className="mx-4 mb-2 overflow-hidden rounded-full bg-white/60 border border-border px-3 py-1.5">
        <div className="flex items-center gap-2">
          <Megaphone className="h-4 w-4 flex-shrink-0 text-warning" />
          <p className="text-xs text-muted-foreground truncate animate-pulse">
            {allMessages[currentMsg]}
          </p>
        </div>
      </div>

      {/* Bubble Space */}
      <div
        className="relative flex-1 overflow-hidden pt-3"
        style={{
          background: `radial-gradient(ellipse at center, ${selectedPlanet.color}15 0%, ${selectedPlanet.color}05 50%, transparent 80%)`
        }}
      >
        {/* Stars background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(30)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-primary/10"
              style={{
                width: Math.random() * 3 + 1,
                height: Math.random() * 3 + 1,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animation: `twinkle ${2 + Math.random() * 3}s ease-in-out infinite`,
                animationDelay: `${Math.random() * 2}s`,
              }}
            />
          ))}
        </div>

        {/* Bubbles */}
        {planetBubbles.map((bubble, index) => {
          if (!visibleBubbles.has(bubble.id)) return null;
          const baseSize = bubble.type === 'talent' ? 44 : 50;
          const size = baseSize + bubble.matchScore * 0.4;
          const pos = BUBBLE_POSITIONS[index % BUBBLE_POSITIONS.length];
          const floatDuration = 5 + (index % 4) * 1.5;
          const isEntering = enteringId === bubble.id;
          const isTalent = bubble.type === 'talent';

          return (
            <button
              key={bubble.id}
              onClick={() => setSelectedBubble(bubble)}
              className={cn(
                'absolute rounded-full flex items-center justify-center cursor-pointer',
                'border-2 shadow-sm',
                'hover:scale-110 active:scale-95',
                isTalent
                  ? 'bg-emerald-50/90 border-emerald-300/60'
                  : 'bg-amber-50/90 border-amber-300/60',
                isEntering && 'animate-[bubble-pop_0.6s_ease-out]'
              )}
              style={{
                width: size,
                height: size,
                left: `calc(${pos.x}% - ${size / 2}px)`,
                top: `calc(${pos.y}% - ${size / 2}px)`,
                animation: `bubble-drift-${index % 3} ${floatDuration}s ease-in-out infinite`,
                opacity: isEntering ? undefined : 1,
                boxShadow: isTalent
                  ? '0 3px 14px rgba(16,185,129,0.2)'
                  : '0 3px 14px rgba(245,158,11,0.2)',
              }}
            >
              {bubble.avatar ? (
                <img
                  src={bubble.avatar}
                  alt={bubble.title}
                  className="h-[60%] w-[60%] rounded-full object-cover ring-2 ring-white/70"
                />
              ) : (
                <span className={cn(
                  'text-[10px] text-center px-1 leading-tight font-medium',
                  isTalent ? 'text-emerald-700' : 'text-amber-700'
                )}>
                  {bubble.title.length > 4 ? bubble.title.slice(0, 4) + '…' : bubble.title}
                </span>
              )}
              {/* 类型小标签 */}
              <span className={cn(
                'absolute -bottom-1.5 left-1/2 -translate-x-1/2 rounded-full px-1.5 py-px text-[8px] whitespace-nowrap shadow-sm',
                isTalent
                  ? 'bg-emerald-500 text-white'
                  : 'bg-amber-500 text-white'
              )}>
                {isTalent ? '人才' : '任务'}
              </span>
            </button>
          );
        })}

        {/* Smart Match Button */}
        <button
          onClick={handleSmartMatch}
          className={cn(
            'absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10',
            'h-16 w-16 rounded-full',
            'bg-primary',
            'flex items-center justify-center shadow-lg',
            'hover:scale-110 transition-transform',
            showMatchAnim && 'animate-ping'
          )}
        >
          <Zap className="h-7 w-7 text-primary-foreground" />
        </button>

        {/* Match Animation */}
        {showMatchAnim && (
          <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none">
            <div className="flex flex-col items-center gap-2 animate-bounce">
              <div className="flex items-center gap-4">
                <div className="h-14 w-14 rounded-full bg-success/60 backdrop-blur-sm animate-pulse" />
                <span className="text-2xl">💫</span>
                <div className="h-14 w-14 rounded-full bg-primary/10 backdrop-blur-sm animate-pulse" />
              </div>
              <span className="rounded-full bg-white/90 px-4 py-1.5 text-sm text-foreground shadow-md">
                正在为你智能匹配...
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Legend + Shop Row - fixed above broadcast input bar */}
      <div className="fixed left-0 right-0 z-31 flex items-center justify-between px-4 py-1.5 bg-white/70 backdrop-blur-sm" style={{ bottom: 'calc(4rem + 6rem)' }}>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <div className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
            <span className="text-[11px] text-muted-foreground">求职者</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="h-2.5 w-2.5 rounded-full bg-amber-400" />
            <span className="text-[11px] text-muted-foreground">任务</span>
          </div>
          <span className="text-[11px] text-muted-foreground">越大 = 越匹配</span>
        </div>
        <button
          onClick={() => setShowShop(true)}
          className="flex items-center gap-1.5 rounded-full bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground shadow-sm transition-transform active:scale-95"
        >
          <ShoppingBag className="h-3.5 w-3.5" />
          商城
        </button>
      </div>

      {/* World Broadcast Input Bar - fixed above bottom nav */}
      <div className="fixed left-0 right-0 z-30 px-4 py-2 bg-white/70 border-t border-border" style={{ bottom: '4rem' }}>
        <div className="flex items-center gap-2">
          <Megaphone className="h-5 w-5 text-foreground flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={broadcastText}
            onChange={e => setBroadcastText(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSendBroadcast()}
            placeholder="发一条世界喇叭，让所有人看到..."
            className="flex-1 rounded-full bg-secondary/60 border border-border px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/50 outline-none focus:border-primary focus:ring-1 focus:ring-primary/10 transition-all"
          />
          <button
            onClick={handleSendBroadcast}
            disabled={!broadcastText.trim()}
            className={cn(
              'flex h-9 w-9 items-center justify-center rounded-full transition-all flex-shrink-0',
              broadcastText.trim()
                ? 'bg-primary text-primary-foreground shadow-md hover:scale-105'
                : 'bg-secondary text-muted-foreground/50'
            )}
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
        <p className="text-[10px] text-muted-foreground/50 mt-1 ml-7">全服广播 · 所有在线用户可见</p>
      </div>

      {/* Sent Toast */}
      {showSentToast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 animate-bounce">
          <div className="flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-primary-foreground shadow-lg text-sm">
            <Megaphone className="h-4 w-4" />
            <span>世界喇叭已发出！</span>
          </div>
        </div>
      )}

      {/* Bubble Detail Sheet */}
      {selectedBubble && (
        <div className="fixed inset-0 z-[60] flex items-end" onClick={() => setSelectedBubble(null)}>
          <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" />
          <div
            className="relative w-full rounded-t-3xl bg-white p-5 pb-6 shadow-xl"
            onClick={e => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedBubble(null)}
              className="absolute right-4 top-4 rounded-full bg-secondary p-1.5"
            >
              <X className="h-4 w-4 text-muted-foreground" />
            </button>

            <div className="flex items-center gap-3 mb-3">
              {selectedBubble.avatar ? (
                <img src={selectedBubble.avatar} alt="" className="h-12 w-12 rounded-2xl object-cover" />
              ) : (
                <div className={cn(
                  'h-12 w-12 rounded-2xl flex items-center justify-center',
                  selectedBubble.type === 'task' ? 'bg-primary/10' : 'bg-success/30'
                )}>
                  <span>{selectedBubble.type === 'task' ? '📋' : '👤'}</span>
                </div>
              )}
              <div>
                <h3 className="text-base text-foreground">{selectedBubble.title}</h3>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className={cn(
                    'rounded-full px-2 py-0.5 text-xs',
                    selectedBubble.type === 'talent' ? 'bg-success/20 text-success' : 'bg-primary/10 text-foreground'
                  )}>
                    {selectedBubble.type === 'talent' ? '接任务' : '找人做'}
                  </span>
                  <span className="flex items-center gap-0.5 text-xs text-success"><Sparkles className="h-3 w-3" /> 匹配 {selectedBubble.matchScore}%</span>
                </div>
              </div>
            </div>

            <div className="flex gap-1.5 mb-4">
              {selectedBubble.tags.map(tag => (
                <span key={tag} className="rounded-full bg-secondary px-2.5 py-0.5 text-xs text-foreground">
                  {tag}
                </span>
              ))}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setSelectedBubble(null);
                  if (selectedBubble.type === 'task') navigate(`/task/${selectedBubble.refId}`);
                  else navigate(`/talent/${selectedBubble.refId}`);
                }}
                className="flex-1 rounded-xl bg-secondary py-2.5 text-sm text-foreground hover:bg-secondary/80 transition-colors"
              >
                查看详情
              </button>
              <button
                onClick={() => { setSelectedBubble(null); navigate('/messages'); }}
                className="flex-1 rounded-xl bg-primary py-2.5 text-sm text-primary-foreground hover:bg-primary/80 transition-colors"
              >
                立即沟通
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Shop Modal */}
      {showShop && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowShop(false)} />
          <div className="relative w-full max-w-[430px] rounded-t-3xl bg-white pb-8 pt-4 animate-slide-up">
            {/* Handle */}
            <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-border" />
            {/* Header */}
            <div className="flex items-center justify-between px-5 mb-4">
              <div>
                <h2 className="text-lg font-semibold">兴趣岛商城</h2>
                <p className="text-xs text-muted-foreground">购买道具，提升曝光</p>
              </div>
              <button onClick={() => setShowShop(false)} className="rounded-full p-1.5 hover:bg-secondary transition-colors">
                <X className="h-5 w-5 text-muted-foreground" />
              </button>
            </div>
            {/* Items */}
            <div className="flex flex-col gap-3 px-5">
              {SHOP_ITEMS.map(item => (
                <div key={item.id} className="flex gap-3 rounded-2xl border border-border bg-white p-3.5">
                  <div className={cn('flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl', item.colorClass)}>
                    <item.icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="text-sm font-semibold">{item.name}</span>
                      <span className={cn('text-sm font-bold', item.colorClass.split(' ')[0])}>
                        ¥{item.price}<span className="text-[10px] font-normal text-muted-foreground">/{item.unit}</span>
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed mb-2">{item.description}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex flex-wrap gap-1">
                        {item.features.map((f, i) => (
                          <span key={i} className={cn('rounded-full px-2 py-0.5 text-[10px]', item.colorClass)}>
                            {f}
                          </span>
                        ))}
                      </div>
                      <button
                        onClick={() => { setPurchasedItem(item.id); setTimeout(() => setPurchasedItem(null), 2000); }}
                        disabled={purchasedItem === item.id}
                        className={cn(
                          'flex-shrink-0 rounded-full px-3.5 py-1 text-xs font-medium transition-all active:scale-95',
                          purchasedItem === item.id
                            ? 'bg-success-light text-success'
                            : cn('text-primary-foreground', item.colorClass.split(' ')[0].replace('text-', 'bg-'))
                        )}
                      >
                        {purchasedItem === item.id ? '✓ 已购买' : '购买'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* CSS Animations */}
      <style>{`
        @keyframes bubble-drift-0 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          25% { transform: translate(8px, -12px) scale(1.02); }
          50% { transform: translate(-4px, -6px) scale(0.98); }
          75% { transform: translate(6px, 8px) scale(1.01); }
        }
        @keyframes bubble-drift-1 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          20% { transform: translate(-10px, 6px) scale(1.03); }
          40% { transform: translate(6px, -14px) scale(0.97); }
          60% { transform: translate(-6px, -4px) scale(1.01); }
          80% { transform: translate(8px, 10px) scale(0.99); }
        }
        @keyframes bubble-drift-2 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          30% { transform: translate(12px, 8px) scale(0.98); }
          60% { transform: translate(-8px, -10px) scale(1.04); }
          80% { transform: translate(4px, 6px) scale(1); }
        }
        @keyframes bubble-pop {
          0% { opacity: 0; transform: scale(0) translate(0, 20px); }
          50% { opacity: 1; transform: scale(1.15) translate(0, -4px); }
          100% { opacity: 1; transform: scale(1) translate(0, 0); }
        }
        @keyframes twinkle {
          0%, 100% { opacity: 0.2; }
          50% { opacity: 0.8; }
        }
        @keyframes slide-up {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}
