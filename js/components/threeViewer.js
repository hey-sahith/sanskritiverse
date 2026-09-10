// 3D Monument Viewer & Historical Time-Travel Engine (Three.js) - Ultra-Detailed Edition

import { soundManager } from '../utils/audioEffects.js';

let scene, camera, renderer, currentMeshGroup, animId;
let isRotating = true;
let currentMonumentId = 'taj-mahal';
let currentTimeEra = '2026';
let currentLightingMode = 'golden';

// Texture Cache
const textureCache = {};

export function initThreeViewer() {
  const container = document.getElementById('three-canvas-container');
  if (!container || !window.THREE) return;

  container.innerHTML = '';

  const width = container.clientWidth || 800;
  const height = container.clientHeight || 520;

  // Scene setup
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x070d1e);
  scene.fog = new THREE.FogExp2(0x070d1e, 0.012);

  // Camera setup
  camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
  camera.position.set(0, 20, 52);
  camera.lookAt(0, 7, 0);

  // WebGL Renderer
  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
  renderer.setSize(width, height);
  // Detect low‑memory devices (≈ 2 GB or less)
  const isLowMemory = (navigator.deviceMemory && navigator.deviceMemory <= 2);
  // Limit pixel ratio for low‑memory mode
  renderer.setPixelRatio(isLowMemory ? 1 : Math.min(window.devicePixelRatio, 1.5));
  // Optionally disable shadows on low‑memory devices
  renderer.shadowMap.enabled = !isLowMemory;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.15;
  container.appendChild(renderer.domElement);

  // Initialize Textures
  initProceduralTextures();

  // Setup Dynamic Lights
  setupLighting();

  // Load initial monument
  loadMonumentModel(currentMonumentId, currentTimeEra);

  // Interactive controls
  setupInteractiveControls(container);

  // Resize handler
  window.addEventListener('resize', onResize);

  // Start Animation
  animate();

  // Setup UI buttons
  setupViewerUI();
}

