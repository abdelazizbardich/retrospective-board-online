import { ImageResponse } from "next/og";
import { getBlogPost } from "@/lib/blog-store";

export const runtime = "edge";

function displayTitle(title: string): string {
  const trimmed = title.trim();
  if (trimmed.length <= 100) return trimmed;
  return `${trimmed.slice(0, 97)}…`;
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const { searchParams } = new URL(request.url);

  let title = searchParams.get("title")?.trim() ?? "";
  let category = searchParams.get("category")?.trim() ?? "";

  if (!title) {
    const post = await getBlogPost(slug);
    if (post) {
      title = post.title;
      category = post.category || category;
    }
  }

  if (!title) title = slug.replace(/-/g, " ");

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          height: "100%",
          background: "linear-gradient(135deg, #0f172a 0%, #1e40af 55%, #0ea5e9 100%)",
          padding: "56px 64px",
          justifyContent: "space-between",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {category ? (
            <div
              style={{
                fontSize: 22,
                fontWeight: 600,
                color: "#bae6fd",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
              }}
            >
              {category}
            </div>
          ) : null}
          <div
            style={{
              fontSize: title.length > 60 ? 44 : 52,
              fontWeight: 700,
              color: "#ffffff",
              lineHeight: 1.15,
              maxWidth: "100%",
            }}
          >
            {displayTitle(title)}
          </div>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderTop: "1px solid rgba(255,255,255,0.2)",
            paddingTop: 28,
          }}
        >
          <div style={{ fontSize: 24, fontWeight: 600, color: "#e2e8f0" }}>
            SprintsPlans Blog
          </div>
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: 12,
              background: "rgba(255,255,255,0.15)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 28,
            }}
          >
            ✦
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
