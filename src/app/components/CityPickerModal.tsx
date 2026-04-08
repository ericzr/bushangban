import { useState, useRef, useEffect } from 'react';
import { X, Search, MapPin, ChevronRight } from 'lucide-react';
import { cn } from '../../lib/utils';

const HOT_CITIES = ['北京', '上海', '广州', '深圳', '南京', '杭州', '济南', '天津', '西安', '重庆', '成都', '武汉', '长沙', '昆明', '贵阳'];

// All cities grouped by pinyin initial
const CITIES_BY_LETTER: Record<string, string[]> = {
  A: ['阿坝藏族羌族自治州', '阿克苏', '阿拉尔', '阿拉善盟', '阿勒泰', '阿里', '安康', '安庆', '鞍山', '安顺', '安阳'],
  B: ['巴彦淖尔', '巴中', '白城', '白山', '白银', '百色', '保定', '保山', '宝鸡', '北海', '北京', '毕节', '滨州', '博尔塔拉蒙古自治州'],
  C: ['沧州', '长春', '长沙', '长治', '常德', '常州', '巢湖', '朝阳', '成都', '承德', '赤峰', '崇左', '楚雄彝族自治州', '滁州'],
  D: ['大理白族自治州', '大连', '大庆', '大同', '大兴安岭', '丹东', '德宏傣族景颇族自治州', '德州', '迪庆藏族自治州', '定西', '东莞', '东营'],
  E: ['鄂尔多斯', '鄂州', '恩施土家族苗族自治州'],
  F: ['防城港', '福州', '抚顺', '抚州', '阜新', '阜阳'],
  G: ['甘孜藏族自治州', '甘南藏族自治州', '赣州', '广安', '广州', '贵港', '贵阳', '桂林', '果洛藏族自治州'],
  H: ['哈尔滨', '哈密', '海东', '海口', '海南藏族自治州', '海西蒙古族藏族自治州', '邯郸', '汉中', '杭州', '合肥', '鹤壁', '鹤岗', '黑河', '衡水', '衡阳', '河池', '贺州', '呼和浩特', '呼伦贝尔', '湖州', '葫芦岛', '怀化', '黄冈', '黄南藏族自治州', '黄山', '黄石', '惠州', '霍林郭勒'],
  J: ['鸡西', '吉安', '吉林', '济南', '济宁', '佳木斯', '嘉兴', '嘉峪关', '江门', '焦作', '揭壶', '金昌', '金华', '锦州', '晋城', '晋中', '荆门', '荆州', '九江'],
  K: ['开封', '克拉玛依', '克孜勒苏柯尔克孜自治州', '昆明', '昆玉'],
  L: ['拉萨', '来宾', '兰州', '廊坊', '乐山', '丽江', '丽水', '连云港', '凉山彝族自治州', '辽阳', '辽源', '临沧', '临夏回族自治州', '临汾', '临沂', '林芝', '柳州', '六安', '六盘水', '龙岩', '娄底', '泸州', '吕梁', '洛阳'],
  M: ['马鞍山', '茂名', '眉山', '梅州', '绵阳', '牡丹江'],
  N: ['南昌', '南充', '南京', '南宁', '南平', '南通', '南阳', '那曲', '内江', '宁波', '宁德', '怒江傈僳族自治州'],
  P: ['盘锦', '攀枝花', '平顶山', '平凉', '莆田', '濮阳'],
  Q: ['黔东南苗族侗族自治州', '黔南布依族苗族自治州', '黔西南布依族苗族自治州', '秦皇岛', '钦州', '青岛', '清远', '庆阳', '曲靖', '衢州'],
  R: ['日喀则', '日照'],
  S: ['三门峡', '三明', '三亚', '山南', '汕头', '汕尾', '商洛', '商丘', '上饶', '上海', '韶关', '绍兴', '邵阳', '沈阳', '石家庄', '石嘴山', '朔州', '四平', '松原', '宿迁', '宿州', '绥化', '随州', '遂宁', '苏州'],
  T: ['台州', '太原', '泰安', '泰州', '唐山', '天津', '天水', '铁岭', '通化', '通辽', '铜川', '铜仁', '铜陵'],
  U: [],
  V: [],
  W: ['威海', '潍坊', '温州', '文山壮族苗族自治州', '乌海', '乌鲁木齐', '无锡', '吴忠', '芜湖', '武汉', '武威', '梧州'],
  X: ['西安', '西宁', '西双版纳傣族自治州', '锡林郭勒盟', '咸宁', '咸阳', '湘潭', '湘西土家族苗族自治州', '邢台', '忻州', '新余', '信阳', '兴安盟', '宣城'],
  Y: ['雅安', '延安', '延边朝鲜族自治州', '盐城', '阳江', '阳泉', '扬州', '宜宾', '宜昌', '宜春', '营口', '永州', '榆林', '玉林', '玉树藏族自治州', '玉溪', '云浮', '运城'],
  Z: ['湛江', '张家界', '张家口', '张掖', '漳州', '昭通', '肇庆', '郑州', '镇江', '中卫', '舟山', '珠海', '株洲', '资阳', '自贡', '遵义'],
};