// -------------------------------------------------------------
// PROCEDURAL HIGH-FIDELITY TEXTURE GENERATORS
// -------------------------------------------------------------
function initProceduralTextures() {
  textureCache.marble = createProceduralCanvasTexture('marble', 256, 256, (ctx, w, h) => {
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(0, 0, w, h);
    // Subtle grey marble veining
    ctx.strokeStyle = 'rgba(203, 213, 225, 0.35)';
    ctx.lineWidth = 3;
    for (let i = 0; i < 12; i++) {
      ctx.beginPath();
      ctx.moveTo(Math.random() * w, 0);
      ctx.bezierCurveTo(w * 0.3 + Math.random() * 80, h * 0.3, w * 0.7 - Math.random() * 80, h * 0.7, Math.random() * w, h);
      ctx.stroke();
    }
  });

  textureCache.pietraDura = createProceduralCanvasTexture('pietraDura', 256, 256, (ctx, w, h) => {
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, w, h);
    // Gold & Jasper floral vine arabesque border
    ctx.strokeStyle = '#d97706';
    ctx.lineWidth = 10;
    ctx.strokeRect(10, 10, w - 20, h - 20);
    ctx.strokeStyle = '#ea580c';
    ctx.lineWidth = 4;
    ctx.strokeRect(24, 24, w - 48, h - 48);

    // Inlaid floral rosettes
    const colors = ['#dc2626', '#0284c7', '#059669', '#d97706'];
    for (let i = 40; i < w - 40; i += 50) {
      for (let j = 40; j < h - 40; j += 50) {
        ctx.fillStyle = colors[(i + j) % colors.length];
        ctx.beginPath();
        ctx.arc(i, j, 8, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#ffd700';
        ctx.beginPath();
        ctx.arc(i, j, 3, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  });

  textureCache.sandstone = createProceduralCanvasTexture('sandstone', 256, 256, (ctx, w, h) => {
    ctx.fillStyle = '#c49b71';
    ctx.fillRect(0, 0, w, h);
    // Stratified sediment stone courses
    ctx.fillStyle = 'rgba(146, 97, 57, 0.25)';
    for (let y = 0; y < h; y += 18) {
      ctx.fillRect(0, y, w, 2);
    }
    // Fine stone grain
    for (let i = 0; i < 8000; i++) {
      ctx.fillStyle = Math.random() > 0.5 ? 'rgba(255,255,255,0.1)' : 'rgba(80,50,30,0.12)';
      ctx.fillRect(Math.random() * w, Math.random() * h, 2, 2);
    }
  });

  textureCache.granite = createProceduralCanvasTexture('granite', 512, 512, (ctx, w, h) => {
    ctx.fillStyle = '#9e968a';
    ctx.fillRect(0, 0, w, h);
    // Porphyritic granite flecks (pink feldspar, dark mica, quartz)
    for (let i = 0; i < 12000; i++) {
      const rand = Math.random();
      if (rand < 0.4) ctx.fillStyle = 'rgba(212, 163, 145, 0.4)'; // Pink feldspar
      else if (rand < 0.75) ctx.fillStyle = 'rgba(30, 30, 35, 0.5)'; // Biotite mica
      else ctx.fillStyle = 'rgba(240, 240, 245, 0.6)'; // Translucent quartz
      ctx.fillRect(Math.random() * w, Math.random() * h, Math.random() * 3 + 1, Math.random() * 3 + 1);
    }
  });

  textureCache.water = createProceduralCanvasTexture('water', 512, 512, (ctx, w, h) => {
    const grad = ctx.createLinearGradient(0, 0, 0, h);
    grad.addColorStop(0, '#0369a1');
    grad.addColorStop(0.5, '#0284c7');
    grad.addColorStop(1, '#075985');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    // Ripple reflections
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
    ctx.lineWidth = 1.5;
    for (let y = 10; y < h; y += 22) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      for (let x = 0; x < w; x += 30) {
        ctx.quadraticCurveTo(x + 15, y + (Math.sin(x) * 4), x + 30, y);
      }
      ctx.stroke();
    }
  });
}

function createProceduralCanvasTexture(id, width, height, drawFn) {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  drawFn(ctx, width, height);

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  return texture;
}

// -------------------------------------------------------------
// DYNAMIC LIGHTING
// -------------------------------------------------------------
function setupLighting() {
  const existingLights = scene.children.filter(c => c.isLight);
  existingLights.forEach(l => scene.remove(l));

  if (currentLightingMode === 'golden') {
    scene.background = new THREE.Color(0x191008);
    scene.fog.color.setHex(0x191008);

    const ambient = new THREE.AmbientLight(0xffeedd, 0.85);
    scene.add(ambient);

    const sun = new THREE.DirectionalLight(0xff9e3b, 2.4);
    sun.position.set(35, 30, 25);
    sun.castShadow = true;
    sun.shadow.mapSize.width = 2048;
    sun.shadow.mapSize.height = 2048;
    sun.shadow.bias = -0.0003;
    scene.add(sun);

    const rim = new THREE.DirectionalLight(0xff6f00, 1.0);
    rim.position.set(-30, 15, -30);
    scene.add(rim);
  } else if (currentLightingMode === 'day') {
    scene.background = new THREE.Color(0x0e1b30);
    scene.fog.color.setHex(0x0e1b30);

    const ambient = new THREE.AmbientLight(0xffffff, 1.0);
    scene.add(ambient);

    const sun = new THREE.DirectionalLight(0xffffff, 2.6);
    sun.position.set(25, 45, 35);
    sun.castShadow = true;
    sun.shadow.mapSize.width = 2048;
    sun.shadow.mapSize.height = 2048;
    scene.add(sun);

    const fill = new THREE.DirectionalLight(0x93c5fd, 0.8);
    fill.position.set(-25, 20, -25);
    scene.add(fill);
  } else if (currentLightingMode === 'night') {
    scene.background = new THREE.Color(0x040714);
    scene.fog.color.setHex(0x040714);

    const ambient = new THREE.AmbientLight(0x1e3a8a, 0.5);
    scene.add(ambient);

    const moon = new THREE.DirectionalLight(0x93c5fd, 1.2);
    moon.position.set(-30, 35, 25);
    scene.add(moon);

    // Warm temple/monument floodlights from ground
    const spots = [
      { x: 18, z: 18 }, { x: -18, z: 18 },
      { x: 18, z: -18 }, { x: -18, z: -18 }
    ];
    spots.forEach(pos => {
      const spot = new THREE.SpotLight(0xf59e0b, 3.5, 55, Math.PI / 3.5, 0.45);
      spot.position.set(pos.x, 1, pos.z);
      spot.target.position.set(0, 9, 0);
      scene.add(spot);
      scene.add(spot.target);
    });
  }
}

// -------------------------------------------------------------
// LOAD MONUMENT MODEL
// -------------------------------------------------------------
export function loadMonumentModel(monumentId, era = '2026') {
  currentMonumentId = monumentId;
  currentTimeEra = era;

  if (currentMeshGroup) {
    // Dispose geometries, materials, and textures to free memory
    currentMeshGroup.traverse(function (obj) {
      if (obj.isMesh) {
        if (obj.geometry) obj.geometry.dispose();
        if (obj.material) {
          if (Array.isArray(obj.material)) {
            obj.material.forEach(m => m.dispose());
          } else {
            obj.material.dispose();
          }
        }
        if (obj.material && obj.material.map) obj.material.map.dispose();
      }
    });
    scene.remove(currentMeshGroup);
  }

  currentMeshGroup = new THREE.Group();

  // Era materials
  let stoneColor, roughness, metalness, weatherTweak;
  if (era === '1000') {
    stoneColor = 0xcab59d;
    roughness = 0.85;
    metalness = 0.05;
    weatherTweak = 0.8;
  } else if (era === '1500') {
    stoneColor = 0xfff8ee;
    roughness = 0.3;
    metalness = 0.2;
    weatherTweak = 1.0;
  } else if (era === '1850') {
    stoneColor = 0xa39a8c;
    roughness = 0.95;
    metalness = 0.05;
    weatherTweak = 0.6;
  } else {
    // 2026 Modern Cleaned
    stoneColor = 0xfcfcfd;
    roughness = 0.35;
    metalness = 0.12;
    weatherTweak = 1.0;
  }

  // Base Landscaping Platform
  buildEnvironmentGround(currentMeshGroup, era);

  if (monumentId === 'taj-mahal') {
    buildDetailedTajMahal(currentMeshGroup, stoneColor, roughness, metalness, era);
  } else if (monumentId === 'konark-sun-temple') {
    buildDetailedKonark(currentMeshGroup, stoneColor, roughness, era);
  } else if (monumentId === 'hampi-vittala') {
    buildDetailedHampi(currentMeshGroup, stoneColor, roughness, era);
  } else if (monumentId === 'sanchi-stupa') {
    buildDetailedSanchi(currentMeshGroup, stoneColor, roughness, era);
  } else {
    buildDetailedTajMahal(currentMeshGroup, stoneColor, roughness, metalness, era);
  }

  scene.add(currentMeshGroup);
  updateTimelineAnnotation(monumentId, era);
}

// -------------------------------------------------------------
// ENVIRONMENT GROUND
// -------------------------------------------------------------
function buildEnvironmentGround(group, era) {
  // Broad landscape disc
  const groundGeo = new THREE.CylinderGeometry(34, 36, 1.4, 64);
  const groundMat = new THREE.MeshStandardMaterial({
    color: 0x111927,
    roughness: 0.9,
    metalness: 0.05
  });
  const ground = new THREE.Mesh(groundGeo, groundMat);
  ground.position.y = -0.7;
  ground.receiveShadow = true;
  group.add(ground);
}

// -------------------------------------------------------------
// 1. TAJ MAHAL - ULTRA DETAILED ARCHITECTURE
// -------------------------------------------------------------
function buildDetailedTajMahal(group, stoneColor, roughness, metalness, era) {
  const marbleMat = new THREE.MeshStandardMaterial({
    color: stoneColor,
    map: textureCache.marble,
    roughness: roughness,
    metalness: metalness
  });

  const pietraDuraMat = new THREE.MeshStandardMaterial({
    map: textureCache.pietraDura,
    roughness: 0.4,
    metalness: 0.1
  });

  const goldMat = new THREE.MeshStandardMaterial({
    color: 0xf59e0b,
    metalness: 0.85,
    roughness: 0.15
  });

  const darkJaliMat = new THREE.MeshStandardMaterial({
    color: 0x1e293b,
    roughness: 0.9
  });

  const sandstoneMat = new THREE.MeshStandardMaterial({
    color: 0x8b3a2b,
    map: textureCache.sandstone,
    roughness: 0.85
  });

  // 1. Double-Tier Stepped Plinth
  const plinthBase = new THREE.Mesh(new THREE.BoxGeometry(26, 1.2, 26), sandstoneMat);
  plinthBase.position.y = 0.6;
  plinthBase.castShadow = true;
  plinthBase.receiveShadow = true;
  group.add(plinthBase);

  const marblePlinth = new THREE.Mesh(new THREE.BoxGeometry(24, 1.0, 24), marbleMat);
  marblePlinth.position.y = 1.7;
  marblePlinth.castShadow = true;
  marblePlinth.receiveShadow = true;
  group.add(marblePlinth);

  // Decorative Plinth Mouldings
  const plinthTrim = new THREE.Mesh(new THREE.BoxGeometry(24.4, 0.25, 24.4), pietraDuraMat);
  plinthTrim.position.y = 2.25;
  group.add(plinthTrim);

  // 2. Central Symmetrical Mausoleum Body (Octagonal chamfered plan)
  const bodyGroup = new THREE.Group();
  bodyGroup.position.y = 2.3;

  // Main square block
  const mainCore = new THREE.Mesh(new THREE.BoxGeometry(14, 10.5, 14), marbleMat);
  mainCore.position.y = 5.25;
  mainCore.castShadow = true;
  mainCore.receiveShadow = true;
  bodyGroup.add(mainCore);

  // 4 Grand Vaulted Pishtaq Portals (Cardinal Directions)
  const cardinalRotations = [0, Math.PI / 2, Math.PI, -Math.PI / 2];
  cardinalRotations.forEach(rot => {
    const pishtaq = new THREE.Group();
    pishtaq.rotation.y = rot;

    // Projecting Frame with Pietra Dura border
    const frame = new THREE.Mesh(new THREE.BoxGeometry(8.2, 9.4, 0.6), pietraDuraMat);
    frame.position.set(0, 5.0, 7.2);
    frame.castShadow = true;
    pishtaq.add(frame);

    // Deep Recessed Iwan Chamber (Tier 1)
    const iwanOuter = new THREE.Mesh(new THREE.BoxGeometry(5.6, 7.8, 1.8), marbleMat);
    iwanOuter.position.set(0, 4.4, 6.4);
    pishtaq.add(iwanOuter);

    // Inner Arched Vault (Tier 2)
    const archRoof = new THREE.Mesh(new THREE.CylinderGeometry(2.5, 2.5, 1.6, 24, 1, false, 0, Math.PI), marbleMat);
    archRoof.rotation.z = Math.PI / 2;
    archRoof.position.set(0, 6.8, 6.4);
    pishtaq.add(archRoof);

    // Perforated Marble Screen Door (Jali)
    const door = new THREE.Mesh(new THREE.BoxGeometry(2.4, 4.2, 0.2), darkJaliMat);
    door.position.set(0, 2.7, 5.6);
    pishtaq.add(door);

    // Decorative Calligraphy Cresting atop Pishtaq
    const crest = new THREE.Mesh(new THREE.BoxGeometry(8.6, 0.4, 0.8), goldMat);
    crest.position.set(0, 9.9, 7.2);
    pishtaq.add(crest);

    bodyGroup.add(pishtaq);
  });

  // 8 Secondary Arched Niches on Chamfered Corners (2 tiers each)
  const chamferAngles = [Math.PI / 4, 3 * Math.PI / 4, -3 * Math.PI / 4, -Math.PI / 4];
  chamferAngles.forEach(ang => {
    const chamfer = new THREE.Group();
    chamfer.rotation.y = ang;

    // Upper & Lower Jharokha Niches
    [3.0, 7.2].forEach(yPos => {
      const niche = new THREE.Mesh(new THREE.BoxGeometry(2.2, 3.0, 0.5), pietraDuraMat);
      niche.position.set(0, yPos, 8.8);
      chamfer.add(niche);

      const innerNiche = new THREE.Mesh(new THREE.BoxGeometry(1.6, 2.4, 0.6), darkJaliMat);
      innerNiche.position.set(0, yPos, 8.7);
      chamfer.add(innerNiche);
    });

    bodyGroup.add(chamfer);
  });

  // Roof Parapet with Decorative Battlements
  const roofParapet = new THREE.Mesh(new THREE.BoxGeometry(14.4, 0.6, 14.4), marbleMat);
  roofParapet.position.y = 10.7;
  bodyGroup.add(roofParapet);

  // 3. Central Dome Drum & Double-Curved Bulbous Onion Dome
  const drum = new THREE.Mesh(new THREE.CylinderGeometry(5.0, 5.2, 2.8, 32), marbleMat);
  drum.position.y = 12.0;
  drum.castShadow = true;
  bodyGroup.add(drum);

  // Drum Inlay Band
  const drumBand = new THREE.Mesh(new THREE.CylinderGeometry(5.25, 5.25, 0.4, 32), pietraDuraMat);
  drumBand.position.y = 13.0;
  bodyGroup.add(drumBand);

  // Bulbous Onion Dome (modeled with pinched base and soaring profile)
  const domeMesh = new THREE.Mesh(
    new THREE.SphereGeometry(5.6, 48, 32, 0, Math.PI * 2, 0, Math.PI * 0.72),
    marbleMat
  );
  domeMesh.position.y = 13.2;
  domeMesh.scale.set(1.0, 1.45, 1.0);
  domeMesh.castShadow = true;
  bodyGroup.add(domeMesh);

  // Inverted Lotus Petal Cap (Padma base)
  const lotusBase = new THREE.Mesh(new THREE.CylinderGeometry(1.4, 2.2, 0.6, 24), marbleMat);
  lotusBase.position.y = 20.8;
  bodyGroup.add(lotusBase);

  // Golden Finial (Kalasha) with Crescent Moon
  const finialShaft = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.35, 3.8, 16), goldMat);
  finialShaft.position.y = 22.8;
  bodyGroup.add(finialShaft);

  // Crescent Ring atop Finial
  const crescent = new THREE.Mesh(new THREE.TorusGeometry(0.5, 0.1, 12, 24, Math.PI * 1.3), goldMat);
  crescent.position.y = 24.8;
  crescent.rotation.z = Math.PI / 4;
  bodyGroup.add(crescent);

  // 4 Corner Chattris (Octagonal kiosks on roof)
  const chattriCoords = [
    { x: 5.2, z: 5.2 }, { x: -5.2, z: 5.2 },
    { x: 5.2, z: -5.2 }, { x: -5.2, z: -5.2 }
  ];

  chattriCoords.forEach(c => {
    const chGroup = new THREE.Group();
    chGroup.position.set(c.x, 10.8, c.z);

    // Octagonal base plinth
    const chBase = new THREE.Mesh(new THREE.CylinderGeometry(1.5, 1.6, 0.4, 8), marbleMat);
    chGroup.add(chBase);

    // 8 Slender Columns
    for (let col = 0; col < 8; col++) {
      const ang = (col * Math.PI) / 4;
      const pillar = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.12, 2.4, 8), marbleMat);
      pillar.position.set(Math.cos(ang) * 1.2, 1.3, Math.sin(ang) * 1.2);
      chGroup.add(pillar);
    }

    // Dome Cupola
    const chDome = new THREE.Mesh(new THREE.SphereGeometry(1.4, 16, 16, 0, Math.PI * 2, 0, Math.PI * 0.65), marbleMat);
    chDome.position.y = 2.7;
    chGroup.add(chDome);

    // Chattri Golden Finial
    const chFin = new THREE.Mesh(new THREE.ConeGeometry(0.2, 1.2, 8), goldMat);
    chFin.position.y = 3.9;
    chGroup.add(chFin);

    bodyGroup.add(chGroup);
  });

  group.add(bodyGroup);

  // 4. Four Freestanding Minarets (Engineered with subtle outward tilt)
  const minaretCoords = [
    { x: 10.6, z: 10.6, tiltX: 0.025, tiltZ: 0.025 },
    { x: -10.6, z: 10.6, tiltX: -0.025, tiltZ: 0.025 },
    { x: 10.6, z: -10.6, tiltX: 0.025, tiltZ: -0.025 },
    { x: -10.6, z: -10.6, tiltX: -0.025, tiltZ: -0.025 }
  ];

  minaretCoords.forEach(m => {
    const minGroup = new THREE.Group();
    minGroup.position.set(m.x, 2.2, m.z);
    minGroup.rotation.x = m.tiltZ;
    minGroup.rotation.z = -m.tiltX;

    // Octagonal base plinth
    const mBase = new THREE.Mesh(new THREE.CylinderGeometry(1.4, 1.6, 2.4, 8), marbleMat);
    mBase.position.y = 1.2;
    mBase.castShadow = true;
    minGroup.add(mBase);

    // Tier 1 (Lowest story)
    const t1 = new THREE.Mesh(new THREE.CylinderGeometry(1.05, 1.25, 5.6, 24), marbleMat);
    t1.position.y = 4.8;
    t1.castShadow = true;
    minGroup.add(t1);

    // Balcony 1 (Bracketed corbel with railing)
    const b1 = new THREE.Mesh(new THREE.CylinderGeometry(1.5, 1.1, 0.6, 24), marbleMat);
    b1.position.y = 7.8;
    minGroup.add(b1);
    const r1 = new THREE.Mesh(new THREE.TorusGeometry(1.45, 0.08, 8, 24), pietraDuraMat);
    r1.rotation.x = Math.PI / 2;
    r1.position.y = 8.1;
    minGroup.add(r1);

    // Tier 2 (Middle story)
    const t2 = new THREE.Mesh(new THREE.CylinderGeometry(0.9, 1.05, 5.0, 24), marbleMat);
    t2.position.y = 10.6;
    t2.castShadow = true;
    minGroup.add(t2);

    // Balcony 2
    const b2 = new THREE.Mesh(new THREE.CylinderGeometry(1.35, 0.95, 0.5, 24), marbleMat);
    b2.position.y = 13.3;
    minGroup.add(b2);

    // Tier 3 (Top story)
    const t3 = new THREE.Mesh(new THREE.CylinderGeometry(0.75, 0.9, 4.4, 24), marbleMat);
    t3.position.y = 15.6;
    t3.castShadow = true;
    minGroup.add(t3);

    // Crowning Open Chhattri Kiosk
    const b3 = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 0.8, 0.4, 16), marbleMat);
    b3.position.y = 17.9;
    minGroup.add(b3);

    for (let cIdx = 0; cIdx < 8; cIdx++) {
      const a = (cIdx * Math.PI) / 4;
      const p = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.09, 1.5, 8), marbleMat);
      p.position.set(Math.cos(a) * 0.9, 18.8, Math.sin(a) * 0.9);
      minGroup.add(p);
    }

    const mCupola = new THREE.Mesh(new THREE.SphereGeometry(1.0, 16, 12, 0, Math.PI * 2, 0, Math.PI * 0.65), marbleMat);
    mCupola.position.y = 19.8;
    minGroup.add(mCupola);

    const mFin = new THREE.Mesh(new THREE.ConeGeometry(0.18, 1.2, 8), goldMat);
    mFin.position.y = 21.0;
    minGroup.add(mFin);

    group.add(minGroup);
  });

  // 5. Mughal Charbagh Formal Water Canal & Cypress Gardens
  const gardenGroup = new THREE.Group();

  // Central Reflecting Water Pool
  const poolGeo = new THREE.BoxGeometry(10, 0.2, 16);
  const poolMat = new THREE.MeshStandardMaterial({
    map: textureCache.water,
    roughness: 0.15,
    metalness: 0.75,
    transparent: true,
    opacity: 0.9
  });
  const waterPool = new THREE.Mesh(poolGeo, poolMat);
  waterPool.position.set(0, 0.15, 17.5);
  gardenGroup.add(waterPool);

  // Marble curb lining the pool
  const curbMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, roughness: 0.5 });
  [-5.2, 5.2].forEach(cx => {
    const curb = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.35, 16.2), curbMat);
    curb.position.set(cx, 0.2, 17.5);
    gardenGroup.add(curb);
  });

  // 5 Brass Fountain Jet Nozzles along the pool
  for (let fz = 11; fz <= 23; fz += 3) {
    const nozzle = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.15, 0.4, 8), goldMat);
    nozzle.position.set(0, 0.35, fz);
    gardenGroup.add(nozzle);

    // Subtle water spray jet
    const spray = new THREE.Mesh(new THREE.ConeGeometry(0.25, 0.9, 8), new THREE.MeshBasicMaterial({ color: 0xe0f2fe, transparent: true, opacity: 0.7 }));
    spray.position.set(0, 0.85, fz);
    gardenGroup.add(spray);
  }

  // Avenue of Symmetrical Cypress Trees (Cupressus) flanking the pool
  const cypressMat = new THREE.MeshStandardMaterial({ color: 0x14532d, roughness: 0.9 });
  const trunkMat = new THREE.MeshStandardMaterial({ color: 0x451a03, roughness: 0.9 });

  [-6.8, 6.8].forEach(tx => {
    for (let tz = 11; tz <= 24; tz += 3.2) {
      const tree = new THREE.Group();
      tree.position.set(tx, 0, tz);

      const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.16, 0.8, 8), trunkMat);
      trunk.position.y = 0.4;
      tree.add(trunk);

      const foliage = new THREE.Mesh(new THREE.ConeGeometry(0.7, 3.2, 10), cypressMat);
      foliage.position.y = 2.2;
      foliage.castShadow = true;
      tree.add(foliage);

      gardenGroup.add(tree);
    }
  });

  group.add(gardenGroup);
}

