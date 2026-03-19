// ═══════════════════════════════════════════════════════════════════
//  SPACE.JS  –  Three.js scene, all celestial bodies
// ═══════════════════════════════════════════════════════════════════

import { PLANET_CONFIG, REAL_STARS_CONFIG, DWARF_CONFIG } from './data.js';

// ── Procedural canvas textures ─────────────────────────────────────
// Generates textures at runtime — no external URLs, works fully offline

function makeCanvasTex(w, h, drawFn) {
  const canvas = document.createElement('canvas');
  canvas.width = w; canvas.height = h;
  drawFn(canvas.getContext('2d'), w, h);
  const t = new THREE.CanvasTexture(canvas);
  return t;
}

// Seeded pseudo-random for consistent noise patterns
function seededRand(seed) {
  let s = seed;
  return () => { s = (s * 16807 + 0) % 2147483647; return (s - 1) / 2147483646; };
}

// Generic noise helper used by multiple body generators
function drawNoise(ctx, w, h, rng, baseColor, spotColor, spotCount, spotSize) {
  ctx.fillStyle = baseColor;
  ctx.fillRect(0, 0, w, h);
  for (let i = 0; i < spotCount; i++) {
    const x = rng() * w, y = rng() * h;
    const r = (rng() * spotSize + spotSize * 0.3);
    const grd = ctx.createRadialGradient(x, y, 0, x, y, r);
    grd.addColorStop(0, spotColor);
    grd.addColorStop(1, 'transparent');
    ctx.fillStyle = grd;
    ctx.fillRect(x - r, y - r, r * 2, r * 2);
  }
}

// Horizontal band helper for gas giants
function drawBands(ctx, w, h, bands) {
  bands.forEach(([yFrac, hFrac, color]) => {
    ctx.fillStyle = color;
    ctx.fillRect(0, yFrac * h, w, hFrac * h);
  });
}

