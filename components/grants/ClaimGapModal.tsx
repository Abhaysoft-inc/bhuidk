"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, UploadCloud, CheckCircle2, ArrowRight, Loader2, Sparkles } from "lucide-react";

export function ClaimGapModal({ isOpen, onClose, gap }: { isOpen: boolean; onClose: () => void; gap: any }) {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 3) {
      setStep(step + 1);
    } else {
      setIsSubmitting(true);
      setTimeout(() => {
        setIsSubmitting(false);
        setStep(4);
      }, 1500);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50 shrink-0">
            <div>
              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Claim Research Gap</div>
              <h2 className="text-lg font-black text-slate-900 leading-tight">{gap?.id}</h2>
            </div>
            <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-full transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="p-6 overflow-y-auto">
            {/* Progress */}
            {step < 4 && (
              <div className="flex items-center gap-2 mb-8">
                {[1, 2, 3].map((s) => (
                  <div key={s} className="flex-1 flex flex-col items-center gap-2">
                    <div className={`w-full h-1.5 rounded-full transition-colors ${step >= s ? "bg-[#0b2b50]" : "bg-slate-200"}`} />
                    <span className={`text-[10px] font-bold ${step >= s ? "text-[#0b2b50]" : "text-slate-400"}`}>
                      {s === 1 ? "Methodology" : s === 2 ? "Budget" : "Review"}
                    </span>
                  </div>
                ))}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {step === 1 && (
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-slate-700 mb-1.5 block">Proposed Solution Title</label>
                    <input type="text" placeholder="e.g. Empirical study on easement rights post-canalization" required className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0b2b50]" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-700 mb-1.5 block">Methodology Overview</label>
                    <textarea rows={4} placeholder="Describe your approach, data sources, and intended outcomes..." required className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0b2b50] resize-none" />
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-slate-700 mb-1.5 block">Requested Funding (₹)</label>
                      <input type="number" placeholder="580000" required className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0b2b50]" />
                      <p className="text-[10px] text-slate-500 mt-1">Max allowed: {gap?.amount}</p>
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-700 mb-1.5 block">Duration (Months)</label>
                      <input type="number" placeholder="6" required className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0b2b50]" />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-700 mb-1.5 block">Upload Detailed Proposal (PDF)</label>
                    <div className="border-2 border-dashed border-slate-200 rounded-xl p-6 flex flex-col items-center justify-center bg-slate-50 text-slate-500 hover:bg-slate-100 hover:border-blue-300 transition-colors cursor-pointer">
                      <UploadCloud className="w-8 h-8 mb-2 text-slate-400" />
                      <span className="text-sm font-bold text-slate-700">Click to upload</span>
                      <span className="text-xs">or drag and drop</span>
                    </div>
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
                  <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl flex gap-3">
                    <Sparkles className="w-5 h-5 text-blue-600 shrink-0" />
                    <div>
                      <h4 className="text-sm font-bold text-blue-900 mb-1">AI Proposal Screen Complete</h4>
                      <p className="text-xs text-blue-700">Your proposal structure aligns 87% with the gap requirements. It has been pre-approved for committee review.</p>
                    </div>
                  </div>
                  <div className="p-4 border border-slate-200 rounded-xl bg-slate-50 text-sm">
                    <div className="font-bold text-slate-800 mb-2">Summary</div>
                    <ul className="space-y-2 text-slate-600">
                      <li><span className="font-semibold text-slate-700">Target Gap:</span> {gap?.id}</li>
                      <li><span className="font-semibold text-slate-700">Principal Investigator:</span> Dr. Ashok Sharma</li>
                      <li><span className="font-semibold text-slate-700">Institution:</span> IISc Bangalore</li>
                    </ul>
                  </div>
                </motion.div>
              )}

              {step === 4 && (
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center justify-center py-10 text-center">
                  <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-4">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-black text-slate-900 mb-2">Proposal Submitted!</h3>
                  <p className="text-sm text-slate-500 max-w-md">Your application <span className="font-bold text-slate-800">APP-902-X</span> has been routed to the DoLR Research Committee. You can track its status in your dashboard.</p>
                </motion.div>
              )}

              {/* Footer Actions */}
              {step < 4 && (
                <div className="flex items-center justify-between pt-6 border-t border-slate-100">
                  <button type="button" onClick={() => step > 1 ? setStep(step - 1) : onClose()} className="text-sm font-bold text-slate-500 hover:text-slate-800 transition-colors">
                    {step > 1 ? "Back" : "Cancel"}
                  </button>
                  <button type="submit" disabled={isSubmitting} className="bg-[#0b2b50] hover:bg-[#164275] disabled:bg-[#0b2b50]/70 text-white font-bold px-6 py-2.5 rounded-lg text-sm transition-colors flex items-center gap-2">
                    {isSubmitting ? (
                      <><Loader2 className="w-4 h-4 animate-spin" /> Submitting...</>
                    ) : (
                      <>{step === 3 ? "Submit Proposal" : "Continue"} <ArrowRight className="w-4 h-4" /></>
                    )}
                  </button>
                </div>
              )}
              {step === 4 && (
                <div className="pt-6 flex justify-center">
                  <button type="button" onClick={onClose} className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold px-6 py-2.5 rounded-lg text-sm transition-colors">
                    Close Window
                  </button>
                </div>
              )}
            </form>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
