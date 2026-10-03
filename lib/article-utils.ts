/**
 * Calculates estimated reading time for an article.
 * Uses 200 words-per-minute (comfortable reading pace).
 * Strips HTML/markdown before counting words.
 */
export function calculateReadingTime(content: string): string {
  const text = content
    .replace(/<[^>]+>/g, " ")        // strip HTML tags
    .replace(/```[\s\S]*?```/g, " ") // strip code blocks
    .replace(/`[^`]*`/g, " ")        // strip inline code
    .replace(/[#*_~[\]()>]/g, " ")   // strip markdown symbols
    .replace(/\s+/g, " ")
    .trim();

  const wordCount = text.split(" ").filter(Boolean).length;
  const minutes = Math.max(1, Math.round(wordCount / 200));
  return `${minutes} min read`;
}

/**
 * Formats a date for display in article metadata.
 */
export function formatArticleDate(date: Date | null | string): string {
  if (!date) return "";
  const d = date instanceof Date ? date : new Date(date);
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/**
 * Generates a simple HTML rendering of markdown content.
 * Supports: headings (##, ###), paragraphs, bold, italic,
 * unordered lists, ordered lists, code blocks, inline code, links, images.
 * This is a simple renderer; no external markdown library needed.
 */
export function renderMarkdown(markdown: string): string {
  let html = markdown;

  // Code blocks (must come before inline code)
  html = html.replace(/```(\w*)\n?([\s\S]*?)```/g, (_, lang, code) => {
    const escapedCode = code
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .trim();
    return `<pre class="article-code-block" data-lang="${lang || "code"}"><code>${escapedCode}</code></pre>`;
  });

  // Inline code
  html = html.replace(/`([^`]+)`/g, "<code class=\"article-inline-code\">$1</code>");

  // Images (before links)
  html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" class="article-image" />');

  // Links — external links open in a new tab, internal links stay in the same tab
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_, text, href) => {
    const isExternal = /^https?:\/\//i.test(href);
    const attrs = isExternal ? ' target="_blank" rel="noopener noreferrer"' : "";
    return `<a href="${href}" class="article-link"${attrs}>${text}</a>`;
  });

  // H2
  html = html.replace(/^## (.+)$/gm, '<h2 class="article-h2">$1</h2>');

  // H3
  html = html.replace(/^### (.+)$/gm, '<h3 class="article-h3">$1</h3>');

  // Bold
  html = html.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");

  // Italic
  html = html.replace(/\*(.+?)\*/g, "<em>$1</em>");

  // Unordered lists
  html = html.replace(/((?:^- .+\n?)+)/gm, (match) => {
    const items = match
      .trim()
      .split("\n")
      .map((line) => `<li>${line.replace(/^- /, "").trim()}</li>`)
      .join("");
    return `<ul class="article-ul">${items}</ul>`;
  });

  // Ordered lists
  html = html.replace(/((?:^\d+\. .+\n?)+)/gm, (match) => {
    const items = match
      .trim()
      .split("\n")
      .map((line) => `<li>${line.replace(/^\d+\. /, "").trim()}</li>`)
      .join("");
    return `<ol class="article-ol">${items}</ol>`;
  });

  // Paragraphs (non-empty lines not already wrapped in block tags)
  html = html
    .split("\n\n")
    .map((block) => {
      const trimmed = block.trim();
      if (!trimmed) return "";
      if (trimmed.startsWith("<!--")) return trimmed; // raw HTML comments pass through
      if (/^<(h[2-6]|ul|ol|pre|img|blockquote)/.test(trimmed)) return trimmed;
      return `<p class="article-p">${trimmed.replace(/\n/g, " ")}</p>`;
    })
    .filter(Boolean)
    .join("\n");

  return html;
}
