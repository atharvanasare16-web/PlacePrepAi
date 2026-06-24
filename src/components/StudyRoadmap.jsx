import { useState, useEffect } from 'react';
import { COLORS } from '../data/colors';
import { topicById } from '../data/topics';
import { callAI } from '../services/ai';

export default function StudyRoadmap({ role }) {
  const [level, setLevel] = useState('Beginner (CS background)');
  const [loading, setLoading] = useState(false);
  const [roadmap, setRoadmap] = useState(null);

  useEffect(() => {
    setLevel('Beginner (CS background)');
    setRoadmap(null);
  }, [role.id]);

  const levels = [
    'Beginner (CS background)',
    'Intermediate (some ML)',
    'Advanced (1+ years experience)',
    'Career Switcher',
  ];

  const generateRoadmap = async () => {
    setLoading(true);
    setRoadmap(null);
    try {
      const res = await callAI(
        [
          {
            role: 'user',
            content: `Create a detailed 10-week placement preparation roadmap for a "${level}" targeting "${role.label}" roles.\nCore topics to cover: ${role.topicIds.map((id) => topicById(id)?.label).filter(Boolean).join(', ')}.\nMust-know concepts: ${role.mustKnow.join(', ')}.\nTypical interview rounds: ${role.rounds.join(', ')}.\n\nFor each week include:\n- Weekly theme\n- 4-5 specific topics\n- Key Python libraries/tools\n- 2-3 practice resources or project ideas\n- Interview question type to practice\n\nAlso include: daily time breakdown, top 5 project ideas for ${role.label}, and 5 non-obvious interview tips.`,
          },
        ],
        `You are a career coach specializing in placement preparation for ${role.label} roles at top tech companies.`
      );
      setRoadmap(res);
    } catch (err) {
      setRoadmap('Sorry, could not generate a roadmap. Please try again.');
    }
    setLoading(false);
  };

  return (
    <div
      style={{
        padding: 32,
        overflowY: 'auto',
        height: '100%',
        maxWidth: 700,
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
        Study Roadmap
      </h2>
      <p
        style={{
          color: COLORS.textSecondary,
          fontSize: 13,
          marginBottom: 24,
        }}
      >
        10-week plan built around{' '}
        <span style={{ color: role.color, fontWeight: 600 }}>
          {role.label}
        </span>{' '}
        requirements.
      </p>

      {/* Level selector card */}
      <div
        style={{
          background: COLORS.card,
          border: `1px solid ${COLORS.border}`,
          borderRadius: 12,
          padding: 24,
          marginBottom: 24,
        }}
      >
        <label
          style={{
            color: COLORS.textSecondary,
            fontSize: 12,
            display: 'block',
            marginBottom: 8,
          }}
        >
          Current Level
        </label>
        <div
          style={{
            display: 'flex',
            gap: 8,
            flexWrap: 'wrap',
            marginBottom: 18,
          }}
        >
          {levels.map((l) => (
            <button
              key={l}
              onClick={() => setLevel(l)}
              style={{
                padding: '7px 14px',
                borderRadius: 6,
                border: `1px solid ${level === l ? role.color : COLORS.border}`,
                background: level === l ? `${role.color}22` : 'transparent',
                color: level === l ? role.color : COLORS.textSecondary,
                fontSize: 12,
                cursor: 'pointer',
                fontWeight: level === l ? 600 : 400,
                transition: 'all 0.15s ease',
              }}
            >
              {l}
            </button>
          ))}
        </div>
        <button
          onClick={generateRoadmap}
          disabled={loading}
          style={{
            padding: '11px 24px',
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
          {loading ? 'Generating roadmap...' : 'Generate My Roadmap 🗺'}
        </button>
      </div>

      {/* Roadmap display card */}
      {roadmap && (
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
            🗺 10-WEEK ROADMAP — {role.label.toUpperCase()}
          </div>
          <pre
            style={{
              color: COLORS.textPrimary,
              fontSize: 12.5,
              lineHeight: 1.8,
              whiteSpace: 'pre-wrap',
              margin: 0,
              fontFamily: 'inherit',
            }}
          >
            {roadmap}
          </pre>
        </div>
      )}

      {/* Empty state */}
      {!roadmap && !loading && (
        <div
          style={{
            textAlign: 'center',
            padding: '40px 20px',
            color: COLORS.textMuted,
            border: `1px dashed ${COLORS.border}`,
            borderRadius: 12,
          }}
        >
          <div style={{ fontSize: 32, marginBottom: 10 }}>🗺</div>
          <div style={{ fontSize: 13 }}>
            Pick your level above to generate a personalized roadmap
          </div>
        </div>
      )}
    </div>
  );
}
