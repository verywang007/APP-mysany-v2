/** 登录页国家 / 地区区号；py 为拼音 + 英文，用于搜索 */
export interface Country {
  flag: string;
  name: string;
  dial: string;
  py: string;
}

export const COUNTRIES: Country[] = [
  { flag: '🇨🇳', name: '中国', dial: '86', py: 'zhongguo china' },
  { flag: '🇭🇰', name: '中国香港', dial: '852', py: 'xianggang hongkong' },
  { flag: '🇲🇴', name: '中国澳门', dial: '853', py: 'aomen macao' },
  { flag: '🇹🇼', name: '中国台湾', dial: '886', py: 'taiwan' },
  { flag: '🇸🇬', name: '新加坡', dial: '65', py: 'xinjiapo singapore' },
  { flag: '🇲🇾', name: '马来西亚', dial: '60', py: 'malaixiya malaysia' },
  { flag: '🇮🇩', name: '印度尼西亚', dial: '62', py: 'yindunixiya indonesia' },
  { flag: '🇹🇭', name: '泰国', dial: '66', py: 'taiguo thailand' },
  { flag: '🇻🇳', name: '越南', dial: '84', py: 'yuenan vietnam' },
  { flag: '🇮🇳', name: '印度', dial: '91', py: 'yindu india' },
  { flag: '🇯🇵', name: '日本', dial: '81', py: 'riben japan' },
  { flag: '🇰🇷', name: '韩国', dial: '82', py: 'hanguo korea' },
  { flag: '🇦🇺', name: '澳大利亚', dial: '61', py: 'aodaliya australia' },
  { flag: '🇺🇸', name: '美国', dial: '1', py: 'meiguo usa america' },
  { flag: '🇨🇦', name: '加拿大', dial: '1', py: 'jianada canada' },
  { flag: '🇧🇷', name: '巴西', dial: '55', py: 'baxi brazil' },
  { flag: '🇲🇽', name: '墨西哥', dial: '52', py: 'moxige mexico' },
  { flag: '🇨🇱', name: '智利', dial: '56', py: 'zhili chile' },
  { flag: '🇬🇧', name: '英国', dial: '44', py: 'yingguo uk britain' },
  { flag: '🇩🇪', name: '德国', dial: '49', py: 'deguo germany' },
  { flag: '🇫🇷', name: '法国', dial: '33', py: 'faguo france' },
  { flag: '🇮🇹', name: '意大利', dial: '39', py: 'yidali italy' },
  { flag: '🇪🇸', name: '西班牙', dial: '34', py: 'xibanya spain' },
  { flag: '🇳🇱', name: '荷兰', dial: '31', py: 'helan netherlands' },
  { flag: '🇵🇱', name: '波兰', dial: '48', py: 'bolan poland' },
  { flag: '🇹🇷', name: '土耳其', dial: '90', py: 'tuerqi turkey' },
  { flag: '🇷🇺', name: '俄罗斯', dial: '7', py: 'eluosi russia' },
  { flag: '🇸🇦', name: '沙特阿拉伯', dial: '966', py: 'shate saudi' },
  { flag: '🇦🇪', name: '阿联酋', dial: '971', py: 'alianqiu uae' },
  { flag: '🇿🇦', name: '南非', dial: '27', py: 'nanfei southafrica' },
  { flag: '🇳🇬', name: '尼日利亚', dial: '234', py: 'nirileiya nigeria' },
  { flag: '🇪🇬', name: '埃及', dial: '20', py: 'aiji egypt' },
];