const LETTERS = Object.keys(CITIES_BY_LETTER).filter(l => CITIES_BY_LETTER[l].length > 0);

interface CityPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  selected: string;
  onSelect: (city: string) => void;
  title?: string;
}

export function CityPickerModal({ isOpen, onClose, selected, onSelect, title = '选择城市' }: CityPickerModalProps) {
  const [query, setQuery] = useState('');
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) setQuery('');
  }, [isOpen]);

  const searchResults = query.trim()
    ? Object.values(CITIES_BY_LETTER).flat().filter(c => c.includes(query))
    : [];

  const handleSelect = (city: string) => {
    onSelect(city);
    onClose();
  };

  const jumpToLetter = (letter: string) => {
    sectionRefs.current[letter]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex flex-col bg-[#f9f5ee]" style={{ paddingTop: 'var(--safe-top)' }}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3">
        <button onClick={onClose} className="p-1 -ml-1">
          <X className="h-5 w-5 text-foreground" />
        </button>
        <span className="text-base font-semibold text-foreground">{title}</span>
        <div className="w-7" />
      </div>

      {/* Search */}
      <div className="px-4 pb-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="输入城市名或拼音查询"
            className="w-full rounded-xl bg-white/80 pl-9 pr-4 py-2.5 text-sm outline-none placeholder:text-muted-foreground/60 border border-border/40"
          />
        </div>
      </div>

      {/* Body */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto relative pr-7">
        {query.trim() ? (
          /* Search results */
          <div className="px-4 pb-6">
            {searchResults.length === 0 ? (
              <p className="py-12 text-center text-sm text-muted-foreground">未找到「{query}」相关城市</p>
            ) : (
              searchResults.map(city => (
                <button
                  key={city}
                  onClick={() => handleSelect(city)}
                  className={cn(
                    'w-full text-left px-3 py-3 text-sm border-b border-border/30 flex items-center justify-between',
                    selected === city ? 'text-primary font-medium' : 'text-foreground'
                  )}
                >
                  {city}
                  {selected === city && <span className="h-2 w-2 rounded-full bg-primary" />}
                </button>
              ))
            )}
          </div>
        ) : (
          <div className="px-4 pb-6">
            {/* Current location */}
            <div className="mb-4">
              <p className="text-xs text-muted-foreground mb-2">当前定位</p>
              <button
                onClick={() => handleSelect('鄂尔多斯')}
                className="flex items-center gap-1.5 bg-white rounded-xl px-4 py-2.5 text-sm border border-border/40 shadow-sm"
              >
                <MapPin className="h-3.5 w-3.5 text-amber-500" />
                鄂尔多斯
                <ChevronRight className="h-3.5 w-3.5 text-muted-foreground ml-1" />
              </button>
            </div>

            {/* 全部 / 远程 */}
            <div className="mb-4 flex gap-2">
              {['全部', '远程'].map(v => (
                <button
                  key={v}
                  onClick={() => handleSelect(v)}
                  className={cn(
                    'rounded-xl px-5 py-2.5 text-sm border shadow-sm',
                    selected === v ? 'bg-primary/10 text-primary border-primary/30 font-medium' : 'bg-white border-border/40 text-foreground'
                  )}
                >
                  {v}
                </button>
              ))}
            </div>

            {/* Hot cities */}
            <div className="mb-5">
              <p className="text-xs text-muted-foreground mb-2">热门城市</p>
              <div className="grid grid-cols-3 gap-2">
                {HOT_CITIES.map(city => (
                  <button
                    key={city}
                    onClick={() => handleSelect(city)}
                    className={cn(
                      'rounded-xl py-2.5 text-sm text-center border shadow-sm',
                      selected === city ? 'bg-primary/10 text-primary border-primary/30 font-medium' : 'bg-white border-border/40 text-foreground'
                    )}
                  >
                    {city}
                  </button>
                ))}
              </div>
            </div>

            {/* Alphabetical list */}
            {LETTERS.map(letter => (
              <div
                key={letter}
                ref={el => { sectionRefs.current[letter] = el; }}
                className="mb-2"
              >
                <p className="text-sm font-semibold text-primary py-1">{letter}</p>
                {CITIES_BY_LETTER[letter].map(city => (
                  <button
                    key={city}
                    onClick={() => handleSelect(city)}
                    className={cn(
                      'w-full text-left px-1 py-2.5 text-sm border-b border-border/20 flex items-center justify-between',
                      selected === city ? 'text-primary font-medium' : 'text-foreground'
                    )}
                  >
                    {city}
                    {selected === city && <span className="h-2 w-2 rounded-full bg-primary flex-shrink-0" />}
                  </button>
                ))}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* A–Z side index */}
      {!query.trim() && (
        <div className="absolute right-0 top-1/2 -translate-y-1/2 flex flex-col items-center py-2 z-10" style={{ top: '50%' }}>
          {LETTERS.map(letter => (
            <button
              key={letter}
              onClick={() => jumpToLetter(letter)}
              className="w-6 h-5 flex items-center justify-center text-[10px] text-primary font-medium leading-none"
            >
              {letter}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
