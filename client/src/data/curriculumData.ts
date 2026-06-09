export interface Subject {
  name: string;
  description: string;
  credits?: number;
}

export interface SemesterDetails {
  semester: string;
  subjects: Subject[];
}

export interface YearStructure {
  year: string;
  title: string;
  summary: string;
  semesters: SemesterDetails[];
}

export const bremStructure: YearStructure[] = [
  {
    year: "Academic Year 1",
    title: "Real Estate Core & Basics",
    summary: "Build structural, mathematical, and spatial drafting foundations alongside legal compliance basics.",
    semesters: [
      {
        semester: "Semester 1",
        subjects: [
          { name: "Fundamentals of Real Estate", description: "Evolution of real estate, micro-markets, categorization of property assets, and role of promoters/investors.", credits: 4 },
          { name: "Land Microeconomics", description: "Analyzing supply and demand equations of urban land, density coefficients, and spatial rent-equilibrium theories.", credits: 3 },
          { name: "Introduction to Spatial Architecture", description: "Aesthetic principles, basic drafting standards, mapping scales, and spatial orientation for residential builds.", credits: 4 },
          { name: "Business & Corporate Communication", description: "Technical presentation skills, broker outreach messaging, pitch decks structure, and legal letter writing.", credits: 3 }
        ]
      },
      {
        semester: "Semester 2",
        subjects: [
          { name: "Principles of Civil Engineering", description: "Soil mechanics, concrete grades, structural safety parameters, layout plans reading, and construction materials.", credits: 4 },
          { name: "Valuation Mathematics", description: "Time value of money (TVM), compounding, discounting, annuity formulas, and future yield calculations.", credits: 4 },
          { name: "General Property & Land Law", description: "Introduction to the Transfer of Property Act, registry protocols, contract act parameters, and Indian land registry history.", credits: 3 },
          { name: "RERA & Legal Regulatory Structures", description: "Detailed guide to the Real Estate Regulatory Authority compliance, promoter duties, escrow rules, and buyer protection laws.", credits: 3 }
        ]
      }
    ]
  },
  {
    year: "Academic Year 2",
    title: "Asset Analytics & Capital Stacking",
    summary: "Master discounted cash flow models, commercial underwriting, corporate tax, and spatial GIS mapping.",
    semesters: [
      {
        semester: "Semester 3",
        subjects: [
          { name: "Discounted Cash Flow Modeling (DCF)", description: "Building institutional-grade cashflow models in Excel, calculating NPV, IRR, and sensitivity analysis.", credits: 4 },
          { name: "Geographic Information Systems (GIS)", description: "Evaluating urban demographic densities, transit pipelines, and location intelligence using spatial layers.", credits: 4 },
          { name: "Corporate Financial Accounting", description: "Ledgers, balance sheets, capital depreciation formulas, and operating income calculation rules.", credits: 3 },
          { name: "Residential Feasibility Models", description: "Underwriting land purchase costs, estimating construction schedules, and pricing marketing channels.", credits: 3 }
        ]
      },
      {
        semester: "Semester 4",
        subjects: [
          { name: "Commercial & Retail Leasing", description: "Master lease templates, triple-net (NNN) leases, indexation equations, tenant layout margins, and anchor-tenant negotiations.", credits: 4 },
          { name: "Joint-Venture (JV) Agreements", description: "Structuring equity splits, waterfall distribution schemes, clawback provisions, and exit timetables.", credits: 4 },
          { name: "Indirect Taxes & GST in Real Estate", description: "GST compliance for developers, input tax credits, local property registers, and stamp duty parameters.", credits: 3 },
          { name: "Demographics & Transit Feasibility", description: "Evaluating transit-oriented development (TOD), infrastructure pipelines, and traffic metrics.", credits: 3 }
        ]
      }
    ]
  },
  {
    year: "Academic Year 3",
    title: "Operations & Digital Distribution",
    summary: "Understand development operations, facilities management, REIT rules, and programmatic broker mechanics.",
    semesters: [
      {
        semester: "Semester 5",
        subjects: [
          { name: "Construction Project Management", description: "WBS, Gantt timelines, critical path method (CPM), supply chain management, and budget tracking.", credits: 4 },
          { name: "Facilities & Asset Management", description: "HVAC systems, energy footprints, preventative maintenance rosters, tenant relation portals, and operating efficiency.", credits: 3 },
          { name: "Housing Finance & Mortgage Markets", description: "Loan-to-value (LTV) limits, mortgage backed securities, bank lending mandates, and debt service coverage ratios.", credits: 4 },
          { name: "Broker Networks & Funnel Sales", description: "Managing third-party channel partners, sales incentives, lead conversion systems, and customer CRM systems.", credits: 3 }
        ]
      },
      {
        semester: "Semester 6",
        subjects: [
          { name: "REIT Regulations & Public Listings", description: "SEBI REIT parameters, compliance checklists, yield distribution structures, and independent valuation rules.", credits: 4 },
          { name: "Sustainability & LEED Green Standards", description: "Carbon credits, low-water builds, IGBC rules, solar grid alignments, and smart micro-grids.", credits: 3 },
          { name: "Real Estate Private Equity (REPE)", description: "Raising institutional funds, dealing with global capital funds, hurdle rates, and secondary sales.", credits: 4 },
          { name: "Land Sourcing & Zoning Strategy", description: "Interpreting developmental masterplans, floor space index (FSI) conversion rights, and environmental permits.", credits: 3 }
        ]
      }
    ]
  },
  {
    year: "Academic Year 4",
    title: "Full-Year Corporate Integration",
    summary: "Gain real desktop experience inside elite developer portfolios and complete your final capstone portfolio.",
    semesters: [
      {
        semester: "Semester 7",
        subjects: [
          { name: "Active On-Desk Developer Internship", description: "Full-time placement within leading corporate real estate or finance desks. Hands-on capital operations under director guidance.", credits: 12 },
          { name: "Weekly Executive Advisory Seminars", description: "Case analysis meetings, reviewing current deal terms, and evaluating real macro-trends with visiting mentors.", credits: 4 }
        ]
      },
      {
        semester: "Semester 8",
        subjects: [
          { name: "Co-Op Capstone Deal Book", description: "Developing a fully modeled development thesis — from zoning checks to financial IRR waterfalls. Present to active developers.", credits: 8 },
          { name: "Property Portfolio Management", description: "Risk hedging, multi-asset allocation, international investments, and secondary sale strategies.", credits: 4 },
          { name: "Ethics & Dispute Resolution", description: "Standard conciliation steps, handling arbitration, land disputes history, and professional standards.", credits: 4 }
        ]
      }
    ]
  }
];

