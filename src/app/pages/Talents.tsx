import { Link, useNavigate, useSearchParams } from 'react-router';
import { useState } from 'react';
import { MOCK_TALENTS } from '../data/mock';
import { cn } from '../../lib/utils';
import { Star, FileText, Heart, MessageCircle, Briefcase, CheckCircle2, TrendingUp } from 'lucide-react';

const TALENT_TABS = ['推荐', '设计师', '开发者', '创作者', '视频', '插画'];

export function Talents() {
  const [activeTab, setActiveTab] = useState('推荐');
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [followedIds, setFollowedIds] = useState<Set<string>>(new Set());

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
    if (activeTab !== '推荐') {
      const match = t.user.role.includes(activeTab) || t.acceptTypes.some(type => type.includes(activeTab)) || t.user.skills.some(s => s.name.includes(activeTab));
      if (!match) return false;
    }
    if (filterIdentity !== '全部' && t.user.identity !== filterIdentity) return false;
    if (filterCity !== '全部' && t.user.city !== filterCity) return false;
    if (filterAccept !== '全部' && !t.acceptTypes.includes(filterAccept)) return false;
    return true;
  });

  return (
    <div className="flex flex-col pb-4">
      {/* Underline Tab Bar — 人才广场专属样式（区别于任务广场的胶囊横滑） */}
      <div className="px-4 pt-2 pb-0">
        <div className="flex gap-0 border-b border-border">
          {TALENT_TABS.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                'relative px-3 py-2.5 text-sm transition-colors whitespace-nowrap',
                activeTab === tab
                  ? 'text-foreground font-semibold'
                  : 'text-muted-foreground'
              )}
            >
              {tab}
              {activeTab === tab && (
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 w-5 rounded-full bg-foreground" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Talent Cards — 名片式布局 */}
      <div className="flex flex-col gap-3 px-4 pt-3">
        {filteredTalents.length === 0 ? (
          <div className="py-20 text-center text-muted-foreground">没有找到匹配的人才</div>
        ) : (
          filteredTalents.map(talent => {
            const isFollowed = followedIds.has(talent.id);
            return (
              <Link key={talent.id} to={`/talent/${talent.id}`} className="block">
                <div className="group rounded-2xl bg-white border border-border p-4 transition-all active:scale-[0.98]">
                  {/* Top: Avatar + Info + Follow */}
                  <div className="flex items-start gap-3.5">
                    {/* Large Avatar */}
                    <div className="relative flex-shrink-0">
                      <img
                        src={talent.user.avatar}
                        alt={talent.user.name}
                        className="h-14 w-14 rounded-2xl object-cover ring-1 ring-border"
                      />
                      {talent.user.isOnline && (
                        <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-white bg-success" />
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="text-[15px] font-semibold text-foreground truncate">{talent.user.name}</h3>
                        <span className="rounded-md bg-secondary px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground flex-shrink-0">
                          {talent.user.role}
                        </span>
                      </div>
                      <div className="mt-0.5 flex items-center gap-2 text-xs text-muted-foreground">
                        <span>{talent.user.city}</span>
                        <span>·</span>
                        <span>{talent.user.identity}</span>
                        <span>·</span>
                        <div className="flex items-center gap-0.5">
                          <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                          <span className="text-foreground font-medium">{talent.rating}</span>
                        </div>
                      </div>

                      {/* Skills */}
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {talent.user.skills.slice(0, 4).map(skill => (
                          <span key={skill.name} className="rounded-full bg-secondary px-2 py-0.5 text-[11px] text-foreground">
                            {skill.name}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Follow Button */}
                    <button
                      onClick={(e) => toggleFollow(e, talent.id)}
                      className={cn(
                        'flex-shrink-0 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors',
                        isFollowed
                          ? 'bg-secondary text-muted-foreground'
                          : 'bg-foreground text-background'
                      )}
                    >
                      {isFollowed ? '已关注' : '关注'}
                    </button>
                  </div>

                  {/* Stats Bar */}
                  <div className="mt-3 flex items-center justify-between rounded-xl bg-secondary/60 px-3 py-2">
                    <div className="flex items-center gap-1.5 text-xs">
                      <Briefcase className="h-3.5 w-3.5 text-muted-foreground" />
                      <span className="font-semibold text-foreground">{talent.completedProjects}</span>
                      <span className="text-muted-foreground">项目</span>
                    </div>
                    <div className="h-3 w-px bg-border" />
                    <div className="flex items-center gap-1.5 text-xs">
                      <CheckCircle2 className="h-3.5 w-3.5 text-muted-foreground" />
                      <span className="font-semibold text-foreground">{talent.completionRate}%</span>
                      <span className="text-muted-foreground">履约</span>
                    </div>
                    <div className="h-3 w-px bg-border" />
                    <div className="flex items-center gap-1.5 text-xs">
                      <TrendingUp className="h-3.5 w-3.5 text-muted-foreground" />
                      <span className="font-semibold text-foreground">{talent.rating}</span>
                      <span className="text-muted-foreground">评分</span>
                    </div>
                    <div className="h-3 w-px bg-border" />
                    <button
                      onClick={handleChat}
                      className="flex items-center gap-1 rounded-full bg-foreground px-3 py-1 text-[11px] font-medium text-background"
                    >
                      <MessageCircle className="h-3 w-3" />
                      沟通
                    </button>
                  </div>
                </div>
              </Link>
            );
          })
        )}
      </div>

      {/* Floating Resume Button */}
      <Link
        to="/profile"
        className="fixed bottom-20 right-4 z-40 flex items-center gap-1.5 rounded-full bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground shadow-lg hover:bg-primary/80 transition-colors"
      >
        <FileText className="h-4 w-4" />
        <span className="text-sm">我的简历</span>
      </Link>
    </div>
  );
}
