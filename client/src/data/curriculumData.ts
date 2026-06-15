// Re-structured curriculum data to support BBA (Undergraduate) and MBA (Postgraduate) with exact subject guidelines
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

export const bbaStructure: YearStructure[] = [
  {
    year: "Academic Year 1",
    title: "Foundation, Basics & Organizational Dynamics",
    summary: "Establish strong foundations in core management, communication, math, and organizational behavior.",
    semesters: [
      {
        semester: "Semester 1: Foundation and Basics",
        subjects: [
          { name: "Principles of Management", description: "Core management frameworks, organizational goal setting, and structural execution." },
          { name: "Business Communication", description: "Develop professional presenting, corporate report writing, and public speaking confidence." },
          { name: "Microeconomics", description: "Study micro market dynamics, demand/supply matrices, price elasticity, and consumer choice." },
          { name: "Financial Accounting", description: "Understanding ledgers, double-entry bookkeeping, balance sheets, and corporate financial basics." },
          { name: "Business Mathematics", description: "Mastering algebraic functions, matrices, linear programming models, and numerical analysis." }
        ]
      },
      {
        semester: "Semester 2: Organizational Dynamics",
        subjects: [
          { name: "Organizational Behavior", description: "Study human dynamics in organizations, group behavior models, and cultural motivation." },
          { name: "Macroeconomics", description: "National income accounting, fiscal policy, monetary economics, inflation, and global systems." },
          { name: "Cost and Management Accounting", description: "Budgetary controls, differential cost methods, product cost calculations, and pricing." },
          { name: "Business Statistics", description: "Probability, standard distributions, index metrics, sampling methods, and correlation charts." },
          { name: "Environmental Studies", description: "Sustainability frameworks, green supply chains, ecology, and environmental standard compliance." }
        ]
      }
    ]
  },
  {
    year: "Academic Year 2",
    title: "Core Business Functions & Advanced Operations",
    summary: "Command marketing, finance, corporate law, and applied operational research methodologies.",
    semesters: [
      {
        semester: "Semester 3: Core Business Functions",
        subjects: [
          { name: "Marketing Management", description: "Customer acquisition funnels, target segment selection, active positioning, and brand values." },
          { name: "Human Resource Management", description: "Strategic recruitment, workplace performance appraisals, employee benefits, and labor law." },
          { name: "Financial Management", description: "Capital budgeting, cost of capital, dividend decisions, working capital, and portfolio theory." },
          { name: "Business Law", description: "Law of contracts, sale of goods, negotiable instruments, and Indian company statutory guidelines." },
          { name: "Management Information Systems", description: "Familiarity with DB management, ERP structures, cloud analytics, and IT infrastructure systems." }
        ]
      },
      {
        semester: "Semester 4: Advanced Operations and Research",
        subjects: [
          { name: "Operations Research", description: "Linear programming, transportation algorithms, simplex optimization, and queues theory." },
          { name: "Business Research Methods", description: "Develop hypotheses, construct questionnaires, tabulate data, and compile analytic files." },
          { name: "Taxation", description: "Direct and indirect taxes setup, corporate taxation schemes, GST compliance, and deductions." },
          { name: "International Business", description: "Multi-national operations, import/export setups, foreign exchange, and entry methods." },
          { name: "Entrepreneurship Development", description: "Ideation formats, business plan writing, incubation stages, seed funding, and pitch decks." }
        ]
      }
    ]
  },
  {
    year: "Academic Year 3",
    title: "Strategy, Specialisation & Capstone Application",
    summary: "Execute real-world corporate projects, marketing strategies, and final thesis presentations.",
    semesters: [
      {
        semester: "Semester 5: Strategy and Specialisation",
        subjects: [
          { name: "Corporate Internship or Summer Project", description: "Structured 8-week corporate residency in real estate developer or brokerage houses." },
          { name: "Services Marketing", description: "Examine services marketing audits, SERVQUAL models, and relationship marketing tools." },
          { name: "Fundamentals of Brand Management", description: "Brand equity matrices, logo architecture, customer loyalty programs, and brand extensions." },
          { name: "Sales and Distribution Management", description: "Manage retail distribution networks, channel margins, sales force structures, and logistics." },
          { name: "Open choice subjects in HR, Finance, or Business Analytics", description: "Specialized electives customized to student pathways for corporate or start-up leadership." }
        ]
      },
      {
        semester: "Semester 6: Capstone and Application",
        subjects: [
          { name: "Analytics Foundations", description: "Leverage standard database querying, analytics modeling, and dashboards for forecasting." },
          { name: "Corporate Governance and Ethics", description: "Analyze business ethics, corporate board configurations, ESG compliance, and CSR models." },
          { name: "Marketing Analytics", description: "Calculate customer lifetime value, optimize customer acquisition costs, and run campaign tests." },
          { name: "Retail Marketing", description: "Examine store display layouts, hypermarket strategies, category management, and e-commerce." },
          { name: "Marketing Communication", description: "Integrated campaigns including advertising, public relations, event management, and digital media." },
          { name: "Final Research Project or Dissertation", description: "Independent developer-grade research project on localized consumer behavior, sales, or PropTech." }
        ]
      }
    ]
  }
];

