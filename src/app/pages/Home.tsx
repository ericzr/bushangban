import { useState, useEffect, useRef } from 'react';
import { MOCK_TASKS, MOCK_BANNERS, SKILL_CATEGORIES, TASK_TYPE_TABS, TASK_TYPE_CONFIG, getTaskTypeLabel, type TaskType } from '../data/mock';
import { TaskCard } from '../components/TaskCard';
import { Plus, ChevronRight, Briefcase, Clock, Target, Bot } from 'lucide-react';
import { cn } from '../../lib/utils';
import { Link, useSearchParams } from 'react-router';

const TYPE_ICON: Record<string, React.ElementType> = {
  all: Target,
  fulltime: Briefcase,
  parttime: Clock,
  crowdsourcing: Target,
  agent: Bot,
};

const ALL_TYPE_TABS = [{ key: 'all' as const, label: '全部' }, ...TASK_TYPE_TABS.filter(t => t.key !== 'all')];

export function Home() {
  const [activeCategory, setActiveCategory] = useState('全部');
  const [activeType, setActiveType] = useState<TaskType | 'all'>('all');
  const [bannerIdx, setBannerIdx] = useState(0);
  const [searchParams] = useSearchParams();
  const bannerTimer = useRef<ReturnType<typeof setInterval>>();

  const filterRegion = searchParams.get('region') || '全部';
  const filterBudget = searchParams.get('budget') || '全部';
  const filterType = searchParams.get('type') || '全部';

  useEffect(() => {
    if (searchParams.get('taskType')) {
      const typeParam = searchParams.get('taskType') as TaskType;
      if (['fulltime', 'parttime', 'crowdsourcing', 'agent'].includes(typeParam)) {
        setActiveType(typeParam);
      }
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

  const filteredTasks = MOCK_TASKS.filter(task => {
    if (activeType !== 'all' && task.type !== activeType) return false;
    if (activeCategory !== '全部' && !task.tags.includes(activeCategory)) return false;
    if (filterRegion !== '全部' && task.location !== filterRegion && task.location !== '远程') return false;
    if (filterBudget !== '全部') {
      const range = BUDGET_RANGES[filterBudget];
      if (range && (task.budgetMax < range.min || task.budgetMin > range.max)) return false;
    }
    if (filterType !== '全部') {
      const typeLabel = getTaskTypeLabel(task.type, task.subType);
      if (typeLabel !== filterType) return false;
    }
    return true;
  });

  const hasActiveFilter = filterRegion !== '全部' || filterBudget !== '全部' || filterType !== '全部';
  const banner = MOCK_BANNERS[bannerIdx];

  return (
    <div className="flex flex-col pb-4">
      {/* Banner Carousel */}
      <div className="px-4 pt-2 pb-1">
        <div
          className={cn('relative overflow-hidden rounded-2xl bg-gradient-to-r p-4 min-h-[100px] flex flex-col justify-between cursor-pointer transition-all duration-500', banner.gradient)}
          onClick={() => {
            if (banner.link?.includes('taskType=')) {
              const type = banner.link.split('taskType=')[1] as TaskType;
              setActiveType(type);
            }
          }}
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

      {/* Task Type Tab Bar — acts as primary filter, visually anchored to the list */}
      <div className="sticky z-30 bg-[var(--background)]" style={{ top: 'calc(var(--safe-top) + 3.5rem)' }}>
        <div className="flex items-stretch px-4 pt-1">
          {ALL_TYPE_TABS.map(tab => {
            const Icon = TYPE_ICON[tab.key] || Target;
            const isActive = activeType === tab.key;
            const config = tab.key !== 'all' ? TASK_TYPE_CONFIG[tab.key as TaskType] : null;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveType(tab.key === 'all' ? 'all' : tab.key as TaskType)}
                className={cn(
                  'flex-1 flex items-center justify-center gap-1.5 py-2.5 text-sm font-medium relative transition-colors',
                  isActive ? 'text-foreground' : 'text-muted-foreground hover:text-foreground/70',
                )}
              >
                <Icon className={cn('h-4 w-4', isActive && config ? config.color : '')} />
                <span>{tab.label}</span>
                {isActive && (
                  <span
                    className={cn('absolute bottom-0 left-1/2 -translate-x-1/2 h-[3px] w-10 rounded-full', config ? config.color.replace('text-', 'bg-') : 'bg-foreground')}
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* Category Tabs (skill filter) */}
        <div className="flex gap-2 overflow-x-auto px-4 py-2 border-b border-border scrollbar-hide">
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
      </div>

      {/* Active search-param filters (region/budget only, type tab is already visible) */}
      {hasActiveFilter && (
        <div className="flex items-center gap-2 px-4 py-2 text-xs text-muted-foreground">
          <span>筛选中：</span>
          {filterRegion !== '全部' && <span className="rounded-full bg-primary/10 text-primary px-2 py-0.5">{filterRegion}</span>}
          {filterBudget !== '全部' && <span className="rounded-full bg-primary/10 text-primary px-2 py-0.5">{filterBudget}</span>}
          {filterType !== '全部' && <span className="rounded-full bg-primary/10 text-primary px-2 py-0.5">{filterType}</span>}
        </div>
      )}

      {/* Task Count */}
      <div className="px-4 pt-1 pb-1">
        <span className="text-xs text-muted-foreground">共 {filteredTasks.length} 个任务</span>
      </div>

      {/* Task Cards */}
      <div className="flex flex-col gap-3 px-4">
        {filteredTasks.length === 0 ? (
          <div className="py-12 text-center text-sm text-muted-foreground">没有找到匹配的任务</div>
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
    </div>
  );
}
