import { useState, useRef, useEffect } from "react";

const COLORS = {
  bg: "#0A0E1A",
  surface: "#111827",
  card: "#161E2E",
  border: "#1F2D45",
  accent: "#00D4AA",
  accentDim: "#00D4AA22",
  accentSoft: "#00D4AA44",
  blue: "#3B82F6",
  amber: "#F59E0B",
  red: "#EF4444",
  green: "#10B981",
  purple: "#8B5CF6",
  pink: "#EC4899",
  textPrimary: "#F1F5F9",
  textSecondary: "#94A3B8",
  textMuted: "#475569",
};

// Generic topic bank (used inside Practice / Code Challenges)
const TOPICS = [
  { id: "python", label: "Python Fundamentals", icon: "🐍", color: "#3B82F6", sub: "OOP, decorators, generators, async" },
  { id: "numpy", label: "NumPy & Pandas", icon: "🔢", color: "#06B6D4", sub: "Vectorization, indexing, DataFrames" },
  { id: "stats", label: "Statistics & Probability", icon: "📊", color: "#8B5CF6", sub: "Distributions, hypothesis testing, Bayes" },
  { id: "ml_core", label: "Core ML Algorithms", icon: "🤖", color: "#00D4AA", sub: "Linear models, trees, SVMs, clustering" },
  { id: "dl", label: "Deep Learning", icon: "🧠", color: "#EC4899", sub: "CNNs, RNNs, backprop, optimization" },
  { id: "nlp", label: "NLP & LLMs", icon: "💬", color: "#F59E0B", sub: "Embeddings, transformers, BERT, GPT" },
  { id: "genai", label: "GenAI & RAG", icon: "✨", color: "#D946EF", sub: "RAG, vector DBs, agents, prompting" },
  { id: "cv", label: "Computer Vision", icon: "👁", color: "#F97316", sub: "CNNs, object detection, segmentation" },
  { id: "mlops", label: "MLOps & Deployment", icon: "🚀", color: "#10B981", sub: "Docker, APIs, model serving, pipelines" },
  { id: "feature_eng", label: "Feature Engineering", icon: "⚙️", color: "#A78BFA", sub: "Encoding, scaling, selection, imputation" },
  { id: "eval", label: "Model Evaluation", icon: "🎯", color: "#34D399", sub: "Metrics, cross-val, bias-variance, tuning" },
  { id: "sql_data", label: "SQL & Data Wrangling", icon: "🗄️", color: "#60A5FA", sub: "Joins, window functions, ETL" },
  { id: "interview_ml", label: "ML System Design", icon: "🏗️", color: "#FB923C", sub: "Recommenders, fraud detection, search" },
];

const topicById = id => TOPICS.find(t => t.id === id);

// Role profiles — drives the entire personalized experience
const ROLE_PROFILES = {
  ai_engineer: {
    id: "ai_engineer", label: "AI Engineer", icon: "✨", color: "#D946EF",
    tagline: "LLMs, RAG pipelines, agents & production AI systems",
    topicIds: ["genai", "nlp", "python", "mlops", "dl", "interview_ml"],
    mustKnow: ["Retrieval-Augmented Generation (RAG)", "Vector databases & embeddings", "Prompt engineering patterns", "LLM fine-tuning vs in-context learning", "Agent / tool-use architectures", "Transformer attention mechanism", "Token limits & context management", "LLM evaluation & hallucination mitigation"],
    rounds: ["Python & APIs", "LLM/GenAI Theory", "System Design (AI Product)", "Take-home: Build a RAG app", "HR & Behavioral"],
    companies: ["OpenAI", "Anthropic", "Google DeepMind", "Perplexity", "Meta AI", "Microsoft"],
    focusDefault: "LLMs & GenAI",
  },
  mle: {
    id: "mle", label: "Machine Learning Engineer", icon: "🤖", color: "#00D4AA",
    tagline: "Production ML systems, pipelines & model performance",
    topicIds: ["ml_core", "feature_eng", "eval", "mlops", "python", "interview_ml"],
    mustKnow: ["Bias-variance tradeoff", "Regularization (L1/L2)", "Gradient boosting internals", "Cross-validation strategies", "Handling class imbalance", "Feature scaling & encoding", "Model serving at scale", "A/B testing for ML"],
    rounds: ["Python & Coding", "ML Theory", "ML System Design", "Stats & Probability", "HR & Behavioral"],
    companies: ["Google", "Amazon", "Microsoft", "Flipkart", "Uber", "Swiggy"],
    focusDefault: "Balanced",
  },
  data_scientist: {
    id: "data_scientist", label: "Data Scientist", icon: "📊", color: "#8B5CF6",
    tagline: "Statistics, experimentation & business-driven modeling",
    topicIds: ["stats", "sql_data", "ml_core", "eval", "python", "numpy"],
    mustKnow: ["Hypothesis testing & p-values", "A/B testing design & pitfalls", "Confidence intervals", "Causal vs correlation", "SQL window functions", "Regression diagnostics", "Sampling bias", "Business metric design"],
    rounds: ["SQL & Stats", "Python/Pandas", "Case Study / Business Sense", "ML Theory", "HR & Behavioral"],
    companies: ["Meta", "Netflix", "Amazon", "Myntra", "Zomato", "PhonePe"],
    focusDefault: "Statistics Heavy",
  },
  dl_engineer: {
    id: "dl_engineer", label: "Deep Learning Engineer", icon: "🧠", color: "#EC4899",
    tagline: "Neural network architectures, training & optimization",
    topicIds: ["dl", "cv", "nlp", "python", "eval", "mlops"],
    mustKnow: ["Backpropagation derivation", "Vanishing/exploding gradients", "Batch normalization", "Dropout & regularization", "Optimizers (SGD, Adam, RMSprop)", "CNN vs RNN vs Transformer", "Transfer learning", "Mixed precision / distributed training"],
    rounds: ["Python & PyTorch", "DL Theory & Math", "Architecture Design", "Paper Discussion", "HR & Behavioral"],
    companies: ["Google DeepMind", "NVIDIA", "Meta AI", "Microsoft Research", "Qualcomm"],
    focusDefault: "Deep Learning",
  },
  nlp_engineer: {
    id: "nlp_engineer", label: "NLP Engineer", icon: "💬", color: "#F59E0B",
    tagline: "Text processing, language models & sequence learning",
    topicIds: ["nlp", "genai", "dl", "python", "eval", "interview_ml"],
    mustKnow: ["Tokenization (BPE, WordPiece)", "Word2Vec vs contextual embeddings", "Self-attention mechanism", "BERT vs GPT architecture", "Named entity recognition", "Sequence-to-sequence models", "Perplexity & BLEU score", "Fine-tuning pretrained LMs"],
    rounds: ["Python & Coding", "NLP Theory", "Model Architecture", "System Design (Search/Chat)", "HR & Behavioral"],
    companies: ["Google", "Hugging Face", "Amazon", "Microsoft", "Salesforce"],
    focusDefault: "LLMs & GenAI",
  },
  cv_engineer: {
    id: "cv_engineer", label: "Computer Vision Engineer", icon: "👁", color: "#F97316",
    tagline: "Image models, detection, segmentation & vision pipelines",
    topicIds: ["cv", "dl", "python", "eval", "mlops", "numpy"],
    mustKnow: ["Convolution & pooling math", "Object detection (YOLO, Faster R-CNN)", "Image segmentation (U-Net)", "Data augmentation strategies", "IoU & mAP metrics", "Vision transformers (ViT)", "Image preprocessing pipelines", "Real-time inference optimization"],
    rounds: ["Python & OpenCV", "CV Theory", "Architecture Design", "Take-home Project", "HR & Behavioral"],
    companies: ["NVIDIA", "Tesla", "Google", "Qualcomm", "Ola Electric"],
    focusDefault: "Deep Learning",
  },
  mlops_engineer: {
    id: "mlops_engineer", label: "MLOps Engineer", icon: "🚀", color: "#10B981",
    tagline: "ML pipelines, deployment, monitoring & infrastructure",
    topicIds: ["mlops", "python", "sql_data", "eval", "interview_ml", "ml_core"],
    mustKnow: ["CI/CD for ML pipelines", "Model versioning & registries", "Containerization (Docker/K8s)", "Model monitoring & drift detection", "Feature stores", "Batch vs real-time inference", "A/B testing infra for models", "Scalable serving (REST/gRPC)"],
    rounds: ["Python & Systems", "Infra/DevOps Theory", "ML System Design", "Take-home: Deploy a model", "HR & Behavioral"],
    companies: ["Amazon", "Microsoft", "Databricks", "Flipkart", "Razorpay"],
    focusDefault: "MLOps",
  },
  data_analyst: {
    id: "data_analyst", label: "Data Analyst", icon: "📈", color: "#60A5FA",
    tagline: "SQL, dashboards, statistics & business insight",
    topicIds: ["sql_data", "stats", "numpy", "eval", "python"],
    mustKnow: ["SQL joins & window functions", "Pivot tables & aggregations", "Statistical significance basics", "Data visualization principles", "Cohort & funnel analysis", "Outlier detection", "Excel/Pandas data cleaning", "Storytelling with data"],
    rounds: ["SQL Test", "Excel/Pandas", "Case Study", "Stats Basics", "HR & Behavioral"],
    companies: ["Deloitte", "Accenture", "Swiggy", "Myntra", "TCS"],
    focusDefault: "Statistics Heavy",
  },
};