export const mbaStructure: YearStructure[] = [
  {
    year: "Academic Year 1",
    title: "Business Foundations, Real Estate Basics & Business Systems",
    summary: "Command financial management, operations, real estate regulatory platforms (RERA, REIT, SEZ, FDI), and automation.",
    semesters: [
      {
        semester: "Semester 1: Business Foundation and Real Estate Basics",
        subjects: [
          { name: "Business Statistics & Data Driven Decision Making", description: "Probability, predictive regressions, and data indicators to back commercial decisions." },
          { name: "Marketing Management", description: "Build active target segment criteria, pricing strategies, and comprehensive marketing programs." },
          { name: "Financial Accounting & Real Estate Investment", description: "Ledger building, corporate balance sheets, asset valuation, and investment yield underwriting." },
          { name: "Operations Management & ERP", description: "Streamline physical logistics, inventory control cycles, and ERP-driven workflow mapping." },
          { name: "Legal Aspects of Business (RERA, REIT, SEZ, FDI)", description: "Navigate property titles history, RERA rules, SEZ listings, and SEBI-governed REIT configurations." },
          { name: "Human Resource Management", description: "Recruitment frameworks, corporate organizational structures, and labor regulations." },
          { name: "Research Methodology", description: "Scientific qualitative and quantitative methods to collect macro real estate data." },
          { name: "Microeconomics", description: "Analyze market structures, pricing curves, utility theory, and asset supply/demand imbalances." },
          { name: "Technology in Business & Real Estate Centric Tech", description: "Introduction to cloud CRM setups, GIS-based property tools, and software automation basics." },
          { name: "Construction & Architecture Engineering Basics", description: "Review structural layouts, engineering limits, township blueprint reading, and government approvals." }
        ]
      },
      {
        semester: "Semester 2: Business Systems and Digital Growth",
        subjects: [
          { name: "Organizational Behaviour", description: "Analysis of human motivation models, corporate dynamics, conflict solutions, and ethics codes." },
          { name: "Operations Research", description: "Linear optimizations, queuing models, allocation strategies, and resource management curves." },
          { name: "Financial Management", description: "Investigate capital structures, cost of capital calculation, debt/equity margins, and payout decisions." },
          { name: "Project Management", description: "Detail tasks using Gantt schedules, Work Breakdown Structures (WBS), and critical path analysis." },
          { name: "Business Communication & Design Thinking", description: "Corporate presentations, collaborative innovation designs, and rapid brainstorming techniques." },
          { name: "Consumer Behaviour & Marketing Insights", description: "Identify customer feedback patterns, consumer lifecycle metrics, and strategic target cohorts." },
          { name: "Digital Marketing, CRM & Automation", description: "Build multi-tier modern pipelines, configure automations, and handle database integrations." },
          { name: "Management Information Systems", description: "Modern computing infrastructures, database schemas, and organizational information routing." }
        ]
      }
    ]
  },
  {
    year: "Academic Year 2",
    title: "Strategy, Real Estate Marketing & PropTech Launch",
    summary: "Architect AI/ML intelligence, manage complex real estate distribution partners, and deploy new launches.",
    semesters: [
      {
        semester: "Semester 3: Strategy and Real Estate Marketing",
        subjects: [
          { name: "Project I (Practical Field Study)", description: "Hands-on regional real estate census, pricing evaluations, and actual market feasibility drafts." },
          { name: "Corporate Governance, Ethics & Crisis Management", description: "Analyze brand protection strategies, contingency management plans, and board of directors protocols." },
          { name: "Strategic Management", description: "Frame corporate advantages, implement mergers, expansion strategies, and competitive matrices." },
          { name: "AI and ML for Business Management", description: "Evaluate machine learning predictive models, automated database workflows, and prompt setups." },
          { name: "Real Estate Brand Management & Corporate Identity", description: "Develop complete visual design templates, corporate branding manuals, and digital asset templates." },
          { name: "Architectural Photography & Dynamic Storytelling", description: "Master site video production, photo edits, and drone footage to power visual marketing." },
          { name: "Commercial & Residential Property Marketing", description: "Formulate lead acquisition plans, leasing structures, NNN calculations, and township sales campaigns." }
        ]
      },
      {
        semester: "Semester 4: PropTech, Sales Channels and Launch Strategy",
        subjects: [
          { name: "Project II (Capstone Thesis)", description: "A high-fidelity project launching simulation, pitch layout, or dynamic PropTech start-up blueprint." },
          { name: "Entrepreneurship & Doing Business in India", description: "Navigate Indian company setups, regulatory tax compliance, and scale-up fundraising." },
          { name: "Global Business Environment & Conflict Resolution", description: "Investigate global trade, exchange rates, and international mediation rules." },
          { name: "Business Transformation & Turnaround", description: "Evaluate corporate audits, cash restructuring, operational pivots, and change management." },
          { name: "Marketing Analytics and PropTech", description: "Integrate database pipelines to track client actions, traffic grids, and GIS mapping APIs." },
          { name: "Real Estate Broker and Channel Management", description: "Run broker rewards structures, channel commission agreements, and sales networks." },
          { name: "Real Estate CRM and Lead Nurturing", description: "Set up automated drip letters, lead qualification scores, and CRM triggers." },
          { name: "New Property Launch and Campaign Management", description: "Coordinate a complete digital real estate project release, budgets, advertising, and marketing rosters." }
        ]
      }
    ]
  }
];

