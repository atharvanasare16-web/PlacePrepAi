import { useState, useRef, useEffect } from 'react';
import { COLORS } from '../data/colors';
import { topicById } from '../data/topics';
import { callAI } from '../services/ai';

export default function MockInterview({ role }) {
  const [company, setCompany] = useState(role.companies[0]);
  const [round, setRound] = useState(role.rounds[0]);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [started, setStarted] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const bottomRef = useRef(null);

  useEffect(() => {
    setCompany(role.companies[0]);
    setRound(role.rounds[0]);
    setStarted(false);
    setMessages([]);
    setInput('');
    setFeedback(null);
  }, [role.id]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const systemPrompt = `You are a senior interviewer at ${company} conducting a "${round}" interview round for a ${role.label} position.
Focus areas for this role: ${role.topicIds.map(id => topicById(id)?.label).filter(Boolean).join(', ')}.
Must-know concepts to probe: ${role.mustKnow.join(', ')}.
Ask ONE focused question at a time. After each candidate answer: give 1-line feedback (✓ Good / ⚠ Incomplete / ✗ Incorrect), then ask the next question.
Be rigorous but fair. After 5-6 exchanges, summarize performance if asked.`;

  const startInterview = async () => {
    setStarted(true);
    setLoading(true);
    setMessages([]);
    setFeedback(null);
    try {
      const res = await callAI(
        [{ role: 'user', content: 'Begin the interview.' }],
        systemPrompt
      );
      setMessages([{ role: 'assistant', content: res }]);
    } catch (err) {
      setMessages([{ role: 'assistant', content: 'Sorry, could not start the interview. Please try again.' }]);
    }
    setLoading(false);
  };

  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    const userMsg = { role: 'user', content: input };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput('');
    setLoading(true);
    try {
      const res = await callAI(newMessages, systemPrompt);
      setMessages([...newMessages, { role: 'assistant', content: res }]);
    } catch (err) {
      setMessages([...newMessages, { role: 'assistant', content: 'Sorry, could not generate a response. Please try again.' }]);
    }
    setLoading(false);
  };

  const getFeedback = async () => {
    setLoading(true);
    try {
      const res = await callAI(
        [
          ...messages,
          {
            role: 'user',
            content: `Give comprehensive feedback on my overall interview performance for the ${role.label} role: technical depth, communication, score out of 10, and top 3 things to improve.`,
          },
        ],
        systemPrompt
      );
      setFeedback(res);
    } catch (err) {
      setFeedback('Sorry, could not generate feedback. Please try again.');
    }
    setLoading(false);
  };

  // Pre-interview setup screen
  if (!started) {
    return (
      <div style={{ padding: 32, maxWidth: 580 }}>
        <h2
          style={{
            color: COLORS.textPrimary,
            fontSize: 20,
            fontWeight: 700,
            marginBottom: 6,
          }}
        >
          Mock Interview — {role.label}
        </h2>
        <p
          style={{
            color: COLORS.textSecondary,
            fontSize: 13,
            marginBottom: 24,
          }}
        >
          Simulate a real {role.label} interview. Get instant feedback after
          every answer.
        </p>

        <div
          style={{
            background: COLORS.card,
            border: `1px solid ${COLORS.border}`,
            borderRadius: 12,
            padding: 24,
            marginBottom: 20,
          }}
        >
          <label
            style={{
              color: COLORS.textSecondary,
              fontSize: 12,
              display: 'block',
              marginBottom: 6,
            }}
          >
            Company
          </label>
          <select
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            style={{
              width: '100%',
              padding: '10px 12px',
              background: COLORS.surface,
              border: `1px solid ${COLORS.border}`,
              borderRadius: 8,
              color: COLORS.textPrimary,
              fontSize: 13,
              marginBottom: 16,
              cursor: 'pointer',
            }}
          >
            {role.companies.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>

          <label
            style={{
              color: COLORS.textSecondary,
              fontSize: 12,
              display: 'block',
              marginBottom: 6,
            }}
          >
            Interview Round
          </label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {role.rounds.map((r) => (
              <button
                key={r}
                onClick={() => setRound(r)}
                style={{
                  padding: '7px 14px',
                  borderRadius: 6,
                  border: `1px solid ${round === r ? role.color : COLORS.border}`,
                  background: round === r ? `${role.color}22` : 'transparent',
                  color: round === r ? role.color : COLORS.textSecondary,
                  fontSize: 12,
                  cursor: 'pointer',
                  fontWeight: round === r ? 600 : 400,
                  transition: 'all 0.15s ease',
                }}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={startInterview}
          style={{
            background: role.color,
            color: '#000',
            fontWeight: 700,
            fontSize: 14,
            padding: '12px 28px',
            borderRadius: 8,
            border: 'none',
            cursor: 'pointer',
            transition: 'opacity 0.15s ease',
          }}
        >
          Start Interview →
        </button>
      </div>
    );
  }

  // Active interview chat screen
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        padding: 24,
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 14,
        }}
      >
        <div>
          <h2
            style={{
              color: COLORS.textPrimary,
              fontSize: 15,
              fontWeight: 700,
              margin: 0,
            }}
          >
            {role.label} · {company}
          </h2>
          <div
            style={{
              color: COLORS.textMuted,
              fontSize: 12,
              marginTop: 2,
            }}
          >
            Round: {round}
          </div>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button
            onClick={getFeedback}
            disabled={loading || messages.length < 4}
            style={{
              padding: '8px 14px',
              background: `${role.color}18`,
              border: `1px solid ${role.color}44`,
              borderRadius: 7,
              color: role.color,
              fontSize: 12,
              cursor: loading || messages.length < 4 ? 'not-allowed' : 'pointer',
              fontWeight: 600,
              opacity: loading || messages.length < 4 ? 0.5 : 1,
              transition: 'all 0.15s ease',
            }}
          >
            Get Feedback
          </button>
          <button
            onClick={() => setStarted(false)}
            style={{
              padding: '8px 14px',
              background: COLORS.surface,
              border: `1px solid ${COLORS.border}`,
              borderRadius: 7,
              color: COLORS.textSecondary,
              fontSize: 12,
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            New Interview
          </button>
        </div>
      </div>

      {/* Chat messages area */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          background: COLORS.surface,
          border: `1px solid ${COLORS.border}`,
          borderRadius: 12,
          padding: 20,
          marginBottom: 12,
          minHeight: 0,
        }}
      >
        {messages.map((m, i) => (
          <div
            key={i}
            style={{
              marginBottom: 16,
              display: 'flex',
              justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start',
            }}
          >
            <div
              style={{
                maxWidth: '78%',
                padding: '12px 16px',
                background: m.role === 'user' ? role.color : COLORS.card,
                color: m.role === 'user' ? '#000' : COLORS.textPrimary,
                borderRadius:
                  m.role === 'user'
                    ? '12px 12px 2px 12px'
                    : '12px 12px 12px 2px',
                fontSize: 13,
                lineHeight: 1.65,
                border:
                  m.role === 'assistant'
                    ? `1px solid ${COLORS.border}`
                    : 'none',
              }}
            >
              {m.role === 'assistant' && (
                <div
                  style={{
                    color: role.color,
                    fontSize: 10,
                    fontWeight: 700,
                    marginBottom: 4,
                  }}
                >
                  🤖 INTERVIEWER
                </div>
              )}
              <pre
                style={{
                  margin: 0,
                  whiteSpace: 'pre-wrap',
                  fontFamily: 'inherit',
                  lineHeight: 1.7,
                }}
              >
                {m.content}
              </pre>
            </div>
          </div>
        ))}

        {/* Typing indicator */}
        {loading && (
          <div style={{ display: 'flex', gap: 6, padding: '12px 0' }}>
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                style={{
                  width: 8,
                  height: 8,
                  background: role.color,
                  borderRadius: '50%',
                  animation: `bounce 1s ${i * 0.2}s infinite`,
                }}
              />
            ))}
          </div>
        )}

        {/* Feedback panel */}
        {feedback && (
          <div
            style={{
              background: `${role.color}18`,
              border: `1px solid ${role.color}44`,
              borderRadius: 10,
              padding: 16,
              marginTop: 8,
            }}
          >
            <div
              style={{
                color: role.color,
                fontWeight: 700,
                fontSize: 12,
                marginBottom: 8,
              }}
            >
              📊 PERFORMANCE FEEDBACK
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
              {feedback}
            </pre>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input area */}
      <div style={{ display: 'flex', gap: 10 }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
          placeholder="Type your answer..."
          style={{
            flex: 1,
            padding: '12px 16px',
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
          onClick={sendMessage}
          disabled={loading || !input.trim()}
          style={{
            padding: '12px 20px',
            background: role.color,
            border: 'none',
            borderRadius: 8,
            color: '#000',
            fontWeight: 700,
            cursor: loading || !input.trim() ? 'not-allowed' : 'pointer',
            fontSize: 14,
            opacity: loading || !input.trim() ? 0.5 : 1,
            transition: 'opacity 0.15s ease',
          }}
        >
          Send
        </button>
      </div>

      {/* Bounce animation for typing dots */}
      <style>{`@keyframes bounce { 0%,100% { transform: translateY(0) } 50% { transform: translateY(-6px) } }`}</style>
    </div>
  );
}
