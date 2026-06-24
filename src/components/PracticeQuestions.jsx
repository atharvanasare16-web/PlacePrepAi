import { useState, useEffect } from 'react';
import { COLORS } from '../data/colors';
import { TOPICS, topicById } from '../data/topics';
import { callAI } from '../services/ai';

export default function PracticeQuestions({ role }) {
  const [selectedTopic, setSelectedTopic] = useState(role.topicIds[0]);
  const [difficulty, setDifficulty] = useState('Medium');
  const [qtype, setQtype] = useState('Conceptual');
  const [question, setQuestion] = useState(null);
  const [loading, setLoading] = useState(false);
  const [answer, setAnswer] = useState('');
  const [feedback, setFeedback] = useState(null);

  useEffect(() => {
    setSelectedTopic(role.topicIds[0]);
    setQuestion(null);
    setAnswer('');
    setFeedback(null);
  }, [role.id]);

  const qtypes = ['Conceptual', 'Mathematical', 'Code-based', 'Scenario'];
  const recommended = new Set(role.topicIds);

  const generateQuestion = async () => {
    if (!selectedTopic) return;
    setLoading(true);
    setQuestion(null);
    setAnswer('');
    setFeedback(null);
    const topic = topicById(selectedTopic);
    try {
      const res = await callAI(
        [
          {
            role: 'user',
            content: `Generate a single ${difficulty} ${qtype} question for "${topic.label}" (${topic.sub}) commonly asked in ${role.label} placement interviews.\n\nIf code-based: include a small Python snippet to analyze or complete.\nIf mathematical: include a specific numerical problem.\nEnd with: HINT: [one subtle hint]\n\nQuestion only — no answer.`,
          },
        ],
        `You are an interview expert for ${role.label} roles. Generate precise, realistic placement interview questions.`
      );
      setQuestion(res);
    } catch (err) {
      setQuestion('Sorry, could not generate a question. Please try again.');
    }
    setLoading(false);
  };

  const checkAnswer = async () => {
    if (!answer.trim()) return;
    setLoading(true);
    const topic = topicById(selectedTopic);
    try {
      const res = await callAI(
        [
          {
            role: 'user',
            content: `Topic: ${topic.label}\nQuestion: ${question}\nCandidate answer: ${answer}\n\nEvaluate:\n1) ✓ Correct answer (detailed)\n2) Score: X/10\n3) What was good\n4) Key gaps or misconceptions\n5) One follow-up question to probe deeper`,
          },
        ],
        `You are an interview evaluator for ${role.label} roles. Be precise, technical, and constructive.`
      );
      setFeedback(res);
    } catch (err) {
      setFeedback('Sorry, could not evaluate your answer. Please try again.');
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
        Practice Questions
      </h2>
      <p
        style={{
          color: COLORS.textSecondary,
          fontSize: 13,
          marginBottom: 22,
        }}
      >
        Curated for{' '}
        <span style={{ color: role.color, fontWeight: 600 }}>
          {role.label}
        </span>{' '}
        — starred topics are most relevant to your role.
      </p>

      {/* Topic grid - 4 columns */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 10,
          marginBottom: 22,
        }}
      >
        {TOPICS.map((t) => (
          <button
            key={t.id}
            onClick={() => setSelectedTopic(t.id)}
            style={{
              position: 'relative',
              padding: '12px 10px',
              background:
                selectedTopic === t.id ? `${t.color}22` : COLORS.card,
              border:
                selectedTopic === t.id
                  ? `1.5px solid ${t.color}`
                  : `1px solid ${COLORS.border}`,
              borderRadius: 10,
              cursor: 'pointer',
              textAlign: 'center',
              transition: 'all 0.15s ease',
            }}
          >
            {recommended.has(t.id) && (
              <span
                style={{
                  position: 'absolute',
                  top: 6,
                  right: 8,
                  fontSize: 10,
                  color: role.color,
                }}
              >
                ★
              </span>
            )}
            <div style={{ fontSize: 18, marginBottom: 4 }}>{t.icon}</div>
            <div
              style={{
                color:
                  selectedTopic === t.id ? t.color : COLORS.textSecondary,
                fontSize: 10,
                fontWeight: 500,
                lineHeight: 1.3,
              }}
            >
              {t.label}
            </div>
          </button>
        ))}
      </div>

      {/* Difficulty and type selectors */}
      <div
        style={{
          display: 'flex',
          gap: 10,
          marginBottom: 20,
          flexWrap: 'wrap',
          alignItems: 'center',
        }}
      >
        <span style={{ color: COLORS.textSecondary, fontSize: 12 }}>
          Difficulty:
        </span>
        {['Easy', 'Medium', 'Hard'].map((d) => (
          <button
            key={d}
            onClick={() => setDifficulty(d)}
            style={{
              padding: '6px 14px',
              borderRadius: 6,
              border: `1px solid ${difficulty === d ? role.color : COLORS.border}`,
              background: difficulty === d ? `${role.color}22` : 'transparent',
              color: difficulty === d ? role.color : COLORS.textSecondary,
              fontSize: 12,
              cursor: 'pointer',
              fontWeight: difficulty === d ? 600 : 400,
              transition: 'all 0.15s ease',
            }}
          >
            {d}
          </button>
        ))}
        <span
          style={{
            color: COLORS.textSecondary,
            fontSize: 12,
            marginLeft: 8,
          }}
        >
          Type:
        </span>
        {qtypes.map((q) => (
          <button
            key={q}
            onClick={() => setQtype(q)}
            style={{
              padding: '6px 14px',
              borderRadius: 6,
              border: `1px solid ${qtype === q ? COLORS.purple : COLORS.border}`,
              background: qtype === q ? '#8B5CF622' : 'transparent',
              color: qtype === q ? COLORS.purple : COLORS.textSecondary,
              fontSize: 12,
              cursor: 'pointer',
              fontWeight: qtype === q ? 600 : 400,
              transition: 'all 0.15s ease',
            }}
          >
            {q}
          </button>
        ))}
        <button
          onClick={generateQuestion}
          disabled={!selectedTopic || loading}
          style={{
            marginLeft: 'auto',
            padding: '8px 20px',
            background: selectedTopic ? role.color : COLORS.border,
            border: 'none',
            borderRadius: 7,
            color: '#000',
            fontWeight: 700,
            fontSize: 12,
            cursor: selectedTopic && !loading ? 'pointer' : 'not-allowed',
            opacity: !selectedTopic || loading ? 0.5 : 1,
            transition: 'all 0.15s ease',
          }}
        >
          {loading ? 'Generating...' : 'Generate ⚡'}
        </button>
      </div>

      {/* Generated question card */}
      {question && (
        <div
          style={{
            background: COLORS.card,
            border: `1px solid ${COLORS.border}`,
            borderRadius: 12,
            padding: 24,
          }}
        >
          {/* Badges */}
          <div
            style={{
              display: 'flex',
              gap: 8,
              marginBottom: 12,
              flexWrap: 'wrap',
            }}
          >
            {[topicById(selectedTopic)?.label, difficulty, qtype].map(
              (badge, i) => (
                <span
                  key={i}
                  style={{
                    background: [
                      `${role.color}22`,
                      '#3B82F622',
                      '#8B5CF622',
                    ][i],
                    border: `1px solid ${[`${role.color}44`, '#3B82F644', '#8B5CF644'][i]}`,
                    borderRadius: 5,
                    padding: '3px 10px',
                    color: [role.color, COLORS.blue, COLORS.purple][i],
                    fontSize: 11,
                    fontWeight: 600,
                  }}
                >
                  {badge}
                </span>
              )
            )}
          </div>

          {/* Question text */}
          <pre
            style={{
              color: COLORS.textPrimary,
              fontSize: 13,
              lineHeight: 1.7,
              whiteSpace: 'pre-wrap',
              marginBottom: 20,
              fontFamily: 'inherit',
            }}
          >
            {question}
          </pre>

          {/* Answer textarea */}
          <textarea
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Type your answer, explanation, or code here..."
            rows={6}
            style={{
              width: '100%',
              padding: '12px 14px',
              background: COLORS.surface,
              border: `1px solid ${COLORS.border}`,
              borderRadius: 8,
              color: COLORS.textPrimary,
              fontSize: 13,
              lineHeight: 1.6,
              resize: 'vertical',
              boxSizing: 'border-box',
              fontFamily: 'monospace',
              marginBottom: 12,
              outline: 'none',
            }}
          />

          {/* Evaluate button */}
          <button
            onClick={checkAnswer}
            disabled={!answer.trim() || loading}
            style={{
              padding: '10px 22px',
              background: COLORS.blue,
              border: 'none',
              borderRadius: 7,
              color: '#fff',
              fontWeight: 600,
              fontSize: 13,
              cursor: !answer.trim() || loading ? 'not-allowed' : 'pointer',
              opacity: !answer.trim() || loading ? 0.5 : 1,
              transition: 'all 0.15s ease',
            }}
          >
            {loading ? 'Evaluating...' : 'Evaluate Answer →'}
          </button>

          {/* Feedback panel */}
          {feedback && (
            <div
              style={{
                marginTop: 16,
                background: COLORS.surface,
                border: `1px solid ${COLORS.border}`,
                borderRadius: 10,
                padding: 16,
              }}
            >
              <div
                style={{
                  color: COLORS.green,
                  fontWeight: 700,
                  fontSize: 12,
                  marginBottom: 8,
                }}
              >
                ✓ EVALUATION
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
                {feedback}
              </pre>
            </div>
          )}
        </div>
      )}

      {/* Empty state */}
      {!question && !loading && (
        <div
          style={{
            textAlign: 'center',
            padding: '44px 20px',
            color: COLORS.textMuted,
            border: `1px dashed ${COLORS.border}`,
            borderRadius: 12,
          }}
        >
          <div style={{ fontSize: 32, marginBottom: 10 }}>⚡</div>
          <div style={{ fontSize: 13 }}>
            Starred topics (★) are most relevant to {role.label}. Click
            Generate to start.
          </div>
        </div>
      )}
    </div>
  );
}