export const bcaStructure: YearStructure[] = [
  {
    year: "Academic Year 1",
    title: "Programming Foundations & Mathematical Reasoning",
    summary: "Build strong foundations in programming logic, mathematics, and computer fundamentals.",
    semesters: [
      {
        semester: "Semester 1: Programming Foundations",
        subjects: [
          { name: "Programming in C", description: "Core programming concepts, control structures, arrays, pointers, functions, and structured problem-solving." },
          { name: "Discrete Mathematics", description: "Logic, set theory, combinatorics, graph theory, and algebraic structures for computing." },
          { name: "Computer Fundamentals & Organisation", description: "Hardware architecture, memory hierarchy, CPU design, number systems, and input-output mechanisms." },
          { name: "Communication Skills", description: "Technical writing, professional presentations, email etiquette, and effective verbal communication." },
          { name: "Environmental Studies", description: "Environmental awareness, sustainability frameworks, green computing, and ecological compliance." }
        ]
      },
      {
        semester: "Semester 2: Object-Oriented Programming",
        subjects: [
          { name: "Object-Oriented Programming with C++", description: "Classes, objects, inheritance, polymorphism, abstraction, encapsulation, and design patterns." },
          { name: "Data Structures", description: "Arrays, linked lists, stacks, queues, trees, graphs, searching and sorting algorithms." },
          { name: "Digital Electronics", description: "Logic gates, combinational circuits, sequential circuits, flip-flops, and registers." },
          { name: "Business Mathematics", description: "Calculus, matrices, probability, statistics, and mathematical models for computing applications." },
          { name: "Operating Systems Concepts", description: "Process management, memory management, file systems, scheduling algorithms, and deadlock handling." }
        ]
      }
    ]
  },
  {
    year: "Academic Year 2",
    title: "Software Development & Database Systems",
    summary: "Master web technologies, database management, networking, and software engineering principles.",
    semesters: [
      {
        semester: "Semester 3: Web Technologies & Databases",
        subjects: [
          { name: "Java Programming", description: "Java syntax, OOP in Java, exception handling, multithreading, collections framework, and JVM internals." },
          { name: "Database Management Systems", description: "Relational models, SQL, normalization, transaction processing, indexing, and query optimization." },
          { name: "Web Development (HTML, CSS, JavaScript)", description: "Frontend technologies, responsive design, DOM manipulation, and modern web standards." },
          { name: "Computer Networks", description: "OSI model, TCP/IP protocols, routing, switching, network security, and wireless networking." },
          { name: "Software Engineering", description: "SDLC models, requirements engineering, UML diagrams, testing strategies, and agile methodologies." }
        ]
      },
      {
        semester: "Semester 4: Advanced Development & Analysis",
        subjects: [
          { name: "Python Programming", description: "Python fundamentals, data manipulation, file handling, libraries, scripting, and automation." },
          { name: "Full Stack Web Development", description: "React/Angular frontends, Node.js backends, REST APIs, MongoDB, deployment workflows." },
          { name: "Design and Analysis of Algorithms", description: "Algorithm complexity, divide and conquer, greedy methods, dynamic programming, and NP-completeness." },
          { name: "Computer Graphics & Multimedia", description: "2D/3D transformations, rendering pipelines, animation, image processing, and multimedia systems." },
          { name: "Statistics and Data Analysis", description: "Descriptive statistics, probability distributions, regression, hypothesis testing, and data visualization." }
        ]
      }
    ]
  },
  {
    year: "Academic Year 3",
    title: "Specialisation, AI & Capstone Projects",
    summary: "Apply advanced computing skills through AI, cloud technologies, and hands-on capstone projects.",
    semesters: [
      {
        semester: "Semester 5: AI & Cloud Computing",
        subjects: [
          { name: "Artificial Intelligence Fundamentals", description: "Search algorithms, knowledge representation, expert systems, neural networks, and AI ethics." },
          { name: "Cloud Computing & DevOps", description: "AWS/Azure fundamentals, containerization, CI/CD pipelines, serverless architecture, and infrastructure." },
          { name: "Mobile Application Development", description: "Android/iOS development, UI frameworks, API integration, and app store deployment." },
          { name: "Cyber Security Essentials", description: "Cryptography, network security, ethical hacking, vulnerability assessment, and compliance standards." },
          { name: "Corporate Internship or Summer Project", description: "Structured 8-week corporate residency in IT companies, startups, or software development houses." }
        ]
      },
      {
        semester: "Semester 6: Capstone & Emerging Technologies",
        subjects: [
          { name: "Machine Learning & Data Science", description: "Supervised and unsupervised learning, model training, feature engineering, and prediction systems." },
          { name: "Blockchain & IoT Fundamentals", description: "Distributed ledger technology, smart contracts, IoT architectures, and sensor networks." },
          { name: "Software Project Management", description: "Agile/Scrum frameworks, sprint planning, risk management, version control, and team coordination." },
          { name: "Professional Ethics & Cyber Law", description: "IT Act, intellectual property, data privacy regulations, ethical standards, and digital governance." },
          { name: "Final Capstone Project & Dissertation", description: "Independent full-stack software project solving a real-world problem with documentation and defense." }
        ]
      }
    ]
  }
];

