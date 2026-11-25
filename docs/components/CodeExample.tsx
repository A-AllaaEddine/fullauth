import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { fullauthPrism } from '@/lib/syntax-theme';

type Props = {
  filename?: string;
  language: string;
  code: string;
};

export default function CodeExample({ filename, language, code }: Props) {
  return (
    <div className="code-example">
      {filename && <p className="code-filename">{filename}</p>}
      <SyntaxHighlighter
        language={language}
        style={fullauthPrism}
        customStyle={{ width: '100%', backgroundColor: 'var(--code)' }}
        wrapLongLines={false}
      >
        {code.trim()}
      </SyntaxHighlighter>
    </div>
  );
}
