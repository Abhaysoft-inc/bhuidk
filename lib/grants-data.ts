export type UrgencyLevel = "High" | "Medium" | "Low";
export type TopicCategory = "disputes" | "land-use" | "climate" | "digitization";
export type FundingTier = "Micro (₹50k–2L)" | "Standard (₹2L–10L)" | "Major (₹10L+)";
export type ClaimStatus = "Claimed" | "In Progress" | "Submitted" | "Reviewed" | "Published";
export type ImpactOutcome = "Completed" | "Cited in Policy" | "Under Peer Review" | "No update yet";
export type UserRole = "researcher" | "official" | "public" | "admin";

export interface CoFunder {
  id: string;
  name: string;
  type: "Government Dept" | "Think Tank" | "Multilateral" | "Academic Fund";
  focusAreas: string[];
  committedPoolLakhs: number;
}

export interface ResearchGap {
  id: string;
  code: string; // e.g. GAP-2026-081
  title: string;
  state: string;
  district?: string;
  urgency: UrgencyLevel;
  topic: TopicCategory;
  sourceEngine: "Dispute Intelligence" | "Contradiction Detector" | "Simulation Sandbox";
  sourceMetric: string; // e.g. "Dispute Intelligence Engine: Sambalpur [Metric #DISP-2023-42]"
  sourceCitation: string; // e.g. "[D3] Sambalpur Land Consolidation Act vs [D9] Canal Notification"
  evidenceSnippet: string;
  recommendedFundingTier: FundingTier;
  estimatedBudget: string;
  eligibleDeliverables: string[];
  coFunders: string[];
  claimStatus: "Available" | "Claimed" | "Resolved";
  claimedBy?: string;
  claimedOrg?: string;
  claimedDate?: string;
  targetRepoDoi?: string;
  dateFlagged: string;
}

export interface ClaimedGapItem {
  id: string;
  gapId: string;
  gapTitle: string;
  researcherName: string;
  institution: string;
  role: string;
  fundingTier: FundingTier;
  amountRequested: string;
  timelineMonths: number;
  currentStage: ClaimStatus;
  progressPercent: number;
  deliverableType: string;
  proposedApproach: string;
  targetRepoDoi: string;
  citationRef: string;
  indexedInRepository: boolean;
  dateSubmitted: string;
  estimatedCompletion: string;
}

export interface FastTrackApplication {
  id: string;
  applicantName: string;
  applicantRole: string;
  applicantOrg: string;
  gapReference: string;
  expectedDeliverable: string;
  timelineWeeks: number;
  requestedAmount: string;
  status: "Under Review" | "Fast-Track Approved" | "Disbursed";
  submittedAt: string;
}

export interface InnovationChallenge {
  id: string;
  challengeCode: string;
  title: string;
  problemStatement: string;
  whyItMatters: string;
  currentBaseline: string; // Honest, transparent statement about current version
  expectedOutcome: string;
  grantPool: string;
  submissionDeadline: string;
  roadmapStage: "Active v1.2 in Production" | "Experimental Prototype" | "Roadmap Q3 2026";
  coFunders: string[];
  submissionCount: number;
}

export interface ImpactRecord {
  id: string;
  grantCode: string;
  title: string;
  leadResearcher: string;
  institution: string;
  fundingTier: FundingTier;
  amountGranted: string;
  resolvedGapCode: string;
  outcomeStatus: ImpactOutcome;
  policyImpactSummary: string;
  repositoryCitation: string; // [D-xxx]
  repositoryDoi: string;
  completionYear: number;
}

export interface PlatformImpactStats {
  totalGrantsFundedLakhs: number;
  totalGrantsCount: number;
  gapsClosedCount: number;
  papersPublishedCount: number;
  avgFastTrackDays: number;
  avgStandardDays: number;
}

// ----------------- MOCK DATASETS -----------------

