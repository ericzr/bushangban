import { type Task } from '../data/mock';
import { cn } from '../../lib/utils';
import { formatDistanceToNow } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { Heart, MessageCircle, Tag, Sparkles } from 'lucide-react';
import { Link } from 'react-router';
import { useState } from 'react';

interface TaskCardProps {
  task: Task;
  className?: string;
}

// 任务类型对应的竖条颜色
const TYPE_COLORS: Record<string, string> = {
  '长期': 'bg-blue-500',
  '兼职': 'bg-amber-500',
  '项目制': 'bg-orange-500',
};

const TYPE_BADGE_COLORS: Record<string, string> = {
  '长期': 'bg-blue-50 text-blue-600',
  '兼职': 'bg-amber-50 text-amber-600',
  '项目制': 'bg-orange-50 text-orange-600',
};

export function TaskCard({ task, className }: TaskCardProps) {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(task.likes);

  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setLiked(!liked);
    setLikeCount(liked ? likeCount - 1 : likeCount + 1);
  };

  return (
    <Link to={`/task/${task.id}`} className="block">
      <div className={cn(
        'group flex overflow-hidden rounded-2xl bg-white transition-all active:scale-[0.98]',
        'border border-amber-100',
        className
      )}>
        {/* Left Color Bar */}
        <div className={cn('w-1 flex-shrink-0', TYPE_COLORS[task.type] || 'bg-amber-400')} />

        {/* Content */}
        <div className="flex flex-1 flex-col gap-2.5 p-4">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="relative">
                <img
                  src={task.author.avatar}
                  alt={task.author.name}
                  className="h-9 w-9 rounded-full object-cover ring-1 ring-border"
                />
                {task.author.isOnline && (
                  <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-background bg-success" />
                )}
              </div>
              <div>
                <h3 className="text-sm text-foreground">{task.author.name}</h3>
                <p className="text-xs text-muted-foreground">
                  {formatDistanceToNow(new Date(task.createdAt),
                    { addSuffix: true, locale: zhCN })}
                </p>
              </div>
            </div>
            {/* Type Badge */}
            <span className={cn(
              'rounded-md px-2 py-0.5 text-[11px] font-medium',
              TYPE_BADGE_COLORS[task.type] || 'bg-amber-50 text-amber-600'
            )}>
              {task.type}
            </span>
          </div>

          {/* Title */}
          <h2 className="text-[15px] font-semibold leading-snug text-foreground line-clamp-1">
            {task.title}
          </h2>

          {/* Description */}
          <p className="text-xs leading-relaxed text-muted-foreground line-clamp-2">
            {task.description}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5">
            {task.tags.map(tag => (
              <span key={tag} className="inline-flex items-center gap-0.5 rounded-full bg-amber-50/80 px-2 py-0.5 text-[11px] text-amber-700">
                <Tag className="h-2.5 w-2.5" />
                {tag}
              </span>
            ))}
            {task.isUrgent && (
              <span className="inline-flex items-center gap-0.5 rounded-full bg-coral-light px-2 py-0.5 text-[11px] text-coral">
                <Sparkles className="h-2.5 w-2.5" />
                急招
              </span>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between pt-0.5">
            <div className="flex items-center gap-3 text-muted-foreground">
              <button onClick={handleLike} className={cn('flex items-center gap-1 text-xs transition-colors', liked && 'text-coral')}>
                <Heart className={cn('h-3.5 w-3.5', liked && 'fill-coral')} />
                <span>{likeCount}</span>
              </button>
              <span className="flex items-center gap-1 text-xs">
                <MessageCircle className="h-3.5 w-3.5" />
                <span>{task.comments}</span>
              </span>
              <span className="text-xs">{task.applicants}人申请</span>
            </div>

            <div className="text-right">
              <span className="text-sm font-semibold text-amber-600">
                ¥{task.budgetMin.toLocaleString()}-{task.budgetMax.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
