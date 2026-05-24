type SpriteProps = { size?: number };

type Layer = { color: string; pixels: [number, number][] };

// Clean pixel sprite renderer — each layer paints its pixels as 1x1 cells in
// declaration order, so callers control outline → fill → highlight stacking
// explicitly. No halo tricks (which muddy solid shapes).
function PixelSprite({
  width,
  height,
  size,
  layers,
}: {
  width: number;
  height: number;
  size: number;
  layers: Layer[];
}) {
  return (
    <svg
      width={size}
      height={size * (height / width)}
      viewBox={`0 0 ${width} ${height}`}
      shapeRendering="crispEdges"
      className="block pixel-art"
      aria-hidden
    >
      {layers.map((layer, li) =>
        layer.pixels.map(([x, y], i) => (
          <rect
            key={`${li}-${i}`}
            x={x}
            y={y}
            width={1}
            height={1}
            fill={layer.color}
          />
        ))
      )}
    </svg>
  );
}

// ----------------------------------------------------------------------------
// FLAME — 9 wide × 11 tall, symmetric teardrop with a bright yellow core.
//
//   . . . . D . . . .   y=0
//   . . . D L D . . .   y=1
//   . . D L L L D . .   y=2
//   . . D L L L D . .   y=3
//   . D L L M L L D .   y=4
//   D L L M Y M L L D   y=5
//   D L L M Y M L L D   y=6
//   D L L M M M L L D   y=7
//   . D L L L L L D .   y=8
//   . . D L L L D . .   y=9
//   . . . D D D . . .   y=10
// ----------------------------------------------------------------------------

const FLAME_DARK: [number, number][] = [
  [4, 0],
  [3, 1], [5, 1],
  [2, 2], [6, 2],
  [2, 3], [6, 3],
  [1, 4], [7, 4],
  [0, 5], [8, 5],
  [0, 6], [8, 6],
  [0, 7], [8, 7],
  [1, 8], [7, 8],
  [2, 9], [6, 9],
  [3, 10], [4, 10], [5, 10],
];

const FLAME_LIGHT: [number, number][] = [
  [4, 1],
  [3, 2], [4, 2], [5, 2],
  [3, 3], [4, 3], [5, 3],
  [2, 4], [3, 4], [5, 4], [6, 4],
  [1, 5], [2, 5], [6, 5], [7, 5],
  [1, 6], [2, 6], [6, 6], [7, 6],
  [1, 7], [2, 7], [6, 7], [7, 7],
  [2, 8], [3, 8], [4, 8], [5, 8], [6, 8],
  [3, 9], [4, 9], [5, 9],
];

const FLAME_MID: [number, number][] = [
  [4, 4],
  [3, 5], [5, 5],
  [3, 6], [5, 6],
  [3, 7], [4, 7], [5, 7],
];

const FLAME_BRIGHT: [number, number][] = [
  [4, 5],
  [4, 6],
];

export function PixelFlame({ size = 24 }: SpriteProps) {
  return (
    <PixelSprite
      width={9}
      height={11}
      size={size}
      layers={[
        { color: "#7c2d12", pixels: FLAME_DARK },        // dark red outline
        { color: "#fb923c", pixels: FLAME_LIGHT },       // orange body
        { color: "#fcd34d", pixels: FLAME_MID },         // amber inner
        { color: "#fef3c7", pixels: FLAME_BRIGHT },      // bright yellow core
      ]}
    />
  );
}

// ----------------------------------------------------------------------------
// TROPHY — 11 wide × 11 tall, classic cup w/ handles, stem, base.
//
//   D D D D D D D D D D D   y=0  rim
//   D L L L L L L L L L D   y=1  cup interior (with highlight at upper-left)
//   D D D L L L L L D D D   y=2  handles outline
//   . D L L L L L L L D .   y=3
//   . D L L L L L L L D .   y=4
//   . D D L L L L L D D .   y=5  cup bottom
//   . . D D L L L D D . .   y=6
//   . . . . D L D . . . .   y=7  stem
//   . . . . D L D . . . .   y=8
//   . . D D D L D D D . .   y=9  base flare
//   . D D D D D D D D D .   y=10 base bottom
// ----------------------------------------------------------------------------

const TROPHY_DARK: [number, number][] = [
  // y=0
  [0, 0], [1, 0], [2, 0], [3, 0], [4, 0], [5, 0], [6, 0], [7, 0], [8, 0], [9, 0], [10, 0],
  // y=1
  [0, 1], [10, 1],
  // y=2
  [0, 2], [1, 2], [2, 2], [8, 2], [9, 2], [10, 2],
  // y=3
  [1, 3], [9, 3],
  // y=4
  [1, 4], [9, 4],
  // y=5
  [1, 5], [2, 5], [8, 5], [9, 5],
  // y=6
  [2, 6], [3, 6], [7, 6], [8, 6],
  // y=7
  [4, 7], [6, 7],
  // y=8
  [4, 8], [6, 8],
  // y=9
  [2, 9], [3, 9], [4, 9], [6, 9], [7, 9], [8, 9],
  // y=10
  [1, 10], [2, 10], [3, 10], [4, 10], [5, 10], [6, 10], [7, 10], [8, 10], [9, 10],
];