export const INITIAL_CO_FUNDERS: CoFunder[] = [
  {
    id: "cf-1",
    name: "DoLR Digital India Land Records Programme",
    type: "Government Dept",
    focusAreas: ["Cadastral Digitization", "Bhu-Aadhaar", "Pre-Litigation Systems"],
    committedPoolLakhs: 250,
  },
  {
    id: "cf-2",
    name: "Centre for Land Governance & Policy (CLGP)",
    type: "Think Tank",
    focusAreas: ["Tenancy Reform", "Forest Rights Act", "Dispute Resolution"],
    committedPoolLakhs: 120,
  },
  {
    id: "cf-3",
    name: "UNDP India Resilient Land Governance Initiative",
    type: "Multilateral",
    focusAreas: ["Climate Adaptation", "Coastal Salinity", "Arid Zone Commons"],
    committedPoolLakhs: 180,
  },
  {
    id: "cf-4",
    name: "NABARD Rural Infrastructure & Land Innovation Fund",
    type: "Academic Fund",
    focusAreas: ["Watershed Management", "Tenant Credit Eligibility", "Soil Mapping"],
    committedPoolLakhs: 150,
  },
  {
    id: "cf-5",
    name: "NITI Aayog Aspirational Districts Innovation Pool",
    type: "Government Dept",
    focusAreas: ["Tribal Patta Settlement", "Administrative Simplification"],
    committedPoolLakhs: 100,
  },
];

