import React from 'react';

export default function CurvedArrow({ direction = 'up' }) {
  const isUp = direction === 'up';

  const pathD = isUp
    ? 'M 10 80 Q 100 0, 190 80'     // Upward curve
    : 'M 10 20 Q 100 100, 190 20';  // Downward curve

  return (
    <svg width="200" height="100" viewBox="0 0 200 100">
      <defs>
        <marker
          id="arrowhead"
          markerWidth="10"
          markerHeight="7"
          refX="10"
          refY="3.5"
          orient="auto"
        >
          <polygon points="0 0, 10 3.5, 0 7" fill="blue" />
        </marker>
      </defs>

      <path
        d={pathD}
        stroke="blue"         // ✅ Make the curve blue
        strokeWidth="2"
        fill="none"
        markerEnd="url(#arrowhead)"
      />
    </svg>
  );
}
