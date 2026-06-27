// ── PlacePrep AI — Topic Bank ────────────────────────────────────────────────
// 30 topics across 9 categories. Roles reference these by `id` via topicIds[].
// Each topic drives Practice Questions, Code Challenges, and Concept Explainer.

export const TOPICS = [
  // ── Programming (4) ──────────────────────────────────────────────────────
  { id: 'python',      label: 'Python Fundamentals',           icon: '🐍', color: '#3B82F6', sub: 'OOP, decorators, generators, async/await, context managers, metaclasses',                 category: 'Programming' },
  { id: 'dsa',         label: 'Data Structures & Algorithms',  icon: '🧮', color: '#8B5CF6', sub: 'Arrays, trees, graphs, heaps, DP, sliding window, topological sort, tries',               category: 'Programming' },
  { id: 'sql_data',    label: 'SQL & Data Wrangling',          icon: '🗄️', color: '#60A5FA', sub: 'Joins, CTEs, window functions, GROUP BY, HAVING, query optimization, ETL',               category: 'Programming' },
  { id: 'numpy',       label: 'NumPy & Pandas',                icon: '🔢', color: '#06B6D4', sub: 'Vectorized ops, broadcasting, indexing, groupby, merge, pivot tables, apply',            category: 'Programming' },

  // ── Theory (1) ───────────────────────────────────────────────────────────
  { id: 'stats',       label: 'Statistics & Probability',      icon: '📊', color: '#8B5CF6', sub: 'Distributions, hypothesis testing, Bayes theorem, CLT, confidence intervals, MLE',       category: 'Theory' },

  // ── ML (4) ───────────────────────────────────────────────────────────────
  { id: 'ml_core',     label: 'Core ML Algorithms',            icon: '🤖', color: '#00D4AA', sub: 'Linear/logistic regression, decision trees, SVM, k-means, ensemble methods, XGBoost',    category: 'ML' },
  { id: 'feature_eng', label: 'Feature Engineering',           icon: '⚙️', color: '#A78BFA', sub: 'Encoding, scaling, imputation, feature selection, target encoding, polynomial features', category: 'ML' },
  { id: 'eval',        label: 'Model Evaluation',              icon: '🎯', color: '#34D399', sub: 'Precision/recall, AUC-ROC, F1, cross-validation, bias-variance, hyperparameter tuning',  category: 'ML' },
  { id: 'interview_ml',label: 'ML System Design',              icon: '🏗️', color: '#FB923C', sub: 'Recommender systems, fraud detection, search ranking, ad click prediction, ML at scale', category: 'ML' },

  // ── DL (4) ───────────────────────────────────────────────────────────────
  { id: 'dl',          label: 'Deep Learning Foundations',      icon: '🧠', color: '#EC4899', sub: 'Backpropagation, activation functions, optimizers (SGD/Adam), batch norm, dropout',      category: 'DL' },
  { id: 'cnn',         label: 'Convolutional Networks',         icon: '🖼️', color: '#F97316', sub: 'Conv layers, pooling, ResNet, VGG, feature maps, receptive field, 1x1 convolutions',    category: 'DL' },
  { id: 'seq_models',  label: 'Sequence Models',                icon: '🔄', color: '#06B6D4', sub: 'RNNs, LSTMs, GRUs, bidirectional networks, seq2seq, teacher forcing, beam search',      category: 'DL' },
  { id: 'transformers',label: 'Transformers & Attention',       icon: '⚡', color: '#F59E0B', sub: 'Scaled dot-product attention, multi-head, positional encoding, self-attention, KV cache',category: 'DL' },

  // ── NLP (3) ──────────────────────────────────────────────────────────────
  { id: 'nlp',         label: 'NLP & Language Models',          icon: '💬', color: '#F59E0B', sub: 'Tokenization (BPE/WordPiece), word embeddings, BERT, GPT, NER, text classification',    category: 'NLP' },
  { id: 'genai',       label: 'GenAI & RAG',                    icon: '✨', color: '#D946EF', sub: 'RAG pipelines, vector DBs, chunking strategies, agents, tool use, prompt engineering',   category: 'NLP' },
  { id: 'llm_eval',    label: 'LLM Evaluation & Safety',        icon: '🛡️', color: '#EF4444', sub: 'Hallucination detection, RLHF, red teaming, perplexity, BLEU/ROUGE, guardrails',       category: 'NLP' },

  // ── CV (2) ───────────────────────────────────────────────────────────────
  { id: 'cv',          label: 'Computer Vision',                icon: '👁',  color: '#F97316', sub: 'Image classification, object detection (YOLO, RCNN), segmentation, data augmentation',  category: 'CV' },
  { id: 'cv_advanced', label: 'Advanced Vision Models',         icon: '🔬', color: '#EC4899', sub: 'Vision Transformers (ViT), CLIP, diffusion models, 3D vision, video understanding',     category: 'CV' },

  // ── MLOps (3) ────────────────────────────────────────────────────────────
  { id: 'mlops',       label: 'MLOps & Deployment',             icon: '🚀', color: '#10B981', sub: 'Model serving (REST/gRPC), CI/CD for ML, model registry, A/B testing, monitoring',      category: 'MLOps' },
  { id: 'cloud',       label: 'Cloud & Infrastructure',         icon: '☁️', color: '#FF9900', sub: 'AWS/GCP/Azure, serverless, IaC (Terraform), containers, auto-scaling, cost optimization',category: 'MLOps' },
  { id: 'data_eng',    label: 'Data Engineering',               icon: '🔧', color: '#3B82F6', sub: 'Spark, Kafka, Airflow, data lakes, batch vs streaming, schema evolution, dbt',          category: 'MLOps' },

  // ── SWE (6) ──────────────────────────────────────────────────────────────
  { id: 'system_design',label: 'System Design',                 icon: '🏛️', color: '#F59E0B', sub: 'Load balancing, caching, sharding, CAP theorem, microservices, message queues',          category: 'SWE' },
  { id: 'backend',      label: 'Backend Development',           icon: '🔧', color: '#10B981', sub: 'REST/GraphQL APIs, databases, ORMs, authentication, rate limiting, middleware',          category: 'SWE' },
  { id: 'frontend',     label: 'Frontend Development',          icon: '⚛️', color: '#61DAFB', sub: 'React, state management, hooks, virtual DOM, SSR/SSG, accessibility, performance',      category: 'SWE' },
  { id: 'devops',       label: 'DevOps & CI/CD',                icon: '🔄', color: '#8B5CF6', sub: 'Docker, Kubernetes, GitHub Actions, monitoring (Prometheus/Grafana), blue-green deploys',category: 'SWE' },
  { id: 'mobile_dev',   label: 'Mobile Development',            icon: '📱', color: '#10B981', sub: 'React Native, Flutter, iOS/Android, app lifecycle, push notifications, offline-first',  category: 'SWE' },
  { id: 'cybersecurity', label: 'Cybersecurity',                 icon: '🔒', color: '#EF4444', sub: 'OWASP Top 10, XSS/CSRF, OAuth 2.0, encryption, penetration testing, zero trust',       category: 'SWE' },

  // ── Business (3) ────────────────────────────────────────────────────────
  { id: 'product',           label: 'Product Management',       icon: '💡', color: '#D946EF', sub: 'Roadmaps, PRDs, user stories, prioritization (RICE/ICE), metrics, A/B testing',         category: 'Business' },
  { id: 'business_analytics',label: 'Business Analytics',       icon: '📈', color: '#10B981', sub: 'KPIs, cohort analysis, funnel metrics, dashboards, Power BI/Tableau, storytelling',     category: 'Business' },
  { id: 'strategy',          label: 'Strategy & Consulting',    icon: '🏢', color: '#F59E0B', sub: 'MECE, issue trees, market sizing, Porter\'s Five Forces, profitability frameworks',     category: 'Business' },
];

/**
 * Look up a single topic by its id.
 * @param {string} id
 * @returns {object|undefined}
 */
export const topicById = (id) => TOPICS.find((t) => t.id === id);

/**
 * Group all topics by their `category` field.
 * @returns {Object<string, object[]>}  e.g. { Programming: [...], ML: [...] }
 */
export const topicsByCategory = () =>
  TOPICS.reduce((acc, topic) => {
    (acc[topic.category] ||= []).push(topic);
    return acc;
  }, {});
