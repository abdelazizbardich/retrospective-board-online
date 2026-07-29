import type { ParsedContent } from "./types";

const STOP_WORDS = new Set([
  "a", "an", "the", "and", "or", "but", "in", "on", "at", "to", "for", "of", "with",
  "by", "from", "as", "is", "was", "are", "were", "be", "been", "being", "have", "has",
  "had", "do", "does", "did", "will", "would", "could", "should", "may", "might",
  "this", "that", "these", "those", "it", "its", "your", "our", "their", "my",
]);

const POWER_WORDS = [
  "best", "ultimate", "complete", "essential", "proven", "simple", "easy", "free",
  "guide", "how", "top", "effective", "powerful", "quick", "expert", "practical",
];

const TRANSITION_WORDS = [
  "however", "therefore", "furthermore", "moreover", "additionally", "consequently",
  "meanwhile", "nevertheless", "similarly", "for example", "in addition", "as a result",
  "on the other hand", "in contrast", "first", "second", "finally", "also", "because",
];

export function stripHtml(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

export function countWords(text: string): number {
  const cleaned = text.trim();
  if (!cleaned) return 0;
  return cleaned.split(/\s+/).filter(Boolean).length;
}

export function normalizeKeyword(keyword: string): string {
  return keyword.trim().toLowerCase();
}

export function keywordInText(keyword: string, text: string): boolean {
  const k = normalizeKeyword(keyword);
  if (!k) return false;
  return normalizeKeyword(text).includes(k);
}

export function countKeywordOccurrences(keyword: string, text: string): number {
  const k = normalizeKeyword(keyword);
  if (!k) return 0;
  const escaped = k.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const regex = new RegExp(`\\b${escaped}\\b`, "gi");
  return (text.match(regex) ?? []).length;
}

export function keywordDensity(keyword: string, text: string): number {
  const words = countWords(text);
  if (words === 0) return 0;
  return (countKeywordOccurrences(keyword, text) / words) * 100;
}

export function isKeywordStuffed(keyword: string, text: string): boolean {
  const density = keywordDensity(keyword, text);
  const count = countKeywordOccurrences(keyword, text);
  return density > 3 || count > 15;
}

export function keywordNearBeginning(keyword: string, text: string, withinChars = 30): boolean {
  const k = normalizeKeyword(keyword);
  if (!k) return false;
  const normalized = normalizeKeyword(text);
  const idx = normalized.indexOf(k);
  return idx >= 0 && idx <= withinChars;
}

export function parseHtmlContent(html: string): ParsedContent {
  const plainText = stripHtml(html);
  const wordCount = countWords(plainText);

  const headings: { level: number; text: string }[] = [];
  const headingRegex = /<h([1-6])[^>]*>([\s\S]*?)<\/h\1>/gi;
  let match: RegExpExecArray | null;
  while ((match = headingRegex.exec(html)) !== null) {
    headings.push({ level: parseInt(match[1], 10), text: stripHtml(match[2]) });
  }

  const paragraphs: string[] = [];
  const pRegex = /<p[^>]*>([\s\S]*?)<\/p>/gi;
  while ((match = pRegex.exec(html)) !== null) {
    const text = stripHtml(match[1]);
    if (text) paragraphs.push(text);
  }

  const images: { src: string; alt: string }[] = [];
  const imgRegex = /<img[^>]*>/gi;
  while ((match = imgRegex.exec(html)) !== null) {
    const tag = match[0];
    const src = tag.match(/src=["']([^"']+)["']/i)?.[1] ?? "";
    const alt = tag.match(/alt=["']([^"']*)["']/i)?.[1] ?? "";
    images.push({ src, alt });
  }

  const internalLinks: { href: string; text: string }[] = [];
  const externalLinks: { href: string; text: string }[] = [];
  const linkRegex = /<a[^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi;
  while ((match = linkRegex.exec(html)) !== null) {
    const href = match[1];
    const text = stripHtml(match[2]);
    if (href.startsWith("/") || href.includes("sprintsplans.com")) {
      internalLinks.push({ href, text });
    } else if (href.startsWith("http")) {
      externalLinks.push({ href, text });
    }
  }

  const lowerHtml = html.toLowerCase();
  const hasFaq =
    lowerHtml.includes("faq") ||
    headings.some((h) => /faq|frequently asked/i.test(h.text));

  return {
    plainText,
    wordCount,
    headings,
    paragraphs,
    images,
    internalLinks,
    externalLinks,
    hasBulletList: /<ul[\s>]/i.test(html),
    hasNumberedList: /<ol[\s>]/i.test(html),
    hasTable: /<table[\s>]/i.test(html),
    hasFaq,
  };
}

export function getIntroduction(parsed: ParsedContent): string {
  if (parsed.paragraphs.length > 0) return parsed.paragraphs[0];
  const words = parsed.plainText.split(/\s+/);
  return words.slice(0, 80).join(" ");
}

export function getConclusion(parsed: ParsedContent): string {
  if (parsed.paragraphs.length > 1) {
    return parsed.paragraphs[parsed.paragraphs.length - 1];
  }
  const words = parsed.plainText.split(/\s+/);
  return words.slice(-80).join(" ");
}

export function getFirstPercentText(parsed: ParsedContent, percent = 10): string {
  const words = parsed.plainText.split(/\s+/);
  const count = Math.max(1, Math.ceil(words.length * (percent / 100)));
  return words.slice(0, count).join(" ");
}

export function estimateReadingTime(wordCount: number): number {
  return Math.max(1, Math.ceil(wordCount / 200));
}

export function hasPowerWords(text: string): boolean {
  const lower = text.toLowerCase();
  return POWER_WORDS.some((w) => lower.includes(w));
}

export function hasNumbers(text: string): boolean {
  return /\d/.test(text);
}

export function slugHasStopWords(slug: string): boolean {
  return slug.split("-").some((w) => STOP_WORDS.has(w));
}

export function slugHasDuplicateWords(slug: string): boolean {
  const words = slug.split("-").filter(Boolean);
  return new Set(words).size !== words.length;
}

export function averageSentenceLength(text: string): number {
  const sentences = text.split(/[.!?]+/).filter((s) => s.trim().length > 0);
  if (sentences.length === 0) return 0;
  const totalWords = sentences.reduce((sum, s) => sum + countWords(s), 0);
  return totalWords / sentences.length;
}

export function countLongSentences(text: string, maxWords = 25): number {
  return text
    .split(/[.!?]+/)
    .filter((s) => countWords(s) > maxWords).length;
}

export function countPassiveVoice(text: string): number {
  const passivePatterns = [
    /\b(is|are|was|were|been|being)\s+\w+ed\b/gi,
    /\b(is|are|was|were|been|being)\s+\w+en\b/gi,
  ];
  let count = 0;
  for (const pattern of passivePatterns) {
    count += (text.match(pattern) ?? []).length;
  }
  return count;
}

export function countTransitionWords(text: string): number {
  const lower = text.toLowerCase();
  return TRANSITION_WORDS.filter((w) => lower.includes(w)).length;
}

export function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 2 && !STOP_WORDS.has(w));
}

export function jaccardSimilarity(a: string[], b: string[]): number {
  const setA = new Set(a);
  const setB = new Set(b);
  const intersection = [...setA].filter((x) => setB.has(x)).length;
  const union = new Set([...setA, ...setB]).size;
  return union === 0 ? 0 : intersection / union;
}

export function makeRecommendation(
  id: string,
  category: string,
  status: "passed" | "warning" | "failed",
  problem: string,
  whyItMatters: string,
  howToFix: string
) {
  return { id, category, status, problem, whyItMatters, howToFix };
}

export function clampScore(score: number, max: number): number {
  return Math.max(0, Math.min(max, Math.round(score)));
}

export function statusFromScore(ratio: number): "passed" | "warning" | "failed" {
  if (ratio >= 0.8) return "passed";
  if (ratio >= 0.5) return "warning";
  return "failed";
}
