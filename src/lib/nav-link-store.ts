import { nanoid } from "nanoid";
import { getSupabase } from "./db";

export type NavLinkArea = "header" | "footer";

export interface NavLink {
  id: string;
  label: string;
  href: string;
  area: NavLinkArea;
  position: number; // sort order within area
  openInNewTab: boolean;
}

// ── Row → domain converter ─────────────────────────────────────────────────

type NavLinkRow = {
  id: string;
  label: string;
  href: string;
  area: NavLinkArea;
  position: number;
  open_in_new_tab: boolean;
};

function rowToLink(row: NavLinkRow): NavLink {
  return {
    id: row.id,
    label: row.label,
    href: row.href,
    area: row.area,
    position: row.position,
    openInNewTab: row.open_in_new_tab,
  };
}

// ── CRUD ───────────────────────────────────────────────────────────────────

export async function getNavLinks(area?: NavLinkArea): Promise<NavLink[]> {
  let query = getSupabase()
    .from("nav_links")
    .select("*")
    .order("position", { ascending: true });

  if (area) {
    query = query.eq("area", area);
  }

  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return (data ?? []).map(rowToLink);
}

export async function createNavLink(
  data: Omit<NavLink, "id">
): Promise<NavLink> {
  const id = nanoid(8);

  const { error } = await getSupabase().from("nav_links").insert({
    id,
    label: data.label,
    href: data.href,
    area: data.area,
    position: data.position,
    open_in_new_tab: data.openInNewTab,
  });

  if (error) throw new Error(error.message);
  return { id, ...data };
}

export async function updateNavLink(
  id: string,
  patch: Partial<Omit<NavLink, "id">>
): Promise<NavLink | undefined> {
  const updates: Record<string, unknown> = {};

  if (patch.label !== undefined)       updates.label          = patch.label;
  if (patch.href !== undefined)        updates.href           = patch.href;
  if (patch.area !== undefined)        updates.area           = patch.area;
  if (patch.position !== undefined)    updates.position       = patch.position;
  if (patch.openInNewTab !== undefined) updates.open_in_new_tab = patch.openInNewTab;

  const { error } = await getSupabase().from("nav_links").update(updates).eq("id", id);
  if (error) throw new Error(error.message);

  const { data } = await getSupabase().from("nav_links").select("*").eq("id", id).single();
  return data ? rowToLink(data) : undefined;
}

export async function deleteNavLink(id: string): Promise<boolean> {
  const { error, count } = await getSupabase()
    .from("nav_links")
    .delete({ count: "exact" })
    .eq("id", id);

  if (error) throw new Error(error.message);
  return (count ?? 0) > 0;
}

/** Reorder: accepts an array of { id, position } pairs */
export async function reorderNavLinks(
  updates: { id: string; position: number }[]
): Promise<void> {
  await Promise.all(
    updates.map(({ id, position }) =>
      getSupabase().from("nav_links").update({ position }).eq("id", id)
    )
  );
}
