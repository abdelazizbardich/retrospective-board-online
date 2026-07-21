import sanitizeHtml from "sanitize-html";

/** Sanitize rich-text HTML for safe server-side rendering (no jsdom required). */
export function sanitizeContent(html: string): string {
  return sanitizeHtml(html, {
    allowedTags: [
      "p", "br", "strong", "b", "em", "i", "s", "del", "strike", "code",
      "h1", "h2", "h3", "h4", "h5", "h6",
      "ul", "ol", "li", "blockquote", "hr", "pre", "a", "img",
    ],
    allowedAttributes: {
      a: ["href", "title", "class", "rel", "target"],
      img: ["src", "alt", "title", "width", "height", "class"],
    },
    allowedSchemes: ["http", "https", "mailto"],
  });
}
