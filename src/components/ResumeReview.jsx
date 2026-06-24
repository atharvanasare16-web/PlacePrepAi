import { useState, useEffect } from 'react';
import { COLORS } from '../data/colors';
import { callAI } from '../services/ai';

export default function ResumeReview({ role }) {
  const [resume, setResume] = useState('');
  const [loading, setLoading] = useState(false);
  const [review, setReview] = useState(null);

  useEffect(() => {
    setResume('');
    setReview(null);
  }, [role.id]);

  const analyzeResume = async () => {
    if (!resume.trim()) return;
    setLoading(true);
    setReview(null);
    try {
      const res = await callAI(
        [
          {
            role: 'user',
            content: `Resume:\n${resume}\n\nTarget Role: ${role.label}\n\nAnalyze this resume:\n1. Overall Score (X/10)\n2. Top 3 Strengths (specific to ${role.label} skills)\n3. Top 3 Gaps relative to: ${role.mustKnow.slice(0, 5).join(', ')}\n4. Missing keywords for "${role.label}" roles (8-10)\n5. Best project to highlight and how to improve its description\n6. One specific bullet point rewrite example\n\nBe technical and role-specific.`,
          },
        ],
        `You are an expert technical recruiter specializing in ${role.label} roles at top tech companies. Give precise, actionable resume feedback.`
      );
      setReview(res);
    } catch (err) {
      setReview('Sorry, could not analyze your resume. Please try again.');
    }
    setLoading(false);
  };

  return (
    <div
      style={{
        padding: 32,
        overflowY: 'auto',
        height: '100%',
        maxWidth: 720,
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
        Resume Review
      </h2>
      <p
        style={{
          color: COLORS.textSecondary,
          fontSize: 13,
          marginBottom: 24,
        }}
      >
        AI analysis tailored to{' '}
        <span style={{ color: role.color, fontWeight: 600 }}>
          {role.label}
        </span>{' '}
        roles.
      </p>

      {/* Resume textarea */}
      <div style={{ marginBottom: 16 }}>
        <textarea
          value={resume}
          onChange={(e) => setResume(e.target.value)}
          placeholder="Paste your resume here — education, experience, projects, skills, publications..."
          rows={12}
          style={{
            width: '100%',
            padding: '14px',
            background: COLORS.surface,
            border: `1px solid ${COLORS.border}`,
            borderRadius: 10,
            color: COLORS.textPrimary,
            fontSize: 12,
            lineHeight: 1.6,
            resize: 'vertical',
            boxSizing: 'border-box',
            fontFamily: 'monospace',
            outline: 'none',
          }}
        />
      </div>

      {/* Analyze button */}
      <button
        onClick={analyzeResume}
        disabled={!resume.trim() || loading}
        style={{
          padding: '11px 26px',
          background: role.color,
          border: 'none',
          borderRadius: 8,
          color: '#000',
          fontWeight: 700,
          fontSize: 13,
          cursor: resume.trim() && !loading ? 'pointer' : 'not-allowed',
          opacity: resume.trim() ? 1 : 0.5,
          marginBottom: 24,
          transition: 'all 0.15s ease',
        }}
      >
        {loading ? 'Analyzing...' : `Analyze for ${role.label} 🔍`}
      </button>

      {/* Review card */}
      {review && (
        <div
          style={{
            background: COLORS.card,
            border: `1px solid ${COLORS.border}`,
            borderRadius: 12,
            padding: 24,
          }}
        >
          <div
            style={{
              color: role.color,
              fontSize: 12,
              fontWeight: 700,
              marginBottom: 12,
            }}
          >
            📊 RESUME ANALYSIS — {role.label.toUpperCase()}
          </div>
          <pre
            style={{
              color: COLORS.textPrimary,
              fontSize: 13,
              lineHeight: 1.8,
              whiteSpace: 'pre-wrap',
              margin: 0,
              fontFamily: 'inherit',
            }}
          >
            {review}
          </pre>
        </div>
      )}
    </div>
  );
}
