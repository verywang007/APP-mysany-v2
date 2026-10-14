import { useState } from 'react';
import { BottomSheet } from '@/components/BottomSheet/BottomSheet';
import { COUNTRIES, type Country } from '@/data/countries';
import { SearchIcon } from './icons';

interface CountrySheetProps {
  open: boolean;
  current: Country;
  onPick: (c: Country) => void;
  onClose: () => void;
}

/** 国家 / 地区选择：支持中文名、拼音、英文、区号搜索 */
export function CountrySheet({ open, current, onPick, onClose }: CountrySheetProps) {
  const [kw, setKw] = useState('');
  const q = kw.trim().toLowerCase().replace(/^\+/, '');
  const rows = COUNTRIES.filter(c => !q || c.name.includes(q) || c.dial.startsWith(q) || c.py.includes(q));

  return (
    <BottomSheet open={open} onClose={onClose} title="国家 / 地区">
      <div className="sheet-search">
        <SearchIcon />
        <input
          type="search"
          placeholder="搜索国家 / 地区或区号"
          value={kw}
          onChange={e => setKw(e.target.value)}
        />
      </div>
      <ul className="country-list">
        {rows.length === 0 && <li className="country-empty">没有匹配的国家 / 地区</li>}
        {rows.map(c => (
          <li
            key={c.name + c.dial}
            className={c.name === current.name && c.dial === current.dial ? 'is-current' : ''}
            onClick={() => onPick(c)}
          >
            <span className="c-flag">{c.flag}</span>
            <span className="c-name">{c.name}</span>
            <span className="c-dial">+{c.dial}</span>
          </li>
        ))}
      </ul>
    </BottomSheet>
  );
}
