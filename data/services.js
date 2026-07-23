const services = [
  {
    id: 'brand-strategy',
    title: 'Brand Strategy',
    tagline: 'The foundation everything else is built on.',
    icon: `<svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="20" cy="8" r="4" stroke="currentColor" stroke-width="1.5"/>
      <circle cx="8" cy="30" r="4" stroke="currentColor" stroke-width="1.5"/>
      <circle cx="32" cy="30" r="4" stroke="currentColor" stroke-width="1.5"/>
      <line x1="18" y1="11.5" x2="10" y2="26.5" stroke="currentColor" stroke-width="1.5"/>
      <line x1="22" y1="11.5" x2="30" y2="26.5" stroke="currentColor" stroke-width="1.5"/>
      <line x1="12" y1="30" x2="28" y2="30" stroke="currentColor" stroke-width="1.5" stroke-dasharray="2 2"/>
    </svg>`,
    overview: 'We define who you are, why you exist, and how you show up. Positioning, naming, messaging architecture — the foundation everything else is built on. A strategy that does not inspire action is not a strategy. We build the kind that makes people move.',
    process: [
      { phase: 'Discover', description: 'Deep immersion into your category, competition, and customer. Stakeholder interviews, market analysis, and cultural audit. We learn everything before we recommend anything.' },
      { phase: 'Define', description: 'Synthesis reveals the strategic territory. Brand platform, positioning statement, messaging hierarchy, narrative architecture. A clear north star that guides every creative decision.' },
      { phase: 'Design', description: 'The strategy comes to life. Multiple creative directions explored, tested, and refined against the strategic framework. We arrive at the solution that feels inevitable.' },
      { phase: 'Deploy', description: 'Comprehensive brand guidelines, messaging playbook, launch strategy. Your team leaves with a system they can use, not a document they shelve.' }
    ],
    deliverables: [
      'Brand platform & positioning',
      'Messaging architecture',
      'Naming exploration (3–5 directions)',
      'Stakeholder workshop facilitation',
      'Competitive landscape analysis',
      'Audience segmentation & personas',
      'Brand narrative & voice guidelines',
      'Launch strategy & rollout plan'
    ],
    timeline: '8–12 weeks',
    pricing: '₹35,000',
    faq: [
      { q: 'What does a brand strategy engagement include?', a: 'A full brand strategy covers discovery, positioning, messaging, and narrative architecture. You receive a strategic platform that serves as the foundation for all creative work. Most engagements include stakeholder workshops, competitive analysis, audience definition, and a comprehensive messaging playbook.' },
      { q: 'Can we do strategy without committing to design?', a: 'Yes. Many clients begin with strategy alone. We define the foundation, and when you are ready to design against it, the transition is seamless. The strategy phase stands on its own as a deliverable.' },
      { q: 'How do you handle stakeholder alignment?', a: 'We facilitate structured workshops designed to surface divergence and build consensus. Our process ensures that conflicting viewpoints are addressed before creative work begins — saving time, money, and frustration.' }
    ]
  },
  {
    id: 'visual-identity',
    title: 'Visual Identity',
    tagline: 'A visual language that makes your strategy tangible.',
    icon: `<svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="4" y="4" width="14" height="14" rx="2" stroke="currentColor" stroke-width="1.5"/>
      <rect x="22" y="4" width="14" height="14" rx="2" stroke="currentColor" stroke-width="1.5"/>
      <rect x="4" y="22" width="14" height="14" rx="2" stroke="currentColor" stroke-width="1.5"/>
      <rect x="22" y="22" width="14" height="14" rx="2" stroke="currentColor" stroke-width="1.5"/>
      <circle cx="11" cy="11" r="2" fill="currentColor" opacity="0.4"/>
      <circle cx="29" cy="11" r="2" fill="currentColor" opacity="0.4"/>
      <circle cx="11" cy="29" r="2" fill="currentColor" opacity="0.4"/>
      <circle cx="29" cy="29" r="2" fill="currentColor" opacity="0.4"/>
    </svg>`,
    overview: 'We craft the visual language that makes your strategy tangible. Logo, color, typography, art direction. Every surface, considered. The goal is not a logo — it is a visual system that works across every medium, every scale, every context your brand will ever inhabit.',
    process: [
      { phase: 'Explore', description: 'Broad creative exploration across multiple directions. Mood boards, reference landscapes, visual territories. We cast a wide net to find unexpected territory.' },
      { phase: 'Refine', description: 'The strongest directions are developed in detail. Logo concepts, color studies, typographic systems. Rigorous critique reduces the field to the undeniable choice.' },
      { phase: 'Apply', description: 'The identity is tested across real-world applications. Stationery, digital, environmental, motion. Design does not exist in a vacuum — we prove it works everywhere.' },
      { phase: 'Deliver', description: 'Comprehensive brand guidelines, asset library, source files. Color specifications, typographic rules, usage guidelines. A system your team can implement with confidence.' }
    ],
    deliverables: [
      'Logo system (primary, secondary, icon)',
      'Color palette (primary, secondary, extended)',
      'Typography system (display, body, UI)',
      'Art direction & photography guidelines',
      'Brand guidelines document',
      'Application mockups (digital + print)',
      'Iconography system',
      'Pattern & texture library'
    ],
    timeline: '10–14 weeks',
    pricing: '₹45,000',
    faq: [
      { q: 'What is included in the logo system?', a: 'You receive a primary logo, secondary variations (horizontal, icon-only, wordmark), clear space rules, minimum size specifications, and incorrect usage examples. Every format is delivered in vector and raster formats for every application.' },
      { q: 'Can we use the brand guidelines with external agencies?', a: 'Absolutely. The guidelines are designed to be implementation-ready for any team — internal or external. We include specification files in industry-standard formats and provide a handoff session to walk your team through the system.' },
      { q: 'What if we need additional applications after delivery?', a: 'We remain available for ongoing application work. Many clients extend the engagement to cover specific needs — packaging, environmental graphics, presentation templates, or digital interfaces.' }
    ]
  },
  {
    id: 'digital-design',
    title: 'Digital Design',
    tagline: 'Digital environments where your brand lives and works.',
    icon: `<svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="4" y="8" width="32" height="24" rx="3" stroke="currentColor" stroke-width="1.5"/>
      <line x1="4" y1="16" x2="36" y2="16" stroke="currentColor" stroke-width="1.5"/>
      <circle cx="9" cy="12" r="1" fill="currentColor"/>
      <circle cx="13" cy="12" r="1" fill="currentColor"/>
      <circle cx="17" cy="12" r="1" fill="currentColor"/>
      <rect x="12" y="20" width="16" height="2" rx="1" fill="currentColor" opacity="0.3"/>
      <rect x="12" y="24" width="12" height="2" rx="1" fill="currentColor" opacity="0.2"/>
      <rect x="12" y="28" width="14" height="2" rx="1" fill="currentColor" opacity="0.15"/>
    </svg>`,
    overview: 'We design the digital environments where your brand lives. Websites, product interfaces, design systems — built to be used, built to last. Every interaction is an extension of your brand. Every screen is an opportunity to build trust.',
    process: [
      { phase: 'Research', description: 'User research, analytics audit, competitive benchmarking. We understand how people interact with your digital presence before we propose changes.' },
      { phase: 'Structure', description: 'Information architecture, user flows, wireframes. The structure is designed before the surfaces. We build clarity from the inside out.' },
      { phase: 'Design', description: 'High-fidelity interface design across breakpoints. Every state, every interaction, every edge case. The design system emerges from the patterns we discover.' },
      { phase: 'Deliver', description: 'Design system documentation, component library, developer handoff. Production-ready assets with clear specifications for engineering implementation.' }
    ],
    deliverables: [
      'UX strategy & information architecture',
      'Wireframes & user flows',
      'High-fidelity UI design (all breakpoints)',
      'Interactive prototype',
      'Design system & component library',
      'Developer handoff documentation',
      'Accessibility audit & compliance report',
      'Performance optimization recommendations'
    ],
    timeline: '10–16 weeks',
    pricing: '₹55,000',
    faq: [
      { q: 'Do you build the website or just design it?', a: 'We design and can deliver production-ready front-end code (HTML, CSS, JavaScript). For complex back-end development, we collaborate with your engineering team or recommend trusted technical partners.' },
      { q: 'What is a design system and do we need one?', a: 'A design system is a library of reusable components and patterns that ensures visual and functional consistency across your digital products. If you have more than one screen or plan to scale, you need one. It saves time, reduces technical debt, and creates a cohesive user experience.' },
      { q: 'How do you handle mobile and responsive design?', a: 'Every design is created mobile-first and extended to tablet and desktop breakpoints. We design for the full range of devices your users actually use — not just the most common ones.' }
    ]
  },
  {
    id: 'motion-interaction',
    title: 'Motion & Interaction',
    tagline: 'Dimension, personality, and purpose in every movement.',
    icon: `<svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="20" cy="20" r="12" stroke="currentColor" stroke-width="1.5"/>
      <circle cx="20" cy="20" r="6" stroke="currentColor" stroke-width="1.5" stroke-dasharray="4 4"/>
      <circle cx="20" cy="20" r="2" fill="currentColor" opacity="0.4"/>
      <path d="M20 8V4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
      <path d="M20 36V32" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
      <path d="M32 20L36 20" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
      <path d="M4 20L8 20" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
    </svg>`,
    overview: 'We give your brand dimension. Motion studies, micro-interactions, video, environmental animation. Purposeful, never ornamental. Every movement communicates intent. Every transition tells the user what to expect.',
    process: [
      { phase: 'Concept', description: 'Motion reference, narrative development, storyboarding. We define the emotional and functional role of motion in your brand experience.' },
      { phase: 'Design', description: 'Frame-by-frame motion studies, timing explorations, easing curves. Each movement is crafted frame by frame to feel inevitable, not arbitrary.' },
      { phase: 'Prototype', description: 'Interactive prototypes, micro-interaction demos, environmental previews. Motion is tested in context to ensure it serves its purpose.' },
      { phase: 'Deliver', description: 'Production-ready motion files, Lottie JSON, video assets, implementation guidelines. Every asset is documented for seamless handoff.' }
    ],
    deliverables: [
      'Motion identity & design principles',
      'Brand film or product launch video',
      'Micro-interaction library',
      'Lottie animation files',
      'Environmental motion concepts',
      'Transition & loading systems',
      'Storyboards & animatics',
      'Implementation documentation'
    ],
    timeline: '6–10 weeks',
    pricing: '₹25,000',
    faq: [
      { q: 'How do you ensure motion performs well on different devices?', a: 'We design motion with performance as a constraint from the start. Animations use GPU-accelerated properties (transform, opacity) and respect reduced-motion preferences. We test across device classes to ensure smooth performance.' },
      { q: 'Can motion be added to an existing brand?', a: 'Yes. We can develop a motion identity that extends an existing brand system. We audit your current visual language and define motion principles that feel like a natural extension of what already exists.' },
      { q: 'What is a motion identity?', a: 'A motion identity is the set of animation principles, timing specifications, and transition patterns that define how your brand moves. Just as a visual identity defines how your brand looks, a motion identity defines how it behaves.' }
    ]
  },
  {
    id: 'brand-guidance',
    title: 'Brand Guidance',
    tagline: 'The systems that keep your brand consistent as it grows.',
    icon: `<svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M8 28L20 10L32 28H8Z" stroke="currentColor" stroke-width="1.5"/>
      <line x1="14" y1="22" x2="26" y2="22" stroke="currentColor" stroke-width="1.5" stroke-dasharray="2 2"/>
      <line x1="20" y1="10" x2="20" y2="28" stroke="currentColor" stroke-width="1.5" stroke-dasharray="2 2" opacity="0.3"/>
    </svg>`,
    overview: 'We build the systems that keep your brand consistent as it grows. Guidelines, templates, asset libraries, launch support. A brand without guidance is not a brand — it is a collection of assets. We build the systems that turn assets into identity.',
    process: [
      { phase: 'Audit', description: 'Existing brand assets, current usage, team workflows. We identify gaps, inconsistencies, and opportunities before building the system.' },
      { phase: 'Architect', description: 'System structure, template design, governance framework. The guidelines are designed to be used, not admired. Practical, accessible, clear.' },
      { phase: 'Build', description: 'Asset library, template files, digital guidelines platform. Every asset is organized, named, and version-controlled. Your team finds what they need in seconds.' },
      { phase: 'Launch', description: 'Team training, implementation support, handoff session. We do not drop off a document and disappear. We ensure your team can use the system effectively.' }
    ],
    deliverables: [
      'Comprehensive brand guidelines',
      'Template library (presentations, docs, social)',
      'Digital asset management system',
      'Brand governance framework',
      'Team training & enablement session',
      'Launch collateral package',
      'Implementation checklist & timeline',
      'Ongoing support & maintenance plan'
    ],
    timeline: '6–10 weeks',
    pricing: '₹25,000',
    faq: [
      { q: 'What makes your guidelines different from a standard PDF?', a: 'Our guidelines are designed to be used, not archived. They are structured for quick reference, written in plain language, and delivered in both digital and printed formats. We also offer a digital guidelines platform that your team can search, browse, and apply in real time.' },
      { q: 'Can you help us enforce brand consistency across multiple teams?', a: 'Yes. We build governance frameworks that scale with your organization. This includes approval workflows, usage tiers, exception processes, and regular brand health checks. Consistency is a system, not a rulebook.' },
      { q: 'What happens when our brand evolves?', a: 'The guidelines are designed to accommodate evolution. We include version control, change management processes, and ongoing support options. When your brand grows, the guidelines grow with it.' }
    ]
  }
];

module.exports = { services };