const PROC_TEX = {

  Sun() {
    return makeCanvasTex(512, 256, (ctx, w, h) => {
      const rng = seededRand(1);
      // Base golden orange
      const bg = ctx.createLinearGradient(0, 0, w, h);
      bg.addColorStop(0,   '#ff9900');
      bg.addColorStop(0.5, '#ffcc00');
      bg.addColorStop(1,   '#ff7700');
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, w, h);
      // Plasma granules
      for (let i = 0; i < 600; i++) {
        const x = rng() * w, y = rng() * h, r = rng() * 12 + 3;
        const g = ctx.createRadialGradient(x, y, 0, x, y, r);
        const bright = rng() > 0.5;
        g.addColorStop(0, bright ? '#ffee44' : '#cc6600');
        g.addColorStop(1, 'transparent');
        ctx.fillStyle = g;
        ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill();
      }
      // Sunspot pairs
      for (let i = 0; i < 4; i++) {
        const x = rng() * w * 0.8 + w * 0.1, y = rng() * h * 0.6 + h * 0.2;
        ctx.fillStyle = 'rgba(80,20,0,0.6)';
        ctx.beginPath(); ctx.arc(x, y, 8, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(x + 14, y + 4, 6, 0, Math.PI * 2); ctx.fill();
      }
    });
  },

  Mercury() {
    return makeCanvasTex(512, 256, (ctx, w, h) => {
      const rng = seededRand(2);
      ctx.fillStyle = '#9a9a8e'; ctx.fillRect(0, 0, w, h);
      // Craters
      for (let i = 0; i < 120; i++) {
        const x = rng() * w, y = rng() * h, r = rng() * 10 + 2;
        ctx.fillStyle = `rgba(60,55,50,${0.3 + rng() * 0.4})`;
        ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill();
        ctx.strokeStyle = `rgba(180,175,165,${0.2 + rng() * 0.2})`;
        ctx.lineWidth = 0.8;
        ctx.beginPath(); ctx.arc(x, y, r * 1.3, 0, Math.PI * 2); ctx.stroke();
      }
    });
  },

  Venus() {
    return makeCanvasTex(512, 256, (ctx, w, h) => {
      const rng = seededRand(3);
      // Swirling yellow-orange cloud bands
      const bg = ctx.createLinearGradient(0, 0, 0, h);
      bg.addColorStop(0,   '#d4a44c');
      bg.addColorStop(0.5, '#e8c870');
      bg.addColorStop(1,   '#c49040');
      ctx.fillStyle = bg; ctx.fillRect(0, 0, w, h);
      for (let i = 0; i < 18; i++) {
        const y = rng() * h;
        ctx.fillStyle = `rgba(255,220,120,${0.08 + rng() * 0.12})`;
        ctx.fillRect(0, y, w, rng() * 12 + 3);
      }
      drawNoise(ctx, w, h, rng, 'transparent', 'rgba(200,150,50,0.08)', 200, 20);
    });
  },

  Earth() {
    return makeCanvasTex(512, 256, (ctx, w, h) => {
      const rng = seededRand(4);
      // Ocean base
      ctx.fillStyle = '#1a5fa8'; ctx.fillRect(0, 0, w, h);
      // Landmasses — rough continental shapes
      const lands = [
        // North America ish
        {x:0.08,y:0.18,rx:0.09,ry:0.18},
        // South America
        {x:0.18,y:0.5,rx:0.05,ry:0.18},
        // Europe/Africa
        {x:0.44,y:0.2,rx:0.06,ry:0.12},
        {x:0.46,y:0.38,rx:0.06,ry:0.22},
        // Asia
        {x:0.56,y:0.15,rx:0.18,ry:0.2},
        // Australia
        {x:0.72,y:0.58,rx:0.06,ry:0.08},
        // Antarctica
        {x:0.5,y:0.9,rx:0.35,ry:0.06},
      ];
      ctx.fillStyle = '#3a8a3a';
      lands.forEach(l => {
        ctx.beginPath();
        ctx.ellipse(l.x*w, l.y*h, l.rx*w, l.ry*h, rng()*0.5, 0, Math.PI*2);
        ctx.fill();
      });
      // Ice caps
      ctx.fillStyle = '#ddeeff';
      ctx.fillRect(0, 0, w, h * 0.06);
      ctx.fillRect(0, h * 0.88, w, h * 0.12);
      // Cloud wisps
      for (let i = 0; i < 30; i++) {
        const x = rng()*w, y = rng()*h;
        ctx.fillStyle = `rgba(255,255,255,${0.15+rng()*0.25})`;
        ctx.beginPath();
        ctx.ellipse(x, y, rng()*40+15, rng()*8+3, rng()*Math.PI, 0, Math.PI*2);
        ctx.fill();
      }
    });
  },

  Mars() {
    return makeCanvasTex(512, 256, (ctx, w, h) => {
      const rng = seededRand(5);
      ctx.fillStyle = '#b5411a'; ctx.fillRect(0, 0, w, h);
      // Terrain variation
      drawNoise(ctx, w, h, rng, 'transparent', 'rgba(180,80,30,0.3)', 300, 18);
      drawNoise(ctx, w, h, rng, 'transparent', 'rgba(100,30,10,0.2)', 200, 12);
      // Valles Marineris — long dark canyon
      ctx.fillStyle = 'rgba(60,15,5,0.5)';
      ctx.fillRect(w*0.25, h*0.45, w*0.4, h*0.04);
      // Polar ice caps
      ctx.fillStyle = 'rgba(240,230,220,0.85)';
      ctx.beginPath(); ctx.ellipse(w*0.5, 0, w*0.25, h*0.07, 0, 0, Math.PI*2); ctx.fill();
      ctx.beginPath(); ctx.ellipse(w*0.5, h, w*0.18, h*0.05, 0, 0, Math.PI*2); ctx.fill();
    });
  },

  Jupiter() {
    return makeCanvasTex(512, 256, (ctx, w, h) => {
      const rng = seededRand(6);
      const bands = [
        [0.00, 0.06, '#c8a882'], [0.06, 0.05, '#a07850'],
        [0.11, 0.08, '#d4b88a'], [0.19, 0.06, '#9a6840'],
        [0.25, 0.10, '#e0c898'], [0.35, 0.05, '#b08858'],
        [0.40, 0.08, '#d8c090'], [0.48, 0.06, '#a07050'],
        [0.54, 0.09, '#cbb882'], [0.63, 0.05, '#906030'],
        [0.68, 0.08, '#d0a870'], [0.76, 0.06, '#b07848'],
        [0.82, 0.09, '#c8a060'], [0.91, 0.09, '#906030'],
      ];
      drawBands(ctx, w, h, bands);
      // Turbulent edges on bands
      for (let i = 0; i < 80; i++) {
        const x = rng()*w, y = rng()*h, rx = rng()*30+10, ry = rng()*4+1;
        ctx.fillStyle = `rgba(${Math.floor(rng()*60+140)},${Math.floor(rng()*40+80)},${Math.floor(rng()*20+30)},0.15)`;
        ctx.beginPath(); ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI*2); ctx.fill();
      }
      // Great Red Spot
      ctx.fillStyle = 'rgba(160,60,40,0.85)';
      ctx.beginPath(); ctx.ellipse(w*0.35, h*0.62, w*0.06, h*0.04, 0.2, 0, Math.PI*2); ctx.fill();
      ctx.fillStyle = 'rgba(200,100,70,0.5)';
      ctx.beginPath(); ctx.ellipse(w*0.35, h*0.62, w*0.04, h*0.025, 0.2, 0, Math.PI*2); ctx.fill();
    });
  },

  Saturn() {
    return makeCanvasTex(512, 256, (ctx, w, h) => {
      const rng = seededRand(7);
      const bands = [
        [0.00, 0.08, '#e8d8b0'], [0.08, 0.06, '#c8b888'],
        [0.14, 0.10, '#ecddb8'], [0.24, 0.05, '#c0a870'],
        [0.29, 0.12, '#e8d4a8'], [0.41, 0.06, '#c4a878'],
        [0.47, 0.10, '#e4d0a4'], [0.57, 0.06, '#c8aa80'],
        [0.63, 0.11, '#e0cc9c'], [0.74, 0.06, '#c0a070'],
        [0.80, 0.10, '#dcc898'], [0.90, 0.10, '#c8b080'],
      ];
      drawBands(ctx, w, h, bands);
      for (let i = 0; i < 40; i++) {
        const x = rng()*w, y = rng()*h, rx = rng()*25+8, ry = rng()*3+1;
        ctx.fillStyle = `rgba(180,150,90,0.1)`;
        ctx.beginPath(); ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI*2); ctx.fill();
      }
    });
  },

  Uranus() {
    return makeCanvasTex(512, 256, (ctx, w, h) => {
      const bg = ctx.createLinearGradient(0, 0, 0, h);
      bg.addColorStop(0,   '#72d8e0');
      bg.addColorStop(0.5, '#9aeaea');
      bg.addColorStop(1,   '#60c8d0');
      ctx.fillStyle = bg; ctx.fillRect(0, 0, w, h);
      // Faint bands
      const rng = seededRand(8);
      for (let i = 0; i < 12; i++) {
        const y = rng()*h;
        ctx.fillStyle = `rgba(100,200,210,${0.04+rng()*0.06})`;
        ctx.fillRect(0, y, w, rng()*8+2);
      }
    });
  },

  Neptune() {
    return makeCanvasTex(512, 256, (ctx, w, h) => {
      const rng = seededRand(9);
      const bg = ctx.createLinearGradient(0, 0, 0, h);
      bg.addColorStop(0,   '#1a3ab8');
      bg.addColorStop(0.5, '#2244cc');
      bg.addColorStop(1,   '#1030a0');
      ctx.fillStyle = bg; ctx.fillRect(0, 0, w, h);
      // Storm bands
      for (let i = 0; i < 15; i++) {
        const y = rng()*h;
        ctx.fillStyle = `rgba(60,100,220,${0.06+rng()*0.08})`;
        ctx.fillRect(0, y, w, rng()*10+2);
      }
      // Great Dark Spot
      ctx.fillStyle = 'rgba(10,20,100,0.7)';
      ctx.beginPath(); ctx.ellipse(w*0.6, h*0.4, w*0.07, h*0.04, 0.3, 0, Math.PI*2); ctx.fill();
    });
  },

  Moon() {
    return makeCanvasTex(512, 256, (ctx, w, h) => {
      const rng = seededRand(10);
      ctx.fillStyle = '#aaaaaa'; ctx.fillRect(0, 0, w, h);
      // Mare (dark patches)
      const mare = [{x:0.35,y:0.35,r:0.12},{x:0.55,y:0.3,r:0.09},{x:0.45,y:0.5,r:0.07}];
      mare.forEach(m => {
        ctx.fillStyle = 'rgba(70,70,70,0.5)';
        ctx.beginPath(); ctx.ellipse(m.x*w, m.y*h, m.r*w, m.r*h*0.8, 0, 0, Math.PI*2); ctx.fill();
      });
      // Craters
      for (let i = 0; i < 80; i++) {
        const x = rng()*w, y = rng()*h, r = rng()*8+1;
        ctx.fillStyle = `rgba(80,80,75,${0.2+rng()*0.3})`;
        ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI*2); ctx.fill();
        ctx.strokeStyle = `rgba(200,200,195,${0.1+rng()*0.15})`;
        ctx.lineWidth = 0.6;
        ctx.beginPath(); ctx.arc(x, y, r*1.4, 0, Math.PI*2); ctx.stroke();
      }
    });
  },

  Pluto() {
    return makeCanvasTex(512, 256, (ctx, w, h) => {
      const rng = seededRand(11);
      ctx.fillStyle = '#b8a898'; ctx.fillRect(0, 0, w, h);
      drawNoise(ctx, w, h, rng, 'transparent', 'rgba(150,110,80,0.3)', 150, 20);
      // Tombaugh Regio (heart shape — nitrogen ice plain)
      ctx.fillStyle = 'rgba(230,220,210,0.6)';
      ctx.beginPath(); ctx.ellipse(w*0.5, h*0.55, w*0.15, h*0.18, 0, 0, Math.PI*2); ctx.fill();
    });
  },

  // Generic rocky body for other moons
  Rocky(seed) {
    return makeCanvasTex(256, 128, (ctx, w, h) => {
      const rng = seededRand(seed ?? 99);
      ctx.fillStyle = '#888878'; ctx.fillRect(0, 0, w, h);
      for (let i = 0; i < 60; i++) {
        const x = rng()*w, y = rng()*h, r = rng()*6+1;
        ctx.fillStyle = `rgba(50,45,40,${0.2+rng()*0.3})`;
        ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI*2); ctx.fill();
      }
    });
  },
};