export const bcaStructure: YearStructure[] = [
  {
    year: "Academic Year 1",
    title: "CS Core & Web Fundamentals",
    summary: "Establish strong foundations in programming logic, modern declarative HTML/CSS, and relational database design.",
    semesters: [
      {
        semester: "Semester 1",
        subjects: [
          { name: "Introduction to Python Programming", description: "Data variables, computational loops, functions, script writing, and scraping fundamentals.", credits: 4 },
          { name: "Web Crafting: HTML & CSS Grid", description: "Semantic markups, responsive CSS layout, Tailwind CSS utility classes, and viewport-safe design.", credits: 4 },
          { name: "Discrete Mathematical Foundations", description: "Logic systems, set expressions, recursion relations, graph pathways, and index logic.", credits: 3 },
          { name: "Computer Architecture & Operating Systems", description: "CPU logic levels, register offsets, process structures, memory paging, and bash terminal skills.", credits: 3 }
        ]
      },
      {
        semester: "Semester 2",
        subjects: [
          { name: "Object Oriented JS & TypeScript", description: "Data scopes, prototype chains, compile-time type-safety, interface patterns, and modular JS imports.", credits: 4 },
          { name: "Relational Database Management (SQL)", description: "PostgreSQL databases, spatial triggers, geometry columns (GIS metadata), and index optimization queries.", credits: 4 },
          { name: "Data Structures & Index Algorithms", description: "Stacks, balance trees, hashing lookup maps, spatial query algorithms, and time complexity checks.", credits: 4 },
          { name: "Visual Wireframing & Figma Prototypes", description: "UI layout, responsive grids, interactive client testing, and UI/UX design rules.", credits: 2 }
        ]
      }
    ]
  },
  {
    year: "Academic Year 2",
    title: "React Infrastructures & Spatial Map APIs",
    summary: "Build high-end interactive map interfaces, cloud servers, and robust API endpoints.",
    semesters: [
      {
        semester: "Semester 3",
        subjects: [
          { name: "React App Development", description: "Virtual DOM, state rendering pipelines, native hooks (useState, useEffect), and responsive UI layouts.", credits: 4 },
          { name: "Server Architectures: Node.js & Express", description: "REST API routes, custom middlewares, file parsing, user JWT keys, and web framework routing.", credits: 4 },
          { name: "Mapbox & Google Maps API Integration", description: "Rendering coordinates markers, vector map layers, geo-fencing overlays, and real-time transit updates.", credits: 4 },
          { name: "Software Pipelines using Git", description: "Branching protocols, continuous integration, actions automation, and code standards.", credits: 2 }
        ]
      },
      {
        semester: "Semester 4",
        subjects: [
          { name: "Data Scrapers & Web Automation", description: "Dynamic crawling, automated listings updates, data cleaning, and RSS notifications systems.", credits: 4 },
          { name: "Docker Containers & Cloud Deployment", description: "SaaS packaging, Dockerfile rules, cloud host scaling, environment keys setup, and proxy systems.", credits: 3 },
          { name: "NoSQL Database Architectures", description: "MongoDB, distributed key-value caches (Redis), session stores, and real-time sync systems.", credits: 3 },
          { name: "Mobile Responsive App Design", description: "Mobile-first CSS, touch targets (44px), physical gestures support, and offline local caching.", credits: 4 }
        ]
      }
    ]
  },
  {
    year: "Academic Year 3",
    title: "Applied AI Engines & Team Capstone",
    summary: "Deploy smart machine learning estimators, integrate LLMs, and launch your real-use SaaS product.",
    semesters: [
      {
        semester: "Semester 5",
        subjects: [
          { name: "Generative AI & LLM Systems", description: "Integrating Google Gemini API, designing semantic search, creating prompt guidelines, and AI agents.", credits: 4 },
          { name: "AVM Machine Learning Classifiers", description: "Regregressive models for price valuations, gradient boost engines, and feature tuning for real-world metrics.", credits: 4 },
          { name: "Data Visualization with Recharts & D3", description: "Dynamic dashboards, interactive charts, metric trends, and spatial data rendering.", credits: 4 },
          { name: "Systems Security & API Protection", description: "Securing against SQL injections, CORS, CSRF, rate-limiters, and encrypted credentials.", credits: 2 }
        ]
      },
      {
        semester: "Semester 6",
        subjects: [
          { name: "Production MVP Design & Launch", description: "Complete group-sprint building a real, modular PropTech software. Secure, deployed on Live Cloud, and presented to VC mentors.", credits: 8 },
          { name: "User Funnel Analytics & Conversion", description: "Product instrumentation, tracking click events, Cohort charts, and optimizing signup funnels.", credits: 3 },
          { name: "Innovative Entrepreneurship Seminar", description: "SaaS licensing, cost of acquisition calculators, pitch materials, and cloud cost management.", credits: 3 }
        ]
      }
    ]
  }
];