const ROLE_LIST = Object.values(ROLE_PROFILES);

const callClaude = async (messages, systemPrompt) => {
  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1200,
      system: systemPrompt,
      messages,
    }),
  });
  const data = await response.json();
  return data.content?.[0]?.text || "Sorry, could not generate a response.";
};

// ---------- ROLE SELECTOR (entry gate) ----------
function RoleSelector({ onSelect }) {
  const [query, setQuery] = useState("");
  const filtered = ROLE_LIST.filter(r => r.label.toLowerCase().includes(query.toLowerCase()));

  return (
    <div style={{
      minHeight: "100vh", background: COLORS.bg, display: "flex", flexDirection: "column",
      alignItems: "center", padding: "60px 24px", fontFamily: "'Inter', -apple-system, sans-serif"
    }}>
      <div style={{
        width: 56, height: 56, background: COLORS.accent, borderRadius: 14,
        display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, marginBottom: 20
      }}>🧠</div>
      <h1 style={{ color: COLORS.textPrimary, fontSize: 26, fontWeight: 800, margin: 0, textAlign: "center" }}>
        What role are you interviewing for?
      </h1>
      <p style={{ color: COLORS.textSecondary, fontSize: 14, marginTop: 8, marginBottom: 32, textAlign: "center", maxWidth: 480 }}>
        Pick your target role and we'll instantly curate the exact topics, questions, and mock interviews you need — no digging through generic material.
      </p>

      <input
        value={query}
        onChange={e => setQuery(e.target.value)}
        placeholder="Search roles... (e.g. AI, Data, MLOps)"
        style={{
          width: "100%", maxWidth: 480, padding: "12px 16px", background: COLORS.surface,
          border: `1px solid ${COLORS.border}`, borderRadius: 10, color: COLORS.textPrimary,
          fontSize: 13, marginBottom: 28, boxSizing: "border-box"
        }}
      />

      <div style={{
        display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16,
        width: "100%", maxWidth: 920
      }}>
        {filtered.map(r => (
          <button key={r.id} onClick={() => onSelect(r.id)} style={{
            textAlign: "left", padding: "20px", background: COLORS.card,
            border: `1px solid ${COLORS.border}`, borderRadius: 14, cursor: "pointer",
            transition: "transform 0.15s, border-color 0.15s"
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = r.color; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = COLORS.border; }}
          >
            <div style={{
              width: 40, height: 40, background: `${r.color}22`, borderRadius: 10,
              display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, marginBottom: 12
            }}>{r.icon}</div>
            <div style={{ color: COLORS.textPrimary, fontSize: 15, fontWeight: 700, marginBottom: 6 }}>{r.label}</div>
            <div style={{ color: COLORS.textMuted, fontSize: 12, lineHeight: 1.5, marginBottom: 12 }}>{r.tagline}</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
              {r.topicIds.slice(0, 3).map(tid => {
                const t = topicById(tid);
                return t ? <span key={tid} style={{ fontSize: 10, color: r.color, background: `${r.color}18`, padding: "2px 7px", borderRadius: 4 }}>{t.icon} {t.label}</span> : null;
              })}
            </div>
          </button>
        ))}
        {filtered.length === 0 && (
          <div style={{ gridColumn: "1 / -1", textAlign: "center", color: COLORS.textMuted, padding: 30 }}>
            No roles match "{query}" — try a different search.
          </div>
        )}
      </div>
    </div>
  );
}