export const INITIAL_RESEARCH_GAPS: ResearchGap[] = [
  {
    id: "gap-1",
    code: "GAP-2026-081",
    title: "Sambalpur, Odisha: 42% Spike in Land Disputes Following Canal Network Expansion",
    state: "Odisha",
    district: "Sambalpur",
    urgency: "High",
    topic: "disputes",
    sourceEngine: "Dispute Intelligence",
    sourceMetric: "Dispute Intelligence Engine: Sambalpur, Odisha [Metric #DISP-2023-42]",
    sourceCitation: "[D3] Sambalpur Land Consolidation Act (1972) vs [D9] Water Resources Canal Alignment Notification (2021)",
    evidenceSnippet: "District revenue court filings surged 42% along the Hirakud Command Area since 2023. No existing policy research or standard operating procedure addresses easement rights across newly canalized command areas, leaving 1,420 smallholder petitions unresolved.",
    recommendedFundingTier: "Standard (₹2L–10L)",
    estimatedBudget: "₹5.8 Lakhs",
    eligibleDeliverables: ["Empirical Dispute Root-Cause Paper", "Easement Rights Policy Brief", "Model Village Settlement Template"],
    coFunders: ["DoLR Digital India Land Records Programme", "UNDP India Resilient Land Governance Initiative"],
    claimStatus: "Available",
    dateFlagged: "12 Feb 2026",
  },
  {
    id: "gap-2",
    code: "GAP-2026-084",
    title: "Bundelkhand, UP: Statutory Contradiction on Tree-Harvest Rights on Recorded Holdings",
    state: "Uttar Pradesh",
    district: "Jhansi & Lalitpur",
    urgency: "High",
    topic: "land-use",
    sourceEngine: "Contradiction Detector",
    sourceMetric: "Contradiction Engine: Statutory Conflict in Jhansi & Lalitpur [Doc #D4 vs #D11]",
    sourceCitation: "[D4] UP Zamindari Abolition Act Sec 13 vs [D11] State Social Forestry Transit Rules (2018)",
    evidenceSnippet: "Contradiction engine detected conflicting statutory clauses: Section 13 grants bhumidhars unrestricted timber rights on ancestral private parcels, while 2018 Transit Rules mandate Divisional Forest Officer transit permits, halting agro-forestry commercialization across 40,000 hectares.",
    recommendedFundingTier: "Micro (₹50k–2L)",
    estimatedBudget: "₹1.8 Lakhs",
    eligibleDeliverables: ["Statutory Harmonization Note", "Inter-Departmental SOP Draft"],
    coFunders: ["Centre for Land Governance & Policy (CLGP)", "NABARD Rural Infrastructure & Land Innovation Fund"],
    claimStatus: "Available",
    dateFlagged: "28 Jan 2026",
  },
  {
    id: "gap-3",
    code: "GAP-2026-087",
    title: "Barmer & Jaisalmer, Rajasthan: Mega-Solar Park Leases vs Pastoral Commons (Gauchar) Customary Rights",
    state: "Rajasthan",
    district: "Jaisalmer",
    urgency: "High",
    topic: "climate",
    sourceEngine: "Dispute Intelligence",
    sourceMetric: "Dispute Intelligence Engine: Western Arid Zone [Metric #DISP-2024-18]",
    sourceCitation: "[D8] Rajasthan Tenancy (Govt Wasteland Allotment) Rules vs [D14] Supreme Court Gauchar Preservation Precedent",
    evidenceSnippet: "Satellite analysis indicates conversion of 18,200 hectares of classified Oran and Gauchar grazing land for renewable power corridors. Zero state policy guidance balances renewable targets with community grazing rights for nomadic Raika pastoralists.",
    recommendedFundingTier: "Major (₹10L+)",
    estimatedBudget: "₹12.5 Lakhs",
    eligibleDeliverables: ["GIS Grazing Buffer Impact Study", "Equitable Renewable Lease Framework", "State Policy Recommendation Paper"],
    coFunders: ["UNDP India Resilient Land Governance Initiative", "NITI Aayog Aspirational Districts Innovation Pool"],
    claimStatus: "Available",
    dateFlagged: "04 Feb 2026",
  },
  {
    id: "gap-4",
    code: "GAP-2026-092",
    title: "Pune & Thane Peri-Urban Corridors, Maharashtra: High-Velocity Land Conversion Mismatching 7/12 Records",
    state: "Maharashtra",
    district: "Pune",
    urgency: "Medium",
    topic: "digitization",
    sourceEngine: "Contradiction Detector",
    sourceMetric: "Contradiction Engine: Drone Survey vs 7/12 Extract Mismatch [Doc #D2 vs #D16]",
    sourceCitation: "[D2] SVAMITVA Ortho-rectified Cadastre vs [D16] Maharashtra Land Revenue Code Manual Sec 85",
    evidenceSnippet: "Automated spatial cross-check revealed a 31% spatial divergence between high-resolution drone parcel polygons and digitised 7/12 revenue abstracts in 18 peri-urban talukas undergoing rapid warehousing development.",
    recommendedFundingTier: "Standard (₹2L–10L)",
    estimatedBudget: "₹6.2 Lakhs",
    eligibleDeliverables: ["Spatial Cadastral Reconciliation Algorithm", "Peri-Urban Mutation Protocol"],
    coFunders: ["DoLR Digital India Land Records Programme", "Centre for Land Governance & Policy (CLGP)"],
    claimStatus: "Available",
    dateFlagged: "18 Jan 2026",
  },
  {
    id: "gap-5",
    code: "GAP-2026-095",
    title: "Thanjavur Delta, Tamil Nadu: Sea Water Intrusion Salinity in Unrecorded Tenancy Holdings",
    state: "Tamil Nadu",
    district: "Thanjavur",
    urgency: "Medium",
    topic: "climate",
    sourceEngine: "Dispute Intelligence",
    sourceMetric: "Dispute Intelligence Engine: Coastal Agrarian Zone [Metric #DISP-2024-29]",
    sourceCitation: "[D7] Coastal Regulation Zone IV Guidelines vs [D19] Tamil Nadu Cultivating Tenants Protection Act",
    evidenceSnippet: "Over 22% of coastal delta paddy plots exhibit moderate-to-severe soil salinity. Because ~60% of delta tillers operate under unwritten oral leases, they are legally excluded from state crop compensation and saltwater bund restoration subsidies.",
    recommendedFundingTier: "Standard (₹2L–10L)",
    estimatedBudget: "₹4.5 Lakhs",
    eligibleDeliverables: ["Oral Lease Climate Compensation Model", "Ground Truthing Survey Dataset"],
    coFunders: ["NABARD Rural Infrastructure & Land Innovation Fund", "UNDP India Resilient Land Governance Initiative"],
    claimStatus: "Available",
    dateFlagged: "09 Feb 2026",
  },
  {
    id: "gap-6",
    code: "GAP-2026-098",
    title: "Sehore & Dewas, MP: Multi-Co-Owner Bhu-Aadhaar ULPIN Fragmentation Delays",
    state: "Madhya Pradesh",
    district: "Sehore",
    urgency: "Low",
    topic: "digitization",
    sourceEngine: "Contradiction Detector",
    sourceMetric: "Contradiction Engine: Multi-Co-owner Mutation Lag [Doc #D1 vs #D22]",
    sourceCitation: "[D1] Bhu-Aadhaar National Technical Specification v2 vs [D22] MP Land Records Manual Ch 3",
    evidenceSnippet: "Generation of 14-digit ULPIN for undivided joint family khatas averages 82 days compared to 6 days for single-owner plots, stalling PM-KISAN subsidy validations for 14,000 heir beneficiaries.",
    recommendedFundingTier: "Micro (₹50k–2L)",
    estimatedBudget: "₹1.5 Lakhs",
    eligibleDeliverables: ["Joint-Khata ULPIN Fast-track Algorithm", "Field Mutation SOP"],
    coFunders: ["DoLR Digital India Land Records Programme"],
    claimStatus: "Available",
    dateFlagged: "14 Feb 2026",
  },
  {
    id: "gap-7",
    code: "GAP-2026-104",
    title: "Dharwad, Karnataka: Latency in Appellate Revenue Disposals Due to Non-Standardized Case Pleadings",
    state: "Karnataka",
    district: "Dharwad",
    urgency: "Medium",
    topic: "disputes",
    sourceEngine: "Dispute Intelligence",
    sourceMetric: "Dispute Intelligence Engine: Revenue Court Backlog [Metric #DISP-2023-55]",
    sourceCitation: "[D5] Karnataka Land Revenue Act (1964) Sec 49 vs [D12] e-Courts Phase III Revenue Interoperability Guideline",
    evidenceSnippet: "Assistant Commissioner appellate courts take an average of 412 days to dispose of mutation appeals due to handwritten vernacular petition filings lacking structured boundary geometry attachments.",
    recommendedFundingTier: "Standard (₹2L–10L)",
    estimatedBudget: "₹3.8 Lakhs",
    eligibleDeliverables: ["Standardized Digital Revenue Appeal Petition Schema", "Pre-Hearing Conciliation Template"],
    coFunders: ["Centre for Land Governance & Policy (CLGP)", "NITI Aayog Aspirational Districts Innovation Pool"],
    claimStatus: "Available",
    dateFlagged: "22 Jan 2026",
  },
];

