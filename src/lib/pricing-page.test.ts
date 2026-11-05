import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { pricingPage, pricingPageWordCount } from "./pricing-page";

const TITLE_MAX = 60 - " | SprintsPlans".length;
const META_MIN = 70;
const META_MAX = 160;

describe("pricing page copy", () => {
  it("keeps SEO title and meta description within SERP limits", () => {
    assert.ok(
      pricingPage.seoTitle.length <= TITLE_MAX,
      `"${pricingPage.seoTitle}" is ${pricingPage.seoTitle.length} chars (max ${TITLE_MAX})`
    );
    assert.ok(
      pricingPage.metaDescription.length >= META_MIN,
      `meta is ${pricingPage.metaDescription.length} chars (min ${META_MIN})`
    );
    assert.ok(
      pricingPage.metaDescription.length <= META_MAX,
      `meta is ${pricingPage.metaDescription.length} chars (max ${META_MAX})`
    );
  });

  it("targets free-board and pricing queries without inventing paid plans", () => {
    const haystack = [
      pricingPage.seoTitle,
      pricingPage.metaDescription,
      pricingPage.h1,
      pricingPage.intro,
      ...pricingPage.faqs.map((faq) => `${faq.question} ${faq.answer}`),
    ]
      .join(" ")
      .toLowerCase();

    assert.match(haystack, /free retrospective board/);
    assert.match(haystack, /retrospective board pricing/);
    assert.doesNotMatch(haystack, /\b\$\d+/);
    assert.doesNotMatch(haystack, /\bpro plan\b/);
    assert.ok(pricingPage.notIncluded.some((item) => /no checkout/i.test(item)));
  });

  it("includes 4 FAQs, honest limits, and 600+ words of unique copy", () => {
    assert.equal(pricingPage.faqs.length, 4);
    assert.ok(pricingPage.included.length >= 5);
    assert.ok(pricingPage.limits.length >= 3);
    assert.ok(pricingPage.notIncluded.length >= 4);
    const words = pricingPageWordCount();
    assert.ok(words >= 600, `pricing page has ${words} words`);
  });
});