// ── Scene bootstrap ────────────────────────────────────────────────
export function buildScene() {
  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(
    60, window.innerWidth / window.innerHeight, 0.1, 8000
  );
  camera.position.set(0, 55, 130);

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  document.getElementById('canvas-host').appendChild(renderer.domElement);

  // Sun light
  const sunLight = new THREE.PointLight(0xfff4dd, 2.5, 3000);
  sunLight.position.set(0, 0, 0);
  scene.add(sunLight);

  // Ambient fill — very dim so unlit sides aren't pure black
  scene.add(new THREE.AmbientLight(0x111133, 0.35));

  // Orbit controls
  const controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.07;
  controls.minDistance = 5;
  controls.maxDistance = 2000;

  window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
  });

  return { scene, camera, renderer, controls };
}

// ── Starfield ──────────────────────────────────────────────────────
export function buildStarfield(scene) {
  // Two layers: small white + coloured tinted
  const addStars = (count, size, spread, colors) => {
    const geo = new THREE.BufferGeometry();
    const verts = new Float32Array(count * 3);
    const cols  = new Float32Array(count * 3);
    const palette = colors || [[1,1,1]];
    for (let i = 0; i < count; i++) {
      // Distribute on a sphere shell
      const theta = Math.random() * Math.PI * 2;
      const phi   = Math.acos(2 * Math.random() - 1);
      const r     = spread * (0.8 + Math.random() * 0.2);
      verts[i*3]   = r * Math.sin(phi) * Math.cos(theta);
      verts[i*3+1] = r * Math.sin(phi) * Math.sin(theta);
      verts[i*3+2] = r * Math.cos(phi);
      const c = palette[Math.floor(Math.random() * palette.length)];
      cols[i*3] = c[0]; cols[i*3+1] = c[1]; cols[i*3+2] = c[2];
    }
    geo.setAttribute('position', new THREE.BufferAttribute(verts, 3));
    geo.setAttribute('color',    new THREE.BufferAttribute(cols, 3));
    const mat = new THREE.PointsMaterial({
      size, vertexColors: true, sizeAttenuation: true, transparent: true, opacity: 0.85
    });
    scene.add(new THREE.Points(geo, mat));
  };

  addStars(12000, 0.6, 3500, [
    [1.0, 1.0, 1.0],
    [1.0, 0.95, 0.85],
    [0.85, 0.9, 1.0],
    [1.0, 0.8, 0.7],
  ]);
  addStars(3000, 1.2, 3500, [[1,1,1]]);
}

