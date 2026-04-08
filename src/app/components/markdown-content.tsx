/**
 * Minimal Markdown → JSX renderer.
 * Handles: headings (##), bold (**), italic (*), inline code (`), code blocks (```),
 * unordered lists (- or *), ordered lists (1.), blockquotes (>), horizontal rules (---),
 * links ([text](url)), and paragraphs.
 */
import React from "react";

function renderInline(text: string, key: string): React.ReactNode[] {
  const result: React.ReactNode[] = [];
  // Patterns: **bold**, *italic*, `code`, [link](url)
  const pattern = /(\*\*(.+?)\*\*|\*(.+?)\*|`([^`]+)`|\[([^\]]+)\]\((https?:\/\/[^\)]+)\))/g;
  let last = 0;
  let match;
  let idx = 0;
  while ((match = pattern.exec(text)) !== null) {
    if (match.index > last) result.push(text.slice(last, match.index));
    if (match[2]) result.push(<strong key={`${key}-b${idx}`}>{match[2]}</strong>);
    else if (match[3]) result.push(<em key={`${key}-i${idx}`}>{match[3]}</em>);
    else if (match[4]) result.push(<code key={`${key}-c${idx}`} className="rounded bg-muted px-1 py-0.5 font-mono text-sm">{match[4]}</code>);
    else if (match[5]) result.push(<a key={`${key}-l${idx}`} href={match[6]} target="_blank" rel="noopener noreferrer" className="text-primary underline hover:opacity-80">{match[5]}</a>);
    last = pattern.lastIndex;
    idx++;
  }
  if (last < text.length) result.push(text.slice(last));
  return result;
}

export function MarkdownContent({ content, className = "" }: { content: string; className?: string }) {
  const lines = content.split("\n");
  const nodes: React.ReactNode[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    // Code block
    if (line.startsWith("```")) {
      const lang = line.slice(3).trim();
      const codeLines: string[] = [];
      i++;
      while (i < lines.length && !lines[i].startsWith("```")) {
        codeLines.push(lines[i]);
        i++;
      }
      nodes.push(
        <pre key={i} className="my-4 overflow-x-auto rounded-xl bg-muted/60 border border-border/60 p-4 text-sm font-mono leading-relaxed">
          <code data-language={lang || undefined}>{codeLines.join("\n")}</code>
        </pre>
      );
      i++;
      continue;
    }

    // Horizontal rule
    if (/^[-*_]{3,}$/.test(line.trim())) {
      nodes.push(<hr key={i} className="my-6 border-border" />);
      i++;
      continue;
    }

    // Headings
    const h3 = line.match(/^### (.+)/);
    const h2 = line.match(/^## (.+)/);
    const h1 = line.match(/^# (.+)/);
    if (h1) { nodes.push(<h1 key={i} className="mt-8 mb-4 text-3xl font-bold tracking-tight">{renderInline(h1[1], `h1-${i}`)}</h1>); i++; continue; }
    if (h2) { nodes.push(<h2 key={i} className="mt-8 mb-3 text-2xl font-bold tracking-tight">{renderInline(h2[1], `h2-${i}`)}</h2>); i++; continue; }
    if (h3) { nodes.push(<h3 key={i} className="mt-6 mb-2 text-xl font-semibold">{renderInline(h3[1], `h3-${i}`)}</h3>); i++; continue; }

    // Blockquote
    if (line.startsWith("> ")) {
      const quoteLines: string[] = [];
      while (i < lines.length && lines[i].startsWith("> ")) {
        quoteLines.push(lines[i].slice(2));
        i++;
      }
      nodes.push(
        <blockquote key={i} className="my-4 border-l-4 border-primary/40 pl-4 italic text-muted-foreground">
          {quoteLines.map((ql, qi) => <p key={qi}>{renderInline(ql, `bq-${i}-${qi}`)}</p>)}
        </blockquote>
      );
      continue;
    }

    // Unordered list
    if (/^[-*+] /.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^[-*+] /.test(lines[i])) {
        items.push(lines[i].replace(/^[-*+] /, ""));
        i++;
      }
      nodes.push(
        <ul key={i} className="my-4 ml-5 list-disc space-y-1.5 text-foreground/90">
          {items.map((item, ii) => <li key={ii}>{renderInline(item, `ul-${i}-${ii}`)}</li>)}
        </ul>
      );
      continue;
    }

    // Ordered list
    if (/^\d+\. /.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\d+\. /.test(lines[i])) {
        items.push(lines[i].replace(/^\d+\. /, ""));
        i++;
      }
      nodes.push(
        <ol key={i} className="my-4 ml-5 list-decimal space-y-1.5 text-foreground/90">
          {items.map((item, ii) => <li key={ii}>{renderInline(item, `ol-${i}-${ii}`)}</li>)}
        </ol>
      );
      continue;
    }

    // Empty line — skip
    if (line.trim() === "") { i++; continue; }

    // Paragraph
    const paraLines: string[] = [];
    while (i < lines.length && lines[i].trim() !== "" && !/^[#>*`\d-]/.test(lines[i])) {
      paraLines.push(lines[i]);
      i++;
    }
    if (paraLines.length > 0) {
      nodes.push(
        <p key={i} className="my-4 leading-7 text-foreground/90">
          {renderInline(paraLines.join(" "), `p-${i}`)}
        </p>
      );
    } else {
      i++;
    }
  }

  return <div className={`prose-custom ${className}`}>{nodes}</div>;
}