export const INITIAL_CLAIMED_GAPS: ClaimedGapItem[] = [
  {
    id: "claim-101",
    gapId: "gap-legacy-01",
    gapTitle: "Automated OCR & Legal Named-Entity Recognition for Colonial Urdu / Modi Script Jamabandi Records",
    researcherName: "Dr. Ananya Sen",
    institution: "IIT Roorkee - Dept of Civil & Geomatics",
    role: "Principal Investigator",
    fundingTier: "Standard (₹2L–10L)",
    amountRequested: "₹6,50,000",
    timelineMonths: 6,
    currentStage: "In Progress",
    progressPercent: 45,
    deliverableType: "Deep Learning Model & Benchmark Dataset",
    proposedApproach: "Fine-tuning hybrid CRNN-Transformer vision encoders on 12,000 high-res scans of pre-1947 RoR registers in Gurdaspur and Solapur with automated land parcel number extraction.",
    targetRepoDoi: "DOI: 10.GOV.IN/LGD/2026/REP-4819",
    citationRef: "[D-CLAIM-101]",
    indexedInRepository: false,
    dateSubmitted: "15 Dec 2025",
    estimatedCompletion: "15 May 2026",
  },
  {
    id: "claim-102",
    gapId: "gap-legacy-02",
    gapTitle: "Drone Photogrammetry vs Ground-Truth ETS Survey Accuracy in Steep Slope Western Ghats",
    researcherName: "Prof. Rajesh Deshmukh",
    institution: "COEP Technological University, Pune",
    role: "Senior GIS Researcher",
    fundingTier: "Micro (₹50k–2L)",
    amountRequested: "₹1,80,000",
    timelineMonths: 3,
    currentStage: "Submitted",
    progressPercent: 85,
    deliverableType: "Field Tolerance Validation Report & Drone SOP",
    proposedApproach: "Comparative analysis of 500 ground control points across Ratnagiri terraced orchards, isolating terrain relief displacement errors under SVAMITVA standard flight parameters.",
    targetRepoDoi: "DOI: 10.GOV.IN/LGD/2026/REP-5120",
    citationRef: "[D-CLAIM-102]",
    indexedInRepository: false,
    dateSubmitted: "10 Nov 2025",
    estimatedCompletion: "28 Feb 2026",
  },
  {
    id: "claim-103",
    gapId: "gap-legacy-03",
    gapTitle: "Pre-Litigation Settlement Framework for Coparcenary Disputes under Hindu Succession Amendment",
    researcherName: "Dr. Meenakshi Sundaram",
    institution: "NALSAR University of Law, Hyderabad",
    role: "Honorary Research Fellow",
    fundingTier: "Major (₹10L+)",
    amountRequested: "₹14,00,000",
    timelineMonths: 12,
    currentStage: "Published",
    progressPercent: 100,
    deliverableType: "National Policy Paper & Conciliation Toolkit",
    proposedApproach: "Synthesized 2,400 high court succession judgments from 2005-2025 to formulate a predictive mediation tree adopted by Telangana revenue tribunals.",
    targetRepoDoi: "DOI: 10.GOV.IN/LGD/2026/REP-3904",
    citationRef: "[D-CLAIM-103]",
    indexedInRepository: true,
    dateSubmitted: "01 Mar 2025",
    estimatedCompletion: "15 Jan 2026",
  },
];