// ── Sun ─────────────────────────────────────────────────────────────
export function buildSun(scene) {
  const geo  = new THREE.SphereGeometry(5, 64, 64);
  const mat  = new THREE.MeshBasicMaterial({ map: PROC_TEX.Sun() });
  const mesh = new THREE.Mesh(geo, mat);
  mesh.userData = { name: 'Sun', bodyType: 'star' };
  scene.add(mesh);

  // Corona glow (sprite-like halo using additive blending)
  const glowGeo = new THREE.SphereGeometry(7.5, 32, 32);
  const glowMat = new THREE.MeshBasicMaterial({
    color: 0xff9900, transparent: true, opacity: 0.12,
    side: THREE.BackSide, blending: THREE.AdditiveBlending, depthWrite: false
  });
  scene.add(new THREE.Mesh(glowGeo, glowMat));

  const glowGeo2 = new THREE.SphereGeometry(10, 32, 32);
  const glowMat2 = new THREE.MeshBasicMaterial({
    color: 0xff6600, transparent: true, opacity: 0.05,
    side: THREE.BackSide, blending: THREE.AdditiveBlending, depthWrite: false
  });
  scene.add(new THREE.Mesh(glowGeo2, glowMat2));

  return mesh;
}

// ── Planet builder ─────────────────────────────────────────────────
function buildPlanetMesh(cfg, scene) {
  const geo = new THREE.SphereGeometry(cfg.radius, 48, 48);

  // Get procedural texture for this body (fall back to colour if none)
  const procTex = PROC_TEX[cfg.name] ? PROC_TEX[cfg.name]() : null;

  let mat;
  if (cfg.name === 'Earth') {
    mat = new THREE.MeshPhongMaterial({
      map:       procTex,
      specular:  new THREE.Color(0x4466aa),
      shininess: 35,
    });
  } else if (procTex) {
    mat = new THREE.MeshPhongMaterial({
      map:       procTex,
      shininess: ['Jupiter','Saturn','Uranus','Neptune'].includes(cfg.name) ? 5 : 12,
      specular:  new THREE.Color(0x111111),
    });
  } else {
    mat = new THREE.MeshPhongMaterial({
      color:    cfg.color,
      emissive: cfg.emissive ?? 0x000000,
      emissiveIntensity: 0.1,
      shininess: 10,
      specular:  new THREE.Color(0x111111),
    });
  }

  // Cloud layer
  let cloudMesh = null;
  if (cfg.name === 'Earth') {
    cloudMesh = new THREE.Mesh(
      new THREE.SphereGeometry(cfg.radius * 1.02, 48, 48),
      new THREE.MeshPhongMaterial({
        map:         makeCloudTex(),
        transparent: true, opacity: 0.5, depthWrite: false,
      })
    );
  }
  if (cfg.name === 'Venus') {
    cloudMesh = new THREE.Mesh(
      new THREE.SphereGeometry(cfg.radius * 1.03, 48, 48),
      new THREE.MeshPhongMaterial({
        map:         PROC_TEX.Venus(),
        transparent: true, opacity: 0.6, depthWrite: false,
        color: 0xddcc88,
      })
    );
  }

  // Atmosphere glow
  const atmoColors = {
    Earth: 0x4488ff, Venus: 0xffcc44,
    Jupiter: 0xffaa44, Saturn: 0xffcc66,
    Uranus: 0x66ffee, Neptune: 0x2244ff,
  };
  if (atmoColors[cfg.name]) {
    cfg._atmo = new THREE.Mesh(
      new THREE.SphereGeometry(cfg.radius * 1.15, 32, 32),
      new THREE.MeshBasicMaterial({
        color: atmoColors[cfg.name], transparent: true, opacity: 0.07,
        side: THREE.BackSide, blending: THREE.AdditiveBlending, depthWrite: false,
      })
    );
  }

  const planet = new THREE.Mesh(geo, mat);
  planet.rotation.z = THREE.MathUtils.degToRad(cfg.tilt ?? 0);
  planet.castShadow    = true;
  planet.receiveShadow = true;
  planet.userData = { name: cfg.name, bodyType: 'planet', cfg };

  const group = new THREE.Group();
  group.add(planet);
  if (cfg._atmo) group.add(cfg._atmo);
  if (cloudMesh) { cfg._cloudMesh = cloudMesh; group.add(cloudMesh); }

  return { group, planet, cloudMesh };
}

