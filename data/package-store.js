import { packages as sourcePackages } from "./packages.js";

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
