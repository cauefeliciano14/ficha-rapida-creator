import styles from './ExhaustionTracker.module.css';

interface ExhaustionTrackerProps {
  level: number;
  onChange: (level: number) => void;
}

const SEGMENT_COUNT = 6;

const SEGMENT_COLORS = [
  'hsl(48, 90%, 55%)',   // 1 — yellow
  'hsl(40, 90%, 50%)',   // 2 — amber
  'hsl(30, 90%, 50%)',   // 3 — orange
  'hsl(20, 85%, 48%)',   // 4 — deep orange
  'hsl(8, 80%, 48%)',    // 5 — red-orange
  'hsl(0, 75%, 45%)',    // 6 — red (dead)
];

export function ExhaustionTracker({ level, onChange }: ExhaustionTrackerProps) {
  const handleSegmentClick = (seg: number) => {
    onChange(seg === level ? seg - 1 : seg);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <span className={styles.label}>EXAUSTÃO</span>
        {level > 0 && (
          <span className={styles.penalty} style={{ color: SEGMENT_COLORS[Math.min(level, SEGMENT_COUNT) - 1] }}>
            −{level} d20
          </span>
        )}
      </div>
      <div className={styles.bar}>
        {Array.from({ length: SEGMENT_COUNT }, (_, i) => {
          const active = i < level;
          return (
            <button
              key={i}
              className={active ? styles.segActive : styles.seg}
              style={active ? { background: SEGMENT_COLORS[i], borderColor: SEGMENT_COLORS[i] } : undefined}
              onClick={() => handleSegmentClick(i + 1)}
              title={`Exaustão nível ${i + 1}${i === 5 ? ' (Morte)' : ''}`}
            />
          );
        })}
      </div>
      {level >= 6 && (
        <span className={styles.deadLabel}>MORTE</span>
      )}
    </div>
  );
}
