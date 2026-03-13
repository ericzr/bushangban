import { Link } from 'react-router';
import { MOCK_TASKS } from '../data/mock';
import { ArrowLeft, Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import { cn } from '../../lib/utils';

export function MyTasks() {
  const tasks = MOCK_TASKS.slice(0, 4);

  return (
    <div className="flex flex-col pb-4" style={{ paddingTop: "calc(var(--safe-top) + 49px)" }}>
      <div className="fixed top-0 left-0 right-0 z-40 flex items-center gap-3 bg-white/80 backdrop-blur-md px-4 py-3 border-b border-border" style={{ paddingTop: "var(--safe-top)" }}>
        <Link to="/profile" className="text-muted-foreground"><ArrowLeft className="h-5 w-5" /></Link>
        <h1 className="text-sm text-foreground">我发布的任务</h1>
      </div>

      <div className="px-4 pt-4 space-y-3">
        {tasks.map(task => (
          <Link key={task.id} to={`/task/${task.id}`} className="block rounded-2xl bg-white border border-border p-4 hover:bg-secondary/30 transition-colors">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm text-foreground">{task.title}</h3>
              <span className={cn('rounded-full px-2 py-0.5 text-[10px]', task.status === 'open' ? 'bg-success-light text-success' : task.status === 'in-progress' ? 'bg-info-light text-info' : 'bg-secondary text-muted-foreground')}>
                {task.status === 'open' ? '开放中' : task.status === 'in-progress' ? '进行中' : '已完成'}
              </span>
            </div>
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <span>¥{task.budgetMin}-{task.budgetMax}</span>
              <span>{task.applicants}人申请</span>
              <span>{task.location}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
