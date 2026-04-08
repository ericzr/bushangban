import { useState, useEffect, useRef } from 'react';
import { MOCK_TASKS, MOCK_BANNERS, SKILL_CATEGORIES } from '../data/mock';
import { TaskCard } from '../components/TaskCard';
import { CityPickerModal } from '../components/CityPickerModal';
import { Plus, ChevronRight, GraduationCap, Clock, Target, Package, SlidersHorizontal, X, MapPin, DollarSign, Wifi } from 'lucide-react';
import { cn } from '../../lib/utils';
import { Link, useSearchParams } from 'react-router';

type MainTabKey = 'all' | 'intern' | 'parttime' | 'package';
type SubTabKey = 'all' | 'crowdsourcing' | 'agent';

const MAIN_TABS: { key: MainTabKey; label: string; icon: React.ElementType }[] = [
  { key: 'all', label: '全部', icon: Target },
  { key: 'intern', label: '实习', icon: GraduationCap },
  { key: 'parttime', label: '兼职', icon: Clock },
  { key: 'package', label: '任务包', icon: Package },
];

const SUB_TABS: { key: SubTabKey; label: string; emoji: string }[] = [
  { key: 'all', label: '全部', emoji: '·' },
  { key: 'crowdsourcing', label: '众包任务', emoji: '👥' },
  { key: 'agent', label: 'Agent任务', emoji: '🤖' },
];

const BUDGET_OPTIONS = ['全部', '1k以下', '1k-5k', '5k-1w', '1w-5w', '5w以上'];
const DELIVERY_OPTIONS = ['全部', '线上', '线下', '线上+线下'];
const SORT_OPTIONS = ['默认排序', '最新发布', '预算最高', '匹配度最高'];

