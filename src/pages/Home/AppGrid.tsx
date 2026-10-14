import { useEffect, useRef, useState } from 'react';
import { useToast } from '@/components/Toast/useToast';
import { APP_ICONS, APPS_PAGE1, APPS_PAGE2, type AppIcon } from './data';

function Tile({ name, icon }: { name: string; icon: AppIcon }) {
  const toast = useToast();
  return (
    <div className="tile" onClick={() => toast(name + '（原型暂未实现）')}>
      {/* 静态常量 SVG，无用户输入 */}
      <svg viewBox="0 0 32 32" aria-hidden="true" dangerouslySetInnerHTML={{ __html: APP_ICONS[icon] }} />
      <span>{name}</span>
    </div>
  );
}

/** 应用宫格：两页，点点切换 + 左右滑动（触摸 / 鼠标拖拽） */
export function AppGrid() {
  const [page, setPage] = useState(0);
  const viewport = useRef<HTMLDivElement>(null);
  const goPage = (i: number) => setPage(Math.max(0, Math.min(1, i)));

  useEffect(() => {
    const el = viewport.current;
    if (!el) return;
    let startX: number | null = null;
    let startY = 0;
    let locked: 'x' | 'y' | null = null;

    const down = (x: number, y: number) => {
      startX = x;
      startY = y;
      locked = null;
    };
    const move = (x: number, y: number, e: Event) => {
      if (startX === null) return;
      const dx = x - startX;
      const dy = y - startY;
      if (locked === null && (Math.abs(dx) > 6 || Math.abs(dy) > 6))
        locked = Math.abs(dx) > Math.abs(dy) ? 'x' : 'y';
      if (locked === 'x' && e.cancelable) e.preventDefault();
    };
    const up = (x: number) => {
      if (startX === null) return;
      const dx = x - startX;
      if (locked === 'x' && Math.abs(dx) > 40) setPage(p => Math.max(0, Math.min(1, p + (dx < 0 ? 1 : -1))));
      startX = null;
      locked = null;
    };

    const ts = (e: TouchEvent) => down(e.touches[0].clientX, e.touches[0].clientY);
    const tm = (e: TouchEvent) => move(e.touches[0].clientX, e.touches[0].clientY, e);
    const te = (e: TouchEvent) => up(e.changedTouches[0].clientX);
    const md = (e: MouseEvent) => down(e.clientX, e.clientY);
    const mm = (e: MouseEvent) => move(e.clientX, e.clientY, e);
    const mu = (e: MouseEvent) => up(e.clientX);

    el.addEventListener('touchstart', ts, { passive: true });
    el.addEventListener('touchmove', tm, { passive: false });
    el.addEventListener('touchend', te);
    el.addEventListener('mousedown', md);
    window.addEventListener('mousemove', mm);
    window.addEventListener('mouseup', mu);
    return () => {
      el.removeEventListener('touchstart', ts);
      el.removeEventListener('touchmove', tm);
      el.removeEventListener('touchend', te);
      el.removeEventListener('mousedown', md);
      window.removeEventListener('mousemove', mm);
      window.removeEventListener('mouseup', mu);
    };
  }, []);

  return (
    <section className="apps">
      <div className="apps-viewport" ref={viewport}>
        <div
          className={'apps-track' + (page === 1 ? ' page-2' : '')}
          style={{ transform: `translateX(${-page * 100}%)` }}
        >
          <div className="apps-page p1">
            {APPS_PAGE1.map(([n, i], k) => (
              <Tile key={k} name={n} icon={i} />
            ))}
          </div>
          <div className="apps-page p2">
            {APPS_PAGE2.map(([n, i], k) => (
              <Tile key={k} name={n} icon={i} />
            ))}
          </div>
        </div>
      </div>
      <div className="dots">
        {[0, 1].map(i => (
          <i key={i} className={page === i ? 'on' : ''} onClick={() => goPage(i)} />
        ))}
      </div>
    </section>
  );
}
