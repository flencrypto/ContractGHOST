/**
 * aLiGN Logo — structural beam identity mark.
 *
 * Full mode: renders the logo inside the blueprint-grid container
 * (for hero/marketing use).
 *
 * Compact mode (compact={true}): renders the logo mark alone at sidebar
 * scale, without the container background or padding.
 */
export default function AlignLogo({ compact = false }: { compact?: boolean }) {
  const logoMark = (
    <div className={`align-logo${compact ? ' align-logo--compact' : ''}`}>
      {/* small leading "a" */}
      <span className="a">a</span>

      {/* tall "L" — the beam is anchored to its bottom-left */}
      <span className="L">
        L
        <span className="beam" aria-hidden="true" />
      </span>

      {/* "iGN" letters rest on the beam */}
      <span className="letters" aria-hidden="true">
        <span>i</span>
        <span>G</span>
        <span>N</span>
      </span>
    </div>
  );

  if (compact) {
    return logoMark;
  }

  return (
    <div className="align-logo-container">
      {logoMark}
    </div>
  );
}