// -------------------------------------------------------------
// 2. KONARK SUN TEMPLE - ULTRA DETAILED ARCHITECTURE
// -------------------------------------------------------------
function buildDetailedKonark(group, stoneColor, roughness, era) {
  const sandstoneMat = new THREE.MeshStandardMaterial({
    color: stoneColor || 0xb8885c,
    map: textureCache.sandstone,
    roughness: roughness || 0.85,
    metalness: 0.08
  });

  const chloriteMat = new THREE.MeshStandardMaterial({
    color: 0x4a4338,
    map: textureCache.granite,
    roughness: 0.8
  });

  const goldKalashaMat = new THREE.MeshStandardMaterial({
    color: 0xd97706,
    metalness: 0.7,
    roughness: 0.25
  });

  // 1. High Multi-Tiered Chariot Plinth with Horizontal Carvings
  const basePavement = new THREE.Mesh(new THREE.BoxGeometry(25, 1.2, 22), sandstoneMat);
  basePavement.position.y = 0.6;
  basePavement.castShadow = true;
  basePavement.receiveShadow = true;
  group.add(basePavement);

  const plinthTier2 = new THREE.Mesh(new THREE.BoxGeometry(22, 1.4, 19), sandstoneMat);
  plinthTier2.position.y = 1.9;
  plinthTier2.castShadow = true;
  group.add(plinthTier2);

  // Decorative elephant relief frieze along base
  const friezeBand = new THREE.Mesh(new THREE.BoxGeometry(22.2, 0.35, 19.2), chloriteMat);
  friezeBand.position.y = 2.5;
  group.add(friezeBand);

  // 2. Jagamohana (Tiered Pyramidal Assembly Hall - Authentic Pidha Deula)
  const hallGroup = new THREE.Group();
  hallGroup.position.set(0, 2.6, -1);

  // Ground cubic sanctum chamber
  const coreSanctum = new THREE.Mesh(new THREE.BoxGeometry(15, 4.0, 15), sandstoneMat);
  coreSanctum.position.y = 2.0;
  coreSanctum.castShadow = true;
  hallGroup.add(coreSanctum);

  // Entrance Portico Steps with Guardian Elephants
  const steps = new THREE.Mesh(new THREE.BoxGeometry(6, 1.8, 4), sandstoneMat);
  steps.position.set(0, 0.9, 8.5);
  hallGroup.add(steps);

  // Stepped Pyramidal Tiers (Pidhas) divided into 2 major groups with recess (Kanti)
  const pidhaCount = 7;
  for (let i = 0; i < pidhaCount; i++) {
    const width = 14.5 - i * 1.5;
    const height = 0.9;
    const yPos = 4.4 + i * 0.95;

    // Step moulding
    const pidha = new THREE.Mesh(new THREE.BoxGeometry(width, height, width), sandstoneMat);
    pidha.position.y = yPos;
    pidha.castShadow = true;
    hallGroup.add(pidha);

    // Overhanging carved cornice edge
    const rim = new THREE.Mesh(new THREE.BoxGeometry(width + 0.3, 0.2, width + 0.3), chloriteMat);
    rim.position.y = yPos - 0.35;
    hallGroup.add(rim);
  }

  // Recess Terrace (Kanti) with carved celestial female musicians (Alasa Kanyas)
  const kantiMesh = new THREE.Mesh(new THREE.CylinderGeometry(3.6, 4.0, 1.2, 24), chloriteMat);
  kantiMesh.position.y = 11.5;
  hallGroup.add(kantiMesh);

  // Four Projecting Gaja-Simha (Lion-upon-Elephant) Statues on Tier Facets
  const lionDirections = [0, Math.PI / 2, Math.PI, -Math.PI / 2];
  lionDirections.forEach(dir => {
    const gajaGroup = new THREE.Group();
    gajaGroup.rotation.y = dir;

    // Lion body leaping forward
    const lion = new THREE.Mesh(new THREE.BoxGeometry(0.8, 1.4, 2.0), chloriteMat);
    lion.position.set(0, 8.8, 6.4);
    lion.rotation.x = 0.25;
    gajaGroup.add(lion);

    // Elephant beneath
    const ele = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.8, 1.2), sandstoneMat);
    ele.position.set(0, 7.8, 6.0);
    gajaGroup.add(ele);

    hallGroup.add(gajaGroup);
  });

  // Beki (Neck Cylinder)
  const beki = new THREE.Mesh(new THREE.CylinderGeometry(3.2, 3.4, 1.0, 32), sandstoneMat);
  beki.position.y = 12.5;
  hallGroup.add(beki);

  // Colossal Ribbed Amalaka Disc (Fluted Stone Gear)
  const amalaka = new THREE.Mesh(new THREE.CylinderGeometry(3.8, 4.2, 1.6, 32), chloriteMat);
  amalaka.position.y = 13.8;
  hallGroup.add(amalaka);

  // Fluted ribs on Amalaka
  for (let r = 0; r < 24; r++) {
    const rAng = (r * Math.PI) / 12;
    const rib = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.22, 1.6, 8), sandstoneMat);
    rib.position.set(Math.cos(rAng) * 4.0, 13.8, Math.sin(rAng) * 4.0);
    hallGroup.add(rib);
  }

  // Khapuri & Crowning Kalasha with Sacred Lotus
  const khapuri = new THREE.Mesh(new THREE.CylinderGeometry(2.0, 3.4, 0.8, 24), sandstoneMat);
  khapuri.position.y = 15.0;
  hallGroup.add(khapuri);

  const kalasha = new THREE.Mesh(new THREE.ConeGeometry(1.0, 2.4, 16), goldKalashaMat);
  kalasha.position.y = 16.6;
  hallGroup.add(kalasha);

  group.add(hallGroup);

  // 3. Iconic 24-Spoked Astronomical Stone Sundial Wheels (Flanking North & South)
  const wheelOffsets = [
    { x: -7.5, z: 9.8, rotY: 0 },
    { x: 0, z: 9.8, rotY: 0 },
    { x: 7.5, z: 9.8, rotY: 0 },
    { x: -7.5, z: -11.8, rotY: Math.PI },
    { x: 0, z: -11.8, rotY: Math.PI },
    { x: 7.5, z: -11.8, rotY: Math.PI }
  ];

  wheelOffsets.forEach(w => {
    const wheelGroup = new THREE.Group();
    wheelGroup.position.set(w.x, 3.2, w.z);
    wheelGroup.rotation.y = w.rotY;

    // Multi-Layer Carved Rim
    const outerRim = new THREE.Mesh(new THREE.TorusGeometry(2.6, 0.35, 16, 48), chloriteMat);
    outerRim.castShadow = true;
    wheelGroup.add(outerRim);

    const innerRim = new THREE.Mesh(new THREE.TorusGeometry(2.2, 0.15, 12, 48), sandstoneMat);
    wheelGroup.add(innerRim);

    // Decorative Medallions along Rim
    for (let m = 0; m < 16; m++) {
      const mAng = (m * Math.PI) / 8;
      const bead = new THREE.Mesh(new THREE.SphereGeometry(0.12, 8, 8), goldKalashaMat);
      bead.position.set(Math.cos(mAng) * 2.6, Math.sin(mAng) * 2.6, 0.3);
      wheelGroup.add(bead);
    }

    // Heavy Protruding Axle Hub (Carved with lotus petals)
    const hubOuter = new THREE.Mesh(new THREE.CylinderGeometry(0.9, 1.0, 0.9, 24), chloriteMat);
    hubOuter.rotation.x = Math.PI / 2;
    hubOuter.castShadow = true;
    wheelGroup.add(hubOuter);

    const axlePin = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.35, 1.3, 16), sandstoneMat);
    axlePin.rotation.x = Math.PI / 2;
    wheelGroup.add(axlePin);

    // 8 Major Spokes (Carved with central circular medallions)
    for (let s = 0; s < 8; s++) {
      const sAng = (s * Math.PI) / 4;
      const majorSpoke = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.22, 4.4, 12), sandstoneMat);
      majorSpoke.rotation.z = sAng;
      wheelGroup.add(majorSpoke);

      // Relief Medallion in middle of major spoke
      const medallion = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.32, 0.45, 16), chloriteMat);
      medallion.rotation.x = Math.PI / 2;
      medallion.position.set(Math.cos(sAng + Math.PI / 2) * 1.5, Math.sin(sAng + Math.PI / 2) * 1.5, 0);
      wheelGroup.add(medallion);
    }

    // 8 Minor Slender Spokes
    for (let s2 = 0; s2 < 8; s2++) {
      const sAng2 = (s2 * Math.PI) / 4 + Math.PI / 8;
      const minorSpoke = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.11, 4.2, 8), chloriteMat);
      minorSpoke.rotation.z = sAng2;
      wheelGroup.add(minorSpoke);
    }

    group.add(wheelGroup);
  });

  // 4. Seven Rearing Solar Steeds Leaping Forward in Forecourt
  const horsesGroup = new THREE.Group();
  horsesGroup.position.set(0, 0, 11);

  const horsePositions = [-4.5, -3.0, -1.5, 0, 1.5, 3.0, 4.5];
  horsePositions.forEach((hx, idx) => {
    const horse = new THREE.Group();
    horse.position.set(hx, 0, idx === 3 ? 4.2 : 3.2 - Math.abs(idx - 3) * 0.3);

    // Stone mounting pedestal
    const pedestal = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.8, 2.4), chloriteMat);
    pedestal.position.y = 0.4;
    horse.add(pedestal);

    // Muscular Rearing Horse Body
    const torso = new THREE.Mesh(new THREE.BoxGeometry(0.7, 1.4, 2.0), sandstoneMat);
    torso.position.set(0, 1.8, 0);
    torso.rotation.x = -0.35; // Rearing upward
    torso.castShadow = true;
    horse.add(torso);

    // Arched Powerful Neck & Head
    const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.55, 1.5, 10), sandstoneMat);
    neck.position.set(0, 2.8, 0.8);
    neck.rotation.x = 0.45;
    horse.add(neck);

    const head = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.6, 1.0), sandstoneMat);
    head.position.set(0, 3.3, 1.3);
    head.rotation.x = -0.2;
    horse.add(head);

    // Decorative Royal Reins & Harness
    const harness = new THREE.Mesh(new THREE.TorusGeometry(0.35, 0.05, 8, 16), goldKalashaMat);
    harness.position.set(0, 3.2, 1.1);
    horse.add(harness);

    // Front Leaping Hooves
    [-0.25, 0.25].forEach(legX => {
      const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.15, 1.6, 8), sandstoneMat);
      leg.position.set(legX, 2.3, 1.2);
      leg.rotation.x = 0.6;
      horse.add(leg);
    });

    horsesGroup.add(horse);
  });

  group.add(horsesGroup);
}

