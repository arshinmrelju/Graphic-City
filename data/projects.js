const projects = [
  {
    id: 'aether', title: 'Aether', client: 'Aether Computing', category: 'brand-identity', year: '2025', size: 'featured',
    color: '#0066FF', seeds: { thumb: 1, gallery: [5, 6, 7, 8] },
    description: 'A visual identity for the future of computing. A complete brand system from strategy through deployment.',
    cs: {
      challenge: 'Aether had outpaced their identity. What began as a research project had become a platform — but their brand still looked like a prototype. They needed a visual system that matched their ambition.',
      research: 'We interviewed 14 stakeholders across engineering, product, and leadership. The recurring theme: Aether was seen as brilliant but inaccessible. The brand needed to communicate precision without coldness.',
      sketches: ['We explored over 60 directions. The mark went through countless variations — geometric, organic, monogram, wordmark. The signal emerged slowly.',
      'Early rounds were deliberately chaotic. We cast a wide net to find unexpected territory. Most directions were discarded. A few survived.',
      'The final direction came from an unlikely source: a napkin sketch of a circuit trace. The mark became an A and an abstract processor in one gesture.'],
      typography: { typefaces: ['Space Grotesk', 'Inter', 'JetBrains Mono'], description: 'Space Grotesk for headlines — technical but warm. Inter for interface and body. JetBrains Mono for code display. The combination bridges the gap between engineering and humanity.' },
      colors: [{ hex: '#0066FF', name: 'Signal', usage: 'Primary action, key highlights' },{ hex: '#0A0A0A', name: 'Core', usage: 'Text, primary UI' },{ hex: '#F5F5F5', name: 'Canvas', usage: 'Backgrounds, surfaces' },{ hex: '#737373', name: 'Muted', usage: 'Secondary text, captions' }],
      results: [{ value: '33%', label: 'Increase in brand recall within 6 months' },{ value: '92%', label: 'Positive sentiment in user testing' },{ value: '4.8×', label: 'ROI on brand investment in year one' }]
    }
  },
  {
    id: 'pulse', title: 'Pulse', client: 'Pulse Health', category: 'digital-product', year: '2025', size: 'tall',
    color: '#059669', seeds: { thumb: 10, gallery: [11, 12, 13, 14] },
    description: 'A reimagined health platform. UX strategy, interface design, and a comprehensive component library.',
    cs: {
      challenge: 'Pulse\'s platform had grown organically over five years. Features were stacked atop features. Patients found it confusing; clinicians found it slow. They needed a complete UX overhaul without disrupting existing users.',
      research: 'We shadowed 12 clinicians and interviewed 20 patients across three clinics in Kochi and Kozhikode. The friction points clustered around three areas: navigation complexity, data entry fatigue, and information hierarchy.',
      sketches: ['Mapping the full user journey revealed 47 distinct screens. We consolidated to 14. Each sketch round focused on reducing steps, not adding features.',
      'The navigation system went through 8 major revisions. The winning approach: context-aware menus that adapt to the user\'s role and task.',
      'Wireframes tested with real clinicians led to immediate improvements. The final information architecture reduced time-to-task by 60%.'],
      typography: { typefaces: ['Space Grotesk', 'Inter'], description: 'Inter was chosen for its exceptional legibility at small sizes — critical for dense clinical dashboards. Space Grotesk provides warmth in patient-facing headlines.' },
      colors: [{ hex: '#059669', name: 'Vital', usage: 'Success states, positive indicators' },{ hex: '#0A0A0A', name: 'Core', usage: 'Primary text' },{ hex: '#FFFFFF', name: 'White', usage: 'Backgrounds' },{ hex: '#DC2626', name: 'Alert', usage: 'Critical warnings, errors' }],
      results: [{ value: '60%', label: 'Reduction in task completion time' },{ value: '94%', label: 'Clinician satisfaction score' },{ value: '2.3×', label: 'Increase in patient portal engagement' }]
    }
  },
  {
    id: 'meridian', title: 'Meridian', client: 'Meridian Finance', category: 'art-direction', year: '2024', size: 'wide',
    color: '#1A1A2E', seeds: { thumb: 20, gallery: [21, 22, 23, 24] },
    description: 'Art direction for a fintech leader. Campaign visuals, photography direction, and brand expression.',
    cs: {
      challenge: 'Meridian was perceived as powerful but impersonal. Their visual language relied on stock imagery and generic gradients. They needed an art direction system that conveyed trust, sophistication, and human warmth.',
      research: 'We analyzed 40+ financial service brands and conducted perception studies across Meridian\'s key markets in South India. The insight: customers wanted a brand that felt both authoritative and approachable — a trusted advisor, not a faceless institution.',
      sketches: ['Our mood exploration spanned architectural photography, textile patterns, and mid-century information design. The thread: precision with soul.',
      'Initial directions ranged from overtly luxurious to starkly minimal. The winning territory existed in the middle — warm minimalism, where every element earns its place.',
      'The photography direction was the breakthrough: environmental portraits shot with natural light, desaturated tones with selective warmth. A visual language that felt both prestigious and genuine.'],
      typography: { typefaces: ['Space Grotesk', 'Inter', 'Playfair Display'], description: 'Space Grotesk for headlines. Playfair Display for editorial moments. Inter for data-heavy interfaces. The mix signals both tradition and modernity.' },
      colors: [{ hex: '#1A1A2E', name: 'Ink', usage: 'Primary backgrounds, deep surfaces' },{ hex: '#C9A96E', name: 'Brass', usage: 'Selective accent, editorial highlights' },{ hex: '#F5F5F0', name: 'Parchment', usage: 'Warm backgrounds' },{ hex: '#0A0A0A', name: 'Core', usage: 'Primary text' }],
      results: [{ value: '28%', label: 'Increase in brand trust perception' },{ value: '45%', label: 'Improvement in brand recall' },{ value: '3.1×', label: 'Engagement rate on campaign content' }]
    }
  },
  {
    id: 'solis', title: 'Solis', client: 'Solis Energy', category: 'brand-identity', year: '2024', size: 'standard',
    color: '#F59E0B', seeds: { thumb: 30, gallery: [31, 32, 33, 34] },
    description: 'Brand identity for a renewable energy startup. Positioning, visual language, and launch materials.',
    cs: {
      challenge: 'Solis entered a market saturated with green leaves and earth tones. Every competitor looked the same. Solis needed to stand out without losing the environmental connection.',
      research: 'We mapped the competitive landscape and identified a gap: no brand in renewable energy owned optimism and energy. Most leaned into seriousness. Solis could own joy.',
      sketches: ['The first round explored literal sun imagery. We pushed past cliché by abstracting light into geometric forms.',
      'The final mark: a radiating A-frame that suggests both solar panels and dawn. The gesture is upward, forward, optimistic.',
      'Color exploration was the hardest part. We tested 40+ yellows before finding the one that read as energetic but not aggressive. Warm without being hot.'],
      typography: { typefaces: ['Space Grotesk', 'Inter'], description: 'Space Grotesk captures the technical precision of solar engineering while remaining approachable. Inter keeps the body text clean and readable across applications.' },
      colors: [{ hex: '#F59E0B', name: 'Sol', usage: 'Primary brand color, energy' },{ hex: '#0A0A0A', name: 'Core', usage: 'Text, structure' },{ hex: '#F5F5F0', name: 'Warm White', usage: 'Backgrounds' },{ hex: '#059669', name: 'Terra', usage: 'Secondary accent, growth' }],
      results: [{ value: '87%', label: 'Brand differentiation score' },{ value: '2.5×', label: 'Social media engagement increase' }]
    }
  },
  {
    id: 'atlas', title: 'Atlas', client: 'Atlas Logistics', category: 'digital-product', year: '2024', size: 'tall',
    color: '#6366F1', seeds: { thumb: 40, gallery: [41, 42, 43, 44] },
    description: 'A logistics dashboard redesign. Complex data visualized with clarity. Enterprise-grade design system.',
    cs: {
      challenge: 'Atlas\'s operations dashboard was a wall of numbers. Dispatchers were missing critical events because the interface couldn\'t differentiate signal from noise.',
      research: 'We rode along with dispatchers across distribution centers in Wayanad, Malappuram, and Ernakulam. The average dispatcher switches between 7 different views to make a single decision. The goal: reduce that to 2.',
      sketches: ['We prototyped a unified timeline view that consolidates all tracking data into a single scrollable narrative. Early tests showed a 40% reduction in context-switching.',
      'The map interface went through 12 iterations. The winner: a hybrid of list and map that shows only what matters at each zoom level.',
      'Color coding became the organizing principle. Each event type received a distinct hue. Critical path items used high-saturation colors; background data receded into neutrals.'],
      typography: { typefaces: ['Inter', 'JetBrains Mono'], description: 'Inter optimized for dense data displays at 14px. JetBrains Mono for tabular data where alignment is critical. Both prioritize readability above all.' },
      colors: [{ hex: '#6366F1', name: 'Signal', usage: 'Interactive elements, primary actions' },{ hex: '#0A0A0A', name: 'Core', usage: 'Primary text' },{ hex: '#F5F5F5', name: 'Canvas', usage: 'Dashboard backgrounds' },{ hex: '#DC2626', name: 'Alert', usage: 'Critical events, delays' }],
      results: [{ value: '40%', label: 'Reduction in dispatcher context-switching' },{ value: '12 min', label: 'Average time saved per decision' },{ value: '96%', label: 'User satisfaction after redesign' }]
    }
  },
  {
    id: 'onda', title: 'Onda', client: 'Onda Audio', category: 'motion', year: '2024', size: 'wide',
    color: '#EC4899', seeds: { thumb: 50, gallery: [51, 52, 53, 54] },
    description: 'Motion identity for a premium audio brand. Sound-reactive visuals, launch film, and environmental motion.',
    cs: {
      challenge: 'Onda\'s audio technology was extraordinary — but their brand felt static. They needed a motion language that could communicate the physicality and emotion of sound.',
      research: 'We studied how sound visualization has been approached across science, art, and entertainment. The insight: the best sound visualizations don\'t explain sound — they evoke the feeling of hearing it.',
      sketches: ['We generated hundreds of waveform interpretations. The winning concept: particles that move like sound waves through physical space — visible vibration.',
      'The launch film script went through 9 revisions. Each cut shifted the balance between technical demonstration and emotional storytelling. The final version splits it 50/50.',
      'Environmental motion for retail spaces in Lulu Mall Kochi used projection mapping to create immersive audio-reactive walls. The technology was complex; the result felt simple and magical.'],
      typography: { typefaces: ['Space Grotesk', 'Inter'], description: 'Space Grotesk in motion — its geometric forms animate beautifully at large sizes. Inter for supporting text that needs to remain stable during motion.' },
      colors: [{ hex: '#EC4899', name: 'Pulse', usage: 'Primary motion color, energy' },{ hex: '#0A0A0A', name: 'Core', usage: 'Background, contrast' },{ hex: '#06B6D4', name: 'Wave', usage: 'Secondary motion accent' },{ hex: '#FFFFFF', name: 'White', usage: 'Text on dark backgrounds' }],
      results: [{ value: '4.2M', label: 'Launch film views in first week' },{ value: '18%', label: 'Increase in retail foot traffic' }]
    }
  },
  {
    id: 'verse', title: 'Verse', client: 'Verse Media', category: 'brand-identity', year: '2024', size: 'standard',
    color: '#8B5CF6', seeds: { thumb: 60, gallery: [61, 62, 63, 64] },
    description: 'A media brand built for the next generation of storytellers.',
    cs: {
      challenge: 'Verse was launching as a new media platform in a space dominated by giants. They needed a brand that felt established on day one — confident, distinct, and ready to challenge the status quo.',
      research: 'We studied how younger audiences discover and trust media brands. The key finding: authenticity is the threshold criterion. A brand that tries too hard to be cool is immediately rejected.',
      sketches: ['The logo mark went through 40+ iterations. Early versions were too literal (play buttons, quote marks). The final mark: an abstract portal — an invitation to step into another world.',
      'The color system was built around purple — a color that signals creativity and is virtually unused by competitors. It became an immediate differentiator.',
      'The typographic system uses extreme contrast: massive, light headlines paired with dense, readable body text. A visual metaphor for the range of content on the platform.'],
      typography: { typefaces: ['Space Grotesk', 'Inter'], description: 'Space Grotesk at display sizes creates the bold editorial voice. Inter provides the readability needed for long-form reading.' },
      colors: [{ hex: '#8B5CF6', name: 'Signal', usage: 'Primary brand color' },{ hex: '#0A0A0A', name: 'Core', usage: 'Text, headers' },{ hex: '#F5F5F5', name: 'Canvas', usage: 'Reading background' },{ hex: '#D4D4D8', name: 'Rule', usage: 'Dividers, subtle structure' }],
      results: [{ value: '2.1M', label: 'Waitlist signups before launch' },{ value: '94%', label: 'Brand favorability in launch survey' }]
    }
  },
  {
    id: 'nocturne', title: 'Nocturne', client: 'Nocturne Hospitality', category: 'digital-product', year: '2023', size: 'tall',
    color: '#0F172A', seeds: { thumb: 70, gallery: [71, 72, 73, 74] },
    description: 'A booking experience for a luxury hotel group. Service design, interface, and guest journey.',
    cs: {
      challenge: 'Nocturne\'s booking experience didn\'t match their hotels. The digital journey felt transactional while the physical experience was transcendent. The gap was costing them conversions.',
      research: 'We mapped the complete guest journey — from discovery to post-stay. The critical insight: booking is not a transaction; it is the beginning of the experience. Every interaction should build anticipation, not friction.',
      sketches: ['The room selection interface was reimagined as an exploration, not a filter. Guests browse by mood, not by category. Early prototypes tested with Nocturne\'s top-tier guests.',
      'Pricing was the biggest design challenge. Luxury guests don\'t lead with price, but hiding it erodes trust. The solution: price presented as context, not a barrier.',
      'The post-booking experience became a product of its own. A pre-arrival flow that builds excitement and captures preferences without feeling like homework.'],
      typography: { typefaces: ['Space Grotesk', 'Inter', 'Playfair Display'], description: 'Playfair Display for editorial moments that evoke printed travel magazines. Space Grotesk for navigation and structure. Inter for booking details and confirmations.' },
      colors: [{ hex: '#0F172A', name: 'Midnight', usage: 'Primary background, hero sections' },{ hex: '#C9A96E', name: 'Gold', usage: 'Accents, highlights, CTAs' },{ hex: '#F5F5F0', name: 'Warm White', usage: 'Content backgrounds' },{ hex: '#FFFFFF', name: 'White', usage: 'Text on dark' }],
      results: [{ value: '34%', label: 'Increase in booking conversion' },{ value: '22%', label: 'Increase in average booking value' },{ value: '8.9', label: 'Post-stay satisfaction score (out of 10)' }]
    }
  },
  {
    id: 'prism', title: 'Prism', client: 'Prism Studios', category: 'art-direction', year: '2023', size: 'tall',
    color: '#06B6D4', seeds: { thumb: 80, gallery: [81, 82, 83, 84] },
    description: 'Art direction and visual identity for a creative co-working space.',
    cs: {
      challenge: 'Prism was a new concept: a co-working space designed specifically for creative professionals. The brand needed to attract a discerning audience in a market saturated with generic coworking brands.',
      research: 'We interviewed 30+ creative professionals about their workspace needs. The recurring theme: they wanted a space that inspired without performing inspiration. Authenticity over aesthetics.',
      sketches: ['The identity system is built on light and refraction — a metaphor for how creative ideas emerge. The logo transforms across applications, never appearing the same way twice.',
      'Spatial design informed the brand direction. The architecture features a central light well that changes throughout the day. The brand captures this quality of changing light.',
      'Signage and wayfinding became a design system of their own. Each floor has a distinct color and typographic treatment tied to the creative disciplines housed there.'],
      typography: { typefaces: ['Space Grotesk', 'Inter'], description: 'Space Grotesk used expressively across the space — oversized, cropped, and layered. Inter for practical wayfinding and information.' },
      colors: [{ hex: '#06B6D4', name: 'Prism', usage: 'Primary brand color' },{ hex: '#0A0A0A', name: 'Core', usage: 'Text, structure' },{ hex: '#F5F5F5', name: 'Canvas', usage: 'Backgrounds' },{ hex: '#F59E0B', name: 'Warm', usage: 'Selective accent, energy' }],
      results: [{ value: '100%', label: 'Occupancy within 4 months of opening' },{ value: '4.7★', label: 'Average member satisfaction rating' }]
    }
  },
  {
    id: 'flux', title: 'Flux', client: 'Flux Robotics', category: 'motion', year: '2023', size: 'standard',
    color: '#DC2626', seeds: { thumb: 90, gallery: [91, 92, 93, 94] },
    description: 'Product launch film and motion system for an AI robotics company.',
    cs: {
      challenge: 'Flux had developed breakthrough robotics technology, but their product film looked like every other tech launch. They needed a visual narrative that communicated the humanity behind the machine.',
      research: 'We spent time in Flux\'s labs watching how engineers interact with the robots. The moments of wonder — a robot adjusting to a human\'s movement, a successful grasp — were more compelling than any spec sheet.',
      sketches: ['The film concept: show the robot learning. Not as a perfect machine, but as something becoming capable. The narrative arc follows a single task from failure to mastery.',
      'Motion studies explored how the robot\'s movements could be choreographed for the camera. Every motion in the film is real — recorded, not simulated.',
      'The sound design was as important as the visuals. We recorded the actual motors and actuators, then composed a score around those industrial sounds. The result is authentic and otherworldly.'],
      typography: { typefaces: ['Space Grotesk', 'JetBrains Mono'], description: 'Space Grotesk for the bold, confident headlines. JetBrains Mono for spec overlays and technical callouts — bridging the gap between storytelling and engineering.' },
      colors: [{ hex: '#DC2626', name: 'Flux', usage: 'Primary brand color, energy' },{ hex: '#0A0A0A', name: 'Core', usage: 'Backgrounds, contrast' },{ hex: '#FFFFFF', name: 'White', usage: 'Text, purity' },{ hex: '#737373', name: 'Muted', usage: 'Technical data, captions' }],
      results: [{ value: '3.8M', label: 'Launch film views in first 72 hours' },{ value: '250+', label: 'Press mentions across tech publications' }]
    }
  },
  {
    id: 'cascade', title: 'Cascade', client: 'Cascade Water', category: 'brand-identity', year: '2023', size: 'wide',
    color: '#0284C7', seeds: { thumb: 100, gallery: [101, 102, 103, 104] },
    description: 'Sustainable packaging and brand identity for a premium water brand.',
    cs: {
      challenge: 'Cascade entered one of the most crowded categories in consumer goods. Every shelf is a sea of blue bottles and mountain imagery. Cascade needed to stand out while communicating premium quality and environmental responsibility.',
      research: 'We studied the premium beverage market across key Indian urban hubs and coastal markets. The white space: no brand had successfully combined premium aesthetics with genuine sustainability credentials. Most used greenwashing; Cascade could use real proof.',
      sketches: ['The bottle form was designed first. We explored over 50 shapes before landing on a geometry that feels both architectural and organic — like a water droplet captured mid-fall.',
      'The label system uses minimal ink and maximum impact. A single typographic mark on clear glass. The product is the packaging; the packaging is the brand.',
      'Sustainability drove every decision. The bottle is 100% recycled aluminum. The ink is plant-based. The supply chain is carbon-neutral. We designed for the full lifecycle, not just the shelf.'],
      typography: { typefaces: ['Space Grotesk', 'Inter'], description: 'Space Grotesk for the wordmark — set in a custom weight between light and regular. Inter for ingredient and nutritional information where legibility at small sizes is critical.' },
      colors: [{ hex: '#0284C7', name: 'Spring', usage: 'Primary brand color' },{ hex: '#0A0A0A', name: 'Core', usage: 'Wordmark, key text' },{ hex: '#FFFFFF', name: 'White', usage: 'Background, cleanliness' },{ hex: '#E5E5E5', name: 'Silver', usage: 'Secondary packaging element' }],
      results: [{ value: '2.4×', label: 'Shelf standout versus competitors' },{ value: '15%', label: 'Market share within first 6 months' },{ value: '94%', label: 'Positive sustainability perception' }]
    }
  },
  {
    id: 'helix', title: 'Helix', client: 'Helix Biotech', category: 'digital-product', year: '2023', size: 'standard',
    color: '#16A34A', seeds: { thumb: 110, gallery: [111, 112, 113, 114] },
    description: 'A clinical trial management platform. Complex workflows made intuitive.',
    cs: {
      challenge: 'Clinical trial software is notoriously difficult to use. Helix wanted to break the pattern — building a platform that researchers actually enjoy using, without compromising on regulatory compliance.',
      research: 'We observed clinical research coordinators across 5 medical centers in Kerala and South India. The average coordinator uses 6 different systems to manage a single trial. The friction is not in any one system — it is in the gaps between them.',
      sketches: ['The central insight: trial management is a project management problem, not a data entry problem. We redesigned the workflow around milestones and decisions, not forms and fields.',
      'The compliance engine runs in the background. Researchers don\'t think about regulations — the system ensures compliance automatically. This inversion was the breakthrough.',
      'The dashboard went through 15 iterations. The final version shows one thing: what needs attention right now. Everything else is one click away, not one screen away.'],
      typography: { typefaces: ['Inter', 'JetBrains Mono'], description: 'Inter for the entire interface — every screen, every label, every data point. JetBrains Mono for protocol IDs and data tables where character-level precision matters.' },
      colors: [{ hex: '#16A34A', name: 'Active', usage: 'Primary actions, success states' },{ hex: '#0A0A0A', name: 'Core', usage: 'Primary text' },{ hex: '#FFFFFF', name: 'White', usage: 'Backgrounds, clarity' },{ hex: '#DC2626', name: 'Alert', usage: 'Protocol deviations, warnings' }],
      results: [{ value: '45%', label: 'Reduction in trial setup time' },{ value: '3.2×', label: 'Increase in researcher satisfaction' },{ value: '100%', label: 'Regulatory compliance maintained' }]
    }
  }
];

