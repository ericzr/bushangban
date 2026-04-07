import logoImg from '../../assets/logo.png';
import logoFullImg from '../../assets/logo-full.png';
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router';
import { Globe, Users, Sparkles, MessageCircle, User, SlidersHorizontal, Search, X, Check } from 'lucide-react';
import { cn } from '../../lib/utils';
import { MOCK_MESSAGES, MOCK_TASKS, MOCK_TALENTS, TASK_TYPE_TABS, TASK_TYPE_CONFIG, type TaskType } from '../data/mock';
import { useState, useRef, useEffect } from 'react';

const REGIONS = ['全部', '远程', '北京', '上海', '杭州', '深圳', '广州', '成都'];
const BUDGETS = ['全部', '1k以下', '1k-5k', '5k-1w', '1w-5w', '5w以上'];
const FILTER_TASK_TYPES = TASK_TYPE_TABS.map(t => t.label);
const IDENTITIES = ['全部', '学生', '自由职业', '公司'];
const CITIES = ['全部', '北京', '上海', '杭州', '深圳', '广州', '成都', '远程'];
const ACCEPT_TYPES = ['全部', 'UI设计', '视频剪辑', '文案', '开发', '插画', '品牌设计', '数据分析', '运营'];

export function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const totalUnread = MOCK_MESSAGES.reduce((sum, m) => sum + m.unread, 0);
  const [query, setQuery] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const [fRegion, setFRegion] = useState(searchParams.get('region') || '全部');
  const [fBudget, setFBudget] = useState(searchParams.get('budget') || '全部');
  const [fType, setFType] = useState(searchParams.get('type') || '全部');
  const [fIdentity, setFIdentity] = useState(searchParams.get('identity') || '全部');
  const [fCity, setFCity] = useState(searchParams.get('city') || '全部');
  const [fAccept, setFAccept] = useState(searchParams.get('accept') || '全部');

  const isTalentsPage = location.pathname === '/talents';

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  const matchedTasks = query.trim()
    ? MOCK_TASKS.filter(t => t.title.includes(query) || t.tags.some(tag => tag.includes(query)) || t.description.includes(query)).slice(0, 3)
    : [];
  const matchedTalents = query.trim()
    ? MOCK_TALENTS.filter(t => t.user.name.includes(query) || t.user.role.includes(query) || t.user.skills.some(s => s.name.includes(query))).slice(0, 3)
    : [];
  const hasResults = matchedTasks.length > 0 || matchedTalents.length > 0;

  useEffect(() => { if (!query.trim()) setShowResults(false); }, [query]);

  const placeholder = location.pathname.startsWith('/talents') ? '搜索人才、技能...' : '搜索任务、技能、关键词...';

  const hideTopBar = ['/messages', '/island', '/profile', '/settings', '/edit-profile', '/my-tasks', '/my-applications', '/create-task'].some(p => location.pathname === p)
    || location.pathname.startsWith('/task/')
    || location.pathname.startsWith('/talent/')
    || location.pathname === '/create-task';

  const hasActiveFilter = isTalentsPage
    ? (fIdentity !== '全部' || fCity !== '全部' || fAccept !== '全部')
    : (fRegion !== '全部' || fBudget !== '全部' || fType !== '全部');

  const applyFilter = () => {
    const params = new URLSearchParams();
    if (isTalentsPage) {
      if (fIdentity !== '全部') params.set('identity', fIdentity);
      if (fCity !== '全部') params.set('city', fCity);
      if (fAccept !== '全部') params.set('accept', fAccept);
      navigate(`/talents?${params.toString()}`);
    } else {
      if (fRegion !== '全部') params.set('region', fRegion);
      if (fBudget !== '全部') params.set('budget', fBudget);
      if (fType !== '全部') params.set('type', fType);
      navigate(`/?${params.toString()}`);
    }
    setShowFilter(false);
  };

  const resetFilter = () => {
    if (isTalentsPage) {
      setFIdentity('全部'); setFCity('全部'); setFAccept('全部');
      navigate('/talents');
    } else {
      setFRegion('全部'); setFBudget('全部'); setFType('全部');
      navigate('/');
    }
    setShowFilter(false);
  };

  const getTypeBadge = (taskType: TaskType) => {
    const cfg = TASK_TYPE_CONFIG[taskType];
    return <span className={cn('ml-1 rounded-md px-1.5 py-0.5 text-[10px]', cfg.badgeClass)}>{cfg.label}</span>;
  };

  const tabs = [
    { path: '/', label: '任务广场', icon: Globe },
    { path: '/talents', label: '人才广场', icon: Users },
    { path: '/island', label: '兴趣岛', icon: Sparkles },
    { path: '/messages', label: '消息', icon: MessageCircle, badge: totalUnread },
    { path: '/profile', label: '我的', icon: User },
  ];

  return (
    <>
      {!hideTopBar && (
        <div className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-border" style={{ paddingTop: 'var(--safe-top)' }}>
          <div className="flex items-center gap-3 px-4 py-2.5">
            <div className="flex items-center gap-1.5 flex-shrink-0">
              <img src={logoFullImg} alt="不上班" className="h-5 w-auto" />
            </div>
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={e => { setQuery(e.target.value); setShowResults(true); }}
                onFocus={() => query.trim() && setShowResults(true)}
                placeholder={placeholder}
                className="w-full rounded-full bg-secondary pl-9 pr-8 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/10 placeholder:text-muted-foreground/50"
              />
              {query && (
                <button onClick={() => { setQuery(''); setShowResults(false); }} className="absolute right-3 top-1/2 -translate-y-1/2">
                  <X className="h-4 w-4 text-muted-foreground" />
                </button>
              )}
            </div>
            {(location.pathname === '/' || location.pathname === '/talents') && (
              <button
                onClick={() => setShowFilter(!showFilter)}
                className={cn('relative flex-shrink-0 rounded-lg p-1.5 transition-colors', showFilter ? 'bg-primary text-primary-foreground' : 'text-muted-foreground')}
              >
                <SlidersHorizontal className="h-5 w-5" />
                {hasActiveFilter && !showFilter && <span className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-coral" />}
              </button>
            )}
          </div>

          {/* Search Dropdown */}
          {showResults && query.trim() && (
            <div className="bg-white border-b border-border shadow-lg max-h-80 overflow-y-auto">
              {!hasResults ? (
                <div className="py-8 text-center text-sm text-muted-foreground">没有找到「{query}」相关结果</div>
              ) : (
                <div className="py-2">
                  {matchedTasks.length > 0 && (
                    <div>
                      <p className="px-4 py-1.5 text-xs text-muted-foreground">任务</p>
                      {matchedTasks.map(t => (
                        <button key={t.id} onClick={() => { setShowResults(false); setQuery(''); navigate(`/task/${t.id}`); }} className="flex items-center gap-3 w-full px-4 py-2.5 text-left hover:bg-secondary/50 transition-colors">
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-foreground truncate">{t.title}{getTypeBadge(t.type)}</p>
                            <p className="text-xs text-muted-foreground">¥{t.budgetMin}-{t.budgetMax} · {t.tags.slice(0, 2).join(' · ')}</p>
                          </div>
                          <span className={cn('rounded-full px-2 py-0.5 text-[10px] flex-shrink-0', t.matchScore >= 80 ? 'bg-match-high-bg text-match-high' : 'bg-match-mid-bg text-match-mid')}>{t.matchScore}%</span>
                        </button>
                      ))}
                    </div>
                  )}
                  {matchedTalents.length > 0 && (
                    <div>
                      <p className="px-4 py-1.5 text-xs text-muted-foreground">人才</p>
                      {matchedTalents.map(t => (
                        <button key={t.id} onClick={() => { setShowResults(false); setQuery(''); navigate(`/talent/${t.id}`); }} className="flex items-center gap-3 w-full px-4 py-2.5 text-left hover:bg-secondary/50 transition-colors">
                          <img src={t.user.avatar} alt={t.user.name} className="h-9 w-9 rounded-full object-cover flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-foreground">{t.user.name}</p>
                            <p className="text-xs text-muted-foreground">{t.user.role} · {t.user.city}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Filter Drawer */}
          {showFilter && (
            <div className="bg-white border-b border-border shadow-lg px-4 py-4 space-y-4 animate-in slide-in-from-top-2 duration-200">
              {isTalentsPage ? (
                <>
                  <div>
                    <p className="text-xs text-muted-foreground mb-2">身份类型</p>
                    <div className="flex flex-wrap gap-2">
                      {IDENTITIES.map(v => <button key={v} onClick={() => setFIdentity(v)} className={cn('rounded-full px-3 py-1 text-xs transition-colors', fIdentity === v ? 'bg-foreground text-background' : 'bg-secondary text-foreground')}>{v}</button>)}
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-2">所在城市</p>
                    <div className="flex flex-wrap gap-2">
                      {CITIES.map(v => <button key={v} onClick={() => setFCity(v)} className={cn('rounded-full px-3 py-1 text-xs transition-colors', fCity === v ? 'bg-foreground text-background' : 'bg-secondary text-foreground')}>{v}</button>)}
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-2">擅长领域</p>
                    <div className="flex flex-wrap gap-2">
                      {ACCEPT_TYPES.map(v => <button key={v} onClick={() => setFAccept(v)} className={cn('rounded-full px-3 py-1 text-xs transition-colors', fAccept === v ? 'bg-foreground text-background' : 'bg-secondary text-foreground')}>{v}</button>)}
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <p className="text-xs text-muted-foreground mb-2">地区</p>
                    <div className="flex flex-wrap gap-2">
                      {REGIONS.map(r => <button key={r} onClick={() => setFRegion(r)} className={cn('rounded-full px-3 py-1 text-xs transition-colors', fRegion === r ? 'bg-foreground text-background' : 'bg-secondary text-foreground')}>{r}</button>)}
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-2">预算</p>
                    <div className="flex flex-wrap gap-2">
                      {BUDGETS.map(b => <button key={b} onClick={() => setFBudget(b)} className={cn('rounded-full px-3 py-1 text-xs transition-colors', fBudget === b ? 'bg-foreground text-background' : 'bg-secondary text-foreground')}>{b}</button>)}
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-2">任务类型</p>
                    <div className="flex flex-wrap gap-2">
                      {FILTER_TASK_TYPES.map(t => <button key={t} onClick={() => setFType(t)} className={cn('rounded-full px-3 py-1 text-xs transition-colors', fType === t ? 'bg-foreground text-background' : 'bg-secondary text-foreground')}>{t}</button>)}
                    </div>
                  </div>
                </>
              )}
              <div className="flex gap-3 pt-1">
                <button onClick={resetFilter} className="flex-1 rounded-xl bg-secondary py-2 text-sm text-foreground">重置</button>
                <button onClick={applyFilter} className="flex-1 rounded-xl bg-primary py-2 text-sm text-primary-foreground flex items-center justify-center gap-1"><Check className="h-4 w-4" /> 确认</button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Bottom Tab Bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-t border-border px-2 py-1.5">
        <div className="flex items-center w-full">
          {tabs.map(tab => {
            const Icon = tab.icon;
            const active = isActive(tab.path);
            const isIsland = tab.path === '/island';
            return (
              <Link key={tab.path} to={tab.path} className={cn('flex-1 flex flex-col items-center rounded-xl transition-colors relative', isIsland ? 'gap-0 py-1 justify-end' : 'gap-0.5 py-1', !isIsland && (active ? 'text-foreground' : 'text-muted-foreground'))}>
                {isIsland ? (
                  <>
                    <div className={cn('absolute left-1/2 -translate-x-1/2 -top-7 flex h-11 w-11 items-center justify-center rounded-full shadow-lg transition-all', active ? 'bg-gradient-to-br from-primary to-primary/70 scale-110' : 'bg-gradient-to-br from-muted-foreground/80 to-muted-foreground/50')}>
                      <Icon className="h-5 w-5 text-white" />
                    </div>
                    <span className={cn('text-[10px] mt-3.5', active ? 'text-foreground' : 'text-muted-foreground')}>{tab.label}</span>
                  </>
                ) : (
                  <>
                    <div className="relative">
                      <Icon className="h-5 w-5" />
                      {tab.badge && tab.badge > 0 && (
                        <span className="absolute -top-1.5 -right-2.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-coral px-1 text-[9px] text-white leading-none">{tab.badge > 99 ? '99+' : tab.badge}</span>
                      )}
                    </div>
                    <span className="text-[10px]">{tab.label}</span>
                  </>
                )}
              </Link>
            );
          })}
        </div>
      </nav>

      {showResults && <div className="fixed inset-0 z-40" onClick={() => setShowResults(false)} />}
      {showFilter && <div className="fixed inset-0 z-40 bg-black/10" onClick={() => setShowFilter(false)} />}
    </>
  );
}
