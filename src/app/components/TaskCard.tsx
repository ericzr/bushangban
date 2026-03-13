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
        'group flex flex-col gap-3 rounded-2xl bg-white p-4 transition-all active:scale-[0.98]',
        'border border-border',
        className
      )}>
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
                {formatDistanceToNow(new Date(task.createdAt), { addSuffix: true, locale: zhCN })}
              </p>
            </div>
          </div>

          {/* Match Score */}
          <div className={cn(
            'flex items-center gap-1 rounded-full px-2 py-0.5 text-xs',
            task.matchScore >= 80 ? 'bg-match-high-bg text-match-high' :
            task.matchScore >= 60 ? 'bg-match-mid-bg text-match-mid' :
            'bg-match-low-bg text-match-low'
          )}>
            <Sparkles className="h-3 w-3" />
            <span>匹配 {task.matchScore}%</span>
          </div>
        </div>

        {/* Title */}
        <h2 className="text-base text-foreground group-hover:text-foreground/80 transition-colors">
          {task.title}
        </h2>

        {/* Description */}
        <p className="line-clamp-2 text-sm text-muted-foreground">
          {task.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5">
          {task.tags.slice(0, 3).map(tag => (
            <span key={tag} className="flex items-center gap-0.5 rounded-full bg-secondary px-2.5 py-0.5 text-xs text-foreground">
              <Tag className="h-2.5 w-2.5" />
              {tag}
            </span>
          ))}
          <span className={cn(
            'rounded-full px-2.5 py-0.5 text-xs',
            task.type === '长期' ? 'bg-info-light text-info' :
            task.type === '兼职' ? 'bg-warning-light text-warning' :
            'bg-success-light text-success'
          )}>
            {task.type}
          </span>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-border pt-3">
          <div className="flex items-center gap-3 text-muted-foreground">
            <button
              onClick={handleLike}
              className={cn(
                'flex items-center gap-1 text-xs transition-colors',
                liked ? 'text-coral' : 'hover:text-coral'
              )}
            >
              <Heart className={cn('h-3.5 w-3.5', liked && 'fill-current')} />
              <span>{likeCount}</span>
            </button>
            <span className="flex items-center gap-1 text-xs">
              <MessageCircle className="h-3.5 w-3.5" />
              <span>{task.comments}</span>
            </span>
            <span className="text-xs">{task.applicants}人申请</span>
          </div>

          <div className="text-right">
            <span className="text-sm text-foreground">
              ¥{task.budgetMin.toLocaleString()}-{task.budgetMax.toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}