export const mcaStructure: YearStructure[] = [
  {
    year: "Academic Year 1",
    title: "Engineering Foundations & Modern AI Systems",
    summary: "Command advanced programming, data structures, operating systems, databases, and AI/ML tooling for building scalable systems.",
    semesters: [
      {
        semester: "Semester 1: Engineering Foundations",
        subjects: [
          { name: "Advanced Programming", description: "Deep dive into advanced data types, memory management, concurrency, and system-level programming." },
          { name: "Data Structures and Algorithms", description: "Advanced trees, graphs, hashing, sorting algorithms, complexity analysis, and algorithm design paradigms." },
          { name: "Discrete Mathematics", description: "Mathematical logic, graph theory, combinatorics, recurrence relations, and formal language theory." },
          { name: "Computer Networks", description: "Network architectures, TCP/IP stack, routing protocols, DNS, HTTP/HTTPS, and network programming." },
          { name: "Software Engineering", description: "Software development lifecycles, agile practices, version control, code reviews, and testing strategies." }
        ]
      },
      {
        semester: "Semester 2: AI Systems & Cloud Computing",
        subjects: [
          { name: "Full Stack Development", description: "Modern frontend frameworks, backend APIs, database integration, authentication, and deployment pipelines." },
          { name: "AI/NLP Foundations", description: "Natural language processing, text classification, sentiment analysis, named entity recognition, and chatbot design." },
          { name: "Cloud Computing", description: "AWS/GCP/Azure services, serverless functions, container orchestration, and cloud-native architecture." },
          { name: "Database Systems", description: "Relational and NoSQL databases, query optimization, indexing strategies, transactions, and data modeling." },
          { name: "Operating Systems", description: "Process scheduling, memory management, file systems, virtualization, and kernel-level programming." }
        ]
      }
    ]
  },
  {
    year: "Academic Year 2",
    title: "System Design, Machine Learning & Deployment",
    summary: "Architect AI/ML intelligence, build production-grade systems, and deploy scalable applications with real-world capstone projects.",
    semesters: [
      {
        semester: "Semester 3: Machine Learning & System Design",
        subjects: [
          { name: "Machine Learning", description: "Supervised and unsupervised learning, ensemble methods, deep learning fundamentals, and model evaluation." },
          { name: "Data Engineering", description: "ETL pipelines, data warehousing, batch and stream processing, Apache Spark, and data quality frameworks." },
          { name: "Prompt Engineering & AI Tools", description: "LLM prompting strategies, AI-assisted development, code generation tools, and responsible AI usage." },
          { name: "System Design I", description: "Scalable architecture patterns, load balancing, caching strategies, microservices, and distributed systems." },
          { name: "Capstone Project I", description: "Research, design, and prototype a software system addressing a real-world industry problem." },
          { name: "AI Product Management", description: "Product lifecycle, user research, roadmapping, feature prioritization, and go-to-market strategies for AI products." }
        ]
      },
      {
        semester: "Semester 4: Deployment, Ethics & Industry Readiness",
        subjects: [
          { name: "System Design II", description: "Advanced distributed systems, event-driven architectures, database sharding, and high-availability design." },
          { name: "Capstone Project II (Thesis)", description: "A production-grade project with live deployment, user testing, performance optimization, and a formal defense." },
          { name: "AI Ethics & Governance", description: "Bias in AI, fairness metrics, explainability, regulatory frameworks, and responsible AI deployment." },
          { name: "Deployment & DevOps", description: "CI/CD pipelines, containerization with Docker/Kubernetes, monitoring, logging, and infrastructure as code." },
          { name: "Industry Internship", description: "Structured internship at a technology company, working on production-level codebases and shipping features." }
        ]
      }
    ]
  }
];
