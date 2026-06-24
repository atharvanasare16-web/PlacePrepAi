/**
 * Badge — small labelled chip with colored tint.
 *
 * @param {object} props
 * @param {string} props.color – accent color for the badge
 * @param {string} props.label – text to display
 * @param {string} [props.icon] – optional icon/emoji before label
 */
export default function Badge({ color, label, icon, style = {}, className = '' }) {
  return (
    <span
      className={`badge ${className}`.trim()}
      style={{
        background: `${color}22`,
        border: `1px solid ${color}44`,
        color: color,
        display: 'inline-flex',
        alignItems: 'center',
        gap: 4,
        ...style,
      }}
    >
      {icon && <span style={{ fontSize: 'inherit' }}>{icon}</span>}
      {label}
    </span>
  );
}