// -------------------------------------------------------------
// 3. HAMPI VITTALA STONE CHARIOT - ULTRA DETAILED ARCHITECTURE
// -------------------------------------------------------------
function buildDetailedHampi(group, stoneColor, roughness, era) {
  const graniteMat = new THREE.MeshStandardMaterial({
    color: stoneColor || 0xa89f91,
    map: textureCache.granite,
    roughness: roughness || 0.9,
    metalness: 0.1
  });

  const darkGraniteMat = new THREE.MeshStandardMaterial({
    color: 0x5a5248,
    map: textureCache.granite,
    roughness: 0.95
  });

  const goldTrimMat = new THREE.MeshStandardMaterial({
    color: 0xd97706,
    metalness: 0.75,
    roughness: 0.3
  });

  // 1. Chariot High Terrace Plinth
  const plinth = new THREE.Mesh(new THREE.BoxGeometry(14, 2.0, 16), graniteMat);
  plinth.position.y = 1.0;
  plinth.castShadow = true;
  plinth.receiveShadow = true;
  group.add(plinth);

  // Carved frieze bands on plinth (mythical yalis & dancers)
  const friezeUpper = new THREE.Mesh(new THREE.BoxGeometry(14.3, 0.3, 16.3), darkGraniteMat);
  friezeUpper.position.y = 1.9;
  group.add(friezeUpper);

  // 2. Garuda Shrine Sanctum
  const shrineGroup = new THREE.Group();
  shrineGroup.position.set(0, 2.0, 0);

  // Main cubic chamber
  const sanctum = new THREE.Mesh(new THREE.BoxGeometry(8.5, 6.0, 10.0), graniteMat);
  sanctum.position.y = 3.0;
  sanctum.castShadow = true;
  shrineGroup.add(sanctum);

  // Pilasters on sanctum walls (Dravidian relief columns)
  const wallPilasterCoords = [
    { x: -4.35, z: 2 }, { x: -4.35, z: -2 },
    { x: 4.35, z: 2 }, { x: 4.35, z: -2 }
  ];
  wallPilasterCoords.forEach(p => {
    const col = new THREE.Mesh(new THREE.BoxGeometry(0.4, 5.8, 0.5), darkGraniteMat);
    col.position.set(p.x, 3.0, p.z);
    shrineGroup.add(col);
  });

  // Front Porch Columns (Mukha Mandapa)
  [-3.2, 3.2].forEach(colX => {
    const porchCol = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.45, 6.0, 12), darkGraniteMat);
    porchCol.position.set(colX, 3.0, 5.6);
    porchCol.castShadow = true;
    shrineGroup.add(porchCol);

    // Ornate capital bracket (Podigai)
    const cap = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.5, 1.1), graniteMat);
    cap.position.set(colX, 6.2, 5.6);
    shrineGroup.add(cap);
  });

  // Overhanging Curved Granite Cornice (Chhajja)
  const chhajja = new THREE.Mesh(new THREE.BoxGeometry(10.2, 0.5, 12.2), darkGraniteMat);
  chhajja.position.y = 6.25;
  shrineGroup.add(chhajja);

  // Tiered Dravidian Vimana Superstructure
  const vimanaTier1 = new THREE.Mesh(new THREE.BoxGeometry(7.4, 1.4, 8.8), graniteMat);
  vimanaTier1.position.y = 7.2;
  shrineGroup.add(vimanaTier1);

  // Miniature Kudu Arches along tier 1
  for (let k = -2.5; k <= 2.5; k += 1.6) {
    const arch = new THREE.Mesh(new THREE.SphereGeometry(0.35, 8, 8, 0, Math.PI), darkGraniteMat);
    arch.position.set(k, 8.0, 4.45);
    shrineGroup.add(arch);
  }

  const vimanaTier2 = new THREE.Mesh(new THREE.BoxGeometry(5.6, 1.3, 6.8), graniteMat);
  vimanaTier2.position.y = 8.5;
  shrineGroup.add(vimanaTier2);

  // Crowning Griva & Shikharam dome
  const griva = new THREE.Mesh(new THREE.CylinderGeometry(2.0, 2.4, 0.8, 16), darkGraniteMat);
  griva.position.y = 9.5;
  shrineGroup.add(griva);

  const domeShikhara = new THREE.Mesh(new THREE.SphereGeometry(2.2, 16, 16, 0, Math.PI * 2, 0, Math.PI * 0.6), graniteMat);
  domeShikhara.position.y = 10.0;
  shrineGroup.add(domeShikhara);

  const kalashaGold = new THREE.Mesh(new THREE.ConeGeometry(0.5, 1.6, 12), goldTrimMat);
  kalashaGold.position.y = 11.6;
  shrineGroup.add(kalashaGold);

  group.add(shrineGroup);

  // 3. Four Massive Carved Granite Wheels
  const wheelPositions = [
    { x: 4.8, z: 4.0 }, { x: -4.8, z: 4.0 },
    { x: 4.8, z: -4.0 }, { x: -4.8, z: -4.0 }
  ];

  wheelPositions.forEach(wp => {
    const wheel = new THREE.Group();
    wheel.position.set(wp.x, 2.0, wp.z);

    // Thick granite wheel body
    const mainWheel = new THREE.Mesh(new THREE.CylinderGeometry(2.0, 2.0, 0.7, 32), darkGraniteMat);
    mainWheel.rotation.z = Math.PI / 2;
    mainWheel.castShadow = true;
    wheel.add(mainWheel);

    // Concentric outer carved rim
    const rimTorus = new THREE.Mesh(new THREE.TorusGeometry(1.9, 0.15, 12, 32), graniteMat);
    rimTorus.rotation.y = Math.PI / 2;
    wheel.add(rimTorus);

    // Hubcap with axle pin
    const hub = new THREE.Mesh(new THREE.CylinderGeometry(0.65, 0.65, 1.1, 16), goldTrimMat);
    hub.rotation.z = Math.PI / 2;
    wheel.add(hub);

    // 8 Floral spokes
    for (let s = 0; s < 8; s++) {
      const sAng = (s * Math.PI) / 4;
      const spoke = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.14, 3.4, 8), graniteMat);
      spoke.rotation.x = sAng;
      wheel.add(spoke);
    }

    group.add(wheel);
  });

  // 4. Twin Sculpted Guardian Elephants in Front
  [-2.2, 2.2].forEach(ex => {
    const elephant = new THREE.Group();
    elephant.position.set(ex, 0, 9.2);

    // Elephant body
    const body = new THREE.Mesh(new THREE.BoxGeometry(1.6, 2.2, 2.8), darkGraniteMat);
    body.position.y = 1.6;
    body.castShadow = true;
    elephant.add(body);

    // Rounded head
    const head = new THREE.Mesh(new THREE.SphereGeometry(0.9, 16, 12), darkGraniteMat);
    head.position.set(0, 2.4, 1.4);
    elephant.add(head);

    // Downward curved trunk
    const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.4, 2.2, 12), darkGraniteMat);
    trunk.position.set(0, 1.2, 2.1);
    trunk.rotation.x = -0.4;
    elephant.add(trunk);

    // Ornate back cloth & saddle
    const saddle = new THREE.Mesh(new THREE.BoxGeometry(1.7, 0.3, 2.0), goldTrimMat);
    saddle.position.set(0, 2.75, 0);
    elephant.add(saddle);

    // White stone tusks
    [-0.45, 0.45].forEach(tx => {
      const tusk = new THREE.Mesh(new THREE.ConeGeometry(0.08, 0.7, 8), new THREE.MeshStandardMaterial({ color: 0xfffbeb }));
      tusk.position.set(tx, 1.8, 1.9);
      tusk.rotation.x = 0.5;
      elephant.add(tusk);
    });

    group.add(elephant);
  });

  // 5. Composite Acoustic Musical Pillars (Maha Mandapa colonnade)
  const pillarCoords = [
    { x: -9.5, z: 3 }, { x: -9.5, z: -3 }, { x: -9.5, z: -9 },
    { x: 9.5, z: 3 }, { x: 9.5, z: -3 }, { x: 9.5, z: -9 },
    { x: 0, z: -11.5 }
  ];

  pillarCoords.forEach(pc => {
    const compPillar = new THREE.Group();
    compPillar.position.set(pc.x, 0, pc.z);

    // Central core pillar
    const coreShaft = new THREE.Mesh(new THREE.BoxGeometry(1.2, 8.5, 1.2), darkGraniteMat);
    coreShaft.position.y = 4.25;
    coreShaft.castShadow = true;
    compPillar.add(coreShaft);

    // 6 Slender detached musical colonnettes surrounding core
    for (let c = 0; c < 6; c++) {
      const cAng = (c * Math.PI) / 3;
      const colonnette = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.14, 7.5, 8), graniteMat);
      colonnette.position.set(Math.cos(cAng) * 0.9, 4.25, Math.sin(cAng) * 0.9);
      colonnette.castShadow = true;
      compPillar.add(colonnette);
    }

    // Heavy bracket capital
    const bracketCap = new THREE.Mesh(new THREE.BoxGeometry(2.0, 0.6, 2.0), graniteMat);
    bracketCap.position.y = 8.7;
    compPillar.add(bracketCap);

    group.add(compPillar);
  });

  // 6. Natural Kishkindha Granite Boulders scattered in background
  const boulderCoords = [
    { x: -16, z: -12, r: 3.5 },
    { x: -14, z: 8, r: 2.8 },
    { x: 16, z: -10, r: 3.8 },
    { x: 15, z: 10, r: 2.5 }
  ];

  boulderCoords.forEach(bc => {
    const boulder = new THREE.Mesh(new THREE.DodecahedronGeometry(bc.r, 1), darkGraniteMat);
    boulder.position.set(bc.x, bc.r * 0.7, bc.z);
    boulder.rotation.set(Math.random(), Math.random(), Math.random());
    boulder.castShadow = true;
    group.add(boulder);
  });
}

