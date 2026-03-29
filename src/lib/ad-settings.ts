import { supabase } from "./supabase";

export interface AdSettings {
  adsEnabled: boolean;
  adClientId: string;
  slotIdLeft: string;
  slotIdRight: string;
}

export async function getAdSettings(): Promise<AdSettings> {
  const { data, error } = await supabase
    .from("ad_settings").select("*").eq("id", 1).single();
  if (error) throw error;
  return {
    adsEnabled:   data.ads_enabled,
    adClientId:   data.ad_client_id,
    slotIdLeft:   data.slot_id_left,
    slotIdRight:  data.slot_id_right,
  };
}

export async function updateAdSettings(patch: Partial<AdSettings>): Promise<AdSettings> {
  const dbPatch: Record<string, unknown> = {};
  if (patch.adsEnabled  !== undefined) dbPatch.ads_enabled   = patch.adsEnabled;
  if (patch.adClientId  !== undefined) dbPatch.ad_client_id  = patch.adClientId;
  if (patch.slotIdLeft  !== undefined) dbPatch.slot_id_left  = patch.slotIdLeft;
  if (patch.slotIdRight !== undefined) dbPatch.slot_id_right = patch.slotIdRight;

  const { data, error } = await supabase
    .from("ad_settings").update(dbPatch).eq("id", 1).select().single();
  if (error) throw error;
  return {
    adsEnabled:   data.ads_enabled,
    adClientId:   data.ad_client_id,
    slotIdLeft:   data.slot_id_left,
    slotIdRight:  data.slot_id_right,
  };
}