const categories = [
  { id: 'all', label: 'All Work' }, { id: 'brand-identity', label: 'Brand Identity' },
  { id: 'digital-product', label: 'Digital Product' }, { id: 'art-direction', label: 'Art Direction' }, { id: 'motion', label: 'Motion' }
];

function getSizeAspect(size) {
  switch (size) {
    case 'featured': return { css: 'aspect-[16/9]', w: 800, h: 450 };
    case 'wide':     return { css: 'aspect-[2/1]',  w: 800, h: 400 };
    case 'tall':     return { css: 'aspect-[3/4]',  w: 600, h: 800 };
    default:         return { css: 'aspect-[4/3]',  w: 600, h: 450 };
  }
}

function filterProjects(category, search, page, perPage) {
  let filtered = [...projects];
  if (category && category !== 'all') filtered = filtered.filter(p => p.category === category);
  if (search && search.trim()) {
    const q = search.toLowerCase().trim();
    filtered = filtered.filter(p => p.title.toLowerCase().includes(q) || p.client.toLowerCase().includes(q) || p.description.toLowerCase().includes(q));
  }
  const total = filtered.length;
  const totalPages = Math.ceil(total / perPage);
  const currentPage = Math.max(1, Math.min(page, totalPages || 1));
  const start = (currentPage - 1) * perPage;
  return { items: filtered.slice(start, start + perPage), total, totalPages, currentPage };
}

function getProject(id) {
  return projects.find(p => p.id === id) || null;
}

function getAdjacentProjects(id) {
  const idx = projects.findIndex(p => p.id === id);
  if (idx === -1) return { prev: null, next: null };
  return {
    prev: idx > 0 ? projects[idx - 1] : projects[projects.length - 1],
    next: idx < projects.length - 1 ? projects[idx + 1] : projects[0]
  };
}

function getRelatedProjects(id, category, count) {
  return projects.filter(p => p.id !== id && p.category === category).slice(0, count || 3);
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { projects, categories, filterProjects, getSizeAspect, getProject, getAdjacentProjects, getRelatedProjects };
}