// ---------- SIDEBAR ----------
function Sidebar({ active, setActive, role, onSwitchRole }) {
  const navItems = [
    { id: "dashboard", label: "Prep Hub", icon: "⊞" },
    { id: "interview", label: "Mock Interview", icon: "🎙" },
    { id: "practice", label: "Practice Questions", icon: "⚡" },
    { id: "codesnippet", label: "Code Challenges", icon: "💻" },
    { id: "concepts", label: "Concept Explainer", icon: "🧠" },
    { id: "resume", label: "Resume Review", icon: "📄" },
    { id: "roadmap", label: "Study Roadmap", icon: "🗺" },
  ];

  return (
    <div style={{
      width: 235, background: COLORS.surface, borderRight: `1px solid ${COLORS.border}`,
      display: "flex", flexDirection: "column", padding: "20px 0", flexShrink: 0
    }}>
      <div style={{ padding: "0 18px 18px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
          <div style={{ width: 30, height: 30, background: COLORS.accent, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>🧠</div>
          <div style={{ color: COLORS.textPrimary, fontWeight: 700, fontSize: 14 }}>ML Prep AI</div>
        </div>
      </div>

      <button onClick={onSwitchRole} style={{
        margin: "0 14px 18px", padding: "12px 14px", background: `${role.color}15`,
        border: `1px solid ${role.color}44`, borderRadius: 10, cursor: "pointer", textAlign: "left"
      }}>
        <div style={{ color: COLORS.textMuted, fontSize: 10, marginBottom: 3 }}>PREPARING FOR</div>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ fontSize: 15 }}>{role.icon}</span>
          <span style={{ color: role.color, fontSize: 13, fontWeight: 700 }}>{role.label}</span>
        </div>
        <div style={{ color: COLORS.textMuted, fontSize: 10, marginTop: 4 }}>↻ Switch role</div>
      </button>

      <nav style={{ flex: 1, padding: "0 12px" }}>
        {navItems.map(item => (
          <button key={item.id} onClick={() => setActive(item.id)} style={{
            width: "100%", display: "flex", alignItems: "center", gap: 10,
            padding: "10px 12px", borderRadius: 8, border: "none", cursor: "pointer",
            marginBottom: 2, textAlign: "left",
            background: active === item.id ? COLORS.accentDim : "transparent",
            color: active === item.id ? COLORS.accent : COLORS.textSecondary,
            fontWeight: active === item.id ? 600 : 400, fontSize: 13,
            borderLeft: active === item.id ? `2px solid ${COLORS.accent}` : "2px solid transparent",
          }}>
            <span style={{ fontSize: 15 }}>{item.icon}</span>
            {item.label}
          </button>
        ))}
      </nav>
    </div>
  );
}

// ---------- ROLE PREP HUB (personalized dashboard) ----------
function RoleHub({ role, setActive }) {
  const weight = Math.floor(100 / role.topicIds.length);

  return (
    <div style={{ padding: "32px", overflowY: "auto", height: "100%" }}>
      <div style={{
        background: `linear-gradient(135deg, ${role.color}22, transparent)`,
        border: `1px solid ${role.color}44`, borderRadius: 14, padding: "24px 28px", marginBottom: 26
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
          <span style={{ fontSize: 28 }}>{role.icon}</span>
          <div>
            <h1 style={{ color: COLORS.textPrimary, fontSize: 21, fontWeight: 800, margin: 0 }}>{role.label} Prep Kit</h1>
            <div style={{ color: COLORS.textSecondary, fontSize: 13, marginTop: 2 }}>{role.tagline}</div>
          </div>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 14 }}>
          {role.companies.map(c => (
            <span key={c} style={{ fontSize: 11, color: COLORS.textSecondary, background: COLORS.surface, border: `1px solid ${COLORS.border}`, padding: "4px 10px", borderRadius: 6 }}>{c}</span>
          ))}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.1fr 1fr", gap: 20, marginBottom: 22 }}>
        <div style={{ background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: 12, padding: 22 }}>
          <h3 style={{ color: COLORS.textPrimary, fontSize: 14, fontWeight: 700, margin: "0 0 16px" }}>📚 Core Topics for This Role</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {role.topicIds.map(tid => {
              const t = topicById(tid);
              if (!t) return null;
              return (
                <button key={tid} onClick={() => setActive("practice")} style={{
                  display: "flex", alignItems: "center", gap: 12, padding: "12px 14px",
                  background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 9,
                  cursor: "pointer", textAlign: "left", width: "100%"
                }}>
                  <span style={{ fontSize: 18 }}>{t.icon}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ color: COLORS.textPrimary, fontSize: 13, fontWeight: 600 }}>{t.label}</div>
                    <div style={{ color: COLORS.textMuted, fontSize: 11 }}>{t.sub}</div>
                  </div>
                  <div style={{ color: t.color, fontSize: 11, fontWeight: 700 }}>~{weight}%</div>
                </button>
              );
            })}
          </div>
        </div>

        <div style={{ background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: 12, padding: 22 }}>
          <h3 style={{ color: COLORS.textPrimary, fontSize: 14, fontWeight: 700, margin: "0 0 16px" }}>✅ Must-Know Concepts</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {role.mustKnow.map((m, i) => (
              <button key={i} onClick={() => setActive("concepts")} style={{
                display: "flex", alignItems: "center", gap: 10, padding: "9px 12px",
                background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 8,
                cursor: "pointer", textAlign: "left", width: "100%"
              }}>
                <span style={{ color: role.color, fontSize: 12 }}>●</span>
                <span style={{ color: COLORS.textSecondary, fontSize: 12.5 }}>{m}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div style={{ background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: 12, padding: 22, marginBottom: 22 }}>
        <h3 style={{ color: COLORS.textPrimary, fontSize: 14, fontWeight: 700, margin: "0 0 16px" }}>🎯 Typical Interview Rounds</h3>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
          {role.rounds.map((r, i) => (
            <div key={r} style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{
                background: `${role.color}18`, border: `1px solid ${role.color}44`, borderRadius: 8,
                padding: "8px 14px", color: role.color, fontSize: 12, fontWeight: 600
              }}>{i + 1}. {r}</div>
              {i < role.rounds.length - 1 && <span style={{ color: COLORS.textMuted }}>→</span>}
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14 }}>
        {[
          { label: "Start Mock Interview", tab: "interview", icon: "🎙", desc: "Role-specific simulation" },
          { label: "Practice Questions", tab: "practice", icon: "⚡", desc: "Curated for this role" },
          { label: "Code Challenges", tab: "codesnippet", icon: "💻", desc: "Hands-on problems" },
          { label: "Get Study Roadmap", tab: "roadmap", icon: "🗺", desc: "Week-by-week plan" },
        ].map(a => (
          <button key={a.tab} onClick={() => setActive(a.tab)} style={{
            padding: "18px 16px", background: COLORS.card, border: `1px solid ${COLORS.border}`,
            borderRadius: 12, cursor: "pointer", textAlign: "left"
          }}>
            <div style={{ fontSize: 22, marginBottom: 8 }}>{a.icon}</div>
            <div style={{ color: COLORS.textPrimary, fontSize: 13, fontWeight: 700, marginBottom: 3 }}>{a.label}</div>
            <div style={{ color: COLORS.textMuted, fontSize: 11 }}>{a.desc}</div>
          </button>
        ))}
      </div>
    </div>
  );
}

// ---------- MOCK INTERVIEW ----------
function MockInterview({ role }) {
  const [company, setCompany] = useState(role.companies[0]);
  const [round, setRound] = useState(role.rounds[0]);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [started, setStarted] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const bottomRef = useRef(null);

  useEffect(() => { setCompany(role.companies[0]); setRound(role.rounds[0]); setStarted(false); setMessages([]); setFeedback(null); }, [role]);
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const systemPrompt = `You are a senior interviewer at ${company} conducting a "${round}" interview round for a ${role.label} position.
Focus areas for this role: ${role.topicIds.map(id => topicById(id)?.label).join(", ")}.
Must-know concepts to probe: ${role.mustKnow.join(", ")}.
Ask ONE focused question at a time. After each candidate answer: give 1-line feedback (✓ Good / ⚠ Incomplete / ✗ Incorrect), then ask the next question.
Be rigorous but fair. After 5-6 exchanges, summarize performance if asked.`;

  const startInterview = async () => {
    setStarted(true); setLoading(true); setMessages([]); setFeedback(null);
    const res = await callClaude([{ role: "user", content: "Begin the interview." }], systemPrompt);
    setMessages([{ role: "assistant", content: res }]);
    setLoading(false);
  };

  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    const userMsg = { role: "user", content: input };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages); setInput(""); setLoading(true);
    const res = await callClaude(newMessages, systemPrompt);
    setMessages([...newMessages, { role: "assistant", content: res }]);
    setLoading(false);
  };

  const getFeedback = async () => {
    setLoading(true);
    const res = await callClaude([
      ...messages,
      { role: "user", content: `Give comprehensive feedback on my overall interview performance for the ${role.label} role: technical depth, communication, score out of 10, and top 3 things to improve.` }
    ], systemPrompt);
    setFeedback(res); setLoading(false);
  };

  if (!started) return (
    <div style={{ padding: 32, maxWidth: 580 }}>
      <h2 style={{ color: COLORS.textPrimary, fontSize: 20, fontWeight: 700, marginBottom: 6 }}>Mock Interview — {role.label}</h2>
      <p style={{ color: COLORS.textSecondary, fontSize: 13, marginBottom: 24 }}>Simulate a real {role.label} interview. Get instant feedback after every answer.</p>
      <div style={{ background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: 12, padding: 24, marginBottom: 20 }}>
        <label style={{ color: COLORS.textSecondary, fontSize: 12, display: "block", marginBottom: 6 }}>Company</label>
        <select value={company} onChange={e => setCompany(e.target.value)} style={{ width: "100%", padding: "10px 12px", background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 8, color: COLORS.textPrimary, fontSize: 13, marginBottom: 16 }}>
          {role.companies.map(c => <option key={c}>{c}</option>)}
        </select>
        <label style={{ color: COLORS.textSecondary, fontSize: 12, display: "block", marginBottom: 6 }}>Interview Round</label>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {role.rounds.map(r => (
            <button key={r} onClick={() => setRound(r)} style={{
              padding: "7px 14px", borderRadius: 6, border: `1px solid ${round === r ? role.color : COLORS.border}`,
              background: round === r ? `${role.color}22` : "transparent",
              color: round === r ? role.color : COLORS.textSecondary, fontSize: 12, cursor: "pointer", fontWeight: round === r ? 600 : 400
            }}>{r}</button>
          ))}
        </div>
      </div>
      <button onClick={startInterview} style={{ background: role.color, color: "#000", fontWeight: 700, fontSize: 14, padding: "12px 28px", borderRadius: 8, border: "none", cursor: "pointer" }}>
        Start Interview →
      </button>
    </div>
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", padding: 24 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
        <div>
          <h2 style={{ color: COLORS.textPrimary, fontSize: 15, fontWeight: 700, margin: 0 }}>{role.label} · {company}</h2>
          <div style={{ color: COLORS.textMuted, fontSize: 12, marginTop: 2 }}>Round: {round}</div>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={getFeedback} disabled={loading || messages.length < 4} style={{ padding: "8px 14px", background: `${role.color}18`, border: `1px solid ${role.color}44`, borderRadius: 7, color: role.color, fontSize: 12, cursor: "pointer", fontWeight: 600 }}>Get Feedback</button>
          <button onClick={() => setStarted(false)} style={{ padding: "8px 14px", background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 7, color: COLORS.textSecondary, fontSize: 12, cursor: "pointer" }}>New Interview</button>
        </div>
      </div>
      <div style={{ flex: 1, overflowY: "auto", background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 12, padding: 20, marginBottom: 12, minHeight: 0 }}>
        {messages.map((m, i) => (
          <div key={i} style={{ marginBottom: 16, display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start" }}>
            <div style={{
              maxWidth: "78%", padding: "12px 16px",
              background: m.role === "user" ? role.color : COLORS.card,
              color: m.role === "user" ? "#000" : COLORS.textPrimary,
              borderRadius: m.role === "user" ? "12px 12px 2px 12px" : "12px 12px 12px 2px",
              fontSize: 13, lineHeight: 1.65,
              border: m.role === "assistant" ? `1px solid ${COLORS.border}` : "none"
            }}>
              {m.role === "assistant" && <div style={{ color: role.color, fontSize: 10, fontWeight: 700, marginBottom: 4 }}>🤖 INTERVIEWER</div>}
              <pre style={{ margin: 0, whiteSpace: "pre-wrap", fontFamily: "inherit" }}>{m.content}</pre>
            </div>
          </div>
        ))}
        {loading && <div style={{ display: "flex", gap: 6, padding: "12px 0" }}>{[0,1,2].map(i => <div key={i} style={{ width: 8, height: 8, background: role.color, borderRadius: "50%", animation: `bounce 1s ${i*0.2}s infinite` }} />)}</div>}
        {feedback && (
          <div style={{ background: `${role.color}18`, border: `1px solid ${role.color}44`, borderRadius: 10, padding: 16, marginTop: 8 }}>
            <div style={{ color: role.color, fontWeight: 700, fontSize: 12, marginBottom: 8 }}>📊 PERFORMANCE FEEDBACK</div>
            <pre style={{ color: COLORS.textPrimary, fontSize: 12, lineHeight: 1.7, whiteSpace: "pre-wrap", margin: 0, fontFamily: "inherit" }}>{feedback}</pre>
          </div>
        )}
        <div ref={bottomRef} />
      </div>
      <div style={{ display: "flex", gap: 10 }}>
        <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && sendMessage()}
          placeholder="Type your answer..."
          style={{ flex: 1, padding: "12px 16px", background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 8, color: COLORS.textPrimary, fontSize: 13 }} />
        <button onClick={sendMessage} disabled={loading || !input.trim()} style={{ padding: "12px 20px", background: role.color, border: "none", borderRadius: 8, color: "#000", fontWeight: 700, cursor: "pointer", fontSize: 14 }}>Send</button>
      </div>
      <style>{`@keyframes bounce { 0%,100% { transform: translateY(0) } 50% { transform: translateY(-6px) } }`}</style>
    </div>
  );
}

// ---------- PRACTICE QUESTIONS ----------
function PracticeQuestions({ role }) {
  const [selectedTopic, setSelectedTopic] = useState(role.topicIds[0]);
  const [difficulty, setDifficulty] = useState("Medium");
  const [qtype, setQtype] = useState("Conceptual");
  const [question, setQuestion] = useState(null);
  const [loading, setLoading] = useState(false);
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState(null);

  useEffect(() => { setSelectedTopic(role.topicIds[0]); setQuestion(null); setFeedback(null); }, [role]);

  const qtypes = ["Conceptual", "Mathematical", "Code-based", "Scenario"];
  const recommended = new Set(role.topicIds);

  const generateQuestion = async () => {
    if (!selectedTopic) return;
    setLoading(true); setQuestion(null); setAnswer(""); setFeedback(null);
    const topic = topicById(selectedTopic);
    const res = await callClaude([{
      role: "user",
      content: `Generate a single ${difficulty} ${qtype} question for "${topic.label}" (${topic.sub}) commonly asked in ${role.label} placement interviews.\n\nIf code-based: include a small Python snippet to analyze or complete.\nIf mathematical: include a specific numerical problem.\nEnd with: HINT: [one subtle hint]\n\nQuestion only — no answer.`
    }], `You are an interview expert for ${role.label} roles. Generate precise, realistic placement interview questions.`);
    setQuestion(res); setLoading(false);
  };

  const checkAnswer = async () => {
    if (!answer.trim()) return;
    setLoading(true);
    const topic = topicById(selectedTopic);
    const res = await callClaude([{
      role: "user",
      content: `Topic: ${topic.label}\nQuestion: ${question}\nCandidate answer: ${answer}\n\nEvaluate:\n1) ✓ Correct answer (detailed)\n2) Score: X/10\n3) What was good\n4) Key gaps or misconceptions\n5) One follow-up question to probe deeper`
    }], `You are an interview evaluator for ${role.label} roles. Be precise, technical, and constructive.`);
    setFeedback(res); setLoading(false);
  };

  return (
    <div style={{ padding: 32, overflowY: "auto", height: "100%" }}>
      <h2 style={{ color: COLORS.textPrimary, fontSize: 20, fontWeight: 700, marginBottom: 6 }}>Practice Questions</h2>
      <p style={{ color: COLORS.textSecondary, fontSize: 13, marginBottom: 22 }}>Curated for <span style={{ color: role.color, fontWeight: 600 }}>{role.label}</span> — starred topics are most relevant to your role.</p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10, marginBottom: 22 }}>
        {TOPICS.map(t => (
          <button key={t.id} onClick={() => setSelectedTopic(t.id)} style={{
            position: "relative", padding: "12px 10px", background: selectedTopic === t.id ? `${t.color}22` : COLORS.card,
            border: selectedTopic === t.id ? `1.5px solid ${t.color}` : `1px solid ${COLORS.border}`,
            borderRadius: 10, cursor: "pointer", textAlign: "center"
          }}>
            {recommended.has(t.id) && <span style={{ position: "absolute", top: 6, right: 8, fontSize: 10, color: role.color }}>★</span>}
            <div style={{ fontSize: 18, marginBottom: 4 }}>{t.icon}</div>
            <div style={{ color: selectedTopic === t.id ? t.color : COLORS.textSecondary, fontSize: 10, fontWeight: 500, lineHeight: 1.3 }}>{t.label}</div>
          </button>
        ))}
      </div>

      <div style={{ display: "flex", gap: 10, marginBottom: 20, flexWrap: "wrap", alignItems: "center" }}>
        <span style={{ color: COLORS.textSecondary, fontSize: 12 }}>Difficulty:</span>
        {["Easy", "Medium", "Hard"].map(d => (
          <button key={d} onClick={() => setDifficulty(d)} style={{ padding: "6px 14px", borderRadius: 6, border: `1px solid ${difficulty === d ? role.color : COLORS.border}`, background: difficulty === d ? `${role.color}22` : "transparent", color: difficulty === d ? role.color : COLORS.textSecondary, fontSize: 12, cursor: "pointer", fontWeight: difficulty === d ? 600 : 400 }}>{d}</button>
        ))}
        <span style={{ color: COLORS.textSecondary, fontSize: 12, marginLeft: 8 }}>Type:</span>
        {qtypes.map(q => (
          <button key={q} onClick={() => setQtype(q)} style={{ padding: "6px 14px", borderRadius: 6, border: `1px solid ${qtype === q ? COLORS.purple : COLORS.border}`, background: qtype === q ? "#8B5CF622" : "transparent", color: qtype === q ? COLORS.purple : COLORS.textSecondary, fontSize: 12, cursor: "pointer", fontWeight: qtype === q ? 600 : 400 }}>{q}</button>
        ))}
        <button onClick={generateQuestion} disabled={!selectedTopic || loading} style={{ marginLeft: "auto", padding: "8px 20px", background: selectedTopic ? role.color : COLORS.border, border: "none", borderRadius: 7, color: "#000", fontWeight: 700, fontSize: 12, cursor: selectedTopic ? "pointer" : "default" }}>
          {loading ? "Generating..." : "Generate ⚡"}
        </button>
      </div>

      {question && (
        <div style={{ background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: 12, padding: 24 }}>
          <div style={{ display: "flex", gap: 8, marginBottom: 12, flexWrap: "wrap" }}>
            {[topicById(selectedTopic)?.label, difficulty, qtype].map((badge, i) => (
              <span key={i} style={{ background: [`${role.color}22`, "#3B82F622", "#8B5CF622"][i], border: `1px solid ${[`${role.color}44`, "#3B82F644", "#8B5CF644"][i]}`, borderRadius: 5, padding: "3px 10px", color: [role.color, COLORS.blue, COLORS.purple][i], fontSize: 11, fontWeight: 600 }}>{badge}</span>
            ))}
          </div>
          <pre style={{ color: COLORS.textPrimary, fontSize: 13, lineHeight: 1.7, whiteSpace: "pre-wrap", marginBottom: 20, fontFamily: "inherit" }}>{question}</pre>
          <textarea value={answer} onChange={e => setAnswer(e.target.value)} placeholder="Type your answer, explanation, or code here..." rows={6} style={{ width: "100%", padding: "12px 14px", background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 8, color: COLORS.textPrimary, fontSize: 13, lineHeight: 1.6, resize: "vertical", boxSizing: "border-box", fontFamily: "monospace", marginBottom: 12 }} />
          <button onClick={checkAnswer} disabled={!answer.trim() || loading} style={{ padding: "10px 22px", background: COLORS.blue, border: "none", borderRadius: 7, color: "#fff", fontWeight: 600, fontSize: 13, cursor: "pointer" }}>
            {loading ? "Evaluating..." : "Evaluate Answer →"}
          </button>
          {feedback && (
            <div style={{ marginTop: 16, background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 10, padding: 16 }}>
              <div style={{ color: COLORS.green, fontWeight: 700, fontSize: 12, marginBottom: 8 }}>✓ EVALUATION</div>
              <pre style={{ color: COLORS.textPrimary, fontSize: 12, lineHeight: 1.75, whiteSpace: "pre-wrap", margin: 0, fontFamily: "inherit" }}>{feedback}</pre>
            </div>
          )}
        </div>
      )}

      {!question && !loading && (
        <div style={{ textAlign: "center", padding: "44px 20px", color: COLORS.textMuted, border: `1px dashed ${COLORS.border}`, borderRadius: 12 }}>
          <div style={{ fontSize: 32, marginBottom: 10 }}>⚡</div>
          <div style={{ fontSize: 13 }}>Starred topics (★) are most relevant to {role.label}. Click Generate to start.</div>
        </div>
      )}
    </div>
  );
}

