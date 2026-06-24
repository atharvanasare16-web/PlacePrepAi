import { COLORS } from '../../data/colors';

/**
 * Button — multi-variant button with loading state support.
 *
 * @param {object} props
 * @param {'primary'|'secondary'|'ghost'} props.variant
 * @param {string}  [props.color]    – custom accent colour (overrides primary bg)
 * @param {boolean} [props.loading]  – show spinner / loading text
 * @param {boolean} [props.disabled]
 * @param {function} props.onClick
 * @param {string}  [props.className]
 * @param {object}  [props.style]
 */
export default function Button({
  variant = 'primary',
  color,
  loading = false,
  disabled = false,
  onClick,
  children,
  className = '',
  style = {},
  ...rest
}) {
  // Map variant → CSS class
  const variantClass = {
    primary: 'btn btn-primary',
    secondary: 'btn btn-secondary',
    ghost: 'btn btn-ghost',
  }[variant] || 'btn btn-primary';

  // Build inline overrides when a custom color is supplied
  const colorOverrides = {};
  if (color && variant === 'primary') {
    colorOverrides.background = color;
    colorOverrides.color = '#000';
    colorOverrides.borderColor = color;
  } else if (color && variant === 'secondary') {
    colorOverrides.borderColor = `${color}66`;
    colorOverrides.color = color;
  } else if (color && variant === 'ghost') {
    colorOverrides.color = color;
  }

  return (
    <button
      className={`${variantClass} ${className}`.trim()}
      disabled={disabled || loading}
      onClick={onClick}
      style={{
        ...colorOverrides,
        opacity: disabled ? 0.5 : 1,
        cursor: disabled || loading ? 'not-allowed' : 'pointer',
        transition: 'all 0.2s ease',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        ...style,
      }}
      {...rest}
    >
      {loading ? (
        <>
          <span
            style={{
              width: 14,
              height: 14,
              border: '2px solid currentColor',
              borderTopColor: 'transparent',
              borderRadius: '50%',
              animation: 'spin 0.6s linear infinite',
              display: 'inline-block',
            }}
          />
          <span>Loading…</span>
        </>
      ) : (
        children
      )}

      {/* Inline keyframes — only rendered once per mount */}
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </button>
  );
}
