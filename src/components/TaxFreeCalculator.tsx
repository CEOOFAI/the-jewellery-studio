import { useState } from "react";

const VAT_RATES: { country: string; rate: number }[] = [
  { country: "United Kingdom", rate: 20 },
  { country: "Spain", rate: 21 },
  { country: "France", rate: 20 },
  { country: "Germany", rate: 19 },
  { country: "Italy", rate: 22 },
  { country: "Netherlands", rate: 21 },
  { country: "EU Average", rate: 21 },
];

export default function TaxFreeCalculator() {
  const [price, setPrice] = useState<string>("");
  const [selectedCountry, setSelectedCountry] = useState(0);

  const vatRate = VAT_RATES[selectedCountry].rate;
  const numericPrice = parseFloat(price) || 0;
  const savings = numericPrice * (vatRate / (100 + vatRate));
  const gibraltarPrice = numericPrice - savings;

  return (
    <div className="bg-navy-card border border-gold/20 rounded-sm p-6 md:p-8 max-w-md mx-auto">
      {/* Price input */}
      <label className="block font-body text-[11px] uppercase tracking-luxe text-muted mb-2">
        Item Price (£)
      </label>
      <input
        type="number"
        min="0"
        step="0.01"
        placeholder="e.g. 1000"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        className="w-full bg-navy-card border border-gold/30 text-warm rounded-sm px-4 py-3 font-body text-base focus:border-gold focus:outline-none transition-colors mb-5"
      />

      {/* Country select */}
      <label className="block font-body text-[11px] uppercase tracking-luxe text-muted mb-2">
        Your Home Country
      </label>
      <select
        value={selectedCountry}
        onChange={(e) => setSelectedCountry(Number(e.target.value))}
        className="w-full bg-navy-card border border-gold/30 text-warm rounded-sm px-4 py-3 font-body text-base focus:border-gold focus:outline-none transition-colors mb-6 appearance-none cursor-pointer"
      >
        {VAT_RATES.map((entry, i) => (
          <option key={entry.country} value={i}>
            {entry.country} ({entry.rate}% VAT)
          </option>
        ))}
      </select>

      {/* Results */}
      {numericPrice > 0 && (
        <div className="border-t border-gold/20 pt-5 space-y-3">
          <div className="flex justify-between font-body text-sm text-muted">
            <span>Price with {vatRate}% VAT</span>
            <span className="text-warm">£{numericPrice.toFixed(2)}</span>
          </div>
          <div className="flex justify-between font-body text-sm text-muted">
            <span>Gibraltar price (tax-free)</span>
            <span className="text-warm">£{gibraltarPrice.toFixed(2)}</span>
          </div>
          <div className="pt-2 text-center">
            <p className="font-body text-[11px] uppercase tracking-luxe text-muted mb-1">
              You save
            </p>
            <p className="font-display text-3xl md:text-4xl text-gold">
              £{savings.toFixed(2)}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