function makeCloudTex() {
  return makeCanvasTex(512, 256, (ctx, w, h) => {
    const rng = seededRand(42);
    ctx.clearRect(0, 0, w, h);
    for (let i = 0; i < 60; i++) {
      const x = rng()*w, y = rng()*h;
      ctx.fillStyle = `rgba(255,255,255,${0.1+rng()*0.25})`;
      ctx.beginPath();
      ctx.ellipse(x, y, rng()*50+10, rng()*12+3, rng()*Math.PI, 0, Math.PI*2);
      ctx.fill();
    }
  });
}

// ── Rings ──────────────────────────────────────────────────────────
function buildRings(cfg, scene) {
  const inner = cfg.ringInner * cfg.radius;
  const outer = cfg.ringOuter * cfg.radius;
  const geo   = new THREE.RingGeometry(inner, outer, 128, 4);

  // Fix RingGeometry UVs so texture maps radially (Three.js bug workaround)
  const pos = geo.attributes.position;
  const uv  = geo.attributes.uv;
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i), y = pos.getY(i);
    const r = Math.sqrt(x*x + y*y);
    uv.setXY(i, (r - inner) / (outer - inner), 0.5);
  }

  let mat;
  if (cfg.name === 'Saturn') {
    // Procedural ring texture: concentric bands of varying opacity
    const ringTex = makeCanvasTex(512, 64, (ctx, w, h) => {
      const grad = ctx.createLinearGradient(0, 0, w, 0);
      grad.addColorStop(0.00, 'rgba(0,0,0,0)');
      grad.addColorStop(0.05, 'rgba(180,160,120,0.3)');
      grad.addColorStop(0.15, 'rgba(210,190,140,0.7)');
      grad.addColorStop(0.25, 'rgba(190,170,120,0.5)');
      grad.addColorStop(0.35, 'rgba(220,200,155,0.85)');
      grad.addColorStop(0.45, 'rgba(160,140,100,0.4)');  // Cassini Division
      grad.addColorStop(0.50, 'rgba(100,85,60,0.15)');
      grad.addColorStop(0.55, 'rgba(200,180,135,0.75)');
      grad.addColorStop(0.65, 'rgba(215,195,150,0.65)');
      grad.addColorStop(0.75, 'rgba(180,160,115,0.45)');
      grad.addColorStop(0.88, 'rgba(160,140,100,0.25)');
      grad.addColorStop(1.00, 'rgba(0,0,0,0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);
    });
    mat = new THREE.MeshBasicMaterial({
      map: ringTex, side: THREE.DoubleSide,
      transparent: true, depthWrite: false, alphaTest: 0.01,
    });
  } else {
    mat = new THREE.MeshBasicMaterial({
      color:       cfg.ringColor ?? 0xaaaaaa,
      side:        THREE.DoubleSide,
      transparent: true,
      opacity:     0.35,
      depthWrite:  false,
    });
  }

  const ring = new THREE.Mesh(geo, mat);
  ring.rotation.x = Math.PI / 2;
  ring.userData = { bodyType: 'ring' };
  return ring;
}

