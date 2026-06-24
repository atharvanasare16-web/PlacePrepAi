/**
 * Skeleton — placeholder loader with animated shimmer lines.
 *
 * @param {object}  props
 * @param {number}  [props.lines=3] – how many shimmer lines to show
 */
export default function Skeleton({ lines = 3 }) {
  // Vary widths so skeletons look organic
  const widths = ['100%', '92%', '76%', '88%', '65%', '95%', '80%'];

  return (
    <div className="skeleton">
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className="skeleton-line"
          style={{ width: widths[i % widths.length] }}
        />
      ))}
    </div>
  );
}
