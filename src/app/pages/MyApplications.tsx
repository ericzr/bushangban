import { Link } from 'react-router';
import { MOCK_TASKS } from '../data/mock';
import { ArrowLeft, Clock, CheckCircle2, XCircle } from 'lucide-react';
import { cn } from '../../lib/utils';

const APPLICATION_STATUS = ['待回复', '已通过', '已拒绝'] as const;

export function MyApplications() {
  const applications = MOCK_TASKS.slice(0, 5).map((task, i) => ({
    ...task,
    applicationStatus: APPLICATION_STATUS[i % 3],
  }));

  return (
    <div className="flex flex-col pb-4" style={{ paddingTop: "calc(var(--safe-top) + 49px)" }}>
      <div className="fixed top-0 left-0 right-0 z-40 flex items-center gap-3 bg-white/80 backdrop-blur-md px-4 py-3 border-b border-border" style={{ paddingTop: "var(--safe-top)" }}>
        <Link to="/profile" className="text-muted-foreground"><ArrowLeft className="h-5 w-5" /></Link>
        <h1 className="text-sm text-foreground">我申请的任务</h1>
      </div>

      <div className="px-4 pt-4 space-y-3">
        {applications.map(app => (
          <Link key={app.id} to={`/task/${app.id}`} className="block rounded-2xl bg-white border border-border p-4 hover:bg-secondary/30 transition-colors">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm text-foreground">{app.title}</h3>
              <span className={cn(
                'rounded-full px-2 py-0.5 text-[10px]',
                app.applicationStatus === '待回复' ? 'bg-warning-light text-warning' :
                app.applicationStatus === '已通过' ? 'bg-success-light text-success' :
                'bg-coral-light text-coral'
              )}>
                {app.applicationStatus}
              </span>
            </div>
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <span>¥{app.budgetMin}-{app.budgetMax}</span>
              <span>{app.author.name}</span>
              <span>{app.location}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
