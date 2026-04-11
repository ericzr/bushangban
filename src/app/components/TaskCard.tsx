import { type Task, TASK_TYPE_CONFIG, getTaskTypeLabel } from '../data/mock';
import { cn } from '../../lib/utils';
import { formatDistanceToNow } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { Heart, MessageCircle, Tag, Bot, Clock, GraduationCap, Target, Zap, MapPin, Wifi } from 'lucide-react';
import { Link } from 'react-router';
import { useState } from 'react';

interface TaskCardProps {
  task: Task;
  className?: string;
}

const TYPE_ICON: Record<string, React.ElementType> = {
  intern: GraduationCap,
  parttime: Clock,
  crowdsourcing: Target,
  agent: Bot,
};

function PriceLabel({ task }: { task: Task }) {
  if (task.priceType === 'monthly') {
    return <span className="text-sm font-semibold text-foreground">¥{task.budgetMin.toLocaleString()}-{task.budgetMax.toLocaleString()}<span className="text-xs font-normal text-muted-foreground">/月</span></span>;
  }
  if (task.priceType === 'hourly') {
    return <span className="text-sm font-semibold text-foreground">¥{task.budgetMin}-{task.budgetMax}<span className="text-xs font-normal text-muted-foreground">/小时</span></span>;
  }
  return <span className="text-sm font-semibold text-foreground">¥{task.budgetMin.toLocaleString()}-{task.budgetMax.toLocaleString()}</span>;
}

export function TaskCard({ task, className }: TaskCardProps) {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(task.likes);

  const typeConfig = TASK_TYPE_CONFIG[task.type];
  const typeLabel = getTaskTypeLabel(task.type);
  const TypeIcon = TYPE_ICON[task.type] || Tag;
  const isAgentType = task.type === 'agent';
  const isCrowdsourcing = task.type === 'crowdsourcing';
  const isIntern = task.type === 'intern';
  const isInstantType = isAgentType || (isCrowdsourcing && task.isInstant);

  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setLiked(!liked);
    setLikeCount(liked ? likeCount - 1 : likeCount + 1);
  };

  return (
    <Link to={`/task/${task.id}`} className="block">
      <div className={cn(
        'group flex overflow-hidden rounded-2xl bg-white border border-border transition-all active:scale-[0.98]',
        className
      )}>
        <div className={cn('w-1 flex-shrink-0', typeConfig.barColor)} />

        <div className="flex flex-1 flex-col gap-2.5 p-4">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="relative">
                <img src={task.author.avatar} alt={task.author.name} className="h-9 w-9 rounded-full object-cover ring-1 ring-border" />
                {task.author.isOnline && <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-background bg-success" />}
              </div>
              <div>
                <h3 className="text-sm text-foreground">{task.author.name}</h3>
                <p className="text-xs text-muted-foreground">{formatDistanceToNow(new Date(task.createdAt), { addSuffix: true, locale: zhCN })}</p>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              {task.isUrgent && (
                <span className="rounded-md px-1.5 py-0.5 text-[10px] font-medium bg-coral-light text-coral">急招</span>
              )}
              <span className={cn('flex items-center gap-1 rounded-md px-2 py-0.5 text-[11px] font-medium', typeConfig.badgeClass)}>
                <TypeIcon className="h-3 w-3" />
                {typeLabel}
              </span>
            </div>
          </div>

          {/* Title */}
          <h2 className="text-[15px] font-semibold leading-snug text-foreground line-clamp-1">{task.title}</h2>

          {/* Description */}
          <p className="text-xs leading-relaxed text-muted-foreground line-clamp-2">{task.description}</p>

          {/* Delivery mode / instant badges for crowdsourcing & agent */}
          {(isAgentType || isCrowdsourcing) && (
            <div className="flex items-center gap-2 flex-wrap">
              {task.isInstant && (
                <span className="inline-flex items-center gap-0.5 rounded-full bg-amber-50 text-amber-600 px-2 py-0.5 text-[11px] font-medium">
                  <Zap className="h-2.5 w-2.5" />即时任务
                </span>
              )}
              {task.deliveryMode && (
                <span className={cn('inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-[11px] font-medium',
                  task.deliveryMode === 'offline' ? 'bg-teal-50 text-teal-600' : 'bg-blue-50 text-blue-600'
                )}>
                  {task.deliveryMode === 'offline' ? <MapPin className="h-2.5 w-2.5" /> : <Wifi className="h-2.5 w-2.5" />}
                  {task.deliveryMode === 'offline' ? '线下' : task.deliveryMode === 'online' ? '线上' : '线上/线下'}
                </span>
              )}
              {task.deliveryMode === 'offline' && task.location && (
                <span className="inline-flex items-center gap-0.5 text-[11px] text-muted-foreground">
                  <MapPin className="h-2.5 w-2.5" />{task.location}
                </span>
              )}
              {task.estimatedDuration && (
                <span className="inline-flex items-center gap-0.5 text-[11px] text-muted-foreground">
                  <Clock className="h-2.5 w-2.5" />{task.estimatedDuration}
                </span>
              )}
            </div>
          )}

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5">
            {task.tags.map(tag => (
              <span key={tag} className="inline-flex items-center gap-0.5 rounded-full bg-secondary px-2 py-0.5 text-[11px] text-foreground">
                <Tag className="h-2.5 w-2.5" />{tag}
              </span>
            ))}
          </div>

          {/* Milestones preview */}
          {task.milestones && task.milestones.length > 0 && (
            <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
              <div className="flex-1 h-1.5 rounded-full bg-secondary overflow-hidden flex">
                {task.milestones.map((ms, i) => (
                  <div
                    key={ms.id}
                    style={{ width: `${ms.percentage}%` }}
                    className={cn(
                      'h-full',
                      ms.status === 'completed' ? 'bg-success' : ms.status === 'in-progress' ? 'bg-info' : 'bg-border',
                      i > 0 && 'border-l border-white'
                    )}
                  />
                ))}
              </div>
              <span className="flex-shrink-0">{task.milestones.length}个里程碑 · 分{task.milestones.length}期交付</span>
            </div>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between pt-0.5">
            <div className="flex items-center gap-3 text-muted-foreground">
              <button onClick={handleLike} className={cn('flex items-center gap-1 text-xs transition-colors', liked && 'text-coral')}>
                <Heart className={cn('h-3.5 w-3.5', liked && 'fill-coral')} /><span>{likeCount}</span>
              </button>
              <span className="flex items-center gap-1 text-xs"><MessageCircle className="h-3.5 w-3.5" /><span>{task.comments}</span></span>
              <span className="text-xs">{task.applicants}人{(isAgentType || isCrowdsourcing) ? '接单' : '申请'}</span>
            </div>
            {(isAgentType || isCrowdsourcing) ? (
              <div className="flex items-center gap-2">
                <PriceLabel task={task} />
                <button
                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
                  className={cn('rounded-full px-3 py-1 text-xs font-medium text-white', isAgentType ? 'bg-rose-500' : 'bg-teal-500')}
                >
                  接单
                </button>
              </div>
            ) : isIntern ? (
              <div className="flex items-center gap-2">
                <PriceLabel task={task} />
                <button
                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
                  className="rounded-full px-3 py-1 text-xs font-medium text-white bg-blue-500"
                >
                  申请
                </button>
              </div>
            ) : (
              <PriceLabel task={task} />
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