export const mcaStructure: YearStructure[] = [
  {
    year: "Academic Year 1",
    title: "Advanced Cloud Architectures & Spatial AI",
    summary: "Command enterprise-grade distributed systems, PostgreSQL GIS geofencing, and advanced machine learning modeling.",
    semesters: [
      {
        semester: "Semester 1",
        subjects: [
          { name: "Enterprise Microservices with Node.js", description: "Decoupled servers, cluster configurations, load balancers, and resilient API design.", credits: 4 },
          { name: "Advanced GIS Databases (PostGIS)", description: "Indexing spatial datasets, writing geography queries, calculation of overlapping polygons, and heatmaps.", credits: 4 },
          { name: "System Message Brokers (Kafka / Redis)", description: "Asynchronous queues, publish-subscribe brokers, low-latency state changes, and websockets.", credits: 4 },
          { name: "Development Tools and Orchestration", description: "Dockerizing environments, Kubernetes clusters, continuous integration, and secure IAM rules.", credits: 2 }
        ]
      },
      {
        semester: "Semester 2",
        subjects: [
          { name: "AI Property Valuations (Neural Networks)", description: "Training multilayer perceptrons, tuning hyper-parameters, and evaluating model variations using Scikit-Learn.", credits: 4 },
          { name: "Computer Vision & Visual Surveying", description: "Parsing property images for material damage detection, roof quality analysis, and automatic category mapping.", credits: 4 },
          { name: "Programmatic Scraping at Scale", description: "Bypassing scraping locks, proxy rotation servers, data deduplication, and automated updates.", credits: 3 },
          { name: "Digital Twins & 3D Spatial Engines", description: "WebGL rendering of property layouts, mapping 3D structures, and handling CAD files in browser.", credits: 3 }
        ]
      }
    ]
  },
  {
    year: "Academic Year 2",
    title: "SaaS Architectures & Venture Deployment",
    summary: "Architect secure multi-tenant software, integrate decentralized ledgers, and defend before private equity boards.",
    semesters: [
      {
        semester: "Semester 3",
        subjects: [
          { name: "Smart Contracts & Land Ledgers", description: "Decentralized database systems, fractional token schemes, ownership records stability, and web3 connectors.", credits: 4 },
          { name: "Multi-Agent AI Workflows", description: "Autonomous agents, agent-to-agent negotiations, automated CRM alerts, and dynamic content generators.", credits: 4 },
          { name: "High-Frequency Pricing Pipelines", description: "Optimizing database search index, caching hot portfolios in Redis, and minimizing transit lag.", credits: 4 },
          { name: "Cloud Financial Operations (FinOps)", description: "Budget optimization, server efficiency audits, minimizing egress charges, and autoscaling design.", credits: 2 }
        ]
      },
      {
        semester: "Semester 4",
        subjects: [
          { name: "Venture Production Capstone", description: "Intensive 6-month product buildout. Test for stability under 500+ requests/sec, and configure automated alert triggers.", credits: 10 },
          { name: "Comprehensive System Compliance Audit", description: "Data security protocols, Indian data storage guidelines, cyber risk tests, and automated error tracking.", credits: 4 }
        ]
      }
    ]
  }
];

