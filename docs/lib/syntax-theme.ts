import type { CSSProperties } from 'react';

const foreground = 'var(--code-ink)';
const keyword = 'var(--syntax-keyword)';
const string = 'var(--syntax-string)';
const functionColor = 'var(--syntax-function)';
const typeColor = 'var(--syntax-type)';
const comment = 'var(--syntax-comment)';

export const fullauthPrism: Record<string, CSSProperties> = {
  'code[class*="language-"]': {
    color: foreground,
    background: 'none',
    fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace',
    fontSize: '12px',
    lineHeight: 1.7,
    textShadow: 'none',
  },
  'pre[class*="language-"]': {
    color: foreground,
    background: 'var(--code)',
    fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace',
    fontSize: '12px',
    lineHeight: 1.7,
    textShadow: 'none',
    padding: '38px 80px 18px 18px',
    margin: '0',
    overflow: 'auto',
  },
  comment: { color: comment, fontStyle: 'normal' },
  prolog: { color: comment },
  doctype: { color: comment },
  cdata: { color: comment },
  punctuation: { color: 'var(--syntax-punctuation)' },
  property: { color: 'var(--syntax-property)' },
  tag: { color: typeColor },
  boolean: { color: typeColor },
  number: { color: 'var(--syntax-number)' },
  constant: { color: typeColor },
  symbol: { color: typeColor },
  deleted: { color: 'var(--syntax-number)' },
  selector: { color: string },
  'attr-name': { color: typeColor },
  string: { color: string },
  char: { color: string },
  builtin: { color: typeColor },
  inserted: { color: string },
  operator: { color: 'var(--syntax-operator)' },
  entity: { color: typeColor, cursor: 'help' },
  url: { color: 'var(--syntax-function)' },
  ' atrule': { color: keyword },
  atrule: { color: keyword },
  'attr-value': { color: string },
  function: { color: functionColor },
  'class-name': { color: typeColor },
  keyword: { color: keyword },
  regex: { color: string },
  important: { color: keyword, fontWeight: '600' },
  variable: { color: 'var(--syntax-property)' },
  bold: { fontWeight: '600' },
  italic: { fontStyle: 'italic' },
};