// -------------------------------------------------------------
// 4. SANCHI GREAT STUPA - ULTRA DETAILED ARCHITECTURE
// -------------------------------------------------------------
function buildDetailedSanchi(group, stoneColor, roughness, era) {
  const sandstoneMat = new THREE.MeshStandardMaterial({
    color: stoneColor || 0xc49b71,
    map: textureCache.sandstone,
    roughness: roughness || 0.85,
    metalness: 0.06
  });

  const polishedMauryanMat = new THREE.MeshStandardMaterial({
    color: 0x967352,
    map: textureCache.sandstone,
    roughness: 0.25,
    metalness: 0.2
  });

  const darkCarvedMat = new THREE.MeshStandardMaterial({
    color: 0x6e523b,
    map: textureCache.sandstone,
    roughness: 0.9
  });

  const goldJewelMat = new THREE.MeshStandardMaterial({
    color: 0xf59e0b,
    metalness: 0.8,
    roughness: 0.2
  });

  // 1. Lower Circular Medhi (Terrace Plinth)
  const medhi = new THREE.Mesh(new THREE.CylinderGeometry(15.5, 16.5, 2.8, 64), sandstoneMat);
  medhi.position.y = 1.4;
  medhi.castShadow = true;
  medhi.receiveShadow = true;
  group.add(medhi);

  // Upper Terrace Balustrade (Medhi Vedika)
  const upperRailing = new THREE.Mesh(new THREE.TorusGeometry(15.2, 0.25, 8, 64), darkCarvedMat);
  upperRailing.rotation.x = Math.PI / 2;
  upperRailing.position.y = 3.0;
  group.add(upperRailing);

  // Double Flight of Access Stairs (Sopana) on South
  const sopana = new THREE.Group();
  sopana.position.set(0, 0, 16.2);
  [-2.2, 2.2].forEach(sx => {
    const flight = new THREE.Mesh(new THREE.BoxGeometry(1.6, 2.4, 3.2), sandstoneMat);
    flight.position.set(sx, 1.2, 0);
    flight.rotation.x = 0.45;
    sopana.add(flight);
  });
  group.add(sopana);

  // 2. Anda (Massive Hemispherical Cosmic Dome)
  const anda = new THREE.Mesh(
    new THREE.SphereGeometry(12.5, 64, 32, 0, Math.PI * 2, 0, Math.PI / 2),
    sandstoneMat
  );
  anda.position.y = 2.8;
  anda.castShadow = true;
  group.add(anda);

  // Fine stone course joint rings on dome
  [5.5, 8.5, 11.5].forEach(ringY => {
    const ringRadius = Math.sqrt(12.5 * 12.5 - (ringY - 2.8) * (ringY - 2.8));
    if (ringRadius > 1) {
      const stoneCourse = new THREE.Mesh(new THREE.TorusGeometry(ringRadius + 0.05, 0.08, 6, 64), darkCarvedMat);
      stoneCourse.rotation.x = Math.PI / 2;
      stoneCourse.position.y = ringY;
      group.add(stoneCourse);
    }
  });

  // 3. Summit Harmika (Square Balustrade Box)
  const harmikaGroup = new THREE.Group();
  harmikaGroup.position.y = 15.3;

  const harmikaBase = new THREE.Mesh(new THREE.BoxGeometry(4.2, 1.6, 4.2), darkCarvedMat);
  harmikaGroup.add(harmikaBase);

  // Carved railing posts on Harmika perimeter
  const harmikaFence = new THREE.Mesh(new THREE.BoxGeometry(4.6, 0.3, 4.6), sandstoneMat);
  harmikaFence.position.y = 0.9;
  harmikaGroup.add(harmikaFence);

  // Central Yasti Spire & Triple Chattravali (Honorific Parasols)
  const yasti = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.24, 5.0, 16), polishedMauryanMat);
  yasti.position.y = 2.8;
  harmikaGroup.add(yasti);

  // Three Stacked Chattras (Three Jewels: Buddha, Dharma, Sangha)
  const chattraSizes = [
    { r: 2.2, y: 3.4 },
    { r: 1.6, y: 4.4 },
    { r: 1.0, y: 5.2 }
  ];
  chattraSizes.forEach(cs => {
    const umbrella = new THREE.Mesh(new THREE.ConeGeometry(cs.r, 0.45, 24), sandstoneMat);
    umbrella.position.y = cs.y;
    harmikaGroup.add(umbrella);

    const rimGold = new THREE.Mesh(new THREE.TorusGeometry(cs.r, 0.05, 8, 24), goldJewelMat);
    rimGold.rotation.x = Math.PI / 2;
    rimGold.position.y = cs.y - 0.2;
    harmikaGroup.add(rimGold);
  });

  group.add(harmikaGroup);

  // 4. Ground-Level Circumambulatory Railing (Vedika)
  const groundVedika = new THREE.Group();
  groundVedika.position.y = 0.9;

  // Upright monolithic posts (Thabha)
  const postCount = 48;
  for (let p = 0; p < postCount; p++) {
    // Leave 4 openings for the 4 Toranas
    if ((p >= 0 && p <= 2) || (p >= 11 && p <= 13) || (p >= 23 && p <= 25) || (p >= 35 && p <= 37)) {
      continue;
    }
    const ang = (p * Math.PI * 2) / postCount;
    const post = new THREE.Mesh(new THREE.BoxGeometry(0.3, 1.8, 0.3), darkCarvedMat);
    post.position.set(Math.cos(ang) * 19.0, 0, Math.sin(ang) * 19.0);
    groundVedika.add(post);
  }

  // Rounded Coping Stone (Ushnisha)
  const ushnisha = new THREE.Mesh(new THREE.TorusGeometry(19.0, 0.25, 8, 64), sandstoneMat);
  ushnisha.rotation.x = Math.PI / 2;
  ushnisha.position.y = 0.9;
  groundVedika.add(ushnisha);

  group.add(groundVedika);

  // 5. Four Monumental Carved Torana Gateways (South, North, East, West)
  const toranaCardinal = [
    { x: 0, z: 19.5, rotY: 0 },
    { x: 0, z: -19.5, rotY: Math.PI },
    { x: 19.5, z: 0, rotY: Math.PI / 2 },
    { x: -19.5, z: 0, rotY: -Math.PI / 2 }
  ];

  toranaCardinal.forEach(tc => {
    const torana = new THREE.Group();
    torana.position.set(tc.x, 0, tc.z);
    torana.rotation.y = tc.rotY;

    // Two Square Upright Monolithic Pillars
    [-2.2, 2.2].forEach(px => {
      const col = new THREE.Mesh(new THREE.BoxGeometry(0.8, 9.2, 0.8), sandstoneMat);
      col.position.set(px, 4.6, 0);
      col.castShadow = true;
      torana.add(col);

      // Lion/Elephant Capital Block atop pillar
      const cap = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.8, 1.2), darkCarvedMat);
      cap.position.set(px, 9.4, 0);
      torana.add(cap);
    });

    // Three Architraves (Horizontal Crossbeams with Spiral Scrolled Ends)
    [6.8, 8.0, 9.2].forEach(by => {
      // Central architrave beam
      const beam = new THREE.Mesh(new THREE.BoxGeometry(6.4, 0.5, 0.6), sandstoneMat);
      beam.position.set(0, by, 0);
      torana.add(beam);

      // Scrolled Volute Terminals on ends
      [-3.4, 3.4].forEach(vx => {
        const volute = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.4, 0.7, 16), darkCarvedMat);
        volute.rotation.z = Math.PI / 2;
        volute.position.set(vx, by, 0);
        torana.add(volute);
      });
    });

    // Vertical carved spacer blocks between beams
    [-1.0, 1.0].forEach(sx => {
      [7.4, 8.6].forEach(sy => {
        const spacer = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.7, 0.4), darkCarvedMat);
        spacer.position.set(sx, sy, 0);
        torana.add(spacer);
      });
    });

    // Crowning Dharmachakra (Wheel of Law) on central top architrave
    const dharmaWheel = new THREE.Mesh(new THREE.TorusGeometry(0.65, 0.12, 8, 24), goldJewelMat);
    dharmaWheel.position.set(0, 10.3, 0);
    torana.add(dharmaWheel);

    group.add(torana);
  });

  // 6. Monolithic Polished Ashoka Pillar adjacent to South Gate
  const ashokaPillar = new THREE.Group();
  ashokaPillar.position.set(-5.5, 0, 18.5);

  const pillarShaft = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.45, 9.0, 24), polishedMauryanMat);
  pillarShaft.position.y = 4.5;
  pillarShaft.castShadow = true;
  ashokaPillar.add(pillarShaft);

  // Inverted Bell Lotus Capital
  const bellCap = new THREE.Mesh(new THREE.ConeGeometry(0.7, 0.9, 16), polishedMauryanMat);
  bellCap.position.y = 9.4;
  ashokaPillar.add(bellCap);

  // Four Asiatic Lions Capital Head
  const lionHead = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.6, 0.8, 8), darkCarvedMat);
  lionHead.position.y = 10.2;
  ashokaPillar.add(lionHead);

  group.add(ashokaPillar);
}

