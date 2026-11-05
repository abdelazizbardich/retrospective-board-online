import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { BOARD_TEMPLATES } from "./types";
import {
  getAllTemplatePages,
  getTemplatePage,
  templateCreatePath,
  templateLandingPath,
  templatePageWordCount,
} from "./template-pages";
import { templateHub } from "./template-pages/hub";

const TITLE_MAX = 60 - " | SprintsPlans".length;
const META_MIN = 70;
const META_MAX = 160;

describe("template landing pages", () => {
  it("covers every board template slug", () => {
    for (const template of BOARD_TEMPLATES) {
      const page = getTemplatePage(template.id);
      assert.ok(page, `missing landing copy for ${template.id}`);
      assert.equal(page?.slug, template.id);
      assert.equal(templateLandingPath(template.id), `/templates/${template.id}`);
      assert.equal(templateCreatePath(template.id), `/create?template=${template.id}`);
    }
    assert.equal(getAllTemplatePages().length, BOARD_TEMPLATES.length);
  });

  it("keeps SEO titles and meta descriptions within SERP limits", () => {
    const pages = [templateHub, ...getAllTemplatePages()];
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

  it("includes 2–4 FAQs and 600+ words of unique copy per template", () => {
    for (const page of getAllTemplatePages()) {
      assert.ok(page.faqs.length >= 2 && page.faqs.length <= 4, `${page.slug} FAQ count`);
      const words = templatePageWordCount(page);
      assert.ok(words >= 600, `${page.slug} has ${words} words`);
      assert.equal(page.columns.length, BOARD_TEMPLATES.find((t) => t.id === page.slug)?.columns.length);
      for (const related of page.relatedSlugs) {
        assert.ok(getTemplatePage(related), `${page.slug} related slug ${related} is missing`);
        assert.notEqual(related, page.slug);
      }
    }
  });

  it("matches board template column titles", () => {
    for (const template of BOARD_TEMPLATES) {
      const page = getTemplatePage(template.id)!;
      assert.deepEqual(
        page.columns.map((column) => column.title),
        template.columns.map((column) => column.title)
      );
    }
  });
});
