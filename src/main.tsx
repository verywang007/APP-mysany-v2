import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
// 样式顺序：变量 → 全局 → 组件库；页面样式随页面组件加载，排在其后
import './styles/tokens.css';
import './styles/global.css';
import './styles/kit.css';
import App from './App';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
