"use client";

import React, { useState, useMemo } from "react";
import {
  Database,
  Search,
  Download,
  FileText,
  Filter,
  ExternalLink,
  BookOpen,
  Share2,
  Calendar,
  Building,
  Check,
  Tag,
  Eye,
  X,
  FileSpreadsheet,
} from "lucide-react";

interface RepositorySectionProps {
  language: "en" | "hi";
  initialSearchQuery?: string;
  initialCategory?: string;
}

interface RepoItem {
  id: string;
  titleEn: string;
  titleHi: string;
  type: "Research Paper" | "Policy Document" | "Geospatial Dataset" | "Legal Framework" | "Case Study";
  domain: string;
  institution: string;
  state: string;
  year: number;
  author: string;
  downloads: number;
  citations: number;
  summaryEn: string;
  summaryHi: string;
  fileFormat: "PDF" | "GeoJSON" | "CSV" | "DOCX";
  fileSize: string;
  doiOrRef: string;
}

export function RepositorySection({
  language,
  initialSearchQuery = "",
  initialCategory = "all",
}: RepositorySectionProps) {
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery);
  const [selectedDomain, setSelectedDomain] = useState("all");
  const [selectedState, setSelectedState] = useState("all");
  const [selectedType, setSelectedType] = useState("all");
  const [activeItemModal, setActiveItemModal] = useState<RepoItem | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const sampleRepo: RepoItem[] = [
    {
      id: "DOC-2026-001",
      titleEn: "Socio-Economic Impact of Unique Land Parcel Identification Number (ULPIN / Bhu-Aadhaar) on Agricultural Credit Flow in India",
      titleHi: "भारत में कृषि ऋण प्रवाह पर विशिष्ट भूखंड पहचान संख्या (यूलपिन / भू-आधार) का सामाजिक-आर्थिक प्रभाव",
      type: "Research Paper",
      domain: "Bhu-Aadhaar & ULPIN",
      institution: "IIM Ahmedabad & PME Division DoLR",
      state: "All India",
      year: 2026,
      author: "Dr. K. S. Ramanujam, Prof. Arindam Sen",
      downloads: 3840,
      citations: 42,
      summaryEn: "Empirical study across 12 States demonstrating a 31% reduction in mortgage verification time and 22% increase in institutional credit access for small and marginal farmers following 14-digit Bhu-Aadhaar seeding.",
      summaryHi: "12 राज्यों में अनुभवजन्य अध्ययन से पता चलता है कि 14-अंकीय भू-आधार सीडिंग के बाद बंधक सत्यापन समय में 31% की कमी और छोटे व सीमांत किसानों के लिए संस्थागत ऋण पहुंच में 22% की वृद्धि हुई।",
      fileFormat: "PDF",
      fileSize: "4.8 MB",
      doiOrRef: "DoLR/PME/2026/RP-019",
    },
    {
      id: "DOC-2026-002",
      titleEn: "Standard Operating Procedures for Drone-Based Cadastral Resurvey in Inhabited Abadi Areas under SVAMITVA",
      titleHi: "स्वामित्व योजना अंतर्गत आबाद आबादी क्षेत्रों में ड्रोन आधारित कैडस्ट्रल पुनर्सर्वेक्षण हेतु मानक संचालन प्रक्रिया",
      type: "Policy Document",
      domain: "SVAMITVA & Rural Abadi",
      institution: "Survey of India & Ministry of Panchayati Raj",
      state: "All India",
      year: 2025,
      author: "Cadastral Survey Directorate, SOI",
      downloads: 9240,
      citations: 88,
      summaryEn: "Comprehensive guidelines covering Continuously Operating Reference Stations (CORS) network tolerances, GIS feature extraction, ground truthing, and 1:500 scale property card generation.",
      summaryHi: "कॉर्स (CORS) नेटवर्क परिशुद्धता, जीआईएस फीचर निष्कर्षण, जमीनी सत्यापन एवं 1:500 पैमाने पर संपत्ति कार्ड उत्पादन हेतु विस्तृत दिशा-निर्देश।",
      fileFormat: "PDF",
      fileSize: "12.2 MB",
      doiOrRef: "MoPR/SOI/SVAMITVA/SOP-04",
    },
    {
      id: "DOC-2026-003",
      titleEn: "National Land Dispute Precedent Database: Machine Learning Analysis of Revenue Appeals (2015-2025)",
      titleHi: "राष्ट्रीय भूमि विवाद मिसाल डेटाबेस: राजस्व अपीलों का मशीन लर्निंग विश्लेषण (2015-2025)",
      type: "Research Paper",
      domain: "Land Disputes & e-Courts",
      institution: "NALSAR University of Law & DoLR",
      state: "Multi-State",
      year: 2026,
      author: "Legal Analytics Research Group",
      downloads: 5120,
      citations: 64,
      summaryEn: "Natural Language Processing (NLP) synthesis of 180,000 revenue appellate judgments finding that 68% of boundary disputes originate from unupdated legacy mutations and manual survey errors.",
      summaryHi: "180,000 राजस्व अपीलीय निर्णयों का एनएलपी विश्लेषण, जिसमें पाया गया कि 68% सीमा विवाद गैर-अद्यतन दाखिल-खारिज और मैनुअल सर्वेक्षण त्रुटियों से उत्पन्न होते हैं।",
      fileFormat: "PDF",
      fileSize: "6.1 MB",
      doiOrRef: "NALSAR/LRC/2026/08",
    },
    {
      id: "DOC-2026-004",
      titleEn: "Multi-Temporal Satellite Assessment of Urban-Rural Fringe Land Conversion in Major Metro Corridors",
      titleHi: "प्रमुख मेट्रो गलियारों में शहरी-ग्रामीण सीमांत भूमि रूपांतरण का बहु-कालिक उपग्रह मूल्यांकन",
      type: "Geospatial Dataset",
      domain: "Urban-Rural Transition",
      institution: "ISRO / National Remote Sensing Centre (NRSC)",
      state: "Maharashtra",
      year: 2026,
      author: "NRSC Urban & Regional Studies Group",
      downloads: 2490,
      citations: 31,
      summaryEn: "0.5m high-resolution spatial vector layer mapping agricultural-to-industrial land use conversions across the Mumbai-Pune and Delhi-NCR peripheral growth zones from 2018 to 2025.",
      summaryHi: "2018 से 2025 तक मुंबई-पुणे और दिल्ली-एनसीआर परिधीय विकास क्षेत्रों में कृषि से औद्योगिक भूमि उपयोग रूपांतरण का 0.5 मीटर रिज़ॉल्यूशन स्थानिक वेक्टर स्तर।",
      fileFormat: "GeoJSON",
      fileSize: "84.5 MB",
      doiOrRef: "NRSC/GEO/2026/UR-07",
    },
    {
      id: "DOC-2026-005",
      titleEn: "Model Land Leasing Act: Comparative Assessment of Tenancy Security and Agricultural Investment in MP & Odisha",
      titleHi: "मॉडल भूमि पट्टा कानून: मध्य प्रदेश व ओडिशा में काश्तकारी सुरक्षा एवं कृषि निवेश का तुलनात्मक मूल्यांकन",
      type: "Case Study",
      domain: "Tenancy & Legal Reforms",
      institution: "NITI Aayog & NIRD&PR Hyderabad",
      state: "Madhya Pradesh",
      year: 2025,
      author: "Dr. B. K. Patnaik, Sh. R. K. Mishra",
      downloads: 4180,
      citations: 53,
      summaryEn: "Field evaluation of institutionalized agricultural land lease agreements showing a 28% increase in capital farm investments by tenant cultivators when tenancy contracts are legally recorded.",
      summaryHi: "संस्थागत कृषि भूमि पट्टा समझौतों का क्षेत्रीय मूल्यांकन, जो दिखाता है कि जब पट्टा अनुबंध कानूनी रूप से दर्ज होते हैं तो काश्तकारों द्वारा पूंजीगत निवेश में 28% की वृद्धि होती है।",
      fileFormat: "PDF",
      fileSize: "3.4 MB",
      doiOrRef: "NITI/EVAL/2025/LL-02",
    },
    {
      id: "DOC-2026-006",
      titleEn: "GIS-Driven Watershed Degradation & Desertification Vulnerability Atlas for Rainfed Agro-Ecological Zones",
      titleHi: "वर्षा आधारित कृषि-पारिस्थितिकी क्षेत्रों हेतु जीआईएस आधारित वाटरशेड क्षरण एवं मरुस्थलीकरण संवेदनशीलता एटलस",
      type: "Geospatial Dataset",
      domain: "Climate Resilience & Watersheds",
      institution: "Central Arid Zone Research Institute (CAZRI) & DoLR",
      state: "Rajasthan",
      year: 2026,
      author: "Land Degradation Neutrality Cell",
      downloads: 3310,
      citations: 39,
      summaryEn: "Spatial dataset at micro-watershed level analyzing soil organic carbon depletion, slope stability, and groundwater recharge potential for targeting WDC-PMKSY 2.0 watershed investments.",
      summaryHi: "डब्ल्यूडीसी-पीएमकेएसवाई 2.0 वाटरशेड निवेश को लक्षित करने के लिए मृदा जैविक कार्बन, ढलान स्थिरता व भूजल पुनर्भरण क्षमता का माइक्रो-वाटरशेड स्तरीय स्थानिक डेटासेट।",
      fileFormat: "CSV",
      fileSize: "18.6 MB",
      doiOrRef: "CAZRI/GIS/2026/WDC-11",
    },
  ];

  const domains = [
    { id: "all", labelEn: "All Domains", labelHi: "सभी क्षेत्र" },
    { id: "Bhu-Aadhaar & ULPIN", labelEn: "Bhu-Aadhaar & ULPIN", labelHi: "भू-आधार व यूलपिन" },
    { id: "SVAMITVA & Rural Abadi", labelEn: "SVAMITVA & Rural Abadi", labelHi: "स्वामित्व एवं ग्रामीण आबादी" },
    { id: "Land Disputes & e-Courts", labelEn: "Land Disputes & e-Courts", labelHi: "भूमि विवाद एवं ई-कोर्ट" },
    { id: "Urban-Rural Transition", labelEn: "Urban-Rural Transition", labelHi: "शहरी-ग्रामीण संक्रमण" },
    { id: "Climate Resilience & Watersheds", labelEn: "Climate Resilience & Watersheds", labelHi: "जलवायु व वाटरशेड" },
    { id: "Tenancy & Legal Reforms", labelEn: "Tenancy & Legal Reforms", labelHi: "काश्तकारी व कानूनी सुधार" },
  ];

  const states = [
    "All India",
    "Multi-State",
    "Madhya Pradesh",
    "Uttar Pradesh",
    "Maharashtra",
    "Rajasthan",
    "Karnataka",
    "Assam",
    "Odisha",
    "Gujarat",
  ];

  const filteredItems = useMemo(() => {
    return sampleRepo.filter((item) => {
      const matchSearch =
        searchQuery === "" ||
        item.titleEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.titleHi.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.institution.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.domain.toLowerCase().includes(searchQuery.toLowerCase());

      const matchDomain = selectedDomain === "all" || item.domain === selectedDomain;
      const matchState = selectedState === "all" || item.state === selectedState;
      const matchType = selectedType === "all" || item.type === selectedType;

      return matchSearch && matchDomain && matchState && matchType;
    });
  }, [searchQuery, selectedDomain, selectedState, selectedType]);

  const copyCitation = (item: RepoItem) => {
    const citation = `${item.author} (${item.year}). "${item.titleEn}". ${item.institution}, Government of India. Ref: ${item.doiOrRef}`;
    navigator.clipboard.writeText(citation);
    setCopiedId(item.id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  return (
    <section id="repository" className="w-full bg-[#f8fafc] py-12 border-b border-slate-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-amber-800 uppercase tracking-wider">
              <Database className="w-4 h-4 text-amber-700" />
              <span>{language === "hi" ? "केंद्रीकृत ज्ञान भंडार" : "Centralized Knowledge Ecosystem"}</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-black text-[#0b2b50] tracking-tight mt-1">
              {language === "hi" ? "राष्ट्रीय भूमि शासन डिजिटल रिपोजिटरी" : "National Land Governance Digital Repository"}
            </h3>
            <p className="text-sm text-slate-600 mt-1 max-w-3xl">
              {language === "hi"
                ? "केंद्र व राज्य सरकारों, अग्रणी विश्वविद्यालयों (आईआईटी, आईआईएम, राष्ट्रीय विधि संस्थान), इसरो एवं वैश्विक थिंक टैंकों द्वारा सत्यापित शोध पत्र, नीति आयोग केस स्टडीज, भू-स्थानिक डेटा एवं विधिक दस्तावेज।"
                : "Curated repository integrating academic research, policy papers, gazette notifications, cadastral manuals, high-resolution geospatial datasets, and dispute jurisprudence from across India."}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs bg-white text-slate-800 font-semibold px-3 py-1.5 rounded border border-slate-300 shadow-2xs">
              {language === "hi"
                ? `कुल परिणाम: ${filteredItems.length}`
                : `Showing: ${filteredItems.length} curated resources`}
            </span>
          </div>
        </div>

        {/* Filters Bar */}
        <div className="mt-6 bg-white p-4 rounded-lg border border-slate-200 shadow-2xs space-y-3">
          <div className="flex flex-col lg:flex-row gap-3">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={
                  language === "hi"
                    ? "शीर्षक, लेखक, संस्थान, यूलपिन, कानून से खोजें..."
                    : "Filter repository by title, author, institution, ULPIN, legal act..."
                }
                className="w-full pl-9 pr-4 py-2 bg-slate-50 text-slate-900 text-xs rounded border border-slate-300 focus:outline-none focus:ring-1 focus:ring-[#0b2b50]"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* State Filter */}
            <div className="flex items-center gap-2 min-w-[200px]">
              <label className="text-xs font-bold text-slate-700 whitespace-nowrap">
                {language === "hi" ? "राज्य:" : "State:"}
              </label>
              <select
                value={selectedState}
                onChange={(e) => setSelectedState(e.target.value)}
                className="w-full py-2 px-2 bg-slate-50 text-slate-800 text-xs rounded border border-slate-300 focus:outline-none focus:ring-1 focus:ring-[#0b2b50]"
              >
                {states.map((st) => (
                  <option key={st} value={st}>
                    {st}
                  </option>
                ))}
              </select>
            </div>

            {/* Type Filter */}
            <div className="flex items-center gap-2 min-w-[200px]">
              <label className="text-xs font-bold text-slate-700 whitespace-nowrap">
                {language === "hi" ? "प्रकार:" : "Type:"}
              </label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full py-2 px-2 bg-slate-50 text-slate-800 text-xs rounded border border-slate-300 focus:outline-none focus:ring-1 focus:ring-[#0b2b50]"
              >
                <option value="all">{language === "hi" ? "सभी प्रकार" : "All Types"}</option>
                <option value="Research Paper">Research Paper</option>
                <option value="Policy Document">Policy Document</option>
                <option value="Geospatial Dataset">Geospatial Dataset</option>
                <option value="Case Study">Case Study</option>
              </select>
            </div>
          </div>

          {/* Domain Chips */}
          <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-slate-100 text-xs">
            <span className="font-bold text-slate-700 mr-1 flex items-center gap-1 text-[11px]">
              <Filter className="w-3 h-3 text-slate-500" />
              {language === "hi" ? "विषय क्षेत्र:" : "Domain:"}
            </span>
            {domains.map((dom) => {
              const isSelected = selectedDomain === dom.id;
              return (
                <button
                  key={dom.id}
                  type="button"
                  onClick={() => setSelectedDomain(dom.id)}
                  className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-colors cursor-pointer border ${
                    isSelected
                      ? "bg-[#0b2b50] text-white border-[#0b2b50]"
                      : "bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200"
                  }`}
                >
                  {language === "hi" ? dom.labelHi : dom.labelEn}
                </button>
              );
            })}
          </div>
        </div>

        {/* Document Cards List */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-lg border border-slate-200 hover:border-slate-400 p-4 shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between"
            >
              <div>
                {/* Meta Badges */}
                <div className="flex items-center justify-between gap-2 text-[10px] font-bold">
                  <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-900 border border-blue-200">
                    {item.type}
                  </span>
                  <span className="text-slate-500 flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-slate-400" />
                    {item.year} • {item.state}
                  </span>
                </div>

                {/* Title */}
                <h4 className="text-sm font-bold text-[#0b2b50] mt-2.5 leading-snug line-clamp-2 hover:underline cursor-pointer"
                  onClick={() => setActiveItemModal(item)}
                >
                  {language === "hi" ? item.titleHi : item.titleEn}
                </h4>

                {/* Institution & Authors */}
                <div className="mt-1.5 flex items-center gap-1 text-[11px] text-slate-600 font-medium">
                  <Building className="w-3 h-3 text-slate-400 shrink-0" />
                  <span className="truncate">{item.institution}</span>
                </div>

                {/* Abstract snippet */}
                <p className="mt-2 text-xs text-slate-600 line-clamp-3 leading-relaxed">
                  {language === "hi" ? item.summaryHi : item.summaryEn}
                </p>

                {/* Metadata reference tag */}
                <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500 font-mono">
                  <span>{item.doiOrRef}</span>
                  <span className="bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded font-bold">
                    {item.fileFormat} • {item.fileSize}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => setActiveItemModal(item)}
                  className="flex items-center gap-1 text-[#0b2b50] hover:text-[#164275] font-bold text-[11px] cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>{language === "hi" ? "विस्तृत देखें" : "View Details"}</span>
                </button>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => copyCitation(item)}
                    className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded border border-slate-200"
                    title="Copy Academic Citation"
                  >
                    {copiedId === item.id ? (
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <Share2 className="w-3.5 h-3.5" />
                    )}
                  </button>

                  <a
                    href="#download"
                    onClick={(e) => {
                      e.preventDefault();
                      alert(`Downloading: ${item.titleEn} (${item.fileFormat}, ${item.fileSize}) from National NIC Cloud Repository.`);
                    }}
                    className="flex items-center gap-1 bg-[#0b2b50] hover:bg-[#071e3d] text-white px-2.5 py-1 rounded text-[11px] font-bold shadow-2xs transition-colors cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5 text-amber-400" />
                    <span>{item.fileFormat}</span>
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredItems.length === 0 && (
          <div className="bg-white p-12 text-center rounded border border-slate-200 mt-6">
            <BookOpen className="w-10 h-10 text-slate-300 mx-auto" />
            <div className="text-sm font-bold text-slate-700 mt-2">
              {language === "hi" ? "कोई परिणाम नहीं मिला" : "No resources match your search criteria"}
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Try adjusting your search terms or clearing the domain filters.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery("");
                setSelectedDomain("all");
                setSelectedState("all");
                setSelectedType("all");
              }}
              className="mt-3 text-xs text-[#0b2b50] font-bold underline"
            >
              Reset all filters
            </button>
          </div>
        )}
      </div>

      {/* Modal Dialog for Resource Details */}
      {activeItemModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-xs">
          <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-slate-300">
            {/* Modal Header */}
            <div className="bg-[#0b2b50] text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-amber-400" />
                <span className="text-xs font-bold uppercase tracking-wider text-amber-300">
                  {activeItemModal.type} • {activeItemModal.id}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setActiveItemModal(null)}
                className="text-white hover:text-amber-300 p-1 rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4 text-xs text-slate-700">
              <h3 className="text-base font-extrabold text-[#0b2b50] leading-snug">
                {language === "hi" ? activeItemModal.titleHi : activeItemModal.titleEn}
              </h3>

              <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3 rounded border border-slate-200">
                <div>
                  <span className="font-bold text-slate-500 block">Lead Author(s):</span>
                  <span className="font-semibold text-slate-800">{activeItemModal.author}</span>
                </div>
                <div>
                  <span className="font-bold text-slate-500 block">Issuing Institution:</span>
                  <span className="font-semibold text-slate-800">{activeItemModal.institution}</span>
                </div>
                <div>
                  <span className="font-bold text-slate-500 block">Domain & Geographic Scope:</span>
                  <span className="font-semibold text-slate-800">
                    {activeItemModal.domain} ({activeItemModal.state})
                  </span>
                </div>
                <div>
                  <span className="font-bold text-slate-500 block">Official Reference ID:</span>
                  <span className="font-mono text-slate-800">{activeItemModal.doiOrRef}</span>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 uppercase tracking-wide text-[11px]">
                  {language === "hi" ? "कार्यकारी सारांश एवं मुख्य निष्कर्ष" : "Executive Summary & Key Findings"}
                </h4>
                <p className="mt-1.5 leading-relaxed text-slate-600 text-xs">
                  {language === "hi" ? activeItemModal.summaryHi : activeItemModal.summaryEn}
                </p>
              </div>

              {/* Policy Application Note */}
              <div className="bg-amber-50 border-l-3 border-amber-500 p-3 rounded-r text-[11px] text-amber-900">
                <span className="font-bold block">Evidence-Based Policy Application:</span>
                This research document is directly referenced by the Department of Land Resources (DoLR)
                PME Division for national cadastral modernization benchmarks and model state tenancy guidelines.
              </div>

              {/* Modal Footer Actions */}
              <div className="pt-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => copyCitation(activeItemModal)}
                  className="flex items-center gap-1.5 px-3 py-2 rounded border border-slate-300 hover:bg-slate-50 font-semibold text-slate-700"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Copy BibTeX / Citation</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setActiveItemModal(null)}
                    className="px-4 py-2 rounded border border-slate-300 hover:bg-slate-100 font-semibold text-slate-700"
                  >
                    Close
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      alert(`Initiating verified download of ${activeItemModal.doiOrRef} (${activeItemModal.fileFormat}) via NIC Secure Gateway.`);
                      setActiveItemModal(null);
                    }}
                    className="flex items-center gap-1.5 bg-[#0b2b50] hover:bg-[#071e3d] text-white px-4 py-2 rounded font-bold shadow-xs"
                  >
                    <Download className="w-4 h-4 text-amber-400" />
                    <span>Download Full {activeItemModal.fileFormat} ({activeItemModal.fileSize})</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