export const INITIAL_INNOVATION_CHALLENGES: InnovationChallenge[] = [
  {
    id: "chal-1",
    challengeCode: "CHAL-CORE-01",
    title: "Improve Our Rule-Based Contradiction Detector with Neural Cross-Encoder Verification",
    problemStatement: "The platform's legal synthesis engine flags statutory contradictions between state revenue codes and central model acts using regex proximity and clause heuristics. This surfaces useful leads but misses subtle contextual qualifications in proviso clauses.",
    whyItMatters: "Over 64% of ongoing land litigation in India is rooted in statutory ambiguity between central environmental/tribal protection acts and state revenue enactments. Reliable automated conflict detection prevents erroneous policy gazetting.",
    currentBaseline: "Rule-based regex & heuristic keyword matching v1.2. Suffers from ~18% false positive rate and frequently misses exceptions buried in legal sub-clauses and colonial-era vernacular amendments.",
    expectedOutcome: "A lightweight fine-tuned Indian Legal BERT cross-encoder capable of classifying potential contradictions with >= 92% precision and producing grounded citation spans [D1]/[D2].",
    grantPool: "₹25,00,000 Grant Pool",
    submissionDeadline: "31 Oct 2026",
    roadmapStage: "Active v1.2 in Production",
    coFunders: ["DoLR Digital India Land Records Programme", "NITI Aayog Aspirational Districts Innovation Pool"],
    submissionCount: 14,
  },
  {
    id: "chal-2",
    challengeCode: "CHAL-CORE-02",
    title: "Calibrate Policy Simulator with 10-Year District Disposal Microdata",
    problemStatement: "Our policy simulation sandbox currently calculates dispute reduction impact using macro-level elasticity factors (coverage, timeline, bureaucratic friction). It lacks empirical grounding in actual district-level case backlog disposal curves.",
    whyItMatters: "State revenue principal secretaries require verifiable, confidence-interval backed projections before allocating ₹100+ Cr state budgets to land digitization initiatives.",
    currentBaseline: "Static linear regression model with fixed weight factors. Does not account for tehsildar judge vacancies, monsoon recess backlogs, or district court appeal escalation loops.",
    expectedOutcome: "A dynamic agent-based or survival-analysis model trained on 10 years of district revenue court disposals across 6 pilot states, outputting P10/P50/P90 impact intervals.",
    grantPool: "₹35,00,000 Grant Pool",
    submissionDeadline: "15 Nov 2026",
    roadmapStage: "Experimental Prototype",
    coFunders: ["Centre for Land Governance & Policy (CLGP)", "UNDP India Resilient Land Governance Initiative"],
    submissionCount: 9,
  },
  {
    id: "chal-3",
    challengeCode: "CHAL-CORE-03",
    title: "Design an Offline-First Vernacular Voice Interface for Field Patwaris / Revenue Inspectors",
    problemStatement: "Field inspectors conducting spot panchanamas and crop inspection entries face high friction typing complex Urdu/Persian/Hindi cadastral terminology into mobile web forms under zero 4G connectivity.",
    whyItMatters: "Inspection backlogs lead to delayed mutation updates, creating discrepancies between physical field possession and digital land records that trigger boundary feuds.",
    currentBaseline: "Standard responsive web form with text input fields; requires continuous 4G network connectivity and offers zero vernacular speech transcription.",
    expectedOutcome: "An offline-capable Progressive Web Application with local on-device speech-to-text supporting Hindi, Marathi, Telugu, and Odia cadastral vocabularies.",
    grantPool: "₹20,00,000 Grant Pool",
    submissionDeadline: "30 Nov 2026",
    roadmapStage: "Roadmap Q3 2026",
    coFunders: ["NABARD Rural Infrastructure & Land Innovation Fund", "DoLR Digital India Land Records Programme"],
    submissionCount: 21,
  },
  {
    id: "chal-4",
    challengeCode: "CHAL-CORE-04",
    title: "Drone-to-Cadastre Auto-Boundary Delineation Using Graph Neural Networks",
    problemStatement: "Vectorizing field parcel boundaries (Medh, stone bunds, hedges) from 5cm drone orthophotos remains a manual CAD digitizing bottleneck across thousands of surveyed SVAMITVA villages.",
    whyItMatters: "Speeding up boundary drafting from 4.2 days per village to 3 hours directly unlocks title deeds (Property Cards) for rural house owners seeking institutional bank loans.",
    currentBaseline: "Semi-automated edge detection with manual polygon vertex correction; high operator fatigue and inconsistency along overgrown field boundaries.",
    expectedOutcome: "A deep geometric deep-learning pipeline outputting topologically valid GeoJSON parcel polygons meeting Survey of India 1:1,000 cadastral tolerances.",
    grantPool: "₹45,00,000 Grant Pool",
    submissionDeadline: "15 Dec 2026",
    roadmapStage: "Experimental Prototype",
    coFunders: ["DoLR Digital India Land Records Programme", "NITI Aayog Aspirational Districts Innovation Pool"],
    submissionCount: 17,
  },
];

