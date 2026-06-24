import { useState } from 'react';
import { COLORS } from '../data/colors';
import { getApiKey, setApiKey as persistApiKey, hasApiKey } from '../services/ai';

/**
 * Sidebar — 235 px navigation rail with brand, role badge, nav items, and API key input.
 *
 * @param {object}   props
 * @param {string}   props.active       – current active tab id
 * @param {function} props.setActive    – callback(tabId)
 * @param {object}   props.role         – current role profile object
 * @param {function} props.onSwitchRole – callback to go back to role selector
 */

const NAV_ITEMS = [
  { id: 'dashboard',   label: 'Prep Hub',           icon: '⊞' },
  { id: 'interview',   label: 'Mock Interview',     icon: '🎙' },
  { id: 'practice',    label: 'Practice Questions',  icon: '⚡' },
  { id: 'codesnippet', label: 'Code Challenges',     icon: '💻' },
  { id: 'concepts',    label: 'Concept Explainer',   icon: '🧠' },
  { id: 'resume',      label: 'Resume Review',       icon: '📄' },
  { id: 'roadmap',     label: 'Study Roadmap',       icon: '🗺' },
];

export default function Sidebar({ active, setActive, role, onSwitchRole }) {
  const [showApiInput, setShowApiInput] = useState(false);
  const [apiKey, setApiKey] = useState(() => getApiKey() || '');

  return (
    <div
      style={{
        width: 235,
        background: COLORS.surface,
        borderRight: `1px solid ${COLORS.border}`,
        display: 'flex',
        flexDirection: 'column',
        padding: '20px 0',
        flexShrink: 0,
        height: '100vh',
        boxSizing: 'border-box',
        overflow: 'hidden',
      }}
    >
      {/* ── Brand ──────────────────────────────────────────────────────── */}
      <div style={{ padding: '0 18px 18px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
          <div
            style={{
              width: 30,
              height: 30,
              background: COLORS.accent,
              borderRadius: 8,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 16,
            }}
          >
            🧠
          </div>
          <div
            style={{
              color: COLORS.textPrimary,
              fontWeight: 700,
              fontSize: 14,
            }}
          >
            PlacePrep AI
          </div>
        </div>
      </div>

      {/* ── Role Badge ─────────────────────────────────────────────────── */}
      <button
        onClick={onSwitchRole}
        style={{
          margin: '0 14px 18px',
          padding: '12px 14px',
          background: `${role.color}15`,
          border: `1px solid ${role.color}44`,
          borderRadius: 10,
          cursor: 'pointer',
          textAlign: 'left',
          transition: 'background 0.2s ease',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = `${role.color}25`;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = `${role.color}15`;
        }}
      >
        <div
          style={{
            color: COLORS.textMuted,
            fontSize: 10,
            marginBottom: 3,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
          }}
        >
          Preparing for
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ fontSize: 15 }}>{role.icon}</span>
          <span
            style={{
              color: role.color,
              fontSize: 13,
              fontWeight: 700,
            }}
          >
            {role.label}
          </span>
        </div>
        <div
          style={{
            color: COLORS.textMuted,
            fontSize: 10,
            marginTop: 4,
          }}
        >
          ↻ Switch role
        </div>
      </button>

      {/* ── Navigation ─────────────────────────────────────────────────── */}
      <nav style={{ flex: 1, padding: '0 12px', overflowY: 'auto' }}>
        {NAV_ITEMS.map((item) => {
          const isActive = active === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActive(item.id)}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '10px 12px',
                borderRadius: 8,
                border: 'none',
                cursor: 'pointer',
                marginBottom: 2,
                textAlign: 'left',
                background: isActive ? COLORS.accentDim : 'transparent',
                color: isActive ? COLORS.accent : COLORS.textSecondary,
                fontWeight: isActive ? 600 : 400,
                fontSize: 13,
                borderLeft: isActive
                  ? `2px solid ${COLORS.accent}`
                  : '2px solid transparent',
                transition: 'all 0.15s ease',
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = `${COLORS.accent}0D`;
                  e.currentTarget.style.color = COLORS.textPrimary;
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = COLORS.textSecondary;
                }
              }}
            >
              <span style={{ fontSize: 15, width: 20, textAlign: 'center' }}>
                {item.icon}
              </span>
              {item.label}
            </button>
          );
        })}
      </nav>

      {/* ── API Key (bottom) ───────────────────────────────────────────── */}
      <div style={{ padding: '12px 14px 4px', borderTop: `1px solid ${COLORS.border}` }}>
        <button
          onClick={() => setShowApiInput((prev) => !prev)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 7,
            width: '100%',
            padding: '8px 6px',
            background: 'transparent',
            border: 'none',
            color: COLORS.textMuted,
            fontSize: 12,
            cursor: 'pointer',
            borderRadius: 6,
            transition: 'color 0.15s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = COLORS.textSecondary;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = COLORS.textMuted;
          }}
        >
          <span style={{ fontSize: 13 }}>🔑</span>
          API Key
          <span style={{ marginLeft: 'auto', fontSize: 10 }}>
            {showApiInput ? '▲' : '▼'}
          </span>
        </button>

        {showApiInput && (
          <div style={{ marginTop: 6 }}>
            <input
              className="input"
              type="password"
              value={apiKey}
              onChange={(e) => {
                const val = e.target.value;
                setApiKey(val);
                persistApiKey(val);
              }}
              placeholder="sk-ant-…"
              style={{
                width: '100%',
                fontSize: 11,
                padding: '8px 10px',
                boxSizing: 'border-box',
              }}
            />
            <div
              style={{
                fontSize: 10,
                color: hasApiKey() ? COLORS.green : COLORS.textMuted,
                marginTop: 4,
              }}
            >
              {hasApiKey() ? '✓ Key saved & ready to use' : 'Paste your Anthropic API key'}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
