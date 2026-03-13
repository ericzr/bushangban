import { useState } from 'react';
import { MOCK_TASKS, SKILL_CATEGORIES } from '../data/mock';
import { TaskCard } from '../components/TaskCard';
import { Plus } from 'lucide-react';
import { cn } from '../../lib/utils';
import { Link, useSearchParams } from 'react-router';

export function Home() {
  const [activeCategory, setActiveCategory] = useState('全部');
  const [searchParams] = useSearchParams();

  // Read filter params from URL (set by Navbar filter drawer)
  const filterRegion = searchParams.get('region') || '全部';
  const filterBudget = searchParams.get('budget') || '全部';
  const filterType = searchParams.get('type') || '全部';

  const BUDGET_RANGES: Record<string, { min: number; max: number }> = {
    '全部': { min: 0, max: Infinity },
    '1k以下': { min: 0, max: 1000 },
    '1k-5k': { min: 1000, max: 5000 },
    '5k-1w': { min: 5000, max: 10000 },
    '1w-5w': { min: 10000, max: 50000 },
    '5w以上': { min: 50000, max: Infinity },
  };

  const filteredTasks = MOCK_TASKS.filter(task => {
    if (activeCategory !== '全部' && !task.tags.includes(activeCategory)) return false;
    if (filterRegion !== '全部' && task.location !== filterRegion && task.location !== '远程') return false;
    if (filterBudget !== '全部') {
      const range = BUDGET_RANGES[filterBudget];
      if (range && (task.budgetMax < range.min || task.budgetMin > range.max)) return false;
    }
    if (filterType !== '全部') {
      const typeMap: Record<string, string> = { '长期': 'long-term', '短期': 'short-term', '兼职': 'part-time', '全职': 'full-time' };
      if (typeMap[filterType] && task.type !== typeMap[filterType]) return false;
    }
    return true;
  });

  const hasActiveFilter = filterRegion !== '全部' || filterBudget !== '全部' || filterType !== '全部';

  return (
    <div className="flex flex-col pb-4">
      {/* Category Tabs */}
      <div className="sticky z-30 bg-[var(--background)] border-b border-border" style={{ top: 'calc(var(--safe-top) + 3.5rem)' }}>
        <div className="flex gap-2 overflow-x-auto px-4 py-2.5 scrollbar-hide">
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

      {/* Active Filter Indicator */}
      {hasActiveFilter && (
        <div className="flex items-center gap-2 px-4 py-2 text-xs text-muted-foreground">
          <span>筛选中：</span>
          {filterRegion !== '全部' && <span className="rounded-full bg-primary/10 text-primary px-2 py-0.5">{filterRegion}</span>}
          {filterBudget !== '全部' && <span className="rounded-full bg-primary/10 text-primary px-2 py-0.5">{filterBudget}</span>}
          {filterType !== '全部' && <span className="rounded-full bg-primary/10 text-primary px-2 py-0.5">{filterType}</span>}
        </div>
      )}

      {/* Task Cards */}
      <div className="flex flex-col gap-3 px-4 pt-2">
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
