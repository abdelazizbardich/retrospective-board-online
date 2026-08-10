-- Run in Supabase SQL Editor to add cover image alt text on blog posts.

ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS cover_image_alt TEXT NOT NULL DEFAULT '';
