import { useState, useEffect } from 'react';
import { COLORS } from '../data/colors';
import { callAI } from '../services/ai';

const LIB_MAP = {
  genai: 'LangChain/LLM APIs',
  nlp: 'Hugging Face Transformers',
  dl: 'PyTorch',
  cv: 'OpenCV/PyTorch',
  ml_core: 'Scikit-learn',
  mlops: 'Docker/FastAPI',
  numpy: 'NumPy/Pandas',
  sql_data: 'SQL in Python',
  python: 'Python + DS',
  dsa: 'Python + DS',
  javascript: 'JavaScript',
  react_dom: 'React',
  java: 'Java',
  system_design: 'System Design',
  feature_eng: 'Scikit-learn',
  eval: 'Scikit-learn',
  stats: 'NumPy/Pandas',
  interview_ml: 'System Design',
};

export default function CodeChallenges({ role }) {
  const defaultLib = LIB_MAP[role.topicIds[0]] || 'Python + DS';

  const [topic, setTopic] = useState(defaultLib);
  const [challenge, setChallenge] = useState(null);
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  useEffect(() => {
    setTopic(LIB_MAP[role.topicIds[0]] || 'Python + DS');
    setChallenge(null);
    setCode('');
    setResult(null);
  }, [role.id]);

  // Derive code topics from role's topicIds, deduped
  const codeTopics = Array.from(
    new Set(
      role.topicIds
        .map((id) => LIB_MAP[id])
        .filter(Boolean)
        .concat(['Python + DS', 'Scikit-learn', 'PyTorch'])
    )
  );

  const getChallenge = async () => {
    setLoading(true);
    setChallenge(null);
    setCode('');
    setResult(null);
    try {
      const res = await callAI(
        [
          {
            role: 'user',
            content: `Create a practical ${topic} coding challenge for a ${role.label} placement interview. Include:\n1. Problem statement (3-5 lines)\n2. Starter code (Python skeleton with TODO comments)\n3. Expected output / example\n\nMake it realistic — something a ${role.label} would actually be asked to build. Format clearly.`,
          },
        ],
        'You are an ML/AI coding challenge designer. Create practical, interview-relevant Python coding problems.'
      );
      setChallenge(res);
    } catch (err) {
      setChallenge('Sorry, could not generate a challenge. Please try again.');
    }
    setLoading(false);
  };

  const reviewCode = async () => {
    if (!code.trim()) return;
    setLoading(true);
    try {
      const res = await callAI(
        [
          {
            role: 'user',
            content: `Challenge:\n${challenge}\n\nCandidate's code:\n\`\`\`python\n${code}\n\`\`\`\n\nReview:\n1) Correctness\n2) Code quality & Pythonic style\n3) Efficiency\n4) Bugs or edge cases missed\n5) Score: X/10\n6) Improved version (brief)`,
          },
        ],
        'You are an expert ML code reviewer. Be technical and precise.'
      );
      setResult(res);
    } catch (err) {
      setResult('Sorry, could not review your code. Please try again.');
    }
    setLoading(false);
  };

  return (
    <div style={{ padding: 32, overflowY: 'auto', height: '100%' }}>
      <h2
        style={{
          color: COLORS.textPrimary,
          fontSize: 20,
          fontWeight: 700,
          marginBottom: 6,
        }}
      >
        Code Challenges
      </h2>
      <p
        style={{
          color: COLORS.textSecondary,
          fontSize: 13,
          marginBottom: 22,
        }}
      >
        Hands-on problems matched to{' '}
        <span style={{ color: role.color, fontWeight: 600 }}>
          {role.label}
        </span>{' '}
        tooling.
      </p>

      {/* Library/framework chips */}
      <div
        style={{
          display: 'flex',
          gap: 10,
          marginBottom: 20,
          flexWrap: 'wrap',
        }}
      >
        {codeTopics.map((t) => (
          <button
            key={t}
            onClick={() => setTopic(t)}
            style={{
              padding: '9px 16px',
              borderRadius: 8,
              border: `1px solid ${topic === t ? role.color : COLORS.border}`,
              background: topic === t ? `${role.color}22` : COLORS.card,
              color: topic === t ? role.color : COLORS.textSecondary,
              fontSize: 13,
              cursor: 'pointer',
              fontWeight: topic === t ? 600 : 400,
              transition: 'all 0.15s ease',
            }}
          >
            {t}
          </button>
        ))}
        <button
          onClick={getChallenge}
          disabled={loading}
          style={{
            marginLeft: 'auto',
            padding: '9px 20px',
            background: role.color,
            border: 'none',
            borderRadius: 8,
            color: '#000',
            fontWeight: 700,
            fontSize: 13,
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.5 : 1,
            transition: 'all 0.15s ease',
          }}
        >
          {loading ? 'Loading...' : 'Get Challenge 💻'}
        </button>
      </div>

      {/* Split pane: challenge + code editor */}
      {challenge && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 20,
          }}
        >
          {/* Left: Challenge description */}
          <div>
            <div
              style={{
                background: COLORS.card,
                border: `1px solid ${COLORS.border}`,
                borderRadius: 10,
                padding: 20,
                marginBottom: 16,
              }}
            >
              <div
                style={{
                  color: role.color,
                  fontSize: 11,
                  fontWeight: 700,
                  marginBottom: 10,
                }}
              >
                📋 CHALLENGE
              </div>
              <pre
                style={{
                  color: COLORS.textPrimary,
                  fontSize: 12,
                  lineHeight: 1.7,
                  whiteSpace: 'pre-wrap',
                  margin: 0,
                  fontFamily: 'inherit',
                }}
              >
                {challenge}
              </pre>
            </div>
          </div>

          {/* Right: Code editor */}
          <div>
            <div
              style={{
                marginBottom: 8,
                display: 'flex',
                justifyContent: 'space-between',
              }}
            >
              <span style={{ color: COLORS.textSecondary, fontSize: 12 }}>
                Your Solution (Python)
              </span>
              <span style={{ color: COLORS.textMuted, fontSize: 11 }}>
                Ctrl+Enter to review
              </span>
            </div>
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && e.ctrlKey && reviewCode()}
              placeholder="# Write your Python code here"
              rows={14}
              style={{
                width: '100%',
                padding: '14px',
                background: '#0D1117',
                border: `1px solid ${COLORS.border}`,
                borderRadius: 8,
                color: '#E6EDF3',
                fontSize: 12,
                lineHeight: 1.6,
                resize: 'vertical',
                boxSizing: 'border-box',
                fontFamily: "'JetBrains Mono', monospace",
                marginBottom: 10,
                outline: 'none',
              }}
            />
            <button
              onClick={reviewCode}
              disabled={!code.trim() || loading}
              style={{
                width: '100%',
                padding: '10px',
                background: COLORS.purple,
                border: 'none',
                borderRadius: 7,
                color: '#fff',
                fontWeight: 600,
                fontSize: 13,
                cursor: !code.trim() || loading ? 'not-allowed' : 'pointer',
                opacity: !code.trim() || loading ? 0.5 : 1,
                transition: 'all 0.15s ease',
              }}
            >
              {loading ? 'Reviewing...' : 'Review My Code →'}
            </button>
          </div>
        </div>
      )}

      {/* Code review result */}
      {result && (
        <div
          style={{
            marginTop: 20,
            background: COLORS.card,
            border: `1px solid ${COLORS.border}`,
            borderRadius: 10,
            padding: 20,
          }}
        >
          <div
            style={{
              color: COLORS.purple,
              fontWeight: 700,
              fontSize: 12,
              marginBottom: 10,
            }}
          >
            🔍 CODE REVIEW
          </div>
          <pre
            style={{
              color: COLORS.textPrimary,
              fontSize: 12,
              lineHeight: 1.75,
              whiteSpace: 'pre-wrap',
              margin: 0,
              fontFamily: 'inherit',
            }}
          >
            {result}
          </pre>
        </div>
      )}

      {/* Empty state */}
      {!challenge && !loading && (
        <div
          style={{
            textAlign: 'center',
            padding: '44px 20px',
            color: COLORS.textMuted,
            border: `1px dashed ${COLORS.border}`,
            borderRadius: 12,
          }}
        >
          <div style={{ fontSize: 32, marginBottom: 10 }}>💻</div>
          <div style={{ fontSize: 13 }}>
            Pick a library and click "Get Challenge" to start coding
          </div>
        </div>
      )}
    </div>
  );
}
