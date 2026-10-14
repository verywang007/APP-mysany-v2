import { useEffect } from 'react';
import { HashRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { DIRECTORY_ROUTE, ROUTES, type AppRoute } from '@/router/routes';

const ALL_ROUTES: AppRoute[] = [DIRECTORY_ROUTE, ...ROUTES];

/** 同步页面标题与地址栏颜色；URL 变化（含查询参数）时重新挂载页面，保证演示参数生效 */
function RoutePage({ route }: { route: AppRoute }) {
  const location = useLocation();
  useEffect(() => {
    document.title = 'MySANY · ' + route.title;
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', route.themeColor);
  }, [route]);
  return (
    <div key={location.pathname + location.search} style={{ display: 'contents' }}>
      {route.element}
    </div>
  );
}

export default function App() {
  return (
    <HashRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Routes>
        {ALL_ROUTES.map(r => (
          <Route key={r.path} path={r.path} element={<RoutePage route={r} />} />
        ))}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </HashRouter>
  );
}
