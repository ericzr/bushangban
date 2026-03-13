import { Link, useNavigate, useSearchParams } from 'react-router';
import { useState } from 'react';
import { MOCK_TALENTS, SKILL_CATEGORIES } from '../data/mock';
import { cn } from '../../lib/utils';
import { Star, ChevronDown, FileText, Sparkles, Heart, MessageCircle } from 'lucide-react';

export function Talents() {
  const [activeCategory, setActiveCategory] = useState('全部');
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [followedIds, setFollowedIds] = useState<Set<string>>(new Set());

  // Read filter params from URL
  const filterIdentity = searchParams.get('identity') || '全部';
  const filterCity = searchParams.get('city') || '全部';
  const filterAccept = searchParams.get('accept') || '全部';

  const toggleFollow = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    setFollowedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const handleChat = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigate('/messages');
  };

  const filteredTalents = MOCK_TALENTS.filter(t => {
    // Category filter
    if (activeCategory !== '全部') {
      const match = t.acceptTypes.some(type => type.includes(activeCategory)) || t.user.skills.some(s => s.name.includes(activeCategory));
      if (!match) return false;
    }
    // Identity filter
    if (filterIdentity !== '全部' && t.user.identity !== filterIdentity) return false;
    // City filter
    if (filterCity !== '全部' && t.user.city !== filterCity) return false;
    // Accept type filter
    if (filterAccept !== '全部' && !t.acceptTypes.includes(filterAccept)) return false;
    return true;
  });

  const hasActiveFilter = filterIdentity !== '全部' || filterCity !== '全部' || filterAccept !== '全部';

  return (
    <div className="flex flex-col pb-4">
      {/* Category Tabs — same style as Home */}
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
          {filterIdentity !== '全部' && <span className="rounded-full bg-primary/10 text-primary px-2 py-0.5">{filterIdentity}</span>}
          {filterCity !== '全部' && <span className="rounded-full bg-primary/10 text-primary px-2 py-0.5">{filterCity}</span>}
          {filterAccept !== '全部' && <span className="rounded-full bg-primary/10 text-primary px-2 py-0.5">{filterAccept}</span>}
        </div>
      )}

      {/* Talent Cards */}
      <div className="flex flex-col gap-3 px-4 pt-2">
        {filteredTalents.map(talent => {
          const { user, acceptTypes, matchScore } = talent;
          const isFollowed = followedIds.has(talent.id);
          return (
            <Link key={talent.id} to={`/talent/${talent.id}`} className="block rounded-2xl bg-white p-4 border border-border active:scale-[0.98] transition-transform">
              <div className="flex gap-3">
                {/* Avatar */}
                <div className="relative flex-shrink-0">
                  <img src={user.avatar} alt={user.name} className="h-14 w-14 rounded-2xl object-cover ring-1 ring-border" />
                  {user.isOnline && (
                    <div className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-2 border-background bg-success" />
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm text-foreground">{user.name}</h3>
                      <span className={cn(
                        'rounded-full px-1.5 py-0.5 text-[10px]',
                        user.identity === '学生' ? 'bg-info-light text-info' :
                        user.identity === '自由职业' ? 'bg-success-light text-success' :
                        'bg-purple-light text-purple'
                      )}>
                        {user.identity}
                      </span>
                    </div>
                    <div className={cn(
                      'flex items-center gap-1 rounded-full px-2 py-0.5 text-xs',
                      matchScore >= 80 ? 'bg-match-high-bg text-match-high' :
                      matchScore >= 60 ? 'bg-match-mid-bg text-match-mid' :
                      'bg-match-low-bg text-match-low'
                    )}>
                      <Sparkles className="h-3 w-3" />
                      <span>匹配 {matchScore}%</span>
                    </div>
                  </div>

                  <p className="text-xs text-muted-foreground mt-0.5">{user.role} · {user.city}</p>

                  {/* Rating */}
                  <div className="flex items-center gap-1 mt-1">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={cn(
                            'h-3 w-3',
                            i < Math.floor(user.rating)
                              ? 'fill-warning text-warning'
                              : 'fill-secondary text-secondary'
                          )}
                        />
                      ))}
                    </div>
                    <span className="text-xs text-muted-foreground">{user.rating}</span>
                    <span className="text-xs text-muted-foreground">· {user.completedProjects}个项目</span>
                  </div>

                  {/* Skills */}
                  <div className="flex flex-wrap gap-1 mt-2">
                    {user.skills.slice(0, 4).map(skill => (
                      <span
                        key={skill.name}
                        className={cn(
                          'rounded-full px-2 py-0.5 text-[10px]',
                          skill.level === '专业' ? 'bg-primary/10 text-foreground' :
                          skill.level === '熟练' ? 'bg-success-light text-success' :
                          'bg-secondary text-muted-foreground'
                        )}
                      >
                        {skill.name}
                        {skill.level === '专业' && <Star className="h-2.5 w-2.5 inline fill-warning text-warning ml-0.5" />}
                      </span>
                    ))}
                  </div>

                  {/* Accept Types */}
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-xs text-muted-foreground">接单：</span>
                    <div className="flex gap-1">
                      {acceptTypes.slice(0, 3).map(type => (
                        <span key={type} className="text-xs text-foreground">{type}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
                <div className="flex items-center gap-2">
                  {user.tags.map(tag => (
                    <span key={tag} className="rounded-full bg-secondary px-2 py-0.5 text-[10px] text-foreground">
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <button onClick={(e) => toggleFollow(e, talent.id)} className={cn('rounded-full px-3 py-1 text-xs transition-colors', isFollowed ? 'bg-secondary text-muted-foreground' : 'bg-secondary text-foreground hover:bg-primary hover:text-primary-foreground')}>
                    {isFollowed ? '已关注' : '关注'}
                  </button>
                  <button onClick={handleChat} className="rounded-full bg-primary px-3 py-1 text-xs text-primary-foreground hover:bg-primary/80 transition-colors">
                    沟通
                  </button>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Floating Resume Button */}
      <Link
        to="/profile"
        className="fixed bottom-22 right-5 z-40 flex items-center gap-1.5 rounded-full bg-primary px-4 py-3 text-primary-foreground shadow-lg hover:scale-105 transition-transform"
      >
        <FileText className="h-4 w-4" />
        <span className="text-sm">我的简历</span>
      </Link>
    </div>
  );
}
