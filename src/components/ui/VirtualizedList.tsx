/**
 * Lightweight virtualization wrapper using `content-visibility: auto`.
 * Each child is wrapped in a div that lets the browser skip layout/paint
 * for off-screen items while keeping the DOM intact for accessibility and
 * search. Cheaper and simpler than full windowing for our card lists
 * (15-30 items), and degrades gracefully where unsupported.
 */
import React from 'react';

interface Props {
  items: React.ReactNode[];
  /** estimated card size used as `contain-intrinsic-size` to stabilize scroll */
  estimatedItemHeight?: number;
  className?: string;
  itemClassName?: string;
}

export const VirtualizedList = React.memo(function VirtualizedList({
  items,
  estimatedItemHeight = 96,
  className,
  itemClassName,
}: Props) {
  return (
    <div className={className}>
      {items.map((node, i) => (
        <div
          key={i}
          className={itemClassName}
          style={{
            contentVisibility: 'auto',
            containIntrinsicSize: `${estimatedItemHeight}px`,
          } as React.CSSProperties}
        >
          {node}
        </div>
      ))}
    </div>
  );
});
