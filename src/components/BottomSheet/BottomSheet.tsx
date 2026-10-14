import type { ReactNode } from 'react';
import { usePresence } from '@/hooks/usePresence';
import styles from './BottomSheet.module.css';

interface BottomSheetProps {
  open: boolean;
  onClose: () => void;
  title: ReactNode;
  /** 左上角关闭按钮文案 */
  cancelText?: string;
  /** 追加到弹层上的类名，用于页面覆盖高度等 */
  className?: string;
  children: ReactNode;
}

/**
 * 底部弹层：拖拽条 + 标题栏（左侧取消）+ 内容。
 * 点遮罩或取消关闭；进出场带过渡。内容需要内边距滚动区时包一层 <SheetBody>。
 */
export function BottomSheet({
  open,
  onClose,
  title,
  cancelText = '取消',
  className,
  children,
}: BottomSheetProps) {
  const { mounted, shown } = usePresence(open, 300);
  if (!mounted) return null;
  const shownCls = shown ? ' ' + styles.shown : '';
  return (
    <>
      <div className={styles.scrim + shownCls} onClick={onClose} />
      <div
        className={styles.sheet + shownCls + (className ? ' ' + className : '')}
        role="dialog"
        aria-modal="true"
      >
        <div className={styles.bar} aria-hidden="true" />
        <div className={styles.head}>
          <button className={styles.cancel} type="button" onClick={onClose}>
            {cancelText}
          </button>
          <span className={styles.title}>{title}</span>
          <span className={styles.spacer} />
        </div>
        {children}
      </div>
    </>
  );
}

export function SheetBody({ children }: { children: ReactNode }) {
  return <div className={styles.body}>{children}</div>;
}
