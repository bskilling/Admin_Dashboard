'use client';
interface BlogTitleProps {
  children: string;
}

export default function BlogTitle({ children }: BlogTitleProps) {
  return (
    <h1
      className="text-4xl md:text-4xl lg:text-4xl font-bold tracking-tighter leading-tight md:leading-none mb-12 text-center md:text-left"
      dangerouslySetInnerHTML={{ __html: children }}
    />
  );
}
