export interface LanguageOption {
  label: string;
  value: string;
}

export const OUTPUT_LANGUAGES: LanguageOption[] = [
  { label: "English", value: "English" },
  { label: "中文", value: "Chinese" },
  { label: "日本語", value: "Japanese" },
  { label: "Bahasa Indonesia", value: "Indonesian" },
  { label: "Deutsch", value: "German" },
  { label: "Français", value: "French" },
  { label: "한국어", value: "Korean" },
  { label: "Español", value: "Spanish" },
];

export const DEFAULT_OUTPUT_LANGUAGE = "English";

export const PLATFORMS: LanguageOption[] = [
  { label: "Amazon", value: "Amazon" },
  { label: "eBay", value: "eBay" },
  { label: "Walmart", value: "Walmart" },
  { label: "Shopee", value: "Shopee" },
  { label: "Lazada", value: "Lazada" },
  { label: "AliExpress", value: "AliExpress" },
  { label: "MercadoLibre", value: "MercadoLibre" },
  { label: "Etsy", value: "Etsy" },
  { label: "TikTok Shop", value: "TikTok Shop" },
];
