import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  canonicalRedirectUrl,
  isBlogSearchPath,
  shouldSkipCanonicalRedirect,
} from "./canonical-url";

describe("canonicalRedirectUrl", () => {
  it("redirects http apex to https apex and keeps path + query", () => {
    assert.equal(
      canonicalRedirectUrl({
        host: "sprintsplans.com",
        proto: "http",
        pathname: "/blog/retrospective-games",
        search: "?utm=1",
      }),
      "https://sprintsplans.com/blog/retrospective-games?utm=1"
    );
  });

  it("permanently canonicalizes www (any proto) onto https apex", () => {
    assert.equal(
      canonicalRedirectUrl({
        host: "www.sprintsplans.com",
        proto: "https",
        pathname: "/templates/starfish",
        search: "",
      }),
      "https://sprintsplans.com/templates/starfish"
    );
    assert.equal(
      canonicalRedirectUrl({
        host: "www.sprintsplans.com:443",
        proto: "http",
        pathname: "/",
        search: "",
      }),
      "https://sprintsplans.com/"
    );
  });

  it("does not redirect an already-canonical https request", () => {
    assert.equal(
      canonicalRedirectUrl({
        host: "sprintsplans.com",
        proto: "https",
        pathname: "/blog",
        search: "?page=2",
      }),
      null
    );
  });

  it("skips localhost and Vercel preview hosts", () => {
    assert.equal(shouldSkipCanonicalRedirect("localhost:3000"), true);
    assert.equal(shouldSkipCanonicalRedirect("retrospective-board-online-abc.vercel.app"), true);
    assert.equal(
      canonicalRedirectUrl({
        host: "retrospective-board-online-git-main.vercel.app",
        proto: "http",
        pathname: "/",
        search: "",
      }),
      null
    );
  });
});

describe("isBlogSearchPath", () => {
  it("matches /blog/search and nested paths only", () => {
    assert.equal(isBlogSearchPath("/blog/search"), true);
    assert.equal(isBlogSearchPath("/blog/search/"), true);
    assert.equal(isBlogSearchPath("/blog"), false);
    assert.equal(isBlogSearchPath("/blog/retrospective-games"), false);
  });
});
