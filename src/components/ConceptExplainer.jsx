import { useState, useEffect } from 'react';
import { COLORS } from '../data/colors';
import { callAI } from '../services/ai';

export default function ConceptExplainer({ role }) {
  const [concept, setConcept] = useState('');
  const [depth, setDepth] = useState('Interview-ready');
  const [explanation, setExplanation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [followUp, setFollowUp] = useState('');
  const [followUpRes, setFollowUpRes] = useState(null);

  useEffect(() => {
    setExplanation(null);
    setConcept('');
    setFollowUp('');
    setFollowUpRes(null);
  }, [role.id]);

  const depthOptions = ['5-year-old', 'Interview-ready', 'Research-level'];

  const explainConcept = async (c) => {
    const q = c || concept;
    if (!q.trim()) return;
    setLoading(true);
    setExplanation(null);
    setFollowUpRes(null);
    setFollowUp('');
    try {
      const res = await callAI(
        [
          {
            role: 'user',
            content: `Explain "${q}" at ${depth} depth for a ${role.label} placement candidate.\n\nInclude:\n1. Core intuition (simple analogy)\n2. Mathematical/technical explanation\n3. Python code snippet (if applicable)\n4. Common interview question about this topic\n5. When to use it / real-world example`,
          },
        ],
        `You are an educator preparing candidates for ${role.label} interviews. Explain clearly, bridging intuition with technical rigor.`
      );
      setExplanation(res);
    } catch (err) {
      setExplanation('Sorry, could not generate an explanation. Please try again.');
    }
    setLoading(false);
  };

  const askFollowUp = async () => {
    if (!followUp.trim()) return;
    setLoading(true);
    try {
      const res = await callAI(
        [
          { role: 'user', content: `Explain ${concept || 'this concept'} at ${depth} depth.` },
          { role: 'assistant', content: explanation },
          { role: 'user', content: followUp },
        ],
        `You are an educator for ${role.label} interview prep. Continue the explanation, being precise and helpful.`
      );
      setFollowUpRes(res);
    } catch (err) {
      setFollowUpRes('Sorry, could not answer your follow-up. Please try again.');
    }
    setLoading(false);
  };

  return (
    <div
      style={{
        padding: 32,
        overflowY: 'auto',
        height: '100%',
        maxWidth: 740,
      }}
    >
      <h2
        style={{
          color: COLORS.textPrimary,
          fontSize: 20,
          fontWeight: 700,
          marginBottom: 6,
        }}
      >
        Concept Explainer
      </h2>
      <p
        style={{
          color: COLORS.textSecondary,
          fontSize: 13,
          marginBottom: 22,
        }}
      >
        Must-know concepts for{' '}
        <span style={{ color: role.color, fontWeight: 600 }}>
          {role.label}
        </span>{' '}
        — tap to get an instant breakdown.
      </p>

      {/* Depth selector */}
      <div
        style={{
          display: 'flex',
          gap: 10,
          marginBottom: 12,
          alignItems: 'center',
        }}
      >
        {depthOptions.map((d) => (
          <button
            key={d}
            onClick={() => setDepth(d)}
            style={{
              padding: '7px 14px',
              borderRadius: 6,
              border: `1px solid ${depth === d ? role.color : COLORS.border}`,
              background: depth === d ? `${role.color}22` : 'transparent',
              color: depth === d ? role.color : COLORS.textSecondary,
              fontSize: 12,
              cursor: 'pointer',
              fontWeight: depth === d ? 600 : 400,
              transition: 'all 0.15s ease',
            }}
          >
            {d}
          </button>
        ))}
      </div>

      {/* Concept input + Explain button */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 18 }}>
        <input
          value={concept}
          onChange={(e) => setConcept(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && explainConcept()}
          placeholder="Type any concept..."
          style={{
            flex: 1,
            padding: '11px 14px',
            background: COLORS.surface,
            border: `1px solid ${COLORS.border}`,
            borderRadius: 8,
            color: COLORS.textPrimary,
            fontSize: 13,
            outline: 'none',
            transition: 'border-color 0.15s ease',
          }}
        />
        <button
          onClick={() => explainConcept()}
          disabled={!concept.trim() || loading}
          style={{
            padding: '11px 20px',
            background: role.color,
            border: 'none',
            borderRadius: 8,
            color: '#000',
            fontWeight: 700,
            fontSize: 13,
            cursor: !concept.trim() || loading ? 'not-allowed' : 'pointer',
            opacity: !concept.trim() || loading ? 0.5 : 1,
            transition: 'all 0.15s ease',
          }}
        >
          {loading ? '...' : 'Explain 🧠'}
        </button>
      </div>

      {/* Must-know concept chips */}
      <div style={{ marginBottom: 20 }}>
        <div
          style={{
            color: COLORS.textMuted,
            fontSize: 11,
            marginBottom: 8,
          }}
        >
          MUST-KNOW FOR {role.label.toUpperCase()}
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {role.mustKnow.map((c) => (
            <button
              key={c}
              onClick={() => {
                setConcept(c);
                explainConcept(c);
              }}
              style={{
                padding: '6px 12px',
                background: COLORS.card,
                border: `1px solid ${role.color}44`,
                borderRadius: 6,
                color: role.color,
                fontSize: 11,
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Explanation card */}
      {explanation && (
        <div
          style={{
            background: COLORS.card,
            border: `1px solid ${COLORS.border}`,
            borderRadius: 12,
            padding: 24,
            marginBottom: 16,
          }}
        >
          <div
            style={{
              color: role.color,
              fontSize: 12,
              fontWeight: 700,
              marginBottom: 10,
            }}
          >
            🧠 {concept.toUpperCase()} — {depth.toUpperCase()}
          </div>
          <pre
            style={{
              color: COLORS.textPrimary,
              fontSize: 13,
              lineHeight: 1.75,
              whiteSpace: 'pre-wrap',
              margin: 0,
              fontFamily: 'inherit',
            }}
          >
            {explanation}
          </pre>

          {/* Follow-up section */}
          <div
            style={{
              marginTop: 16,
              paddingTop: 14,
              borderTop: `1px solid ${COLORS.border}`,
            }}
          >
            <div
              style={{
                color: COLORS.textSecondary,
                fontSize: 12,
                marginBottom: 8,
              }}
            >
              Ask a follow-up question
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <input
                value={followUp}
                onChange={(e) => setFollowUp(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && askFollowUp()}
                placeholder="e.g. How does this relate to..."
                style={{
                  flex: 1,
                  padding: '9px 12px',
                  background: COLORS.surface,
                  border: `1px solid ${COLORS.border}`,
                  borderRadius: 7,
                  color: COLORS.textPrimary,
                  fontSize: 12,
                  outline: 'none',
                }}
              />
              <button
                onClick={askFollowUp}
                disabled={!followUp.trim() || loading}
                style={{
                  padding: '9px 16px',
                  background: `${role.color}22`,
                  border: `1px solid ${role.color}44`,
                  borderRadius: 7,
                  color: role.color,
                  fontSize: 12,
                  cursor: !followUp.trim() || loading ? 'not-allowed' : 'pointer',
                  fontWeight: 600,
                  opacity: !followUp.trim() || loading ? 0.5 : 1,
                  transition: 'all 0.15s ease',
                }}
              >
                Ask →
              </button>
            </div>
            {followUpRes && (
              <pre
                style={{
                  marginTop: 14,
                  color: COLORS.textPrimary,
                  fontSize: 12,
                  lineHeight: 1.7,
                  whiteSpace: 'pre-wrap',
                  fontFamily: 'inherit',
                }}
              >
                {followUpRes}
              </pre>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
