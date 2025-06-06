'use client';
import styles from './BlogBody.module.css';

interface BlogBodyProps {
  content: string;
}

export default function BlogBody({ content }: BlogBodyProps) {
  return (
    <div className="max-w-2xl mx-auto">
      <div className={styles.content} dangerouslySetInnerHTML={{ __html: content }} />
    </div>
  );
}