export function Home() {
  const [activeCategory, setActiveCategory] = useState('全部');
  const [activeMain, setActiveMain] = useState<MainTabKey>('all');
  const [activeSub, setActiveSub] = useState<SubTabKey>('all');
  const [bannerIdx, setBannerIdx] = useState(0);
  const [searchParams] = useSearchParams();
  const bannerTimer = useRef<ReturnType<typeof setInterval>>();

  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [showCityPicker, setShowCityPicker] = useState(false);
  const [filterRegion, setFilterRegion] = useState('全部');
  const [filterBudget, setFilterBudget] = useState('全部');
  const [filterDelivery, setFilterDelivery] = useState('全部');
  const [filterSort, setFilterSort] = useState('默认排序');

  useEffect(() => {
    const typeParam = searchParams.get('taskType');
    if (typeParam) {
      if (typeParam === 'intern') { setActiveMain('intern'); }
      else if (typeParam === 'parttime') { setActiveMain('parttime'); }
      else if (typeParam === 'crowdsourcing') { setActiveMain('package'); setActiveSub('crowdsourcing'); }
      else if (typeParam === 'agent') { setActiveMain('package'); setActiveSub('agent'); }
    }
  }, [searchParams]);

  useEffect(() => {
    bannerTimer.current = setInterval(() => setBannerIdx(i => (i + 1) % MOCK_BANNERS.length), 4000);
    return () => clearInterval(bannerTimer.current);
  }, []);

  const BUDGET_RANGES: Record<string, { min: number; max: number }> = {
    '全部': { min: 0, max: Infinity },
    '1k以下': { min: 0, max: 1000 },
    '1k-5k': { min: 1000, max: 5000 },
    '5k-1w': { min: 5000, max: 10000 },
    '1w-5w': { min: 10000, max: 50000 },
    '5w以上': { min: 50000, max: Infinity },
  };

  const DELIVERY_MAP: Record<string, string | undefined> = {
    '全部': undefined,
    '线上': 'online',
    '线下': 'offline',
    '线上+线下': 'both',
  };

  let filteredTasks = MOCK_TASKS.filter(task => {
    if (activeMain === 'intern' && task.type !== 'intern') return false;
    if (activeMain === 'parttime' && task.type !== 'parttime') return false;
    if (activeMain === 'package') {
      if (activeSub === 'crowdsourcing' && task.type !== 'crowdsourcing') return false;
      if (activeSub === 'agent' && task.type !== 'agent') return false;
      if (activeSub === 'all' && task.type !== 'crowdsourcing' && task.type !== 'agent') return false;
    }
    if (activeCategory !== '全部' && !task.tags.includes(activeCategory)) return false;
    if (filterRegion !== '全部' && task.location !== filterRegion && task.location !== '远程') return false;
    if (filterBudget !== '全部') {
      const range = BUDGET_RANGES[filterBudget];
      if (range && (task.budgetMax < range.min || task.budgetMin > range.max)) return false;
    }
    if (filterDelivery !== '全部') {
      const dm = DELIVERY_MAP[filterDelivery];
      if (dm && task.deliveryMode && task.deliveryMode !== dm && task.deliveryMode !== 'both') return false;
      if (dm && !task.deliveryMode) return false;
    }
    return true;
  });

  if (filterSort === '最新发布') filteredTasks = [...filteredTasks].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  else if (filterSort === '预算最高') filteredTasks = [...filteredTasks].sort((a, b) => b.budgetMax - a.budgetMax);
  else if (filterSort === '匹配度最高') filteredTasks = [...filteredTasks].sort((a, b) => b.matchScore - a.matchScore);

  const activeFilterCount = [filterRegion, filterBudget, filterDelivery].filter(v => v !== '全部').length + (filterSort !== '默认排序' ? 1 : 0);
  const clearAllFilters = () => { setFilterRegion('全部'); setFilterBudget('全部'); setFilterDelivery('全部'); setFilterSort('默认排序'); };
  const banner = MOCK_BANNERS[bannerIdx];

  const handleBannerClick = () => {
    if (banner.link?.includes('taskType=')) {
      const type = banner.link.split('taskType=')[1];
      if (type === 'intern') { setActiveMain('intern'); setActiveSub('all'); }
      else if (type === 'parttime') { setActiveMain('parttime'); setActiveSub('all'); }
      else if (type === 'crowdsourcing') { setActiveMain('package'); setActiveSub('crowdsourcing'); }
      else if (type === 'agent') { setActiveMain('package'); setActiveSub('agent'); }
    }
  };

  const showDeliveryFilter = activeMain === 'package' || activeMain === 'all';

  return (
    <div className="flex flex-col pb-4">
      {/* Banner Carousel */}
      <div className="px-4 pt-2 pb-1">
        <div
          className={cn('relative overflow-hidden rounded-2xl bg-gradient-to-r p-5 min-h-[148px] flex flex-col justify-between cursor-pointer transition-all duration-500', banner.gradient)}
          onClick={handleBannerClick}
        >
          <div>
            <h2 className="text-lg font-bold text-white">{banner.title}</h2>
            <p className="text-sm text-white/80 mt-0.5">{banner.subtitle}</p>
          </div>
          <div className="flex items-center justify-between mt-3">
            <span className="text-xs text-white/60 flex items-center gap-1">
              了解更多 <ChevronRight className="h-3 w-3" />
            </span>
            <div className="flex gap-1.5">
              {MOCK_BANNERS.map((_, i) => (
                <button
                  key={i}
                  onClick={(e) => { e.stopPropagation(); setBannerIdx(i); }}
                  className={cn('h-1.5 rounded-full transition-all', i === bannerIdx ? 'w-4 bg-white' : 'w-1.5 bg-white/40')}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Primary Tab Bar */}
      <div className="sticky z-30 bg-white" style={{ top: 'calc(var(--safe-top) + 3.5rem)' }}>
        <div className="flex items-stretch px-4 pt-1">
          {MAIN_TABS.map(tab => {
            const isActive = activeMain === tab.key;
            const isPackage = tab.key === 'package';
            return (
              <button
                key={tab.key}
                onClick={() => {
                  setActiveMain(tab.key);
                  if (tab.key !== 'package') setActiveSub('all');
                }}
                className={cn(
                  'flex-1 flex items-center justify-center gap-1 py-2.5 text-sm font-medium relative transition-colors',
                  isActive ? 'text-foreground' : 'text-muted-foreground hover:text-foreground/70',
                )}
              >
                {!isPackage && (
                  <tab.icon className={cn('h-4 w-4', isActive ? (tab.key === 'intern' ? 'text-blue-500' : tab.key === 'parttime' ? 'text-amber-500' : '') : '')} />
                )}
                <span>{tab.label}</span>
                {isActive && (
                  <span className={cn('absolute bottom-0 left-1/2 -translate-x-1/2 h-[3px] w-10 rounded-full',
                    tab.key === 'intern' ? 'bg-blue-500' :
                    tab.key === 'parttime' ? 'bg-amber-500' :
                    tab.key === 'package' ? 'bg-purple-500' : 'bg-foreground'
                  )} />
                )}
              </button>
            );
          })}
        </div>

        {/* 任务包 Sub-tabs — segmented control */}
        {activeMain === 'package' && (
          <div className="px-4 py-2 border-b border-border/50">
            <div className="inline-flex bg-secondary rounded-xl p-0.5 gap-0">
              {SUB_TABS.map(sub => (
                <button
                  key={sub.key}
                  onClick={() => setActiveSub(sub.key)}
                  className={cn(
                    'flex items-center gap-1.5 px-4 py-1.5 rounded-[10px] text-xs font-medium transition-all',
                    activeSub === sub.key
                      ? sub.key === 'agent'
                        ? 'bg-white shadow-sm text-rose-600'
                        : sub.key === 'crowdsourcing'
                          ? 'bg-white shadow-sm text-purple-600'
                          : 'bg-white shadow-sm text-foreground'
                      : 'text-muted-foreground'
                  )}
                >
                  {sub.key !== 'all' && <span className="text-sm leading-none">{sub.emoji}</span>}
                  {sub.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Skill Category + Filter Row */}
        <div className="flex items-center border-b border-border">
          <div className="flex gap-2 overflow-x-auto px-4 py-2 flex-1 scrollbar-hide">
            {SKILL_CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={cn(
                  'flex-shrink-0 rounded-full px-3.5 py-1.5 text-xs transition-colors whitespace-nowrap',
                  activeCategory === cat
                    ? 'bg-foreground text-background'
                    : 'bg-secondary text-foreground hover:bg-secondary/80'
                )}
              >
                {cat}
              </button>
            ))}
          </div>
          <button
            onClick={() => setShowFilterPanel(!showFilterPanel)}
            className={cn(
              'flex items-center gap-1 px-3 py-1.5 mr-3 rounded-full text-xs transition-colors flex-shrink-0 border',
              activeFilterCount > 0 ? 'bg-primary/10 text-primary border-primary/30' : 'bg-secondary text-foreground border-transparent'
            )}
          >
            <SlidersHorizontal className="h-3.5 w-3.5" />
            <span>筛选</span>
            {activeFilterCount > 0 && (
              <span className="ml-0.5 h-4 w-4 rounded-full bg-primary text-primary-foreground text-[10px] flex items-center justify-center">{activeFilterCount}</span>
            )}
          </button>
        </div>
      </div>

      {/* Filter Panel */}
      {showFilterPanel && (
        <div className="bg-white border-b border-border px-4 py-3 space-y-3 animate-slide-up">
          <div>
            <div className="flex items-center gap-1.5 mb-2">
              <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="text-xs font-medium text-foreground">地区</span>
            </div>
            <button
              onClick={() => setShowCityPicker(true)}
              className={cn(
                'flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm border w-full text-left',
                filterRegion !== '全部' ? 'bg-primary/10 text-primary border-primary/30 font-medium' : 'bg-secondary/60 text-foreground border-transparent'
              )}
            >
              <MapPin className="h-3.5 w-3.5 flex-shrink-0" />
              <span className="flex-1">{filterRegion !== '全部' ? filterRegion : '选择城市'}</span>
              <ChevronRight className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
            </button>
          </div>
          <div>
            <div className="flex items-center gap-1.5 mb-2">
              <DollarSign className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="text-xs font-medium text-foreground">薪资/预算</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {BUDGET_OPTIONS.map(b => (
                <button key={b} onClick={() => setFilterBudget(b)} className={cn('rounded-full px-3 py-1 text-[11px] transition-colors border', filterBudget === b ? 'bg-primary/10 text-primary border-primary/30 font-medium' : 'bg-secondary/60 text-foreground border-transparent')}>{b}</button>
              ))}
            </div>
          </div>
          {showDeliveryFilter && (
            <div>
              <div className="flex items-center gap-1.5 mb-2">
                <Wifi className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="text-xs font-medium text-foreground">交付方式</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {DELIVERY_OPTIONS.map(d => (
                  <button key={d} onClick={() => setFilterDelivery(d)} className={cn('rounded-full px-3 py-1 text-[11px] transition-colors border', filterDelivery === d ? 'bg-primary/10 text-primary border-primary/30 font-medium' : 'bg-secondary/60 text-foreground border-transparent')}>{d}</button>
                ))}
              </div>
            </div>
          )}
          <div>
            <div className="flex items-center gap-1.5 mb-2">
              <SlidersHorizontal className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="text-xs font-medium text-foreground">排序</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {SORT_OPTIONS.map(s => (
                <button key={s} onClick={() => setFilterSort(s)} className={cn('rounded-full px-3 py-1 text-[11px] transition-colors border', filterSort === s ? 'bg-primary/10 text-primary border-primary/30 font-medium' : 'bg-secondary/60 text-foreground border-transparent')}>{s}</button>
              ))}
            </div>
          </div>
          <div className="flex items-center justify-between pt-1">
            <button onClick={clearAllFilters} className="text-xs text-muted-foreground hover:text-foreground transition-colors">清除筛选</button>
            <button onClick={() => setShowFilterPanel(false)} className="rounded-full bg-foreground text-background px-5 py-1.5 text-xs font-medium">确定</button>
          </div>
        </div>
      )}

      {/* Active Filter Tags */}
      {activeFilterCount > 0 && !showFilterPanel && (
        <div className="flex items-center gap-1.5 px-4 py-2 overflow-x-auto scrollbar-hide">
          {filterRegion !== '全部' && (
            <span className="flex items-center gap-1 rounded-full bg-primary/10 text-primary px-2.5 py-0.5 text-[11px] flex-shrink-0">
              <MapPin className="h-3 w-3" />{filterRegion}
              <button onClick={() => setFilterRegion('全部')}><X className="h-3 w-3" /></button>
            </span>
          )}
          {filterBudget !== '全部' && (
            <span className="flex items-center gap-1 rounded-full bg-primary/10 text-primary px-2.5 py-0.5 text-[11px] flex-shrink-0">
              <DollarSign className="h-3 w-3" />{filterBudget}
              <button onClick={() => setFilterBudget('全部')}><X className="h-3 w-3" /></button>
            </span>
          )}
          {filterDelivery !== '全部' && (
            <span className="flex items-center gap-1 rounded-full bg-primary/10 text-primary px-2.5 py-0.5 text-[11px] flex-shrink-0">
              <Wifi className="h-3 w-3" />{filterDelivery}
              <button onClick={() => setFilterDelivery('全部')}><X className="h-3 w-3" /></button>
            </span>
          )}
          {filterSort !== '默认排序' && (
            <span className="flex items-center gap-1 rounded-full bg-primary/10 text-primary px-2.5 py-0.5 text-[11px] flex-shrink-0">
              {filterSort}
              <button onClick={() => setFilterSort('默认排序')}><X className="h-3 w-3" /></button>
            </span>
          )}
          <button onClick={clearAllFilters} className="text-[11px] text-muted-foreground ml-1 flex-shrink-0">清除全部</button>
        </div>
      )}

      {/* Task Count */}
      <div className="px-4 pt-1 pb-1">
        <span className="text-xs text-muted-foreground">共 {filteredTasks.length} 个</span>
      </div>

      {/* Task Cards */}
      <div className="flex flex-col gap-3 px-4">
        {filteredTasks.length === 0 ? (
          <div className="py-12 text-center text-sm text-muted-foreground">没有找到匹配的内容</div>
        ) : (
          filteredTasks.map(task => <TaskCard key={task.id} task={task} />)
        )}
      </div>

      {/* FAB */}
      <Link
        to="/create-task"
        className="fixed bottom-20 right-4 z-40 flex items-center gap-1.5 rounded-full bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground shadow-lg hover:bg-primary/80 transition-colors"
      >
        <Plus className="h-4 w-4" />
        发布
      </Link>

      {/* City Picker Modal */}
      <CityPickerModal
        isOpen={showCityPicker}
        onClose={() => setShowCityPicker(false)}
        selected={filterRegion}
        onSelect={setFilterRegion}
        title="选择地区"
      />
    </div>
  );
}
