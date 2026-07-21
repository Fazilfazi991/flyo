import { packages as sourcePackages } from "./packages.js";
import { getSupabaseClient, isSupabaseConfigured } from "./supabase-config.js";

export const ADMIN_PACKAGE_STORAGE_KEY = "flyoAdminPackages";
export const ADMIN_SETTINGS_STORAGE_KEY = "flyoAdminSettings";

const clone = value => JSON.parse(JSON.stringify(value));

const readJson = (key, fallback) => {
  try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : fallback;
  } catch {
    return fallback;
  }
};

const writeJson = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
  window.dispatchEvent(new CustomEvent("flyo-admin-store-change", { detail: { key } }));
};

export const getSourcePackages = () => clone(sourcePackages);

export const getAdminPackages = () => {
  const savedPackages = readJson(ADMIN_PACKAGE_STORAGE_KEY, null);
  if (Array.isArray(savedPackages) && savedPackages.length) return savedPackages;
  return sourcePackages.map((item, index) => ({
    ...clone(item),
    adminStatus: item.adminStatus || "published",
    featured: Boolean(item.featured),
    displayOrder: item.displayOrder ?? index + 1,
    lastUpdated: item.lastUpdated || "Imported from live site"
  }));
};

export const saveAdminPackages = packages => {
  writeJson(ADMIN_PACKAGE_STORAGE_KEY, packages);
};

export const resetAdminPackages = () => {
  localStorage.removeItem(ADMIN_PACKAGE_STORAGE_KEY);
  window.dispatchEvent(new CustomEvent("flyo-admin-store-change", { detail: { key: ADMIN_PACKAGE_STORAGE_KEY } }));
};

export const getPublicPackages = () => getAdminPackages()
  .filter(item => (item.adminStatus || "published") === "published")
  .sort((a, b) => (Number(a.displayOrder) || 9999) - (Number(b.displayOrder) || 9999));

export const getAdminSettings = () => ({
  aedToInr: 26,
  aedToUsd: 1 / 3.67,
  uaeWhatsapp: "+971 50 535 7300",
  indiaWhatsapp: "+91 6361 25 4400",
  uaeOfficePhone: "04 396 4626",
  indiaOfficePhone: "+91 6361 25 4400",
  uaeEmail: "info.dubai@flyotour.com",
  indiaEmail: "info.india@flyotour.com",
  uaeLocation: "Deira, Dubai",
  indiaLocation: "Karnataka, India",
  seoTitle: "Flyo Tours & Travels",
  seoDescription: "Curated holidays, flights, visa support, and custom travel plans.",
  ...readJson(ADMIN_SETTINGS_STORAGE_KEY, {})
});

export const saveAdminSettings = settings => {
  writeJson(ADMIN_SETTINGS_STORAGE_KEY, { ...getAdminSettings(), ...settings });
};

const packageToRow = item => ({
  slug: item.slug,
  title: item.title,
  status: item.adminStatus || "published",
  featured: Boolean(item.featured),
  display_order: Number(item.displayOrder) || 9999,
  package_data: item,
  updated_at: new Date().toISOString()
});

const rowToPackage = row => ({
  ...(row.package_data || {}),
  slug: row.slug,
  title: row.title || row.package_data?.title || row.slug,
  adminStatus: row.status || row.package_data?.adminStatus || "published",
  featured: Boolean(row.featured),
  displayOrder: row.display_order ?? row.package_data?.displayOrder ?? 9999,
  lastUpdated: row.updated_at || row.package_data?.lastUpdated || ""
});

export const getSupabaseSession = async () => {
  const client = await getSupabaseClient();
  if (!client) return null;
  const { data } = await client.auth.getSession();
  return data.session;
};

export const signInAdmin = async (email, password) => {
  const client = await getSupabaseClient();
  if (!client) throw new Error("Supabase is not configured.");
  const { data, error } = await client.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data.session;
};

export const signOutAdmin = async () => {
  const client = await getSupabaseClient();
  if (client) await client.auth.signOut();
};

export const getAdminPackagesAsync = async () => {
  if (!isSupabaseConfigured()) return getAdminPackages();
  const client = await getSupabaseClient();
  const { data, error } = await client
    .from("flyo_packages")
    .select("*")
    .order("display_order", { ascending: true })
    .order("updated_at", { ascending: false });
  if (error) throw error;
  if (!data?.length) return getAdminPackages();
  const packages = data.map(rowToPackage);
  saveAdminPackages(packages);
  return packages;
};

export const getPublicPackagesAsync = async () => {
  try {
    return (await getAdminPackagesAsync())
      .filter(item => (item.adminStatus || "published") === "published")
      .sort((a, b) => (Number(a.displayOrder) || 9999) - (Number(b.displayOrder) || 9999));
  } catch {
    return getPublicPackages();
  }
};

export const saveAdminPackageAsync = async packageItem => {
  const packages = getAdminPackages();
  const index = packages.findIndex(item => item.slug === packageItem.slug);
  const nextPackages = index >= 0
    ? packages.map(item => item.slug === packageItem.slug ? packageItem : item)
    : [...packages, packageItem];
  saveAdminPackages(nextPackages);
  if (!isSupabaseConfigured()) return packageItem;
  const client = await getSupabaseClient();
  const { error } = await client.from("flyo_packages").upsert(packageToRow(packageItem), { onConflict: "slug" });
  if (error) throw error;
  return packageItem;
};

export const saveAdminPackagesAsync = async packages => {
  saveAdminPackages(packages);
  if (!isSupabaseConfigured()) return packages;
  const client = await getSupabaseClient();
  const { error } = await client.from("flyo_packages").upsert(packages.map(packageToRow), { onConflict: "slug" });
  if (error) throw error;
  return packages;
};

export const deleteAdminPackageAsync = async slug => {
  saveAdminPackages(getAdminPackages().filter(item => item.slug !== slug));
  if (!isSupabaseConfigured()) return;
  const client = await getSupabaseClient();
  const { error } = await client.from("flyo_packages").delete().eq("slug", slug);
  if (error) throw error;
};

export const seedSupabasePackagesIfEmpty = async () => {
  if (!isSupabaseConfigured()) return { seeded: false, reason: "Supabase not configured" };
  const client = await getSupabaseClient();
  const { count, error } = await client
    .from("flyo_packages")
    .select("slug", { count: "exact", head: true });
  if (error) throw error;
  if (count) return { seeded: false, count };
  const packages = getAdminPackages();
  const { error: seedError } = await client.from("flyo_packages").upsert(packages.map(packageToRow), { onConflict: "slug" });
  if (seedError) throw seedError;
  return { seeded: true, count: packages.length };
};

export const getAdminSettingsAsync = async () => {
  if (!isSupabaseConfigured()) return getAdminSettings();
  const client = await getSupabaseClient();
  const { data, error } = await client
    .from("flyo_settings")
    .select("settings")
    .eq("id", "site")
    .maybeSingle();
  if (error) throw error;
  const settings = { ...getAdminSettings(), ...(data?.settings || {}) };
  saveAdminSettings(settings);
  return settings;
};

export const saveAdminSettingsAsync = async settings => {
  const nextSettings = { ...getAdminSettings(), ...settings };
  saveAdminSettings(nextSettings);
  if (!isSupabaseConfigured()) return nextSettings;
  const client = await getSupabaseClient();
  const { error } = await client
    .from("flyo_settings")
    .upsert({ id: "site", settings: nextSettings, updated_at: new Date().toISOString() }, { onConflict: "id" });
  if (error) throw error;
  return nextSettings;
};