// ── Orbit path ─────────────────────────────────────────────────────
function buildOrbit(a, e, color) {
  const pts = [];
  for (let t = 0; t <= Math.PI * 2; t += 0.005) {
    const r = (a * (1 - e * e)) / (1 + e * Math.cos(t));
    pts.push(new THREE.Vector3(r * Math.cos(t), 0, r * Math.sin(t)));
  }
  pts.push(pts[0].clone());
  const geo = new THREE.BufferGeometry().setFromPoints(pts);
  const mat = new THREE.LineBasicMaterial({ color: color ?? 0x1a3a55, transparent: true, opacity: 0.5 });
  return new THREE.Line(geo, mat);
}

// ── Moon builder ───────────────────────────────────────────────────
function buildMoon(mCfg, idx) {
  const geo = new THREE.SphereGeometry(mCfg.radius, 24, 24);
  const moonTex = mCfg.name === 'Luna' ? PROC_TEX.Moon()
                : PROC_TEX.Rocky(idx * 7 + 20);
  const mat = new THREE.MeshPhongMaterial({
    map: moonTex, shininess: 4, specular: new THREE.Color(0x111111),
  });
  const mesh = new THREE.Mesh(geo, mat);
  mesh.userData = { name: mCfg.name, bodyType: 'moon' };
  mesh.castShadow = true;
  return mesh;
}

// ── Asteroid belt ──────────────────────────────────────────────────
export function buildAsteroidBelt(scene) {
  const COUNT = 1800;
  const geo   = new THREE.BufferGeometry();
  const verts = new Float32Array(COUNT * 3);
  const cols  = new Float32Array(COUNT * 3);

  for (let i = 0; i < COUNT; i++) {
    const angle  = Math.random() * Math.PI * 2;
    const radius = 48 + Math.random() * 18;          // between Mars(38) and Jupiter(72)
    const yOff   = (Math.random() - 0.5) * 1.2;
    verts[i*3]   = radius * Math.cos(angle);
    verts[i*3+1] = yOff;
    verts[i*3+2] = radius * Math.sin(angle);
    const bright = 0.45 + Math.random() * 0.25;
    cols[i*3]   = bright;
    cols[i*3+1] = bright * 0.92;
    cols[i*3+2] = bright * 0.82;
  }

  geo.setAttribute('position', new THREE.BufferAttribute(verts, 3));
  geo.setAttribute('color',    new THREE.BufferAttribute(cols, 3));
  const mat = new THREE.PointsMaterial({
    size: 0.35, vertexColors: true, sizeAttenuation: true
  });
  const belt = new THREE.Points(geo, mat);
  belt.userData = { bodyType: 'belt', _angle: 0 };
  scene.add(belt);
  return belt;
}