// ---------- CODE CHALLENGES ----------
function CodeChallenges({ role }) {
  const libMap = {
    genai: "LangChain/LLM APIs", nlp: "Hugging Face Transformers", dl: "PyTorch", cv: "OpenCV/PyTorch",
    ml_core: "Scikit-learn", mlops: "Docker/FastAPI", numpy: "NumPy/Pandas", sql_data: "SQL in Python", python: "Python + DS",
  };
  const defaultLib = libMap[role.topicIds[0]] || "Python + DS";
  const [topic, setTopic] = useState(defaultLib);
  const [challenge, setChallenge] = useState(null);
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  useEffect(() => { setTopic(defaultLib); setChallenge(null); setResult(null); }, [role]);

  const codeTopics = Array.from(new Set(role.topicIds.map(id => libMap[id]).filter(Boolean).concat(["Python + DS", "Scikit-learn", "PyTorch"])));

  const getChallenge = async () => {
    setLoading(true); setChallenge(null); setCode(""); setResult(null);
    const res = await callClaude([{
      role: "user",
      content: `Create a practical ${topic} coding challenge for a ${role.label} placement interview. Include:\n1. Problem statement (3-5 lines)\n2. Starter code (Python skeleton with TODO comments)\n3. Expected output / example\n\nMake it realistic — something a ${role.label} would actually be asked to build. Format clearly.`
    }], "You are an ML/AI coding challenge designer. Create practical, interview-relevant Python coding problems.");
    setChallenge(res); setLoading(false);
  };

  const reviewCode = async () => {
    if (!code.trim()) return;
    setLoading(true);
    const res = await callClaude([{
      role: "user",
      content: `Challenge:\n${challenge}\n\nCandidate's code:\n\`\`\`python\n${code}\n\`\`\`\n\nReview:\n1) Correctness\n2) Code quality & Pythonic style\n3) Efficiency\n4) Bugs or edge cases missed\n5) Score: X/10\n6) Improved version (brief)`
    }], "You are an expert ML code reviewer. Be technical and precise.");
    setResult(res); setLoading(false);
  };

  return (
    <div style={{ padding: 32, overflowY: "auto", height: "100%" }}>
      <h2 style={{ color: COLORS.textPrimary, fontSize: 20, fontWeight: 700, marginBottom: 6 }}>Code Challenges</h2>
      <p style={{ color: COLORS.textSecondary, fontSize: 13, marginBottom: 22 }}>Hands-on problems matched to <span style={{ color: role.color, fontWeight: 600 }}>{role.label}</span> tooling.</p>

      <div style={{ display: "flex", gap: 10, marginBottom: 20, flexWrap: "wrap" }}>
        {codeTopics.map(t => (
          <button key={t} onClick={() => setTopic(t)} style={{
            padding: "9px 16px", borderRadius: 8, border: `1px solid ${topic === t ? role.color : COLORS.border}`,
            background: topic === t ? `${role.color}22` : COLORS.card,
            color: topic === t ? role.color : COLORS.textSecondary, fontSize: 13, cursor: "pointer", fontWeight: topic === t ? 600 : 400
          }}>{t}</button>
        ))}
        <button onClick={getChallenge} disabled={loading} style={{ marginLeft: "auto", padding: "9px 20px", background: role.color, border: "none", borderRadius: 8, color: "#000", fontWeight: 700, fontSize: 13, cursor: "pointer" }}>
          {loading ? "Loading..." : "Get Challenge 💻"}
        </button>
      </div>

      {challenge && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
          <div>
            <div style={{ background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: 10, padding: 20, marginBottom: 16 }}>
              <div style={{ color: role.color, fontSize: 11, fontWeight: 700, marginBottom: 10 }}>📋 CHALLENGE</div>
              <pre style={{ color: COLORS.textPrimary, fontSize: 12, lineHeight: 1.7, whiteSpace: "pre-wrap", margin: 0, fontFamily: "inherit" }}>{challenge}</pre>
            </div>
          </div>
          <div>
            <div style={{ marginBottom: 8, display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: COLORS.textSecondary, fontSize: 12 }}>Your Solution (Python)</span>
              <span style={{ color: COLORS.textMuted, fontSize: 11 }}>Ctrl+Enter to review</span>
            </div>
            <textarea
              value={code}
              onChange={e => setCode(e.target.value)}
              onKeyDown={e => e.key === "Enter" && e.ctrlKey && reviewCode()}
              placeholder="# Write your Python code here"
              rows={14}
              style={{ width: "100%", padding: "14px", background: "#0D1117", border: `1px solid ${COLORS.border}`, borderRadius: 8, color: "#E6EDF3", fontSize: 12, lineHeight: 1.6, resize: "vertical", boxSizing: "border-box", fontFamily: "'JetBrains Mono', monospace", marginBottom: 10 }}
            />
            <button onClick={reviewCode} disabled={!code.trim() || loading} style={{ width: "100%", padding: "10px", background: COLORS.purple, border: "none", borderRadius: 7, color: "#fff", fontWeight: 600, fontSize: 13, cursor: "pointer" }}>
              {loading ? "Reviewing..." : "Review My Code →"}
            </button>
          </div>
        </div>
      )}

      {result && (
        <div style={{ marginTop: 20, background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: 10, padding: 20 }}>
          <div style={{ color: COLORS.purple, fontWeight: 700, fontSize: 12, marginBottom: 10 }}>🔍 CODE REVIEW</div>
          <pre style={{ color: COLORS.textPrimary, fontSize: 12, lineHeight: 1.75, whiteSpace: "pre-wrap", margin: 0, fontFamily: "inherit" }}>{result}</pre>
        </div>
      )}

      {!challenge && !loading && (
        <div style={{ textAlign: "center", padding: "44px 20px", color: COLORS.textMuted, border: `1px dashed ${COLORS.border}`, borderRadius: 12 }}>
          <div style={{ fontSize: 32, marginBottom: 10 }}>💻</div>
          <div style={{ fontSize: 13 }}>Pick a library and click "Get Challenge" to start coding</div>
        </div>
      )}
    </div>
  );
}

