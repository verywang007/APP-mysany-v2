import { Fragment } from 'react';
import type { LegalDoc } from '@/data/legal';

/** 段落正文：\n 换行；以 ** 开头时首行加粗 */
function Paragraph({ text }: { text: string }) {
  const bold = text.startsWith('**');
  const lines = (bold ? text.slice(2) : text).split('\n');
  return (
    <p>
      {lines.map((line, i) => (
        <Fragment key={i}>
          {i > 0 && <br />}
          {bold && i === 0 ? <b>{line}</b> : line}
        </Fragment>
      ))}
    </p>
  );
}

/** 渲染协议正文（h4 + p），样式由所在页面决定 */
export function LegalDocBody({ doc, tail }: { doc: LegalDoc; tail?: React.ReactNode }) {
  return (
    <>
      {doc.sections.map(([h, body], i) => (
        <Fragment key={i}>
          {h && <h4>{h}</h4>}
          <Paragraph text={body} />
        </Fragment>
      ))}
      {tail}
    </>
  );
}