export const INITIAL_IMPACT_RECORDS: ImpactRecord[] = [
  {
    id: "imp-1",
    grantCode: "GRANT-2025-012",
    title: "Empirical Analysis of Land Mutation Latency on Rural Kisan Credit Card (KCC) Approvals",
    leadResearcher: "Dr. K. S. Ramanathan",
    institution: "Madras School of Economics, Chennai",
    fundingTier: "Standard (₹2L–10L)",
    amountGranted: "₹7,20,000",
    resolvedGapCode: "GAP-2024-033",
    outcomeStatus: "Cited in Policy",
    policyImpactSummary: "Directly cited in RBI Working Group Report on Rural Credit Modernization (2025); informed adoption of automated revenue mutation verification API by 14 public sector banks.",
    repositoryCitation: "[D-184] Land Mutation Latency & Agricultural Credit Disbursal",
    repositoryDoi: "DOI: 10.GOV.IN/LGD/2025/REP-1842",
    completionYear: 2025,
  },
  {
    id: "imp-2",
    grantCode: "GRANT-2025-019",
    title: "SVAMITVA Property Card Adoption and Commercial Bank Collateralization Assessment",
    leadResearcher: "Prof. Arvind Trivedi",
    institution: "National Law School of India University (NLSIU)",
    fundingTier: "Major (₹10L+)",
    amountGranted: "₹12,50,000",
    resolvedGapCode: "GAP-2024-041",
    outcomeStatus: "Completed",
    policyImpactSummary: "Produced comprehensive legal handbook on abadi title mortgageability adopted by state registrars across Haryana, MP, and UP.",
    repositoryCitation: "[D-219] Abadi Land Titles & Bank Mortgageability Framework",
    repositoryDoi: "DOI: 10.GOV.IN/LGD/2025/REP-2190",
    completionYear: 2025,
  },
  {
    id: "imp-3",
    grantCode: "GRANT-2025-024",
    title: "Satellite SAR Interferometry for Monitoring Coal Mining Subsidence on Agricultural Pattas",
    leadResearcher: "Dr. Pratibha Das",
    institution: "IIT (ISM) Dhanbad - Mining Geomatics",
    fundingTier: "Standard (₹2L–10L)",
    amountGranted: "₹6,80,000",
    resolvedGapCode: "GAP-2024-057",
    outcomeStatus: "Cited in Policy",
    policyImpactSummary: "Integrated into Coal India - DoLR Joint Rehabilitation SOP for Korba & Singrauli opencast expansion corridors.",
    repositoryCitation: "[D-255] InSAR Land Subsidence Verification Manual",
    repositoryDoi: "DOI: 10.GOV.IN/LGD/2025/REP-2554",
    completionYear: 2025,
  },
  {
    id: "imp-4",
    grantCode: "GRANT-2026-003",
    title: "Evaluating Female Coparcener Land Registry Entitlements in Irrigation Rehabilitation Zones",
    leadResearcher: "Dr. Sunita Murthy",
    institution: "Tata Institute of Social Sciences (TISS), Mumbai",
    fundingTier: "Micro (₹50k–2L)",
    amountGranted: "₹1,50,000",
    resolvedGapCode: "GAP-2025-072",
    outcomeStatus: "Under Peer Review",
    policyImpactSummary: "Study of 800 displaced families in Narmada Valley revealing gender disparities in joint compensation title issuance. Policy draft under review by Ministry of Social Justice.",
    repositoryCitation: "[D-291] Gender Disaggregated Land Restitution Protocols",
    repositoryDoi: "DOI: 10.GOV.IN/LGD/2026/REP-2910",
    completionYear: 2026,
  },
  {
    id: "imp-5",
    grantCode: "GRANT-2025-008",
    title: "Machine Learning Identification of Unregistered Tenancy from Multi-Temporal NDVI Crop Signatures",
    leadResearcher: "Dr. Farooq Ahmad",
    institution: "Aligarh Muslim University & ICRISAT",
    fundingTier: "Micro (₹50k–2L)",
    amountGranted: "₹1,95,000",
    resolvedGapCode: "GAP-2024-029",
    outcomeStatus: "No update yet",
    policyImpactSummary: "Initial pilot conducted across 45 villages in Western UP. Follow-up state deployment pending district collector approval.",
    repositoryCitation: "[D-162] Remote Sensing Tenancy Identification Prototype",
    repositoryDoi: "DOI: 10.GOV.IN/LGD/2025/REP-1628",
    completionYear: 2025,
  },
];

export const PLATFORM_IMPACT_STATS: PlatformImpactStats = {
  totalGrantsFundedLakhs: 248.5,
  totalGrantsCount: 38,
  gapsClosedCount: 29,
  papersPublishedCount: 22,
  avgFastTrackDays: 12,
  avgStandardDays: 34,
};
