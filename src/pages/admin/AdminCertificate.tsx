import { useState } from "react";

const emptyForm = {
  item_name: "",
  description: "",
  materials: "",
  weight: "",
  hallmark_number: "",
  valuation_amount: "",
  customer_name: "",
  date: new Date().toISOString().split("T")[0],
};

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export default function AdminCertificate() {
  const [form, setForm] = useState(emptyForm);

  function update(field: string, value: string) {
    setForm({ ...form, [field]: value });
  }

  function formatDate(dateStr: string): string {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  }

  function handleGeneratePDF() {
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Certificate of Authenticity - ${escapeHtml(form.item_name)}</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=Inter:wght@300;400;500&display=swap');

          * { margin: 0; padding: 0; box-sizing: border-box; }

          @page {
            size: A4;
            margin: 0;
          }

          body {
            font-family: 'Inter', sans-serif;
            color: #1a1a2e;
            background: white;
          }

          .certificate {
            width: 210mm;
            min-height: 297mm;
            margin: 0 auto;
            padding: 40mm 30mm;
            position: relative;
          }

          .border-frame {
            position: absolute;
            top: 15mm;
            left: 15mm;
            right: 15mm;
            bottom: 15mm;
            border: 2px solid #c9a84c;
          }

          .border-frame-inner {
            position: absolute;
            top: 18mm;
            left: 18mm;
            right: 18mm;
            bottom: 18mm;
            border: 0.5px solid #c9a84c50;
          }

          .header {
            text-align: center;
            margin-bottom: 30px;
          }

          .header h1 {
            font-family: 'Playfair Display', serif;
            font-size: 14px;
            letter-spacing: 6px;
            text-transform: uppercase;
            color: #c9a84c;
            margin-bottom: 20px;
          }

          .header h2 {
            font-family: 'Playfair Display', serif;
            font-size: 28px;
            color: #1a1a2e;
            margin-bottom: 8px;
          }

          .header .divider {
            width: 80px;
            height: 1px;
            background: #c9a84c;
            margin: 20px auto;
          }

          .certify-text {
            text-align: center;
            font-size: 12px;
            color: #666;
            font-weight: 300;
            margin-bottom: 30px;
            line-height: 1.8;
          }

          .details {
            max-width: 400px;
            margin: 0 auto 40px;
          }

          .detail-row {
            display: flex;
            justify-content: space-between;
            padding: 10px 0;
            border-bottom: 1px solid #eee;
            font-size: 12px;
          }

          .detail-label {
            color: #999;
            font-weight: 300;
            text-transform: uppercase;
            letter-spacing: 1px;
            font-size: 10px;
          }

          .detail-value {
            color: #1a1a2e;
            font-weight: 500;
            text-align: right;
          }

          .description-section {
            max-width: 400px;
            margin: 0 auto 40px;
            text-align: center;
          }

          .description-section h3 {
            font-family: 'Playfair Display', serif;
            font-size: 12px;
            color: #c9a84c;
            text-transform: uppercase;
            letter-spacing: 3px;
            margin-bottom: 10px;
          }

          .description-section p {
            font-size: 11px;
            color: #666;
            line-height: 1.8;
            font-weight: 300;
          }

          .footer {
            position: absolute;
            bottom: 45mm;
            left: 30mm;
            right: 30mm;
          }

          .signature-area {
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
            margin-bottom: 30px;
          }

          .signature-line {
            width: 180px;
            text-align: center;
          }

          .signature-line .line {
            border-top: 1px solid #1a1a2e;
            margin-bottom: 5px;
          }

          .signature-line p {
            font-size: 10px;
            color: #999;
            text-transform: uppercase;
            letter-spacing: 1px;
          }

          .footer-brand {
            text-align: center;
            padding-top: 20px;
            border-top: 1px solid #eee;
          }

          .footer-brand p {
            font-size: 9px;
            color: #bbb;
            letter-spacing: 2px;
            text-transform: uppercase;
          }

          @media print {
            body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          }
        </style>
      </head>
      <body>
        <div class="certificate">
          <div class="border-frame"></div>
          <div class="border-frame-inner"></div>

          <div class="header">
            <h1>The Jewellery Studio</h1>
            <h2>Certificate of Authenticity</h2>
            <div class="divider"></div>
          </div>

          <p class="certify-text">
            This is to certify that the following item is an authentic piece<br>
            verified by The Jewellery Studio, Gibraltar.
          </p>

          <div class="details">
            <div class="detail-row">
              <span class="detail-label">Item</span>
              <span class="detail-value">${escapeHtml(form.item_name)}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Materials</span>
              <span class="detail-value">${escapeHtml(form.materials)}</span>
            </div>
            ${form.weight ? `
            <div class="detail-row">
              <span class="detail-label">Weight</span>
              <span class="detail-value">${escapeHtml(form.weight)}</span>
            </div>` : ""}
            ${form.hallmark_number ? `
            <div class="detail-row">
              <span class="detail-label">Hallmark No.</span>
              <span class="detail-value">${escapeHtml(form.hallmark_number)}</span>
            </div>` : ""}
            ${form.valuation_amount ? `
            <div class="detail-row">
              <span class="detail-label">Valuation</span>
              <span class="detail-value">${escapeHtml(form.valuation_amount)}</span>
            </div>` : ""}
            <div class="detail-row">
              <span class="detail-label">Issued To</span>
              <span class="detail-value">${escapeHtml(form.customer_name)}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Date</span>
              <span class="detail-value">${formatDate(form.date)}</span>
            </div>
          </div>

          ${form.description ? `
          <div class="description-section">
            <h3>Description</h3>
            <p>${escapeHtml(form.description)}</p>
          </div>` : ""}

          <div class="footer">
            <div class="signature-area">
              <div class="signature-line">
                <div class="line"></div>
                <p>Michael</p>
                <p style="font-size: 8px; margin-top: 2px;">The Jewellery Studio</p>
              </div>
              <div class="signature-line">
                <div class="line"></div>
                <p>Date</p>
              </div>
            </div>
            <div class="footer-brand">
              <p>The Jewellery Studio &bull; Gibraltar</p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `);

    printWindow.document.close();
    setTimeout(() => printWindow.print(), 500);
  }

  const fields = [
    { key: "item_name", label: "Item Name", placeholder: "e.g. 18ct Gold Diamond Ring", required: true },
    { key: "description", label: "Description", placeholder: "Brief description of the piece", textarea: true },
    { key: "materials", label: "Materials", placeholder: "e.g. 18ct Yellow Gold, 0.5ct Diamond", required: true },
    { key: "weight", label: "Weight", placeholder: "e.g. 4.2g" },
    { key: "hallmark_number", label: "Hallmark Number", placeholder: "e.g. GIB-2026-001" },
    { key: "valuation_amount", label: "Valuation Amount", placeholder: "e.g. £2,500" },
    { key: "customer_name", label: "Customer Name", placeholder: "Full name", required: true },
    { key: "date", label: "Date", type: "date", required: true },
  ];

  const canGenerate = form.item_name && form.materials && form.customer_name && form.date;

  return (
    <div>
      <h1 className="font-display text-2xl text-warm tracking-elegant mb-2">
        Certificate of Authenticity
      </h1>
      <p className="text-muted text-sm font-body mb-8">
        Generate a branded PDF certificate for jewellery items.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Form */}
        <div className="space-y-4">
          {fields.map((f) => (
            <div key={f.key}>
              <label className="block text-muted text-xs font-body mb-1">
                {f.label}
                {f.required && <span className="text-gold ml-1">*</span>}
              </label>
              {f.textarea ? (
                <textarea
                  value={form[f.key as keyof typeof form]}
                  onChange={(e) => update(f.key, e.target.value)}
                  rows={3}
                  className="w-full bg-navy border border-gold/10 text-warm text-sm font-body rounded-sm px-3 py-2 focus:border-gold/30 focus:outline-none resize-y"
                  placeholder={f.placeholder}
                />
              ) : (
                <input
                  type={f.type || "text"}
                  value={form[f.key as keyof typeof form]}
                  onChange={(e) => update(f.key, e.target.value)}
                  className="w-full bg-navy border border-gold/10 text-warm text-sm font-body rounded-sm px-3 py-2 focus:border-gold/30 focus:outline-none"
                  placeholder={f.placeholder}
                />
              )}
            </div>
          ))}

          <button
            onClick={handleGeneratePDF}
            disabled={!canGenerate}
            className="bg-gold text-navy text-sm font-body font-semibold px-6 py-2.5 rounded-sm hover:bg-gold/90 transition-colors disabled:opacity-50 mt-2"
          >
            Generate PDF
          </button>
        </div>

        {/* Preview */}
        <div className="bg-white rounded-sm p-8 text-center">
          <div className="border-2 border-[#c9a84c] p-8 min-h-[400px] flex flex-col">
            <p
              className="text-xs tracking-[4px] uppercase mb-3"
              style={{ color: "#c9a84c", fontFamily: "serif" }}
            >
              The Jewellery Studio
            </p>
            <h2
              className="text-xl mb-4"
              style={{ color: "#1a1a2e", fontFamily: "serif" }}
            >
              Certificate of Authenticity
            </h2>
            <div className="w-16 h-px mx-auto mb-6" style={{ background: "#c9a84c" }} />

            <p className="text-xs mb-6" style={{ color: "#666" }}>
              This is to certify that the following item is an authentic piece
              verified by The Jewellery Studio, Gibraltar.
            </p>

            <div className="text-left max-w-xs mx-auto flex-1 space-y-2">
              {form.item_name && (
                <div className="flex justify-between text-xs border-b border-gray-200 pb-2">
                  <span style={{ color: "#999" }}>Item</span>
                  <span style={{ color: "#1a1a2e" }}>{form.item_name}</span>
                </div>
              )}
              {form.materials && (
                <div className="flex justify-between text-xs border-b border-gray-200 pb-2">
                  <span style={{ color: "#999" }}>Materials</span>
                  <span style={{ color: "#1a1a2e" }}>{form.materials}</span>
                </div>
              )}
              {form.weight && (
                <div className="flex justify-between text-xs border-b border-gray-200 pb-2">
                  <span style={{ color: "#999" }}>Weight</span>
                  <span style={{ color: "#1a1a2e" }}>{form.weight}</span>
                </div>
              )}
              {form.hallmark_number && (
                <div className="flex justify-between text-xs border-b border-gray-200 pb-2">
                  <span style={{ color: "#999" }}>Hallmark</span>
                  <span style={{ color: "#1a1a2e" }}>{form.hallmark_number}</span>
                </div>
              )}
              {form.valuation_amount && (
                <div className="flex justify-between text-xs border-b border-gray-200 pb-2">
                  <span style={{ color: "#999" }}>Valuation</span>
                  <span style={{ color: "#1a1a2e" }}>{form.valuation_amount}</span>
                </div>
              )}
              {form.customer_name && (
                <div className="flex justify-between text-xs border-b border-gray-200 pb-2">
                  <span style={{ color: "#999" }}>Issued To</span>
                  <span style={{ color: "#1a1a2e" }}>{form.customer_name}</span>
                </div>
              )}
              {form.date && (
                <div className="flex justify-between text-xs border-b border-gray-200 pb-2">
                  <span style={{ color: "#999" }}>Date</span>
                  <span style={{ color: "#1a1a2e" }}>{formatDate(form.date)}</span>
                </div>
              )}
            </div>

            <div className="mt-8 pt-4 border-t border-gray-200">
              <div className="flex justify-between px-4">
                <div className="text-center">
                  <div className="w-32 border-t border-gray-400 mb-1" />
                  <p className="text-[9px] uppercase tracking-widest" style={{ color: "#999" }}>
                    Michael
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-32 border-t border-gray-400 mb-1" />
                  <p className="text-[9px] uppercase tracking-widest" style={{ color: "#999" }}>
                    Date
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
