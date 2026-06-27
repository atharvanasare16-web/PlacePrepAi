import { useState, useEffect } from 'react';

// ── Data ────────────────────────────────────────────────────────────────────
import { ROLE_PROFILES } from './data/roles';
import { COLORS } from './data/colors';

// ── Components ──────────────────────────────────────────────────────────────
import RoleSelector from './components/RoleSelector';
import Sidebar from './components/Sidebar';
import RoleHub from './components/RoleHub';
import MockInterview from './components/MockInterview';
import PracticeQuestions from './components/PracticeQuestions';
import CodeChallenges from './components/CodeChallenges';
import ConceptExplainer from './components/ConceptExplainer';
import ResumeReview from './components/ResumeReview';
import StudyRoadmap from './components/StudyRoadmap';

// ── AI Service ──────────────────────────────────────────────────────────────
import {
  getApiKey,
  setApiKey,
  clearApiKey,
  hasApiKey,
  friendlyError,
  callMockInterview,
  callGenerateQuestion,
  callEvaluateAnswer,
  callCodeChallenge,
  callReviewCode,
  callExplainConcept,
  callResumeReview,
  callStudyRoadmap,
} from './services/ai';

// ── Hooks ───────────────────────────────────────────────────────────────────
import useLocalStorage, { KEYS } from './hooks/useLocalStorage';

// ═══════════════════════════════════════════════════════════════════════════════
// ROOT COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

