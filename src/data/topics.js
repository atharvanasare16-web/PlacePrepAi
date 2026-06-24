// ── Topic Bank ──────────────────────────────────────────────────────────────
// Each topic drives Practice Questions, Code Challenges, and Concept Explainer.
// Roles reference these by `id` via their `topicIds` array.

export const TOPICS = [
  // ─── ML / AI ─────────────────────────────────────────────────────────────
  { id: "python",      label: "Python Fundamentals",      icon: "🐍",  color: "#3B82F6", sub: "OOP, decorators, generators, async" },
  { id: "numpy",       label: "NumPy & Pandas",           icon: "🔢",  color: "#06B6D4", sub: "Vectorization, indexing, DataFrames" },
  { id: "stats",       label: "Statistics & Probability",  icon: "📊",  color: "#8B5CF6", sub: "Distributions, hypothesis testing, Bayes" },
  { id: "ml_core",     label: "Core ML Algorithms",       icon: "🤖",  color: "#00D4AA", sub: "Linear models, trees, SVMs, clustering" },
  { id: "dl",          label: "Deep Learning",            icon: "🧠",  color: "#EC4899", sub: "CNNs, RNNs, backprop, optimization" },
  { id: "nlp",         label: "NLP & LLMs",               icon: "💬",  color: "#F59E0B", sub: "Embeddings, transformers, BERT, GPT" },
  { id: "genai",       label: "GenAI & RAG",              icon: "✨",  color: "#D946EF", sub: "RAG, vector DBs, agents, prompting" },
  { id: "cv",          label: "Computer Vision",          icon: "👁",   color: "#F97316", sub: "CNNs, object detection, segmentation" },
  { id: "mlops",       label: "MLOps & Deployment",       icon: "🚀",  color: "#10B981", sub: "Docker, APIs, model serving, pipelines" },
  { id: "feature_eng", label: "Feature Engineering",      icon: "⚙️",  color: "#A78BFA", sub: "Encoding, scaling, selection, imputation" },
  { id: "eval",        label: "Model Evaluation",         icon: "🎯",  color: "#34D399", sub: "Metrics, cross-val, bias-variance, tuning" },
  { id: "sql_data",    label: "SQL & Data Wrangling",     icon: "🗄️",  color: "#60A5FA", sub: "Joins, window functions, ETL" },
  { id: "interview_ml",label: "ML System Design",         icon: "🏗️",  color: "#FB923C", sub: "Recommenders, fraud detection, search" },

  // ─── Tech / SDE ──────────────────────────────────────────────────────────
  { id: "dsa",          label: "Data Structures & Algorithms", icon: "🧮", color: "#3B82F6", sub: "Arrays, trees, graphs, DP, sorting" },
  { id: "system_design",label: "System Design",               icon: "🏛️", color: "#F59E0B", sub: "Scalability, load balancing, databases" },
  { id: "os",           label: "Operating Systems",            icon: "💾", color: "#EF4444", sub: "Processes, threads, memory, scheduling" },
  { id: "dbms",         label: "DBMS & Databases",             icon: "🗃️", color: "#8B5CF6", sub: "Normalization, indexing, transactions" },
  { id: "networking",   label: "Computer Networks",            icon: "🌐", color: "#06B6D4", sub: "TCP/IP, HTTP, DNS, sockets" },
  { id: "javascript",   label: "JavaScript & TypeScript",      icon: "⚡", color: "#F59E0B", sub: "Closures, promises, event loop, TS" },
  { id: "react_dom",    label: "React & Frontend",             icon: "⚛️", color: "#61DAFB", sub: "Components, hooks, state, virtual DOM" },
  { id: "java",         label: "Java / C++",                   icon: "☕", color: "#E76F00", sub: "Collections, multithreading, JVM, STL" },
  { id: "ooad",         label: "OOP & Design Patterns",        icon: "🔷", color: "#3B82F6", sub: "SOLID, factory, observer, strategy" },
  { id: "cloud",        label: "Cloud & Infrastructure",       icon: "☁️", color: "#FF9900", sub: "AWS, GCP, serverless, IaC" },
  { id: "web_security", label: "Web & App Security",           icon: "🔒", color: "#EF4444", sub: "OWASP, XSS, CSRF, authentication" },
  { id: "css_ui",       label: "CSS & UI/UX",                  icon: "🎨", color: "#EC4899", sub: "Flexbox, grid, animations, responsiveness" },
  { id: "mobile_dev",   label: "Mobile Development",           icon: "📱", color: "#10B981", sub: "Android, iOS, React Native, Flutter" },
  { id: "api_design",   label: "API & Backend Design",         icon: "🔌", color: "#8B5CF6", sub: "REST, GraphQL, gRPC, auth" },

  // ─── Non-Tech ────────────────────────────────────────────────────────────
  { id: "aptitude",      label: "Aptitude & Reasoning",              icon: "🧩", color: "#F59E0B", sub: "Quant, logical reasoning, verbal" },
  { id: "behavioral",   label: "Behavioral & HR",                   icon: "🤝", color: "#00D4AA", sub: "STAR method, leadership, conflict" },
  { id: "product",      label: "Product Thinking",                  icon: "💡", color: "#D946EF", sub: "Roadmaps, metrics, prioritization" },
  { id: "case_study",   label: "Case Studies",                      icon: "📋", color: "#FB923C", sub: "Market sizing, frameworks, profitability" },
  { id: "excel_bi",     label: "Excel & BI Tools",                  icon: "📈", color: "#10B981", sub: "Pivot tables, Power BI, Tableau" },
  { id: "communication",label: "Communication & Presentation",      icon: "🎤", color: "#EC4899", sub: "Storytelling, deck design, stakeholders" },
];

/**
 * Lookup a single topic by its id.
 * @param {string} id
 * @returns {object|undefined}
 */
export const topicById = (id) => TOPICS.find((t) => t.id === id);