// ── Comet ──────────────────────────────────────────────────────────
export function buildComet(scene) {
  // Nucleus
  const nucleus = new THREE.Mesh(
    new THREE.SphereGeometry(0.18, 8, 8),
    new THREE.MeshPhongMaterial({ color: 0x555550, emissive: 0x000000, shininess: 2 })
  );
  nucleus.userData = { name: 'Comet Halley', bodyType: 'comet' };

  // Dust tail — wide fan of particles, streams away from Sun
  const DUST_COUNT = 280;
  const dustPositions = new Float32Array(DUST_COUNT * 3);
  const dustColors    = new Float32Array(DUST_COUNT * 3);
  const dustGeo = new THREE.BufferGeometry();
  dustGeo.setAttribute('position', new THREE.BufferAttribute(dustPositions, 3));
  dustGeo.setAttribute('color',    new THREE.BufferAttribute(dustColors, 3));
  const dustMat = new THREE.PointsMaterial({
    size: 0.55, vertexColors: true, transparent: true, opacity: 0.55,
    sizeAttenuation: true, depthWrite: false, blending: THREE.AdditiveBlending
  });
  const dustTail = new THREE.Points(dustGeo, dustMat);
  scene.add(dustTail);

  // Ion tail — narrow, bright blue line of particles
  const ION_COUNT = 160;
  const ionPositions = new Float32Array(ION_COUNT * 3);
  const ionColors    = new Float32Array(ION_COUNT * 3);
  const ionGeo = new THREE.BufferGeometry();
  ionGeo.setAttribute('position', new THREE.BufferAttribute(ionPositions, 3));
  ionGeo.setAttribute('color',    new THREE.BufferAttribute(ionColors, 3));
  const ionMat = new THREE.PointsMaterial({
    size: 0.3, vertexColors: true, transparent: true, opacity: 0.45,
    sizeAttenuation: true, depthWrite: false, blending: THREE.AdditiveBlending
  });
  const ionTail = new THREE.Points(ionGeo, ionMat);
  scene.add(ionTail);

  // Store refs so animateComet can update positions each frame
  nucleus._dustTail  = dustTail;
  nucleus._ionTail   = ionTail;
  nucleus._dustCount = DUST_COUNT;
  nucleus._ionCount  = ION_COUNT;

  scene.add(nucleus);

  // Halley-like highly elliptical orbit line
  // a=300, e=0.967 → perihelion = 300*(1-0.967) = ~10 units, well clear of Sun radius 5
  const cometOrbit = buildOrbit(300, 0.967, 0x4499ff);
  scene.add(cometOrbit);

  return {
    nucleus,
    orbitData: { a: 300, e: 0.967, theta: 0, speed: 0.003 }
  };
}

// ── Real stars ─────────────────────────────────────────────────────
export function buildRealStars(scene) {
  return REAL_STARS_CONFIG.map(cfg => {
    const geo  = new THREE.SphereGeometry(cfg.radius, 16, 16);
    const mat  = new THREE.MeshBasicMaterial({ color: cfg.color });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(...cfg.pos);
    mesh.userData = { name: cfg.name, bodyType: 'realStar' };

    // Glow
    const glowGeo = new THREE.SphereGeometry(cfg.radius * 2.2, 16, 16);
    const glowMat = new THREE.MeshBasicMaterial({
      color: cfg.color, transparent: true, opacity: 0.08,
      side: THREE.BackSide, blending: THREE.AdditiveBlending, depthWrite: false
    });
    const glow = new THREE.Mesh(glowGeo, glowMat);
    mesh.add(glow);

    scene.add(mesh);
    return mesh;
  });
}