// -------------------------------------------------------------
// TIMELINE ANNOTATION UPDATE
// -------------------------------------------------------------
function updateTimelineAnnotation(monumentId, era) {
  const noteEl = document.getElementById('timeline-annotation');
  const yearEl = document.getElementById('timeline-active-year');
  if (!noteEl || !yearEl) return;

  const annotations = {
    'taj-mahal': {
      '1000': 'Ancient floodplains along the sacred Yamuna River prior to imperial city foundation.',
      '1500': 'Sikandar Lodi develops Agra; early riverfront gardens and terraced havelis appear.',
      '1850': 'Colonial era neglect; Lord Curzon later initiates restoration, transforming the Charbagh into English lawns.',
      '2026': 'Modern UNESCO protected wonder: advanced clay-pack mud treatments preserve translucent Makrana marble luster.'
    },
    'konark-sun-temple': {
      '1000': 'Ancient Kalinga sacred coastal pilgrimage where Chandrabhaga river met the Bay of Bengal.',
      '1500': 'Imperial golden age: King Narasimhadeva I completes the 227-ft celestial sun chariot with magnetic idol.',
      '1850': 'British colonial engineers fill the Jagamohana hall with sand and stone to prevent roof collapse.',
      '2026': 'ASI robotic geotechnical endoscopes gently extract interior sand to permanently reinforce internal stone ribs.'
    },
    'hampi-vittala': {
      '1000': 'Pampa Kshetra: Sacred pilgrimage site along the Tungabhadra, venerated in the Ramayana as Kishkindha.',
      '1500': 'Imperial Zenith: Emperor Krishnadevaraya dedicates the 56 acoustic musical pillars and stone chariot.',
      '1850': 'Rediscovered by British surveyors; earliest photographic surveys document the monolithic granite ruins.',
      '2026': 'UNESCO protected 4,100-hectare archaeological park with electric buggies and restored ancient bazaar streets.'
    },
    'sanchi-stupa': {
      '1000': 'Vibrant Buddhist monastic university with hundreds of monks, viharas, and circumambulatory rituals.',
      '1500': 'Monastery abandoned as medieval trade routes shifted; jungle vegetation gradually conceals the stupa.',
      '1850': 'Rediscovered in 1818 by General Taylor; archaeological excavation re-erects the 4 carved Toranas.',
      '2026': 'Global UNESCO Buddhist pilgrimage center with state-of-the-art climate-controlled archaeological museum.'
    }
  };

  const eraText = era === '1000' ? '1000 CE (Origins & Foundations)'
    : era === '1500' ? '1500 CE (Peak Imperial Glory)'
    : era === '1850' ? '1850 CE (Colonial Transition)'
    : '2026 CE (Modern Conservation)';

  yearEl.textContent = eraText;
  noteEl.textContent = (annotations[monumentId] && annotations[monumentId][era]) ||
    'Architectural elements reflecting structural conservation and material heritage through the centuries.';
}

