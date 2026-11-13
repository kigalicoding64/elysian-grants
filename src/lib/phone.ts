export type PhoneCountry = { iso: string; name: string; flag: string; dial: string; lengths: number[]; prefix?: RegExp; hint: string };

export const PHONE_COUNTRIES: PhoneCountry[] = [
  { iso: "RW", name: "Rwanda", flag: "🇷🇼", dial: "250", lengths: [9], prefix: /^7[2389]/, hint: "9 digits starting with 72, 73, 78 or 79" },
  { iso: "KE", name: "Kenya", flag: "🇰🇪", dial: "254", lengths: [9], prefix: /^[17]/, hint: "9 digits starting with 7 or 1" },
  { iso: "UG", name: "Uganda", flag: "🇺🇬", dial: "256", lengths: [9], prefix: /^7/, hint: "9 digits starting with 7" },
  { iso: "TZ", name: "Tanzania", flag: "🇹🇿", dial: "255", lengths: [9], prefix: /^[67]/, hint: "9 digits starting with 6 or 7" },
  { iso: "BI", name: "Burundi", flag: "🇧🇮", dial: "257", lengths: [8], hint: "8 digits" },
  { iso: "CD", name: "DR Congo", flag: "🇨🇩", dial: "243", lengths: [9], hint: "9 digits" },
  { iso: "NG", name: "Nigeria", flag: "🇳🇬", dial: "234", lengths: [10], hint: "10 digits" },
  { iso: "GH", name: "Ghana", flag: "🇬🇭", dial: "233", lengths: [9], hint: "9 digits" },
  { iso: "ZA", name: "South Africa", flag: "🇿🇦", dial: "27", lengths: [9], hint: "9 digits" },
  { iso: "ET", name: "Ethiopia", flag: "🇪🇹", dial: "251", lengths: [9], hint: "9 digits" },
  { iso: "US", name: "United States / Canada", flag: "🇺🇸", dial: "1", lengths: [10], hint: "10 digits" },
  { iso: "GB", name: "United Kingdom", flag: "🇬🇧", dial: "44", lengths: [10], hint: "10 digits" },
  { iso: "FR", name: "France", flag: "🇫🇷", dial: "33", lengths: [9], hint: "9 digits" },
  { iso: "BE", name: "Belgium", flag: "🇧🇪", dial: "32", lengths: [8, 9], hint: "8 or 9 digits" },
  { iso: "DE", name: "Germany", flag: "🇩🇪", dial: "49", lengths: [10, 11], hint: "10 or 11 digits" },
  { iso: "CN", name: "China", flag: "🇨🇳", dial: "86", lengths: [11], hint: "11 digits" },
  { iso: "IN", name: "India", flag: "🇮🇳", dial: "91", lengths: [10], hint: "10 digits" },
  { iso: "TR", name: "Türkiye", flag: "🇹🇷", dial: "90", lengths: [10], hint: "10 digits" },
  { iso: "AE", name: "United Arab Emirates", flag: "🇦🇪", dial: "971", lengths: [9], hint: "9 digits" },
];

export function findCountry(iso: string) {
  return PHONE_COUNTRIES.find((c) => c.iso === iso) ?? PHONE_COUNTRIES[0]!;
}

/** Returns an error message, or null when the local number is valid for the country. */
export function validatePhone(iso: string, local: string): string | null {
  const c = findCountry(iso);
  let digits = local.replace(/\D/g, "");
  if (digits.startsWith(c.dial) && digits.length > Math.max(...c.lengths)) digits = digits.slice(c.dial.length);
  if (digits.startsWith("0")) digits = digits.slice(1);
  if (!c.lengths.includes(digits.length) || (c.prefix && !c.prefix.test(digits))) {
    return `${c.name} numbers must be ${c.hint} (after +${c.dial})`;
  }
  return null;
}

/** Full international number like +250788123456, or null if invalid. */
export function formatPhone(iso: string, local: string): string | null {
  if (validatePhone(iso, local)) return null;
  const c = findCountry(iso);
  let digits = local.replace(/\D/g, "");
  if (digits.startsWith(c.dial) && digits.length > Math.max(...c.lengths)) digits = digits.slice(c.dial.length);
  if (digits.startsWith("0")) digits = digits.slice(1);
  return `+${c.dial}${digits}`;
}