// ── Build all planets ──────────────────────────────────────────────
export function buildPlanets(scene) {
  const result = [];

  const buildSet = (configs) => {
    configs.forEach(cfg => {
      cfg.theta = Math.random() * Math.PI * 2;

      const { group, planet, cloudMesh } = buildPlanetMesh(cfg, scene);

      // Orbit line
      scene.add(buildOrbit(cfg.a, cfg.e));

      // Rings
      let ringMesh = null;
      if (cfg.hasRings) {
        ringMesh = buildRings(cfg, scene);
        group.add(ringMesh);
      }

      scene.add(group);

      // Moons
      const moons = [];
      cfg.moons?.forEach((mCfg, mi) => {
        mCfg.theta = Math.random() * Math.PI * 2;
        const moonMesh = buildMoon(mCfg, mi);
        scene.add(moonMesh);
        moons.push({ mesh: moonMesh, cfg: mCfg });
      });

      result.push({ group, planet, cloudMesh, ringMesh, cfg, moons });
    });
  };

  buildSet(PLANET_CONFIG);
  buildSet(DWARF_CONFIG);

  return result;
}

// ── Labels ─────────────────────────────────────────────────────────
export function buildLabel(text, subtle) {
  const div = document.createElement('div');
  div.textContent = text;
  div.className = subtle ? 'label label-subtle' : 'label';
  document.getElementById('labels').appendChild(div);
  return div;
}

// ── Animate orbital position (Kepler) ──────────────────────────────
export function keplerPos(a, e, theta) {
  const r = (a * (1 - e * e)) / (1 + e * Math.cos(theta));
  return { x: r * Math.cos(theta), z: r * Math.sin(theta), r };
}

// ── Camera focus system ────────────────────────────────────────────
export class CameraFocus {
  constructor(camera, controls) {
    this.camera   = camera;
    this.controls = controls;
    this.target   = null;
    this.orbiting = false;
    this.orbitAngle  = 0;
    this.orbitRadius = 50;
    this._isMouseDown  = false;
    this._dragDelta    = 0;
    this.DRAG_THRESHOLD = 5;

    this._onMouseDown = () => { this._isMouseDown = true; this._dragDelta = 0; };
    this._onMouseMove = (e) => {
      if (this._isMouseDown && this.target) {
        this._dragDelta += Math.abs(e.movementX) + Math.abs(e.movementY);
        if (this._dragDelta > this.DRAG_THRESHOLD) this.exit();
      }
    };
    this._onMouseUp   = () => { this._isMouseDown = false; };
    this._onWheel     = () => { if (this.target) this.exit(); };
    this._onTouch     = () => { if (this.target) this.exit(); };

    document.addEventListener('mousedown', this._onMouseDown);
    document.addEventListener('mousemove', this._onMouseMove);
    document.addEventListener('mouseup',   this._onMouseUp);
    document.addEventListener('wheel',     this._onWheel);
    document.addEventListener('touchmove', this._onTouch, { passive: true });
  }

  focus(object, radiusOverride) {
    this.target  = object;
    this.orbiting = false;
    this.orbitAngle  = 0;
    this.orbitRadius = radiusOverride ?? 30;
    document.getElementById('escapeHint').style.display = 'block';
  }

  exit() {
    this.target   = null;
    this.orbiting = false;
    document.getElementById('escapeHint').style.display = 'none';
  }

  get wasDrag() { return this._dragDelta > this.DRAG_THRESHOLD; }
  resetDrag()   { this._dragDelta = 0; }

  update() {
    if (!this.target) return;

    const pos = this.target.getWorldPosition
      ? this.target.getWorldPosition(new THREE.Vector3())
      : this.target.position;

    const desiredY = pos.y + this.orbitRadius * 0.4;
    const dp = new THREE.Vector3();

    if (!this.orbiting) {
      const dir = new THREE.Vector3().subVectors(this.camera.position, pos).normalize();
      dp.copy(pos).add(dir.multiplyScalar(this.orbitRadius));
      this.camera.position.lerp(dp, 0.025);
      this.camera.position.y = THREE.MathUtils.lerp(this.camera.position.y, desiredY, 0.025);
      this.controls.target.lerp(pos, 0.025);

      if (this.camera.position.distanceTo(pos) < this.orbitRadius + 0.5) {
        this.orbiting = true;
        this.orbitAngle = Math.atan2(
          this.camera.position.z - pos.z,
          this.camera.position.x - pos.x
        );
      }
    } else {
      this.orbitAngle += 0.0018;
      dp.x = pos.x + this.orbitRadius * Math.cos(this.orbitAngle);
      dp.z = pos.z + this.orbitRadius * Math.sin(this.orbitAngle);
      dp.y = desiredY;
      this.camera.position.lerp(dp, 0.06);
      this.controls.target.copy(pos);
    }
  }
}