// -------------------------------------------------------------
// INTERACTIVE ORBIT CONTROLS & EVENT LISTENERS
// -------------------------------------------------------------
function setupInteractiveControls(container) {
  let isDragging = false;
  let prevMouseX = 0;
  let prevMouseY = 0;

  container.addEventListener('mousedown', (e) => {
    isDragging = true;
    prevMouseX = e.clientX;
    prevMouseY = e.clientY;
  });

  window.addEventListener('mouseup', () => {
    isDragging = false;
  });

  container.addEventListener('mousemove', (e) => {
    if (!isDragging || !currentMeshGroup) return;

    const deltaX = e.clientX - prevMouseX;
    const deltaY = e.clientY - prevMouseY;

    currentMeshGroup.rotation.y += deltaX * 0.008;
    camera.position.y = Math.max(5, Math.min(38, camera.position.y - deltaY * 0.06));
    camera.lookAt(0, 7, 0);

    prevMouseX = e.clientX;
    prevMouseY = e.clientY;
  });

  // Mobile Touch support
  container.addEventListener('touchstart', (e) => {
    if (e.touches.length === 1) {
      isDragging = true;
      prevMouseX = e.touches[0].clientX;
      prevMouseY = e.touches[0].clientY;
    }
  });

  container.addEventListener('touchmove', (e) => {
    if (!isDragging || e.touches.length !== 1 || !currentMeshGroup) return;

    const deltaX = e.touches[0].clientX - prevMouseX;
    const deltaY = e.touches[0].clientY - prevMouseY;

    currentMeshGroup.rotation.y += deltaX * 0.008;
    camera.position.y = Math.max(5, Math.min(38, camera.position.y - deltaY * 0.06));
    camera.lookAt(0, 7, 0);

    prevMouseX = e.touches[0].clientX;
    prevMouseY = e.touches[0].clientY;
  });

  container.addEventListener('touchend', () => {
    isDragging = false;
  });

  container.addEventListener('wheel', (e) => {
    e.preventDefault();
    const zoomDelta = e.deltaY * 0.04;
    camera.position.z = Math.max(22, Math.min(80, camera.position.z + zoomDelta));
  });
}

