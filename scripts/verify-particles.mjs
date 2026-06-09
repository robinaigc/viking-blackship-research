import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const particles = fs.readFileSync(
  path.join(root, "app/components/particles.tsx"),
  "utf8",
);
const home = fs.readFileSync(path.join(root, "app/page.tsx"), "utf8");

assert.match(home, /quantity=\{180\}/, "home should render more particles");
assert.match(particles, /kind: "planet" \| "star"/, "particles should have star and planet types");
assert.match(particles, /depth: number/, "particles should track distance depth");
assert.match(particles, /const depth = isPlanet/, "planet opacity should be distance-aware");
assert.match(particles, /const size = isPlanet[\s\S]*20/, "planet size should reach about 10x the original max");
assert.match(particles, /createRadialGradient/, "large particles should have subtle surface shading");
assert.match(particles, /drawPlanetSurface/, "large particles should use a dedicated planet surface renderer");
assert.match(particles, /drawTerrainPatch/, "large particles should have terrain-like patches");
assert.match(particles, /drawCrater/, "large particles should have crater-like marks");
assert.match(particles, /globalAlpha = alpha \* circle\.depth/, "far planets should render with lower opacity");
assert.match(particles, /staticity = 50/, "staticity default should stay unchanged");
assert.match(particles, /ease = 50/, "ease default should stay unchanged");
assert.match(particles, /const magnetism = 0\.1 \+ Math\.random\(\) \* 4/, "magnetism should stay unchanged");

console.log("Particle contract passed.");
