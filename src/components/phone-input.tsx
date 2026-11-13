import { PHONE_COUNTRIES, findCountry, validatePhone } from "@/lib/phone";
import { Input } from "@/components/ui/input";

export function PhoneInput({ id, country, value, onCountryChange, onChange, showError }: {
  id?: string; country: string; value: string;
  onCountryChange: (iso: string) => void; onChange: (v: string) => void; showError?: boolean;
}) {
  const c = findCountry(country);
  const error = value ? validatePhone(country, value) : null;
  return (
    <div className="space-y-1">
      <div className="flex gap-2">
        <select
          aria-label="Country code"
          className="h-10 rounded-md border border-input bg-background px-2 text-sm"
          value={country}
          onChange={(e) => onCountryChange(e.target.value)}
        >
          {PHONE_COUNTRIES.map((p) => (
            <option key={p.iso} value={p.iso}>{p.flag} +{p.dial} {p.name}</option>
          ))}
        </select>
        <Input id={id} type="tel" inputMode="tel" maxLength={20} placeholder={c.iso === "RW" ? "788 123 456" : "Phone number"}
          value={value} onChange={(e) => onChange(e.target.value)} aria-invalid={!!error} className="flex-1" />
      </div>
      <p className={`text-xs ${error && (showError || value.replace(/\D/g, "").length >= Math.min(...c.lengths)) ? "text-destructive" : "text-muted-foreground"}`}>
        {error && (showError || value.replace(/\D/g, "").length >= Math.min(...c.lengths)) ? error : `Expected: ${c.hint}`}
      </p>
    </div>
  );
}