function setupViewerUI() {
  const monumentSelect = document.getElementById('three-monument-select');
  if (monumentSelect) {
    monumentSelect.addEventListener('change', (e) => {
      soundManager.playClick();
      loadMonumentModel(e.target.value, currentTimeEra);
    });
  }

  const timeSlider = document.getElementById('three-time-slider');
  if (timeSlider) {
    timeSlider.addEventListener('input', (e) => {
      const val = parseInt(e.target.value, 10);
      let era = '2026';
      if (val < 25) era = '1000';
      else if (val < 55) era = '1500';
      else if (val < 85) era = '1850';
      else era = '2026';

      if (era !== currentTimeEra) {
        soundManager.playClick();
        loadMonumentModel(currentMonumentId, era);
      }
    });
  }

  const lightingContainer = document.getElementById('three-lighting-modes');
  if (lightingContainer) {
    lightingContainer.addEventListener('click', (e) => {
      const btn = e.target.closest('button[data-light]');
      if (!btn) return;
      soundManager.playClick();

      lightingContainer.querySelectorAll('button').forEach(b => b.classList.remove('active-mode'));
      btn.classList.add('active-mode');

      currentLightingMode = btn.getAttribute('data-light');
      setupLighting();
    });
  }

  const rotateBtn = document.getElementById('btn-toggle-rotate');
  if (rotateBtn) {
    rotateBtn.addEventListener('click', () => {
      soundManager.playClick();
      isRotating = !isRotating;
      rotateBtn.classList.toggle('active-rotate', isRotating);
    });
  }

  const resetBtn = document.getElementById('btn-reset-camera');
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      soundManager.playClick();
      camera.position.set(0, 20, 52);
      camera.lookAt(0, 7, 0);
      if (currentMeshGroup) currentMeshGroup.rotation.y = 0;
    });
  }
}

function animate() {
  animId = requestAnimationFrame(animate);

  if (isRotating && currentMeshGroup) {
    currentMeshGroup.rotation.y += 0.003;
  }

  renderer.render(scene, camera);
}

function onResize() {
  const container = document.getElementById('three-canvas-container');
  if (!container || !renderer || !camera) return;

  const width = container.clientWidth;
  const height = container.clientHeight || 520;

  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  renderer.setSize(width, height);
}