// ---------- CONCEPT EXPLAINER ----------
function ConceptExplainer({ role }) {
  const [concept, setConcept] = useState("");
  const [depth, setDepth] = useState("Interview-ready");
  const [explanation, setExplanation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [followUp, setFollowUp] = useState("");
  const [followUpRes, setFollowUpRes] = useState(null);

  useEffect(() => { setExplanation(null); setConcept(""); setFollowUpRes(null); }, [role]);

  const depthOptions = ["5-year-old", "Interview-ready", "Research-level"];

  const explainConcept = async (c) => {
    const q = c || concept;
    if (!q.trim()) return;
    setLoading(true); setExplanation(null); setFollowUpRes(null);
    const res = await callClaude([{
      role: "user",
      content: `Explain "${q}" at ${depth} depth for a ${role.label} placement candidate.\n\nInclude:\n1. Core intuition (simple analogy)\n2. Mathematical/technical explanation\n3. Python code snippet (if applicable)\n4. Common interview question about this topic\n5. When to use it / real-world example`
    }], `You are an educator preparing candidates for ${role.label} interviews. Explain clearly, bridging intuition with technical rigor.`);
    setExplanation(res); setLoading(false);
  };

  const askFollowUp = async () => {
    if (!followUp.trim()) return;
    setLoading(true);
    const res = await callClaude([
      { role: "user", content: `Explain ${concept || "this concept"} at ${depth} depth.` },
      { role: "assistant", content: explanation },
      { role: "user", content: followUp }
    ], `You are an educator for ${role.label} interview prep. Continue the explanation, being precise and helpful.`);
    setFollowUpRes(res); setLoading(false);
  };

  return (
    <div style={{ padding: 32, overflowY: "auto", height: "100%", maxWidth: 740 }}>
      <h2 style={{ color: COLORS.textPrimary, fontSize: 20, fontWeight: 700, marginBottom: 6 }}>Concept Explainer</h2>
      <p style={{ color: COLORS.textSecondary, fontSize: 13, marginBottom: 22 }}>Must-know concepts for <span style={{ color: role.color, fontWeight: 600 }}>{role.label}</span> — tap to get an instant breakdown.</p>

      <div style={{ display: "flex", gap: 10, marginBottom: 12, alignItems: "center" }}>
        {depthOptions.map(d => (
          <button key={d} onClick={() => setDepth(d)} style={{ padding: "7px 14px", borderRadius: 6, border: `1px solid ${depth === d ? role.color : COLORS.border}`, background: depth === d ? `${role.color}22` : "transparent", color: depth === d ? role.color : COLORS.textSecondary, fontSize: 12, cursor: "pointer", fontWeight: depth === d ? 600 : 400 }}>{d}</button>
        ))}
      </div>

      <div style={{ display: "flex", gap: 10, marginBottom: 18 }}>
        <input value={concept} onChange={e => setConcept(e.target.value)} onKeyDown={e => e.key === "Enter" && explainConcept()} placeholder="Type any concept..." style={{ flex: 1, padding: "11px 14px", background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 8, color: COLORS.textPrimary, fontSize: 13 }} />
        <button onClick={() => explainConcept()} disabled={!concept.trim() || loading} style={{ padding: "11px 20px", background: role.color, border: "none", borderRadius: 8, color: "#000", fontWeight: 700, fontSize: 13, cursor: "pointer" }}>
          {loading ? "..." : "Explain 🧠"}
        </button>
      </div>

      <div style={{ marginBottom: 20 }}>
        <div style={{ color: COLORS.textMuted, fontSize: 11, marginBottom: 8 }}>MUST-KNOW FOR {role.label.toUpperCase()}</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {role.mustKnow.map(c => (
            <button key={c} onClick={() => { setConcept(c); explainConcept(c); }} style={{ padding: "6px 12px", background: COLORS.card, border: `1px solid ${role.color}44`, borderRadius: 6, color: role.color, fontSize: 11, cursor: "pointer" }}>{c}</button>
          ))}
        </div>
      </div>

      {explanation && (
        <div style={{ background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: 12, padding: 24, marginBottom: 16 }}>
          <div style={{ color: role.color, fontSize: 12, fontWeight: 700, marginBottom: 10 }}>🧠 {concept.toUpperCase()} — {depth.toUpperCase()}</div>
          <pre style={{ color: COLORS.textPrimary, fontSize: 13, lineHeight: 1.75, whiteSpace: "pre-wrap", margin: 0, fontFamily: "inherit" }}>{explanation}</pre>

          <div style={{ marginTop: 16, paddingTop: 14, borderTop: `1px solid ${COLORS.border}` }}>
            <div style={{ color: COLORS.textSecondary, fontSize: 12, marginBottom: 8 }}>Ask a follow-up question</div>
            <div style={{ display: "flex", gap: 10 }}>
              <input value={followUp} onChange={e => setFollowUp(e.target.value)} onKeyDown={e => e.key === "Enter" && askFollowUp()} placeholder="e.g. How does this relate to..." style={{ flex: 1, padding: "9px 12px", background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 7, color: COLORS.textPrimary, fontSize: 12 }} />
              <button onClick={askFollowUp} disabled={!followUp.trim() || loading} style={{ padding: "9px 16px", background: `${role.color}22`, border: `1px solid ${role.color}44`, borderRadius: 7, color: role.color, fontSize: 12, cursor: "pointer", fontWeight: 600 }}>Ask →</button>
            </div>
            {followUpRes && <pre style={{ marginTop: 14, color: COLORS.textPrimary, fontSize: 12, lineHeight: 1.7, whiteSpace: "pre-wrap", fontFamily: "inherit" }}>{followUpRes}</pre>}
          </div>
        </div>
      )}
    </div>
  );
}

// ---------- RESUME REVIEW ----------
function ResumeReview({ role }) {
  const [resume, setResume] = useState("");
  const [loading, setLoading] = useState(false);
  const [review, setReview] = useState(null);

  const analyzeResume = async () => {
    if (!resume.trim()) return;
    setLoading(true); setReview(null);
    const res = await callClaude([{
      role: "user",
      content: `Resume:\n${resume}\n\nTarget Role: ${role.label}\n\nAnalyze this resume:\n1. Overall Score (X/10)\n2. Top 3 Strengths (specific to ${role.label} skills)\n3. Top 3 Gaps relative to: ${role.mustKnow.slice(0,5).join(", ")}\n4. Missing keywords for "${role.label}" roles (8-10)\n5. Best project to highlight and how to improve its description\n6. One specific bullet point rewrite example\n\nBe technical and role-specific.`
    }], `You are an expert technical recruiter specializing in ${role.label} roles at top tech companies. Give precise, actionable resume feedback.`);
    setReview(res); setLoading(false);
  };

  return (
    <div style={{ padding: 32, overflowY: "auto", height: "100%", maxWidth: 720 }}>
      <h2 style={{ color: COLORS.textPrimary, fontSize: 20, fontWeight: 700, marginBottom: 6 }}>Resume Review</h2>
      <p style={{ color: COLORS.textSecondary, fontSize: 13, marginBottom: 24 }}>AI analysis tailored to <span style={{ color: role.color, fontWeight: 600 }}>{role.label}</span> roles.</p>

      <div style={{ marginBottom: 16 }}>
        <textarea value={resume} onChange={e => setResume(e.target.value)} placeholder="Paste your resume here — education, experience, projects, skills, publications..." rows={12} style={{ width: "100%", padding: "14px", background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 10, color: COLORS.textPrimary, fontSize: 12, lineHeight: 1.6, resize: "vertical", boxSizing: "border-box", fontFamily: "monospace" }} />
      </div>

      <button onClick={analyzeResume} disabled={!resume.trim() || loading} style={{ padding: "11px 26px", background: role.color, border: "none", borderRadius: 8, color: "#000", fontWeight: 700, fontSize: 13, cursor: resume.trim() ? "pointer" : "default", opacity: resume.trim() ? 1 : 0.5, marginBottom: 24 }}>
        {loading ? "Analyzing..." : `Analyze for ${role.label} 🔍`}
      </button>

      {review && (
        <div style={{ background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: 12, padding: 24 }}>
          <div style={{ color: role.color, fontSize: 12, fontWeight: 700, marginBottom: 12 }}>📊 RESUME ANALYSIS — {role.label.toUpperCase()}</div>
          <pre style={{ color: COLORS.textPrimary, fontSize: 13, lineHeight: 1.8, whiteSpace: "pre-wrap", margin: 0, fontFamily: "inherit" }}>{review}</pre>
        </div>
      )}
    </div>
  );
}

// ---------- STUDY ROADMAP ----------
function StudyRoadmap({ role }) {
  const [level, setLevel] = useState("Beginner (CS background)");
  const [loading, setLoading] = useState(false);
  const [roadmap, setRoadmap] = useState(null);

  const generateRoadmap = async () => {
    setLoading(true); setRoadmap(null);
    const res = await callClaude([{
      role: "user",
      content: `Create a detailed 10-week placement preparation roadmap for a "${level}" targeting "${role.label}" roles.\nCore topics to cover: ${role.topicIds.map(id => topicById(id)?.label).join(", ")}.\nMust-know concepts: ${role.mustKnow.join(", ")}.\nTypical interview rounds: ${role.rounds.join(", ")}.\n\nFor each week include:\n- Weekly theme\n- 4-5 specific topics\n- Key Python libraries/tools\n- 2-3 practice resources or project ideas\n- Interview question type to practice\n\nAlso include: daily time breakdown, top 5 project ideas for ${role.label}, and 5 non-obvious interview tips.`
    }], `You are a career coach specializing in placement preparation for ${role.label} roles at top tech companies.`);
    setRoadmap(res); setLoading(false);
  };

  return (
    <div style={{ padding: 32, overflowY: "auto", height: "100%", maxWidth: 700 }}>
      <h2 style={{ color: COLORS.textPrimary, fontSize: 20, fontWeight: 700, marginBottom: 6 }}>Study Roadmap</h2>
      <p style={{ color: COLORS.textSecondary, fontSize: 13, marginBottom: 24 }}>10-week plan built around <span style={{ color: role.color, fontWeight: 600 }}>{role.label}</span> requirements.</p>

      <div style={{ background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: 12, padding: 24, marginBottom: 24 }}>
        <label style={{ color: COLORS.textSecondary, fontSize: 12, display: "block", marginBottom: 8 }}>Current Level</label>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 18 }}>
          {["Beginner (CS background)", "Intermediate (some ML)", "Advanced (1+ years ML)", "Switching from Data Analyst"].map(l => (
            <button key={l} onClick={() => setLevel(l)} style={{ padding: "7px 14px", borderRadius: 6, border: `1px solid ${level === l ? role.color : COLORS.border}`, background: level === l ? `${role.color}22` : "transparent", color: level === l ? role.color : COLORS.textSecondary, fontSize: 12, cursor: "pointer", fontWeight: level === l ? 600 : 400 }}>{l}</button>
          ))}
        </div>
        <button onClick={generateRoadmap} disabled={loading} style={{ padding: "11px 24px", background: role.color, border: "none", borderRadius: 8, color: "#000", fontWeight: 700, fontSize: 13, cursor: "pointer" }}>
          {loading ? "Generating roadmap..." : "Generate My Roadmap 🗺"}
        </button>
      </div>

      {roadmap && (
        <div style={{ background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: 12, padding: 24 }}>
          <div style={{ color: role.color, fontSize: 12, fontWeight: 700, marginBottom: 12 }}>🗺 10-WEEK ROADMAP — {role.label.toUpperCase()}</div>
          <pre style={{ color: COLORS.textPrimary, fontSize: 12.5, lineHeight: 1.8, whiteSpace: "pre-wrap", margin: 0, fontFamily: "inherit" }}>{roadmap}</pre>
        </div>
      )}

      {!roadmap && !loading && (
        <div style={{ textAlign: "center", padding: "40px 20px", color: COLORS.textMuted, border: `1px dashed ${COLORS.border}`, borderRadius: 12 }}>
          <div style={{ fontSize: 32, marginBottom: 10 }}>🗺</div>
          <div style={{ fontSize: 13 }}>Pick your level above to generate a personalized roadmap</div>
        </div>
      )}
    </div>
  );
}

// ---------- APP ----------
export default function App() {
  const [selectedRoleId, setSelectedRoleId] = useState(null);
  const [active, setActive] = useState("dashboard");

  if (!selectedRoleId) {
    return <RoleSelector onSelect={(id) => { setSelectedRoleId(id); setActive("dashboard"); }} />;
  }

  const role = ROLE_PROFILES[selectedRoleId];

  const views = {
    dashboard: <RoleHub role={role} setActive={setActive} />,
    interview: <MockInterview role={role} />,
    practice: <PracticeQuestions role={role} />,
    codesnippet: <CodeChallenges role={role} />,
    concepts: <ConceptExplainer role={role} />,
    resume: <ResumeReview role={role} />,
    roadmap: <StudyRoadmap role={role} />,
  };

  return (
    <div style={{ display: "flex", height: "100vh", background: COLORS.bg, fontFamily: "'Inter', -apple-system, sans-serif", color: COLORS.textPrimary, overflow: "hidden" }}>
      <Sidebar active={active} setActive={setActive} role={role} onSwitchRole={() => setSelectedRoleId(null)} />
      <main style={{ flex: 1, overflow: "hidden", display: "flex", flexDirection: "column" }}>{views[active]}</main>
    </div>
  );
}
