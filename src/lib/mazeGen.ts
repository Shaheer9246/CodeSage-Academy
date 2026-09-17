// Tile codes: 0 empty, 1 wall, 2 gate, 3 finish, 4 start
export type Tile = 0 | 1 | 2 | 3 | 4;
export type Grid = Tile[][];
export type Facing = 'N' | 'E' | 'S' | 'W';

function seededRand(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 0xffffffff;
  };
}

export function generateMaze(size: number, gateCount: number, seed = Date.now()): Grid {
  const rand = seededRand(seed);
  // Start with all walls, carve a snake-y path with DFS from (1,1)
  const grid: Grid = Array.from({ length: size }, () => Array(size).fill(1) as Tile[]);
  const stack: Array<[number, number]> = [[1, 1]];
  grid[1][1] = 0;
  while (stack.length) {
    const [x, y] = stack[stack.length - 1];
    const dirs: Array<[number, number]> = [[0, -2], [2, 0], [0, 2], [-2, 0]];
    // shuffle dirs
    for (let i = dirs.length - 1; i > 0; i--) {
      const j = Math.floor(rand() * (i + 1));
      [dirs[i], dirs[j]] = [dirs[j], dirs[i]];
    }
    let moved = false;
    for (const [dx, dy] of dirs) {
      const nx = x + dx, ny = y + dy;
      if (nx > 0 && ny > 0 && nx < size - 1 && ny < size - 1 && grid[ny][nx] === 1) {
        grid[y + dy / 2][x + dx / 2] = 0;
        grid[ny][nx] = 0;
        stack.push([nx, ny]);
        moved = true;
        break;
      }
    }
    if (!moved) stack.pop();
  }

  // Mark start + finish
  grid[1][1] = 4;
  // find farthest empty cell as finish (BFS)
  const dist: number[][] = Array.from({ length: size }, () => Array(size).fill(-1));
  dist[1][1] = 0;
  const q: Array<[number, number]> = [[1, 1]];
  let far: [number, number] = [1, 1];
  while (q.length) {
    const [x, y] = q.shift()!;
    if (dist[y][x] > dist[far[1]][far[0]]) far = [x, y];
    for (const [dx, dy] of [[0, -1], [1, 0], [0, 1], [-1, 0]]) {
      const nx = x + dx, ny = y + dy;
      if (nx >= 0 && ny >= 0 && nx < size && ny < size && grid[ny][nx] !== 1 && dist[ny][nx] === -1) {
        dist[ny][nx] = dist[y][x] + 1;
        q.push([nx, ny]);
      }
    }
  }
  grid[far[1]][far[0]] = 3;

  // Drop gates on random corridor cells (not start/finish)
  const corridors: Array<[number, number]> = [];
  for (let y = 0; y < size; y++)
    for (let x = 0; x < size; x++)
      if (grid[y][x] === 0 && dist[y][x] > 1) corridors.push([x, y]);
  for (let i = corridors.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [corridors[i], corridors[j]] = [corridors[j], corridors[i]];
  }
  for (let i = 0; i < Math.min(gateCount, corridors.length); i++) {
    const [x, y] = corridors[i];
    grid[y][x] = 2;
  }
  return grid;
}

export function turnLeft(f: Facing): Facing {
  return ({ N: 'W', W: 'S', S: 'E', E: 'N' } as const)[f];
}
export function turnRight(f: Facing): Facing {
  return ({ N: 'E', E: 'S', S: 'W', W: 'N' } as const)[f];
}
export function delta(f: Facing): [number, number] {
  const m: Record<Facing, [number, number]> = { N: [0, -1], E: [1, 0], S: [0, 1], W: [-1, 0] };
  return m[f];
}
