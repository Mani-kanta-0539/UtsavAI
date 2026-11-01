'use client';

import React, { useState } from 'react';
import { ParsedVendorQuote } from '@/types/vendor';
import { Sparkles, AlertOctagon, CheckCircle2 } from 'lucide-react';

interface VendorComparatorProps {
  category: string;
  guestCount: number;
  sampleQuotes: { vendorName: string; rawText: string }[];
}

export const VendorComparator: React.FC<VendorComparatorProps> = ({
  category,
  guestCount,
  sampleQuotes,
}) => {
  const [quotesInput, setQuotesInput] = useState<string>(
    sampleQuotes
      .map((q) => `--- VENDOR: ${q.vendorName} ---\n${q.rawText}`)
      .join('\n\n')
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [comparisons, setComparisons] = useState<ParsedVendorQuote[]>([]);
  const [source, setSource] = useState<'gemini' | 'smart_fallback' | null>(null);

  const handleCompare = async () => {
    setIsLoading(true);
    try {
      const blocks = quotesInput.split(/--- VENDOR:\s*/i).filter((b) => b.trim().length > 0);
      const parsedPayload = blocks.map((b, idx) => {
        const lines = b.trim().split('\n');
        const firstLine = lines[0] || `Vendor ${idx + 1}`;
        const name = firstLine.replace(/---/g, '').trim();
        const text = lines.slice(1).join('\n').trim() || b.trim();
        return { id: `quote-${idx + 1}`, vendorName: name, rawText: text };
      });

      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'PARSE_VENDOR_QUOTES',
          category,
          guestCount,
          quotes: parsedPayload.length > 0 ? parsedPayload : sampleQuotes.map((s, i) => ({ id: `q-${i}`, vendorName: s.vendorName, rawText: s.rawText })),
        }),
      });

      const data = await res.json();
      if (data.success && data.comparisons) {
        setComparisons(data.comparisons);
        setSource(data.source);
      }
    } catch (err) {
      console.error('Failed to compare quotes:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoadSamples = () => {
    setQuotesInput(sampleQuotes.map((q) => `--- VENDOR: ${q.vendorName} ---\n${q.rawText}`).join('\n\n'));
  };

  return (
    <section aria-labelledby="vendor-compare-heading" className="glass-panel rounded-2xl border border-white/10 p-6 shadow-2xl text-white">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-white/10 gap-2">
        <div>
          <h2 id="vendor-compare-heading" className="text-base font-bold text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-400" />
            AI Vendor Quote Comparator & Red Flag Detector
          </h2>
          <p className="text-xs text-slate-400">
            Paste raw estimates to extract true per-plate rates, unmask hidden taxes (+18% GST), and compare side-by-side.
          </p>
        </div>

        <button
          onClick={handleLoadSamples}
          className="text-xs font-semibold text-amber-300 bg-amber-500/15 hover:bg-amber-500/25 px-3 py-1.5 rounded-xl border border-amber-500/30 transition-colors self-start sm:self-auto"
        >
          Load 3 Real-World Quotes
        </button>
      </div>

      <div className="mt-4">
        <label htmlFor="raw-quote-textarea" className="block text-xs font-semibold text-slate-300 mb-1">
          Raw Quotes Input (Separate with &quot;--- VENDOR: Name ---&quot;)
        </label>
        <textarea
          id="raw-quote-textarea"
          rows={5}
          value={quotesInput}
          onChange={(e) => setQuotesInput(e.target.value)}
          placeholder="Paste raw vendor messages or estimates here..."
          className="w-full p-3 text-xs font-mono bg-black/60 border border-white/15 rounded-xl focus:ring-2 focus:ring-amber-500 text-white placeholder-slate-500"
        />
        <div className="mt-2 flex justify-between items-center">
          <span className="text-[11px] text-slate-400">
            Simulating for current guest count: <span className="font-bold text-amber-300">{guestCount} Pax</span>
          </span>
          <button
            onClick={handleCompare}
            disabled={isLoading}
            className="px-5 py-2 rounded-full btn-glow-purple text-white text-xs font-bold shadow-xl flex items-center space-x-1.5 disabled:opacity-50 transition-all"
          >
            <Sparkles className="w-4 h-4" />
            <span>{isLoading ? 'Analyzing Quotes...' : 'Extract & Compare Quotes'}</span>
          </button>
        </div>
      </div>

      {comparisons.length > 0 && (
        <div className="mt-6 pt-5 border-t border-white/10">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Side-by-Side Analysis ({comparisons.length} Evaluated)
            </span>
            {source && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Source: {source === 'gemini' ? 'Gemini 2.5 Flash' : 'Smart Fallback Engine'}
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {comparisons.map((c) => (
              <div key={c.id} className="p-4 rounded-xl border border-white/10 bg-black/50 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-sm text-white truncate">{c.vendorName}</h3>
                    <span className="text-xs font-bold text-blue-300 bg-blue-500/20 px-2 py-0.5 rounded border border-blue-500/30">
                      Fit: {c.priorityFitScore}/100
                    </span>
                  </div>

                  <div className="mt-3 bg-white/[0.03] p-3 rounded-lg border border-white/10 space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-400">Base Cost:</span>
                      <span className="font-medium text-white">₹{c.baseCost.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-400">Taxes / Fees:</span>
                      <span className="font-medium text-amber-300">₹{c.taxesAndFees.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between text-xs pt-1 border-t border-white/10 font-bold">
                      <span className="text-white">True Grand Total:</span>
                      <span className="text-rose-400 font-extrabold">₹{c.grandTotal.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="text-[11px] text-right text-slate-400">
                      ~₹{c.perPersonEquivalent}/plate
                    </div>
                  </div>

                  {c.redFlags.length > 0 && (
                    <div className="mt-3 p-2 bg-rose-500/15 border border-rose-500/30 rounded-lg">
                      <div className="flex items-center text-[10px] font-extrabold text-rose-300 uppercase">
                        <AlertOctagon className="w-3 h-3 mr-1 text-rose-400" />
                        Hidden Charges / Red Flags
                      </div>
                      <ul className="list-disc list-inside text-[11px] text-rose-200 mt-1 space-y-0.5">
                        {c.redFlags.map((rf, i) => (
                          <li key={i}>{rf}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="mt-3 text-xs text-slate-300 bg-amber-500/10 p-2.5 rounded-lg border border-amber-500/20">
                    <span className="font-bold text-amber-300">Verdict: </span>
                    {c.verdict}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
};
