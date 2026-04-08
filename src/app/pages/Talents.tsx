import { Link, useNavigate, useSearchParams } from 'react-router';
import { useState } from 'react';
import { MOCK_TALENTS } from '../data/mock';
import { cn } from '../../lib/utils';
import { Star, FileText, Heart, MessageCircle, Briefcase, CheckCircle2, TrendingUp, SlidersHorizontal, MapPin, X, Users, DollarSign, Zap } from 'lucide-react';

const TALENT_TABS = ['推荐', '设计师', '开发者', '创作者', '视频', '插画'];

const IDENTITY_OPTIONS = ['全部', '自由职业', '学生', '公司'];
const CITY_OPTIONS = ['全部', '上海', '北京', '深圳', '杭州', '广州', '成都', '远程'];
const ACCEPT_OPTIONS = ['全部', 'UI设计', '全栈开发', '文案', '视频剪辑', '插画', '品牌策划', '小程序', 'IP设计'];
const RATE_OPTIONS = ['全部', '100以下/时', '100-300/时', '300-500/时', '500以上/时'];
const SORT_OPTIONS = ['推荐排序', '评分最高', '项目最多', '履约率最高'];

export function Talents() {
  const [activeTab, setActiveTab] = useState('推荐');
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [followedIds, setFollowedIds] = useState<Set<string>>(new Set());

  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [filterIdentity, setFilterIdentity] = useState('全部');
  const [filterCity, setFilterCity] = useState('全部');
  const [filterAccept, setFilterAccept] = useState('全部');
  const [filterRate, setFilterRate] = useState('全部');
  const [filterSort, setFilterSort] = useState('推荐排序');

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

  const RATE_RANGES: Record<string, { min: number; max: number }> = {
    '全部': { min: 0, max: Infinity },
    '100以下/时': { min: 0, max: 100 },
    '100-300/时': { min: 100, max: 300 },
    '300-500/时': { min: 300, max: 500 },
    '500以上/时': { min: 500, max: Infinity },
  };

  let filteredTalents = MOCK_TALENTS.filter(t => {
    if (activeTab !== '推荐') {
      const match = t.user.role.includes(activeTab) || t.acceptTypes.some(type => type.includes(activeTab)) || t.user.skills.some(s => s.name.includes(activeTab));
      if (!match) return false;
    }
    if (filterIdentity !== '全部' && t.user.identity !== filterIdentity) return false;
    if (filterCity !== '全部' && t.user.city !== filterCity) return false;
    if (filterAccept !== '全部' && !t.acceptTypes.includes(filterAccept)) return false;
    if (filterRate !== '全部') {
      const range = RATE_RANGES[filterRate];
      const rateStr = t.hourlyRate || '0-0';
      const minRate = parseInt(rateStr.split('-')[0]);
      if (range && (minRate < range.min || minRate >= range.max)) return false;
    }
    return true;
  });

  if (filterSort === '评分最高') filteredTalents = [...filteredTalents].sort((a, b) => b.rating - a.rating);
  else if (filterSort === '项目最多') filteredTalents = [...filteredTalents].sort((a, b) => b.completedProjects - a.completedProjects);
  else if (filterSort === '履约率最高') filteredTalents = [...filteredTalents].sort((a, b) => b.completionRate - a.completionRate);

  const activeFilterCount = [filterIdentity, filterCity, filterAccept, filterRate].filter(v => v !== '全部').length + (filterSort !== '推荐排序' ? 1 : 0);
  const clearAllFilters = () => { setFilterIdentity('全部'); setFilterCity('全部'); setFilterAccept('全部'); setFilterRate('全部'); setFilterSort('推荐排序'); };

  return (
    <div className="flex flex-col pb-4">
      {/* Tab Bar + Filter */}
      <div className="px-4 pt-2 pb-0">
        <div className="flex items-center border-b border-border">
          <div className="flex gap-0 flex-1">
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
          <button
            onClick={() => setShowFilterPanel(!showFilterPanel)}
            className={cn(
              'flex items-center gap-1 px-3 py-1.5 rounded-full text-xs transition-colors flex-shrink-0 border',
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
          {/* Identity */}
          <div>
            <div className="flex items-center gap-1.5 mb-2">
              <Users className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="text-xs font-medium text-foreground">身份类型</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {IDENTITY_OPTIONS.map(v => (
                <button key={v} onClick={() => setFilterIdentity(v)} className={cn(
                  'rounded-full px-3 py-1 text-[11px] transition-colors border',
                  filterIdentity === v ? 'bg-primary/10 text-primary border-primary/30 font-medium' : 'bg-secondary/60 text-foreground border-transparent'
                )}>{v}</button>
              ))}
            </div>
          </div>
          {/* City */}
          <div>
            <div className="flex items-center gap-1.5 mb-2">
              <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="text-xs font-medium text-foreground">城市</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {CITY_OPTIONS.map(v => (
                <button key={v} onClick={() => setFilterCity(v)} className={cn(
                  'rounded-full px-3 py-1 text-[11px] transition-colors border',
                  filterCity === v ? 'bg-primary/10 text-primary border-primary/30 font-medium' : 'bg-secondary/60 text-foreground border-transparent'
                )}>{v}</button>
              ))}
            </div>
          </div>
          {/* Accept Type */}
          <div>
            <div className="flex items-center gap-1.5 mb-2">
              <Zap className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="text-xs font-medium text-foreground">接单类型</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {ACCEPT_OPTIONS.map(v => (
                <button key={v} onClick={() => setFilterAccept(v)} className={cn(
                  'rounded-full px-3 py-1 text-[11px] transition-colors border',
                  filterAccept === v ? 'bg-primary/10 text-primary border-primary/30 font-medium' : 'bg-secondary/60 text-foreground border-transparent'
                )}>{v}</button>
              ))}
            </div>
          </div>
          {/* Rate */}
          <div>
            <div className="flex items-center gap-1.5 mb-2">
              <DollarSign className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="text-xs font-medium text-foreground">时薪范围</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {RATE_OPTIONS.map(v => (
                <button key={v} onClick={() => setFilterRate(v)} className={cn(
                  'rounded-full px-3 py-1 text-[11px] transition-colors border',
                  filterRate === v ? 'bg-primary/10 text-primary border-primary/30 font-medium' : 'bg-secondary/60 text-foreground border-transparent'
                )}>{v}</button>
              ))}
            </div>
          </div>
          {/* Sort */}
          <div>
            <div className="flex items-center gap-1.5 mb-2">
              <SlidersHorizontal className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="text-xs font-medium text-foreground">排序</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {SORT_OPTIONS.map(v => (
                <button key={v} onClick={() => setFilterSort(v)} className={cn(
                  'rounded-full px-3 py-1 text-[11px] transition-colors border',
                  filterSort === v ? 'bg-primary/10 text-primary border-primary/30 font-medium' : 'bg-secondary/60 text-foreground border-transparent'
                )}>{v}</button>
              ))}
            </div>
          </div>
          {/* Actions */}
          <div className="flex items-center justify-between pt-1">
            <button onClick={clearAllFilters} className="text-xs text-muted-foreground hover:text-foreground transition-colors">清除筛选</button>
            <button onClick={() => setShowFilterPanel(false)} className="rounded-full bg-foreground text-background px-5 py-1.5 text-xs font-medium">确定</button>
          </div>
        </div>
      )}

      {/* Active Filter Tags */}
      {activeFilterCount > 0 && !showFilterPanel && (
        <div className="flex items-center gap-1.5 px-4 py-2 overflow-x-auto scrollbar-hide">
          {filterIdentity !== '全部' && (
            <span className="flex items-center gap-1 rounded-full bg-primary/10 text-primary px-2.5 py-0.5 text-[11px] flex-shrink-0">
              <Users className="h-3 w-3" />{filterIdentity}
              <button onClick={() => setFilterIdentity('全部')}><X className="h-3 w-3" /></button>
            </span>
          )}
          {filterCity !== '全部' && (
            <span className="flex items-center gap-1 rounded-full bg-primary/10 text-primary px-2.5 py-0.5 text-[11px] flex-shrink-0">
              <MapPin className="h-3 w-3" />{filterCity}
              <button onClick={() => setFilterCity('全部')}><X className="h-3 w-3" /></button>
            </span>
          )}
          {filterAccept !== '全部' && (
            <span className="flex items-center gap-1 rounded-full bg-primary/10 text-primary px-2.5 py-0.5 text-[11px] flex-shrink-0">
              <Zap className="h-3 w-3" />{filterAccept}
              <button onClick={() => setFilterAccept('全部')}><X className="h-3 w-3" /></button>
            </span>
          )}
          {filterRate !== '全部' && (
            <span className="flex items-center gap-1 rounded-full bg-primary/10 text-primary px-2.5 py-0.5 text-[11px] flex-shrink-0">
              <DollarSign className="h-3 w-3" />{filterRate}
              <button onClick={() => setFilterRate('全部')}><X className="h-3 w-3" /></button>
            </span>
          )}
          {filterSort !== '推荐排序' && (
            <span className="flex items-center gap-1 rounded-full bg-primary/10 text-primary px-2.5 py-0.5 text-[11px] flex-shrink-0">
              {filterSort}
              <button onClick={() => setFilterSort('推荐排序')}><X className="h-3 w-3" /></button>
            </span>
          )}
          <button onClick={clearAllFilters} className="text-[11px] text-muted-foreground ml-1 flex-shrink-0">清除全部</button>
        </div>
      )}

      {/* Talent Count */}
      <div className="px-4 pt-1 pb-1">
        <span className="text-xs text-muted-foreground">共 {filteredTalents.length} 位人才</span>
      </div>

      {/* Talent Cards */}
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
                          : 'border border-border text-foreground hover:bg-secondary'
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
                      className="flex items-center gap-1 rounded-full border border-border px-3 py-1 text-[11px] font-medium text-foreground hover:bg-secondary"
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