const TROPHY_LIGHT: [number, number][] = [
  // y=1 row of cup
  [1, 1], [2, 1], [3, 1], [4, 1], [5, 1], [6, 1], [7, 1], [8, 1], [9, 1],
  // y=2 (only the center section between handle pixels)
  [3, 2], [4, 2], [5, 2], [6, 2], [7, 2],
  // y=3
  [2, 3], [3, 3], [4, 3], [5, 3], [6, 3], [7, 3], [8, 3],
  // y=4
  [2, 4], [3, 4], [4, 4], [5, 4], [6, 4], [7, 4], [8, 4],
  // y=5
  [3, 5], [4, 5], [5, 5], [6, 5], [7, 5],
  // y=6
  [4, 6], [5, 6], [6, 6],
  // y=7..9 stem + base inner
  [5, 7],
  [5, 8],
  [5, 9],
];

const TROPHY_HIGHLIGHT: [number, number][] = [
  [2, 1], [3, 1], // upper-left rim highlight
  [2, 3], [2, 4], // left inner wall highlight
];

export function PixelTrophy({ size = 24 }: SpriteProps) {
  return (
    <PixelSprite
      width={11}
      height={11}
      size={size}
      layers={[
        { color: "#78350f", pixels: TROPHY_DARK },      // dark brown outline
        { color: "#fbbf24", pixels: TROPHY_LIGHT },     // gold fill
        { color: "#fef3c7", pixels: TROPHY_HIGHLIGHT }, // cream highlight
      ]}
    />
  );
}

// ----------------------------------------------------------------------------
// CROWN — 9 wide × 7 tall, three-gem crown.
//
//   . D . . D . . D .   y=0  gem tips
//   . D D . D D D . D   ← (drop, ugly) actually:
//
//   . D . . . D . . D .  hmm let me redo
//
// Final layout:
//   . D . . . D . . D .   y=0  three gem tips outline
//   D B D D D B D D D     wait, 9 wide
//
// Clean layout (9 wide × 7 tall):
//   . D . . D . . D .   y=0
//   D B D D B D D B D   y=1  (gems with bright centers)
//   D L L L L L L L D   y=2  (band)
//   D L L L L L L L D   y=3  (band)
//   D L D L D L D L D   y=4  (vertical dividers)
//   D D D D D D D D D   y=5  (bottom outline)
//   . D D D D D D D .   y=6  (foot)
// ----------------------------------------------------------------------------

const CROWN_DARK: [number, number][] = [
  // y=0 — gem tip outlines
  [1, 0], [4, 0], [7, 0],
  // y=1 — outline around gems
  [0, 1], [2, 1], [3, 1], [5, 1], [6, 1], [8, 1],
  // y=2 — band outline edges
  [0, 2], [8, 2],
  // y=3
  [0, 3], [8, 3],
  // y=4 — band bottom with dividers
  [0, 4], [2, 4], [4, 4], [6, 4], [8, 4],
  // y=5 — bottom outline
  [0, 5], [1, 5], [2, 5], [3, 5], [4, 5], [5, 5], [6, 5], [7, 5], [8, 5],
  // y=6 — foot
  [1, 6], [2, 6], [3, 6], [4, 6], [5, 6], [6, 6], [7, 6],
];

const CROWN_GOLD: [number, number][] = [
  // y=2 band
  [1, 2], [2, 2], [3, 2], [4, 2], [5, 2], [6, 2], [7, 2],
  // y=3 band
  [1, 3], [2, 3], [3, 3], [4, 3], [5, 3], [6, 3], [7, 3],
  // y=4 (between dividers)
  [1, 4], [3, 4], [5, 4], [7, 4],
];

const CROWN_GEM: [number, number][] = [
  [1, 1], [4, 1], [7, 1], // bright gem centers
];

export function PixelCrown({ size = 22 }: SpriteProps) {
  return (
    <PixelSprite
      width={9}
      height={7}
      size={size}
      layers={[
        { color: "#78350f", pixels: CROWN_DARK },  // dark outline
        { color: "#fbbf24", pixels: CROWN_GOLD },  // gold band
        { color: "#fef3c7", pixels: CROWN_GEM },   // bright gem centers
      ]}
    />
  );
}
