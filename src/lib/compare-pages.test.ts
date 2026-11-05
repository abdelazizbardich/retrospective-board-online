import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  compareHub,
  compareLandingPath,
  comparePageWordCount,
  getAllComparePages,
  getComparePage,
} from "./compare-pages";
import { getTemplatePage } from "./template-pages";

const TITLE_MAX = 60 - " | SprintsPlans".length;
const META_MIN = 70;
const META_MAX = 160;
const EXPECTED_SLUGS = ["easyretro", "retrium", "teamretro", "parabol", "miro"];

describe("compare landing pages", () => {
  it("covers the planned competitor slugs", () => {
    const pages = getAllComparePages();
    assert.deepEqual(
      pages.map((page) => page.slug),
      EXPECTED_SLUGS
    );
    for (const slug of EXPECTED_SLUGS) {
      const page = getComparePage(slug);
      assert.ok(page, `missing comparison copy for ${slug}`);
      assert.equal(compareLandingPath(slug), `/compare/${slug}`);
    }
  });

  it("keeps SEO titles and meta descriptions within SERP limits", () => {
    const pages = [compareHub, ...getAllComparePages()];
    for (const page of pages) {
      assert.ok(
        page.seoTitle.length <= TITLE_MAX,
        `"${page.seoTitle}" is ${page.seoTitle.length} chars (max ${TITLE_MAX})`
      );
      assert.ok(
        page.metaDescription.length >= META_MIN,
        `"${page.seoTitle}" meta is ${page.metaDescription.length} chars (min ${META_MIN})`
      );
      assert.ok(
        page.metaDescription.length <= META_MAX,
        `"${page.seoTitle}" meta is ${page.metaDescription.length} chars (max ${META_MAX})`
      );
    }
  });

  it("includes 2–4 FAQs, related links, and 600+ words of unique copy", () => {
    for (const page of getAllComparePages()) {
      assert.ok(page.faqs.length >= 2 && page.faqs.length <= 4, `${page.slug} FAQ count`);
      const words = comparePageWordCount(page);
      assert.ok(words >= 600, `${page.slug} has ${words} words`);
      assert.ok(page.rows.length >= 6, `${page.slug} comparison rows`);
      assert.ok(page.ctaHref.startsWith("/create"), `${page.slug} CTA should deep-link to create`);
      for (const related of page.relatedSlugs) {
        assert.ok(getComparePage(related), `${page.slug} related slug ${related} is missing`);
        assert.notEqual(related, page.slug);
      }
      for (const template of page.relatedTemplates) {
        assert.ok(getTemplatePage(template), `${page.slug} related template ${template} is missing`);
      }
    }
  });

  it("keeps hub FAQs in the same 2–4 range", () => {
    assert.ok(compareHub.faqs.length >= 2 && compareHub.faqs.length <= 4);
  });
});
