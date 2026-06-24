import { COLORS } from '../../data/colors';

/**
 * TopicGrid — selectable grid of topic buttons with recommended badges.
 *
 * @param {object}   props
 * @param {Array}    props.topics         – topic objects { id, icon, label, color }
 * @param {string}   [props.selectedId]   – currently selected topic id
 * @param {function} props.onSelect       – callback(topicId)
 * @param {Set}      [props.recommendedIds] – Set of topic ids that are role-relevant
 * @param {string}   [props.roleColor]    – accent color for ★ badge
 * @param {number}   [props.columns=4]    – CSS grid column count
 */
export default function TopicGrid({
  topics = [],
  selectedId,
  onSelect,
  recommendedIds = new Set(),
  roleColor = COLORS.accent,
  columns = 4,
}) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
        gap: 10,
      }}
    >
      {topics.map((t) => {
        const isSelected    = selectedId === t.id;
        const isRecommended = recommendedIds.has(t.id);

        return (
          <button
            key={t.id}
            onClick={() => onSelect(t.id)}
            style={{
              position: 'relative',
              padding: '12px 10px',
              background: isSelected ? `${t.color}22` : COLORS.card,
              border: isSelected
                ? `1.5px solid ${t.color}`
                : `1px solid ${COLORS.border}`,
              borderRadius: 10,
              cursor: 'pointer',
              textAlign: 'center',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              if (!isSelected) {
                e.currentTarget.style.borderColor = `${t.color}88`;
                e.currentTarget.style.background  = `${t.color}0D`;
              }
            }}
            onMouseLeave={(e) => {
              if (!isSelected) {
                e.currentTarget.style.borderColor = COLORS.border;
                e.currentTarget.style.background  = COLORS.card;
              }
            }}
          >
            {/* ★ recommended badge */}
            {isRecommended && (
              <span
                style={{
                  position: 'absolute',
                  top: 6,
                  right: 8,
                  fontSize: 10,
                  color: roleColor,
                }}
              >
                ★
              </span>
            )}

            <div style={{ fontSize: 18, marginBottom: 4 }}>{t.icon}</div>
            <div
              style={{
                color: isSelected ? t.color : COLORS.textSecondary,
                fontSize: 10,
                fontWeight: 500,
                lineHeight: 1.3,
              }}
            >
              {t.label}
            </div>
          </button>
        );
      })}
    </div>
  );
}
