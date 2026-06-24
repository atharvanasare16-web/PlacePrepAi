import { COLORS } from '../data/colors';
import { topicById } from '../data/topics';

/**
 * RoleHub — personalized dashboard for the selected role.
 * Hero banner → Topics + Must-Know → Interview Rounds → Quick-launch cards.
 *
 * @param {object}   props
 * @param {object}   props.role      – full role profile object
 * @param {function} props.setActive – callback(tabId) to navigate
 */
export default function RoleHub({ role, setActive }) {
  const weight = Math.floor(100 / role.topicIds.length);

  return (
    <div
      className="fade-in"
      style={{ padding: '32px', overflowY: 'auto', height: '100%' }}
    >
      {/* ── Hero Banner ────────────────────────────────────────────────── */}
      <div
        className="card"
        style={{
          background: `linear-gradient(135deg, ${role.color}22, transparent)`,
          border: `1px solid ${role.color}44`,
          padding: '26px 28px',
          marginBottom: 26,
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 14,
            marginBottom: 8,
          }}
        >
          <span style={{ fontSize: 32 }}>{role.icon}</span>
          <div>
            <h1
              style={{
                color: COLORS.textPrimary,
                fontSize: 22,
                fontWeight: 800,
                margin: 0,
              }}
            >
              {role.label} Prep Kit
            </h1>
            <div
              style={{
                color: COLORS.textSecondary,
                fontSize: 13,
                marginTop: 3,
              }}
            >
              {role.tagline}
            </div>
          </div>
        </div>

        {/* Company badges */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 8,
            marginTop: 16,
          }}
        >
          {role.companies.map((c) => (
            <span
              key={c}
              className="badge"
              style={{
                fontSize: 11,
                color: COLORS.textSecondary,
                background: COLORS.surface,
                border: `1px solid ${COLORS.border}`,
                padding: '4px 10px',
                borderRadius: 6,
              }}
            >
              {c}
            </span>
          ))}
        </div>
      </div>

      {/* ── Two-Column: Topics + Must-Know ────────────────────────────── */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1.1fr 1fr',
          gap: 20,
          marginBottom: 22,
        }}
      >
        {/* Left — Core Topics */}
        <div className="card" style={{ padding: 22 }}>
          <h3
            style={{
              color: COLORS.textPrimary,
              fontSize: 14,
              fontWeight: 700,
              margin: '0 0 16px',
            }}
          >
            📚 Core Topics for This Role
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {role.topicIds.map((tid) => {
              const t = topicById(tid);
              if (!t) return null;
              return (
                <button
                  key={tid}
                  onClick={() => setActive('practice')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    padding: '12px 14px',
                    background: COLORS.surface,
                    border: `1px solid ${COLORS.border}`,
                    borderRadius: 9,
                    cursor: 'pointer',
                    textAlign: 'left',
                    width: '100%',
                    transition: 'border-color 0.15s ease, background 0.15s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = `${t.color}66`;
                    e.currentTarget.style.background = `${t.color}0A`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = COLORS.border;
                    e.currentTarget.style.background = COLORS.surface;
                  }}
                >
                  <span style={{ fontSize: 20 }}>{t.icon}</span>
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        color: COLORS.textPrimary,
                        fontSize: 13,
                        fontWeight: 600,
                      }}
                    >
                      {t.label}
                    </div>
                    <div
                      style={{
                        color: COLORS.textMuted,
                        fontSize: 11,
                        marginTop: 2,
                      }}
                    >
                      {t.sub}
                    </div>
                  </div>
                  <div
                    style={{
                      color: t.color,
                      fontSize: 11,
                      fontWeight: 700,
                      whiteSpace: 'nowrap',
                    }}
                  >
                    ~{weight}%
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right — Must-Know Concepts */}
        <div className="card" style={{ padding: 22 }}>
          <h3
            style={{
              color: COLORS.textPrimary,
              fontSize: 14,
              fontWeight: 700,
              margin: '0 0 16px',
            }}
          >
            ✅ Must-Know Concepts
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {role.mustKnow.map((m, i) => (
              <button
                key={i}
                onClick={() => setActive('concepts')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: '9px 12px',
                  background: COLORS.surface,
                  border: `1px solid ${COLORS.border}`,
                  borderRadius: 8,
                  cursor: 'pointer',
                  textAlign: 'left',
                  width: '100%',
                  transition: 'border-color 0.15s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = `${role.color}66`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = COLORS.border;
                }}
              >
                <span style={{ color: role.color, fontSize: 12, flexShrink: 0 }}>
                  ●
                </span>
                <span
                  style={{
                    color: COLORS.textSecondary,
                    fontSize: 12.5,
                    lineHeight: 1.4,
                  }}
                >
                  {m}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Interview Rounds Pipeline ──────────────────────────────────── */}
      <div className="card" style={{ padding: 22, marginBottom: 22 }}>
        <h3
          style={{
            color: COLORS.textPrimary,
            fontSize: 14,
            fontWeight: 700,
            margin: '0 0 16px',
          }}
        >
          🎯 Typical Interview Rounds
        </h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
          {role.rounds.map((r, i) => (
            <div
              key={r}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
              }}
            >
              <div
                style={{
                  background: `${role.color}18`,
                  border: `1px solid ${role.color}44`,
                  borderRadius: 8,
                  padding: '8px 14px',
                  color: role.color,
                  fontSize: 12,
                  fontWeight: 600,
                  whiteSpace: 'nowrap',
                }}
              >
                {i + 1}. {r}
              </div>
              {i < role.rounds.length - 1 && (
                <span style={{ color: COLORS.textMuted, fontSize: 14 }}>→</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ── Quick-Launch Actions ────────────────────────────────────────── */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 14,
        }}
      >
        {[
          {
            label: 'Start Mock Interview',
            tab: 'interview',
            icon: '🎙',
            desc: 'Role-specific simulation',
          },
          {
            label: 'Practice Questions',
            tab: 'practice',
            icon: '⚡',
            desc: 'Curated for this role',
          },
          {
            label: 'Code Challenges',
            tab: 'codesnippet',
            icon: '💻',
            desc: 'Hands-on problems',
          },
          {
            label: 'Get Study Roadmap',
            tab: 'roadmap',
            icon: '🗺',
            desc: 'Week-by-week plan',
          },
        ].map((a) => (
          <button
            key={a.tab}
            onClick={() => setActive(a.tab)}
            className="card"
            style={{
              padding: '18px 16px',
              cursor: 'pointer',
              textAlign: 'left',
              transition: 'border-color 0.18s ease, transform 0.18s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = role.color;
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = COLORS.border;
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <div style={{ fontSize: 24, marginBottom: 10 }}>{a.icon}</div>
            <div
              style={{
                color: COLORS.textPrimary,
                fontSize: 13,
                fontWeight: 700,
                marginBottom: 4,
              }}
            >
              {a.label}
            </div>
            <div
              style={{
                color: COLORS.textMuted,
                fontSize: 11,
                lineHeight: 1.4,
              }}
            >
              {a.desc}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
