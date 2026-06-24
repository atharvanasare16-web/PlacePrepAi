import { useState } from 'react';
import { COLORS } from '../data/colors';
import { ROLE_LIST, ROLE_CATEGORIES } from '../data/roles';
import { topicById } from '../data/topics';

/**
 * RoleSelector — the landing page.
 * Lets the user search, filter by category, and pick a target role.
 *
 * @param {object}   props
 * @param {function} props.onSelect – callback(roleId) when a card is clicked
 */
export default function RoleSelector({ onSelect }) {
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  // ── filtering ─────────────────────────────────────────────────────────
  const filtered = ROLE_LIST.filter((r) => {
    const matchesSearch =
      r.label.toLowerCase().includes(query.toLowerCase()) ||
      r.tagline.toLowerCase().includes(query.toLowerCase());
    const matchesCategory =
      activeCategory === 'all' || r.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  // ── category tabs (prepend "All") ─────────────────────────────────────
  const categories = [
    { id: 'all', label: 'All Roles', icon: '🎯', color: COLORS.accent },
    ...ROLE_CATEGORIES,
  ];

  return (
    <div
      className="fade-in"
      style={{
        minHeight: '100vh',
        background: COLORS.bg,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '52px 24px 60px',
        fontFamily: "'Inter', -apple-system, sans-serif",
      }}
    >
      {/* ── Brand ──────────────────────────────────────────────────────── */}
      <div
        style={{
          width: 52,
          height: 52,
          background: COLORS.accent,
          borderRadius: 14,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 26,
          marginBottom: 18,
          boxShadow: `0 0 30px ${COLORS.accent}33`,
        }}
      >
        🧠
      </div>
      <div
        style={{
          color: COLORS.accent,
          fontWeight: 800,
          fontSize: 13,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          marginBottom: 12,
        }}
      >
        PlacePrep AI
      </div>

      {/* ── Heading ────────────────────────────────────────────────────── */}
      <h1
        style={{
          color: COLORS.textPrimary,
          fontSize: 28,
          fontWeight: 800,
          margin: 0,
          textAlign: 'center',
        }}
      >
        What role are you preparing for?
      </h1>
      <p
        style={{
          color: COLORS.textSecondary,
          fontSize: 14,
          marginTop: 8,
          marginBottom: 28,
          textAlign: 'center',
          maxWidth: 520,
          lineHeight: 1.55,
        }}
      >
        Pick your target role and we'll instantly curate the exact topics,
        questions, and mock interviews you need — no digging through generic
        material.
      </p>

      {/* ── Search ─────────────────────────────────────────────────────── */}
      <input
        className="input"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search roles… (e.g. AI, Backend, Product)"
        style={{
          width: '100%',
          maxWidth: 520,
          marginBottom: 20,
          boxSizing: 'border-box',
        }}
      />

      {/* ── Category Tabs ──────────────────────────────────────────────── */}
      <div
        style={{
          display: 'flex',
          gap: 10,
          marginBottom: 28,
          flexWrap: 'wrap',
          justifyContent: 'center',
        }}
      >
        {categories.map((cat) => {
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              style={{
                padding: '8px 18px',
                borderRadius: 8,
                border: `1px solid ${isActive ? cat.color : COLORS.border}`,
                background: isActive ? `${cat.color}22` : 'transparent',
                color: isActive ? cat.color : COLORS.textSecondary,
                fontSize: 13,
                fontWeight: isActive ? 600 : 400,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                transition: 'all 0.2s ease',
              }}
            >
              <span style={{ fontSize: 14 }}>{cat.icon}</span>
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* ── Role Grid ──────────────────────────────────────────────────── */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 16,
          width: '100%',
          maxWidth: 960,
        }}
      >
        {filtered.map((r) => (
          <button
            key={r.id}
            onClick={() => onSelect(r.id)}
            className="card"
            style={{
              textAlign: 'left',
              padding: '22px 20px',
              cursor: 'pointer',
              transition: 'transform 0.18s ease, border-color 0.18s ease, box-shadow 0.18s ease',
              position: 'relative',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = r.color;
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = `0 8px 24px ${r.color}15`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = COLORS.border;
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            {/* icon */}
            <div
              style={{
                width: 42,
                height: 42,
                background: `${r.color}22`,
                borderRadius: 10,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 20,
                marginBottom: 12,
              }}
            >
              {r.icon}
            </div>

            {/* label */}
            <div
              style={{
                color: COLORS.textPrimary,
                fontSize: 15,
                fontWeight: 700,
                marginBottom: 5,
              }}
            >
              {r.label}
            </div>

            {/* tagline */}
            <div
              style={{
                color: COLORS.textMuted,
                fontSize: 12,
                lineHeight: 1.5,
                marginBottom: 14,
              }}
            >
              {r.tagline}
            </div>

            {/* top-3 topic badges */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
              {r.topicIds.slice(0, 3).map((tid) => {
                const t = topicById(tid);
                if (!t) return null;
                return (
                  <span
                    key={tid}
                    style={{
                      fontSize: 10,
                      color: r.color,
                      background: `${r.color}18`,
                      padding: '2px 8px',
                      borderRadius: 4,
                    }}
                  >
                    {t.icon} {t.label}
                  </span>
                );
              })}
            </div>
          </button>
        ))}

        {filtered.length === 0 && (
          <div
            style={{
              gridColumn: '1 / -1',
              textAlign: 'center',
              color: COLORS.textMuted,
              padding: 40,
            }}
          >
            <div style={{ fontSize: 32, marginBottom: 8 }}>🔍</div>
            No roles match "{query}" — try a different search.
          </div>
        )}
      </div>
    </div>
  );
}
