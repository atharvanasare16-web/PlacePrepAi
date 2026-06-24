import { COLORS } from '../../data/colors';

/**
 * ChatBubble — renders a single chat message (user or assistant).
 *
 * @param {object}  props
 * @param {'user'|'assistant'} props.role
 * @param {string}  [props.color]     – role accent colour
 * @param {string}  [props.roleLabel] – label shown above assistant messages
 * @param {React.ReactNode} props.children
 */
export default function ChatBubble({ role, color = COLORS.accent, roleLabel, children }) {
  const isUser = role === 'user';

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: isUser ? 'flex-end' : 'flex-start',
        marginBottom: 16,
      }}
    >
      <div
        className={`chat-bubble ${role}`}
        style={{
          maxWidth: '78%',
          padding: '12px 16px',
          background: isUser ? color : COLORS.card,
          color: isUser ? '#000' : COLORS.textPrimary,
          borderRadius: isUser ? '12px 12px 2px 12px' : '12px 12px 12px 2px',
          border: !isUser ? `1px solid ${COLORS.border}` : 'none',
          fontSize: 13,
          lineHeight: 1.65,
        }}
      >
        {!isUser && roleLabel && (
          <div
            style={{
              color: color,
              fontSize: 10,
              fontWeight: 700,
              marginBottom: 4,
              textTransform: 'uppercase',
              letterSpacing: '0.03em',
            }}
          >
            {roleLabel}
          </div>
        )}
        <pre
          style={{
            margin: 0,
            whiteSpace: 'pre-wrap',
            fontFamily: 'inherit',
          }}
        >
          {children}
        </pre>
      </div>
    </div>
  );
}
