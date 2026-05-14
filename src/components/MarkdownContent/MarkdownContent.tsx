import ReactMarkdown from 'react-markdown';
import type { Components } from 'react-markdown';
import remarkGfm from 'remark-gfm';
import styles from './MarkdownContent.module.css';

type MarkdownContentProps = {
  content: string;
  className?: string;
  inverted?: boolean;
};

const components: Components = {
  a: ({ children, href }) => (
    <a href={href} target="_blank" rel="noreferrer">
      {children}
    </a>
  ),
};

export function MarkdownContent({
  content,
  className,
  inverted = false,
}: MarkdownContentProps) {
  const rootClassName = [
    styles.markdown,
    inverted ? styles.userMarkdown : '',
    className ?? '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={rootClassName}>
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {content}
      </ReactMarkdown>
    </div>
  );
}
