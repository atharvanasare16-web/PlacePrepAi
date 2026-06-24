import { COLORS } from '../../data/colors';

/**
 * Card — base container component.
 * Uses the `.card` CSS class with optional `.card-glass` variant.
 *
 * @param {object}  props
 * @param {boolean} props.glass     – use frosted-glass variant
 * @param {string}  props.className – additional CSS classes
 * @param {object}  props.style     – inline style overrides
 * @param {React.ReactNode} props.children
 */
export default function Card({ glass = false, className = '', style = {}, children, ...rest }) {
  const base = glass ? 'card card-glass' : 'card';
  const cls  = `${base} ${className}`.trim();

  return (
    <div className={cls} style={style} {...rest}>
      {children}
    </div>
  );
}
