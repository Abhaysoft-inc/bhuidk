"use client";

import React from "react";
import { AshokaEmblem, MeghRajLogo, DigitalIndiaLogo, NICBadge } from "./gov-icons";
import { Shield, ExternalLink, Mail, Phone, MapPin, CheckCircle } from "lucide-react";

interface GovFooterProps {
  language: "en" | "hi";
}

export function GovFooter({ language }: GovFooterProps) {
  return (
    <footer className="w-full bg-[#071e3d] text-slate-300 text-xs border-t-4 border-amber-500">
      {/* Tricolor line */}
      <div className="h-1 w-full tiranga-border" />

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Col 1: Ministry Info */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <AshokaEmblem className="h-12 w-auto text-white" />
              <div>
                <div className="font-extrabold text-white text-sm leading-tight">
                  {language === "hi" ? "भूमि संसाधन विभाग" : "Department of Land Resources"}
                </div>
                <div className="text-[11px] text-slate-400">
                  {language === "hi" ? "ग्रामीण विकास मंत्रालय, भारत सरकार" : "Ministry of Rural Development, Govt of India"}
                </div>
              </div>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              {language === "hi"
                ? "नीति, निगरानी एवं मूल्यांकन (PME) प्रभाग के तत्वावधान में संचालित राष्ट्रीय डिजिटल अनुसंधान एवं नीति नवाचार मंच।"
                : "National Digital Platform for Research, Policy Innovation & Evidence-Based Land Governance under the Policy, Monitoring & Evaluation (PME) Division."}
            </p>
            <div className="pt-2 text-[11px] text-slate-400 space-y-1">
              <div className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>Nirman Bhawan, New Delhi - 110011</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>support-landgov@nic.in</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>Toll-Free Helpline: 1800-11-7890</span>
              </div>
            </div>
          </div>

          {/* Col 2: Related National Portals */}
          <div>
            <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-3 pb-1 border-b border-slate-700">
              {language === "hi" ? "संबंधित राष्ट्रीय पोर्टल" : "Related National Portals"}
            </h4>
            <ul className="space-y-2 text-[11px]">
              <li>
                <a
                  href="https://dolr.gov.in"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-amber-400 flex items-center justify-between"
                >
                  <span>Department of Land Resources (DoLR)</span>
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              </li>
              <li>
                <a
                  href="https://bhuvan.nrsc.gov.in"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-amber-400 flex items-center justify-between"
                >
                  <span>Bhuvan Geo-Portal (ISRO)</span>
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              </li>
              <li>
                <a
                  href="https://svamitva.nic.in"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-amber-400 flex items-center justify-between"
                >
                  <span>SVAMITVA Scheme Portal (MoPR)</span>
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              </li>
              <li>
                <a
                  href="https://surveyofindia.gov.in"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-amber-400 flex items-center justify-between"
                >
                  <span>Survey of India (SOI)</span>
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              </li>
              <li>
                <a
                  href="https://data.gov.in"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-amber-400 flex items-center justify-between"
                >
                  <span>Open Government Data (OGD) India</span>
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Portal Policies (GIGW Compliance) */}
          <div>
            <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-3 pb-1 border-b border-slate-700">
              {language === "hi" ? "वेबसाइट नीतियां" : "Website Policies & Compliance"}
            </h4>
            <ul className="space-y-2 text-[11px]">
              <li>
                <a href="#policies" className="hover:text-amber-400">
                  {language === "hi" ? "वेबसाइट नीतियां (Website Policies)" : "Website Policies & Terms"}
                </a>
              </li>
              <li>
                <a href="#hyperlink" className="hover:text-amber-400">
                  {language === "hi" ? "हाइपरलिंक नीति (Hyperlink Policy)" : "Hyperlinking Policy"}
                </a>
              </li>
              <li>
                <a href="#copyright" className="hover:text-amber-400">
                  {language === "hi" ? "कॉपीराइट नीति (Copyright Policy)" : "Copyright Policy"}
                </a>
              </li>
              <li>
                <a href="#privacy" className="hover:text-amber-400">
                  {language === "hi" ? "गोपनीयता नीति (Privacy Policy)" : "Privacy & Data Policy"}
                </a>
              </li>
              <li>
                <a href="#accessibility" className="hover:text-amber-400">
                  {language === "hi" ? "अभिगम्यता विवरण (Accessibility Statement)" : "Accessibility Statement (GIGW 3.0)"}
                </a>
              </li>
              <li>
                <a href="#help" className="hover:text-amber-400">
                  {language === "hi" ? "सहायता एवं अक्सर पूछे जाने वाले प्रश्न" : "Help & Grievance Redressal"}
                </a>
              </li>
            </ul>
          </div>

          {/* Col 4: Hosting, Security & Badges */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-3 pb-1 border-b border-slate-700">
              {language === "hi" ? "सुरक्षा एवं होस्टिंग" : "Infrastructure & Hosting"}
            </h4>
            <div className="flex flex-col gap-2">
              <MeghRajLogo className="bg-slate-800/80 border-slate-700 text-white" />
              <NICBadge className="bg-slate-800/80 border-slate-700 text-white" />
            </div>
            <div className="pt-2 text-[10px] text-slate-400 space-y-1">
              <div className="flex items-center gap-1.5 text-emerald-400">
                <CheckCircle className="w-3.5 h-3.5" />
                <span>STQC Certified & Audited</span>
              </div>
              <div>GIGW 3.0 (Govt of India Guidelines for Websites)</div>
              <div>SSL 256-bit Encrypted Government Channel</div>
            </div>
          </div>
        </div>

        {/* Bottom Compliance & Visitor counter bar */}
        <div className="mt-8 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-400">
          <div>
            © 2026 Department of Land Resources (DoLR), Ministry of Rural Development. All Rights Reserved.
          </div>
          <div className="flex items-center gap-4">
            <span>Last Updated: <strong className="text-slate-200">14 Sept 2026</strong></span>
            <span className="hidden sm:inline">|</span>
            <span>
              Visitors: <strong className="text-amber-400 font-mono">1,482,904</strong>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
