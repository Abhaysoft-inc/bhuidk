export interface GovtScheme {
  id: string;
  name: string;
  description: string;
  budget: string;
  keywords: string[];
}

const SEEDED_SCHEMES: GovtScheme[] = [
  {
    id: 'SCH-01',
    name: 'Digital India Land Records Modernization Programme (DILRMP)',
    description: 'Aims to modernize management of land records, minimize scope of land/property disputes, enhance transparency in the land records maintenance system.',
    budget: '₹1,000 Crores',
    keywords: ['land records', 'digitization', 'disputes', 'property', 'cadastral', 'survey']
  },
  {
    id: 'SCH-02',
    name: 'SVAMITVA Scheme',
    description: 'Providing a record of rights to village household owners possessing houses in inhabited rural areas using drone technology.',
    budget: '₹500 Crores',
    keywords: ['drone', 'rural', 'property card', 'mapping', 'survey', 'village']
  },
  {
    id: 'SCH-03',
    name: 'Pradhan Mantri Awas Yojana (PMAY)',
    description: 'Providing affordable housing to the urban and rural poor.',
    budget: '₹79,000 Crores',
    keywords: ['housing', 'affordable', 'construction', 'slum rehabilitation', 'urban poor']
  },
  {
    id: 'SCH-04',
    name: 'AMRUT 2.0',
    description: 'Atal Mission for Rejuvenation and Urban Transformation focusing on water supply, sewerage, and urban infrastructure.',
    budget: '₹2.77 Lakh Crores',
    keywords: ['urban', 'infrastructure', 'water', 'sewerage', 'transit', 'zoning']
  },
  {
    id: 'SCH-05',
    name: 'Smart Cities Mission',
    description: 'Promote cities that provide core infrastructure and give a decent quality of life to its citizens via smart solutions.',
    budget: '₹48,000 Crores',
    keywords: ['smart city', 'iot', 'sensors', 'urban planning', 'transit', 'digital twin']
  }
];

export interface MatchResult {
  scheme: GovtScheme;
  score: number;
  matchedKeywords: string[];
}

/**
 * Basic implementation of TF-IDF / Keyword Intersection scoring.
 * Compares a research project's tags and description against government schemes.
 */
export function findMatchingGrants(projectDescription: string, projectTags: string[]): MatchResult[] {
  const normalizedText = (projectDescription + ' ' + projectTags.join(' ')).toLowerCase();
  
  const results: MatchResult[] = SEEDED_SCHEMES.map(scheme => {
    let score = 0;
    const matchedKeywords: string[] = [];
    
    scheme.keywords.forEach(keyword => {
      // Very basic keyword matching (in a real app, use NLP stemmers or vector embeddings)
      if (normalizedText.includes(keyword.toLowerCase())) {
        score += 25; // Base weight per keyword
        matchedKeywords.push(keyword);
      }
    });
    
    // Add minor score if description intersects heavily
    const descWords = scheme.description.toLowerCase().split(' ');
    let descHits = 0;
    descWords.forEach(word => {
      if (word.length > 4 && normalizedText.includes(word)) {
        descHits += 1;
      }
    });
    
    score += descHits * 2;
    
    return {
      scheme,
      // Cap at 98% for realism in UI
      score: Math.min(98, score),
      matchedKeywords
    };
  });
  
  // Filter out zero scores and sort by highest score
  return results
    .filter(r => r.score > 10)
    .sort((a, b) => b.score - a.score);
}
