import { COLORS } from '../../data/colors';

/**
 * EmptyState — zero-data placeholder with icon, title, and description.
 *
 * @param {object}  props
 * @param {string}  props.icon        – emoji or icon string
 * @param {string}  props.title       – heading text
 * @param {string}  props.description – supporting copy
 */
export default function EmptyState({ icon, title, description }) {
  return (
    <div className="empty-state">
      <div className="empty-state-icon">{icon}</div>
      <h3
        style={{
          color: COLORS.textPrimary,
          fontSize: 16,
          fontWeight: 700,
          margin: '12px 0 6px',
        }}
      >
        {title}
      </h3>
      <p
        style={{
          color: COLORS.textMuted,
          fontSize: 13,
          margin: 0,
          maxWidth: 380,
          lineHeight: 1.55,
        }}
      >
        {description}
      </p>
    </div>
  );
}
