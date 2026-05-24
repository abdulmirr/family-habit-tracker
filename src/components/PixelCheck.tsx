type Props = { size?: number };

// 8-bit pixel-art checkmark, sized to match the chunky avatar art style.
// shape-rendering="crispEdges" keeps every rect a hard square (no anti-aliasing).
export function PixelCheck({ size = 14 }: Props) {
  // Green check pixels — 2-pixel-wide chunky stroke.
  //   . . . . . . G G
  //   . . . . . G G .
  //   . . . . G G . .
  //   G . . G G . . .
  //   G G G G . . . .
  //   . G G . . . . .
  const greens: [number, number][] = [
    [6, 0], [7, 0],
    [5, 1], [6, 1],
    [4, 2], [5, 2],
    [0, 3], [3, 3], [4, 3],
    [0, 4], [1, 4], [2, 4], [3, 4],
    [1, 5], [2, 5],
  ];

  return (
    <svg
      width={size}
      height={size * (8 / 10)}
      viewBox="-1 -1 10 8"
      shapeRendering="crispEdges"
      className="block"
      aria-hidden
    >
      {/* Dark-green outline — drawn as a 3x3 halo per green pixel, then greens overpaint the centers. */}
      {greens.map(([x, y], i) => (
        <rect
          key={`d${i}`}
          x={x - 1}
          y={y - 1}
          width={3}
          height={3}
          fill="#14532d"
        />
      ))}
      {/* Bright green check pixels */}
      {greens.map(([x, y], i) => (
        <rect key={`g${i}`} x={x} y={y} width={1} height={1} fill="#22c55e" />
      ))}
    </svg>
  );
}