export const mbaStructure: YearStructure[] = [
  {
    year: "Academic Year 1",
    title: "Corporate Real Estate Finance & Underwriting",
    summary: "Establish rigorous financial competencies in Excel valuations, JV structuring, and legal land protections.",
    semesters: [
      {
        semester: "Semester 1",
        subjects: [
          { name: "Real Estate Markets Microeconomics", description: "Land scarcity math, demand equations, transition indicators, and evaluating local competition.", credits: 4 },
          { name: "Financial Accounting & Valuation Models", description: "Building Excel cashflow sheets, calculating capitalization ratios, and projecting operations revenues.", credits: 4 },
          { name: "Statutory Law & RERA Compliance", description: "Comprehensive analysis of land titles, registration requirements, consumer rights, and escrow regulations.", credits: 3 },
          { name: "Managerial Methods & Analysis", description: "Probability mapping, ROI distributions, variance metrics, and modeling market shifts.", credits: 3 }
        ]
      },
      {
        semester: "Semester 2",
        subjects: [
          { name: "Debt Financing & Capital Stacking", description: "Mezzanine debt systems, structuring senior bank loans, calculating debt service coverage (DSCR).", credits: 4 },
          { name: "Corporate Underwriting Procedures", description: "Tenant risk assessments, pricing leases, calculating lease rollover costs, and indexing formulas.", credits: 4 },
          { name: "Project Feasibility Modeling", description: "Analyzing material cost trends, municipal developer fees, FSI rights, and delivery models.", credits: 4 },
          { name: "Real Estate Broker Network Systems", description: "Commission guidelines, channel outreach structures, conversion trackers, and lead scoring.", credits: 2 }
        ]
      }
    ]
  },
  {
    year: "Academic Year 2",
    title: "Capital Markets & REIT Listings",
    summary: "Formulate public listings strategy, raise institutional private equity, and defend your investment book.",
    semesters: [
      {
        semester: "Semester 3",
        subjects: [
          { name: "Trust Structure & REIT Management", description: "Structuring SEBI-compliant public listings, yield distribution formulas, and regulatory audits.", credits: 4 },
          { name: "Private Equity Joint-Ventures", description: "Pitching global REPE funds, water distribution schedules, clawbacks, and exit parameters.", credits: 4 },
          { name: "Zoning Reforms & Transit Developments", description: "Capitalizing on transit corridors, smart cities plans, and municipal FSI adjustments.", credits: 4 },
          { name: "Urban Real Estate Taxation", description: "GST implementations, income tax optimization, and long-term capital gains exemptions.", credits: 2 }
        ]
      },
      {
        semester: "Semester 4",
        subjects: [
          { name: "Advisory Book Boardroom Presentation", description: "Complete analysis of a developer investment proposal, presenting it to real-world developer advisory directors.", credits: 8 },
          { name: "Property Risk Hedging Models", description: "Hedging material cost changes, interest rate swaps, and urban transition indicators.", credits: 4 },
          { name: "Professional Standards & Land Ethics", description: "International ethics standards, resolving land registration conflicts constructively, and mediation.", credits: 4 }
        ]
      }
    ]
  }
];