export default function App() {
  // ── Persisted state ───────────────────────────────────────────────────────
  const [selectedRoleId, setSelectedRoleId] = useLocalStorage(KEYS.ROLE_ID, null);
  const [activeView, setActiveView] = useLocalStorage(KEYS.ACTIVE_VIEW, 'dashboard');

  // Force dashboard when role changes
  useEffect(() => {
    if (!selectedRoleId) {
      setActiveView('dashboard');
    }
  }, [selectedRoleId, setActiveView]);

  // ── Role selection handler ────────────────────────────────────────────────
  const handleSelectRole = (id) => {
    setSelectedRoleId(id);
    setActiveView('dashboard');
  };

  const handleSwitchRole = () => {
    setSelectedRoleId(null);
    setActiveView('dashboard');
  };

  // ── No role selected → show role selector ─────────────────────────────────
  if (!selectedRoleId || !ROLE_PROFILES[selectedRoleId]) {
    return <RoleSelector onSelect={handleSelectRole} />;
  }

  const role = ROLE_PROFILES[selectedRoleId];

  // ── View map — each component receives its specific AI callers ────────────
  const views = {
    dashboard: (
      <RoleHub
        role={role}
        setActive={setActiveView}
      />
    ),
    interview: (
      <MockInterview
        role={role}
        callMockInterview={callMockInterview}
        friendlyError={friendlyError}
      />
    ),
    practice: (
      <PracticeQuestions
        role={role}
        callGenerateQuestion={callGenerateQuestion}
        callEvaluateAnswer={callEvaluateAnswer}
        friendlyError={friendlyError}
      />
    ),
    codesnippet: (
      <CodeChallenges
        role={role}
        callCodeChallenge={callCodeChallenge}
        callReviewCode={callReviewCode}
        friendlyError={friendlyError}
      />
    ),
    concepts: (
      <ConceptExplainer
        role={role}
        callExplainConcept={callExplainConcept}
        friendlyError={friendlyError}
      />
    ),
    resume: (
      <ResumeReview
        role={role}
        callResumeReview={callResumeReview}
        friendlyError={friendlyError}
      />
    ),
    roadmap: (
      <StudyRoadmap
        role={role}
        callStudyRoadmap={callStudyRoadmap}
        friendlyError={friendlyError}
      />
    ),
  };

  // ── Layout ────────────────────────────────────────────────────────────────
  return (
    <div
      style={{
        display: 'flex',
        height: '100vh',
        background: COLORS.bg,
        fontFamily: "'Inter', -apple-system, sans-serif",
        color: COLORS.textPrimary,
        overflow: 'hidden',
      }}
    >
      <Sidebar
        active={activeView}
        setActive={setActiveView}
        role={role}
        onSwitchRole={handleSwitchRole}
        setApiKey={setApiKey}
        getApiKey={getApiKey}
        clearApiKey={clearApiKey}
        hasApiKey={hasApiKey}
      />
      <main
        style={{
          flex: 1,
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {views[activeView] || views.dashboard}
      </main>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// COMPONENT INTEGRATION PATTERNS
// ═══════════════════════════════════════════════════════════════════════════════
//
// Copy-paste these patterns into each component to wire up the AI callers.
// Each pattern shows the correct loading/error/result state management.
//
// ─────────────────────────────────────────────────────────────────────────────
// PATTERN: Mock Interview (components/MockInterview.jsx)
// ─────────────────────────────────────────────────────────────────────────────
//
//   import { useState, useRef, useEffect } from 'react';
//
//   export default function MockInterview({ role, callMockInterview, friendlyError }) {
//     const [messages, setMessages] = useState([]);
//     const [input, setInput] = useState('');
//     const [loading, setLoading] = useState(false);
//     const [error, setError] = useState(null);
//
//     const startInterview = async () => {
//       setLoading(true);
//       setError(null);
//       try {
//         const initialMessages = [{ role: 'user', content: 'Begin the interview.' }];
//         const response = await callMockInterview(role, company, round, initialMessages);
//         setMessages([{ role: 'assistant', content: response }]);
//       } catch (err) {
//         setError(friendlyError(err));
//       } finally {
//         setLoading(false);
//       }
//     };
//
//     const sendMessage = async () => {
//       if (!input.trim() || loading) return;
//       const userMsg = { role: 'user', content: input };
//       const newMessages = [...messages, userMsg];
//       setMessages(newMessages);
//       setInput('');
//       setLoading(true);
//       setError(null);
//       try {
//         const response = await callMockInterview(role, company, round, newMessages);
//         setMessages([...newMessages, { role: 'assistant', content: response }]);
//       } catch (err) {
//         setError(friendlyError(err));
//       } finally {
//         setLoading(false);
//       }
//     };
//   }
//
// ─────────────────────────────────────────────────────────────────────────────
// PATTERN: Practice Questions (components/PracticeQuestions.jsx)
// ─────────────────────────────────────────────────────────────────────────────
//
//   export default function PracticeQuestions({ role, callGenerateQuestion, callEvaluateAnswer, friendlyError }) {
//     const [question, setQuestion] = useState(null);
//     const [answer, setAnswer] = useState('');
//     const [feedback, setFeedback] = useState(null);
//     const [loading, setLoading] = useState(false);
//     const [error, setError] = useState(null);
//
//     const generateQuestion = async () => {
//       setLoading(true);
//       setError(null);
//       setQuestion(null);
//       setFeedback(null);
//       try {
//         const result = await callGenerateQuestion(role, topic, difficulty, qtype);
//         setQuestion(result);
//       } catch (err) {
//         setError(friendlyError(err));
//       } finally {
//         setLoading(false);
//       }
//     };
//
//     const evaluateAnswer = async () => {
//       if (!answer.trim()) return;
//       setLoading(true);
//       setError(null);
//       try {
//         const result = await callEvaluateAnswer(role, topic, question, answer);
//         setFeedback(result);
//       } catch (err) {
//         setError(friendlyError(err));
//       } finally {
//         setLoading(false);
//       }
//     };
//   }
//
// ─────────────────────────────────────────────────────────────────────────────
// PATTERN: Code Challenges (components/CodeChallenges.jsx)
// ─────────────────────────────────────────────────────────────────────────────
//
//   export default function CodeChallenges({ role, callCodeChallenge, callReviewCode, friendlyError }) {
//     const [challenge, setChallenge] = useState(null);
//     const [code, setCode] = useState('');
//     const [review, setReview] = useState(null);
//     const [loading, setLoading] = useState(false);
//     const [error, setError] = useState(null);
//
//     const getChallenge = async () => {
//       setLoading(true);
//       setError(null);
//       setChallenge(null);
//       setReview(null);
//       try {
//         const result = await callCodeChallenge(role, selectedLibrary);
//         setChallenge(result);
//       } catch (err) {
//         setError(friendlyError(err));
//       } finally {
//         setLoading(false);
//       }
//     };
//
//     const reviewCode = async () => {
//       if (!code.trim()) return;
//       setLoading(true);
//       setError(null);
//       try {
//         const result = await callReviewCode(role, challenge, code);
//         setReview(result);
//       } catch (err) {
//         setError(friendlyError(err));
//       } finally {
//         setLoading(false);
//       }
//     };
//   }
//
// ─────────────────────────────────────────────────────────────────────────────
// PATTERN: Concept Explainer (components/ConceptExplainer.jsx)
// ─────────────────────────────────────────────────────────────────────────────
//
//   export default function ConceptExplainer({ role, callExplainConcept, friendlyError }) {
//     const [explanation, setExplanation] = useState(null);
//     const [loading, setLoading] = useState(false);
//     const [error, setError] = useState(null);
//
//     const explain = async (conceptText) => {
//       setLoading(true);
//       setError(null);
//       try {
//         const result = await callExplainConcept(role, conceptText, depth);
//         setExplanation(result);
//       } catch (err) {
//         setError(friendlyError(err));
//       } finally {
//         setLoading(false);
//       }
//     };
//
//     // Follow-up with conversation history
//     const askFollowUp = async (followUpText) => {
//       setLoading(true);
//       setError(null);
//       try {
//         const history = [
//           { role: 'user', content: `Explain "${concept}" at ${depth} depth.` },
//           { role: 'assistant', content: explanation },
//           { role: 'user', content: followUpText },
//         ];
//         const result = await callExplainConcept(role, concept, depth, history);
//         setFollowUpResult(result);
//       } catch (err) {
//         setError(friendlyError(err));
//       } finally {
//         setLoading(false);
//       }
//     };
//   }
//
// ─────────────────────────────────────────────────────────────────────────────
// PATTERN: Resume Review (components/ResumeReview.jsx)
// ─────────────────────────────────────────────────────────────────────────────
//
//   export default function ResumeReview({ role, callResumeReview, friendlyError }) {
//     const [resume, setResume] = useState('');
//     const [review, setReview] = useState(null);
//     const [loading, setLoading] = useState(false);
//     const [error, setError] = useState(null);
//
//     const analyzeResume = async () => {
//       if (!resume.trim()) return;
//       setLoading(true);
//       setError(null);
//       setReview(null);
//       try {
//         const result = await callResumeReview(role, resume);
//         setReview(result);
//       } catch (err) {
//         setError(friendlyError(err));
//       } finally {
//         setLoading(false);
//       }
//     };
//   }
//
// ─────────────────────────────────────────────────────────────────────────────
// PATTERN: Study Roadmap (components/StudyRoadmap.jsx)
// ─────────────────────────────────────────────────────────────────────────────
//
//   export default function StudyRoadmap({ role, callStudyRoadmap, friendlyError }) {
//     const [roadmap, setRoadmap] = useState(null);
//     const [loading, setLoading] = useState(false);
//     const [error, setError] = useState(null);
//
//     const generateRoadmap = async () => {
//       setLoading(true);
//       setError(null);
//       setRoadmap(null);
//       try {
//         const result = await callStudyRoadmap(role, level);
//         setRoadmap(result);
//       } catch (err) {
//         setError(friendlyError(err));
//       } finally {
//         setLoading(false);
//       }
//     };
//   }
//
// ─────────────────────────────────────────────────────────────────────────────
// ERROR DISPLAY PATTERN (use in any component)
// ─────────────────────────────────────────────────────────────────────────────
//
//   {error && (
//     <div style={{
//       background: COLORS.errorBg,
//       border: `1px solid ${COLORS.errorBorder}`,
//       borderRadius: 10,
//       padding: '12px 16px',
//       marginBottom: 16,
//       color: COLORS.red,
//       fontSize: 13,
//       display: 'flex',
//       justifyContent: 'space-between',
//       alignItems: 'center',
//     }}>
//       <span>{error}</span>
//       <button
//         onClick={() => setError(null)}
//         style={{
//           background: 'none', border: 'none', color: COLORS.red,
//           cursor: 'pointer', fontSize: 16, padding: '0 4px',
//         }}
//       >×</button>
//     </div>
//   )}
//
