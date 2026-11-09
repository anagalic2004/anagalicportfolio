// Soulshine lamp: an interactive 3D model built from the team's renders.
// The full lamp spins; click a part (or a chip) to see that piece on its own.
import * as THREE from './three.module.min.js';

const PARTS = {
  all:     { name: 'Full lamp',        dims: '43 × 48.1 × 36.2 cm', text: 'Lamp, phone stand, speaker and scent diffuser on one desk mat.' },
  head:    { name: 'Lamp head & neck', dims: '34.3 × 35.6 × 11.4 cm', text: 'A 30 cm LED strip behind a diffuser that slowly dims as a focus session runs.' },
  base:    { name: 'Lamp base',        dims: '8.6 × 25 × 25 cm',      text: 'Holds the session timer with + / − controls; the vents let the light and sound breathe.' },
  speaker: { name: '360° speaker',     dims: '',                      text: 'Plays a soft sound cue to pull you back from scrolling.' },
  stand:   { name: 'Phone stand',      dims: '5 × 24.5 × 11 cm',      text: 'Charges the phone face-away, out of sight, while you focus.' },
  scent:   { name: 'Scent diffuser',   dims: '',                      text: 'Inspired by Pura: slits release a calming scent such as lavender.' }
};

function canvasTex(w, h, draw) {
  const c = document.createElement('canvas'); c.width = w; c.height = h;
  const g = c.getContext('2d'); draw(g, w, h);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4; return t;
}
const FONT = '"Figtree","Helvetica Neue",Arial,sans-serif';

function matTex() {
  return canvasTex(1024, 1024, (g, w, h) => {
    g.fillStyle = '#C9D3DC'; g.fillRect(0, 0, w, h);
    g.strokeStyle = 'rgba(120,138,155,.35)'; g.lineWidth = 2;
    for (let i = 0; i <= w; i += 64) { g.beginPath(); g.moveTo(i, 0); g.lineTo(i, h); g.stroke(); g.beginPath(); g.moveTo(0, i); g.lineTo(w, i); g.stroke(); }
    g.strokeStyle = 'rgba(120,138,155,.6)'; g.lineWidth = 6; g.strokeRect(6, 6, w - 12, h - 12);
  });
}
function bandTex() {
  return canvasTex(2048, 256, (g, w, h) => {
    g.fillStyle = '#B4AA9C'; g.fillRect(0, 0, w, h);
    // arched vents along the bottom
    for (let x = 40; x < w; x += 150) {
      g.fillStyle = '#6E665D'; g.beginPath(); g.moveTo(x, h); g.lineTo(x, h - 70); g.quadraticCurveTo(x + 32, h - 150, x + 64, h - 70); g.lineTo(x + 64, h); g.fill();
      g.fillStyle = '#E2DCD2'; g.beginPath(); g.moveTo(x + 8, h); g.lineTo(x + 32, h - 46); g.lineTo(x + 56, h); g.fill();
    }
    // timer display, - / +, clock icon, gear
    const cx = 520;
    g.fillStyle = '#121214'; roundRect(g, cx - 95, 40, 190, 78, 14); g.fill();
    g.fillStyle = '#E8E8EA'; g.font = `700 58px ${FONT}`; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('00:00', cx, 80);
    g.strokeStyle = '#8C8A3A'; g.lineWidth = 7; g.lineCap = 'round';
    g.beginPath(); g.moveTo(cx - 190, 80); g.lineTo(cx - 130, 80); g.stroke();
    g.beginPath(); g.moveTo(cx + 130, 80); g.lineTo(cx + 190, 80); g.moveTo(cx + 160, 50); g.lineTo(cx + 160, 110); g.stroke();
    g.fillStyle = '#B9A23A'; g.beginPath(); g.arc(cx, 185, 46, 0, 7); g.fill();
    g.beginPath(); g.arc(cx - 40, 145, 20, 0, 7); g.arc(cx + 40, 145, 20, 0, 7); g.fill();
    g.strokeStyle = '#3B3720'; g.lineWidth = 6; g.beginPath(); g.moveTo(cx, 185); g.lineTo(cx, 152); g.moveTo(cx, 185); g.lineTo(cx + 26, 200); g.stroke();
    const gx = 1180, gy = 120; g.fillStyle = '#B9A23A';
    for (let i = 0; i < 12; i++) { const a = i / 12 * Math.PI * 2; g.save(); g.translate(gx, gy); g.rotate(a); g.fillRect(-9, -62, 18, 26); g.restore(); }
    g.beginPath(); g.arc(gx, gy, 42, 0, 7); g.fill(); g.fillStyle = '#B4AA9C'; g.beginPath(); g.arc(gx, gy, 14, 0, 7); g.fill();
    g.strokeStyle = '#8C8A3A'; g.beginPath(); g.moveTo(gx - 150, 70); g.lineTo(gx - 100, 70); g.stroke();
  });
}
function roundRect(g, x, y, w, h, r) { g.beginPath(); g.moveTo(x + r, y); g.arcTo(x + w, y, x + w, y + h, r); g.arcTo(x + w, y + h, x, y + h, r); g.arcTo(x, y + h, x, y, r); g.arcTo(x, y, x + w, y, r); g.closePath(); }
function wordTex(word, w = 1024, h = 256, size = 150) {
  return canvasTex(w, h, (g) => {
    g.clearRect(0, 0, w, h); g.textAlign = 'center'; g.textBaseline = 'middle';
    g.font = `900 ${size}px "Arial Black",Impact,${FONT}`;
    g.fillStyle = '#5E1C20'; g.fillText(word, w / 2 + 7, h / 2 + 8);
    g.fillStyle = '#B5303A'; g.fillText(word, w / 2, h / 2);
  });
}
function scentTex() {
  return canvasTex(1024, 1024, (g, w, h) => {
    g.fillStyle = '#46484D'; g.fillRect(0, 0, w, h);
    g.strokeStyle = '#6A3C8F'; g.lineWidth = 26; g.beginPath(); g.arc(w / 2, h / 2, 300, 0, 7); g.stroke();
    g.fillStyle = '#D8D9DE'; g.font = `600 92px ${FONT}`; g.textAlign = 'center'; g.textBaseline = 'middle';
    const t = 'LAVENDER', R = 190; g.save(); g.translate(w / 2, h / 2); g.rotate(-0.95);
    for (let i = 0; i < t.length; i++) { g.save(); g.rotate(i * 0.24); g.translate(0, -R); g.fillText(t[i], 0, 0); g.restore(); }
    g.restore();
  });
}

const M = (color, o = {}) => new THREE.MeshStandardMaterial({ color, roughness: .62, metalness: .04, ...o });
function outline(mesh, opacity = .45) {
  const e = new THREE.LineSegments(new THREE.EdgesGeometry(mesh.geometry, 28), new THREE.LineBasicMaterial({ color: 0x3E4652, transparent: true, opacity }));
  mesh.add(e); return mesh;
}
function shadowed(m) { m.castShadow = true; m.receiveShadow = true; return m; }
function roundedSlab(w, h, d, r) {
  const s = new THREE.Shape(); const x = -w / 2, y = -h / 2;
  s.moveTo(x + r, y); s.lineTo(x + w - r, y); s.quadraticCurveTo(x + w, y, x + w, y + r); s.lineTo(x + w, y + h - r); s.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  s.lineTo(x + r, y + h); s.quadraticCurveTo(x, y + h, x, y + h - r); s.lineTo(x, y + r); s.quadraticCurveTo(x, y, x + r, y);
  const g = new THREE.ExtrudeGeometry(s, { depth: d, bevelEnabled: true, bevelSize: .04, bevelThickness: .04, bevelSegments: 3, curveSegments: 10 });
  g.translate(0, 0, -d / 2); return g;
}

function buildLamp() {
  const root = new THREE.Group(); const parts = {};
  const part = (key) => { const g = new THREE.Group(); g.userData.part = key; root.add(g); parts[key] = g; return g; };

  // desk mat (not selectable)
  const mat = shadowed(new THREE.Mesh(new THREE.BoxGeometry(8, .08, 7), [M(0xB9C3CC), M(0xB9C3CC), new THREE.MeshStandardMaterial({ map: matTex(), roughness: .9 }), M(0xB9C3CC), M(0xB9C3CC), M(0xB9C3CC)]));
  mat.position.y = -.04; outline(mat, .3); const matG = new THREE.Group(); matG.add(mat); root.add(matG); parts.__mat = matG;

  // base
  const base = part('base'); base.position.set(-1.3, 0, -.7);
  const bandMat = new THREE.MeshStandardMaterial({ map: bandTex(), roughness: .7 });
  const band = shadowed(new THREE.Mesh(new THREE.CylinderGeometry(1.55, 1.55, .78, 72, 1, true), bandMat)); band.position.y = .39; band.rotation.y = -Math.PI * .62; base.add(outline(band, .25));
  const bandFloor = new THREE.Mesh(new THREE.CircleGeometry(1.55, 72), M(0x8E867B)); bandFloor.rotation.x = -Math.PI / 2; bandFloor.position.y = .005; base.add(bandFloor);
  const lip = shadowed(new THREE.Mesh(new THREE.CylinderGeometry(1.58, 1.58, .06, 72), M(0xD9D3C8))); lip.position.y = .8; base.add(lip);
  const cone = shadowed(new THREE.Mesh(new THREE.CylinderGeometry(1.22, 1.6, .5, 72), M(0x6F7176))); cone.position.y = 1.08; base.add(outline(cone, .3));
  const top = shadowed(new THREE.Mesh(new THREE.RingGeometry(.48, 1.22, 72), M(0xC8BDAE, { side: THREE.DoubleSide }))); top.rotation.x = -Math.PI / 2; top.position.y = 1.335; base.add(top);

  // speaker tab behind the base
  const sp = part('speaker'); sp.position.set(-.55, 1.0, -1.85); sp.rotation.set(-.12, .25, 0);
  const tab = shadowed(new THREE.Mesh(roundedSlab(1.25, 1.0, .32, .35), M(0xA6ABB2))); sp.add(outline(tab, .35));
  const spWord = new THREE.Mesh(new THREE.PlaneGeometry(1.05, .26), new THREE.MeshBasicMaterial({ map: wordTex('SPEAKER'), transparent: true })); spWord.position.set(0, .22, .21); sp.add(spWord);
  const spBack = spWord.clone(); spBack.position.z = -.21; spBack.rotation.y = Math.PI; sp.add(spBack);

  // neck + head
  const head = part('head'); head.position.copy(base.position);
  const prof = [[.62, 1.34], [.62, 1.40], [.50, 1.42], [.44, 1.6], [.36, 2.3], [.33, 3.0], [.36, 3.6], [.48, 4.05], [.52, 4.12]].map(([r, y]) => new THREE.Vector2(r, y));
  const neck = shadowed(new THREE.Mesh(new THREE.LatheGeometry(prof, 48), M(0x93A07F, { roughness: .55 }))); head.add(outline(neck, .25));
  const collar = shadowed(new THREE.Mesh(new THREE.CylinderGeometry(.66, .66, .07, 48), M(0xD2C7B8))); collar.position.y = 1.37; head.add(collar);
  const bar = new THREE.Group(); bar.position.set(-1.0, 4.42, 0); head.add(bar);
  const dShape = new THREE.Shape(); dShape.moveTo(-.5, 0); dShape.lineTo(.5, 0); dShape.absarc(0, 0, .5, 0, Math.PI, false);
  const dGeo = new THREE.ExtrudeGeometry(dShape, { depth: 4.2, bevelEnabled: true, bevelSize: .03, bevelThickness: .03, bevelSegments: 2, curveSegments: 28 }); dGeo.translate(0, 0, -2.1); dGeo.rotateY(Math.PI / 2);
  const shell = shadowed(new THREE.Mesh(dGeo, M(0xB3A496))); bar.add(outline(shell, .35));
  
  const recess = new THREE.Mesh(new THREE.PlaneGeometry(3.3, .7), M(0x7D7872, { side: THREE.DoubleSide })); recess.rotation.x = Math.PI / 2; recess.position.set(-.25, -.035, 0); bar.add(recess);
  for (let i = -1; i <= 1; i++) { const led = new THREE.Mesh(new THREE.BoxGeometry(3.1, .03, .1), M(0xD7C24A, { emissive: 0xE8C64A, emissiveIntensity: .55 })); led.position.set(-.25, -.06, i * .2); bar.add(led); }
  

  // phone stand
  const st = part('stand'); st.position.set(2.15, 0, -1.25); st.rotation.y = -.35;
  const box = shadowed(new THREE.Mesh(new THREE.BoxGeometry(2.3, .62, .7), M(0xC4B7A6))); box.position.y = .31; st.add(outline(box, .35));
  const slot = new THREE.Mesh(new THREE.BoxGeometry(2.0, .02, .2), M(0x5C564F)); slot.position.set(0, .625, 0); st.add(slot);
  const phone = new THREE.Group(); phone.position.set(0, .55, 0); phone.rotation.x = -.2; st.add(phone);
  const ph = shadowed(new THREE.Mesh(roundedSlab(2.0, 2.9, .12, .16), M(0x8F949B))); ph.position.y = 1.45; phone.add(outline(ph, .35));
  const phWord = new THREE.Mesh(new THREE.PlaneGeometry(1.25, .32), new THREE.MeshBasicMaterial({ map: wordTex('PHONE'), transparent: true })); phWord.position.set(.1, 2.25, .11); phone.add(phWord);
  const cable = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3([new THREE.Vector3(.35, .32, .36), new THREE.Vector3(-.2, .2, .37), new THREE.Vector3(-.75, .1, .37)]), 20, .025, 8), M(0xA02A30)); st.add(cable);

  // scent diffuser
  const sc = part('scent'); sc.position.set(1.35, 0, 1.55);
  const disc = shadowed(new THREE.Mesh(new THREE.CylinderGeometry(1.35, 1.35, .2, 72), [M(0x3F4146), new THREE.MeshStandardMaterial({ map: scentTex(), roughness: .6 }), M(0x3F4146)])); disc.position.y = .1; sc.add(outline(disc, .35));

  root.position.y = -1.9;
  return { root, parts };
}

function init(host) {
  const canvas = host.querySelector('canvas'), chips = [...host.querySelectorAll('[data-part]')];
  const nameEl = host.querySelector('.l3-name'), dimEl = host.querySelector('.l3-dims'), txtEl = host.querySelector('.l3-text'), tip = host.querySelector('.l3-tip');
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(2, devicePixelRatio)); renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap; renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.05;
  const scene = new THREE.Scene();
  const cam = new THREE.PerspectiveCamera(32, 1, .1, 200);
  scene.add(new THREE.HemisphereLight(0xffffff, 0xC9D3E6, 1.55));
  const sun = new THREE.DirectionalLight(0xffffff, 2.1); sun.position.set(-5, 10, 6); sun.castShadow = true; sun.shadow.mapSize.set(2048, 2048); sun.shadow.radius = 6;
  Object.assign(sun.shadow.camera, { left: -7, right: 7, top: 7, bottom: -7 }); scene.add(sun);
  const rim = new THREE.DirectionalLight(0xD6E3FF, .8); rim.position.set(6, 4, -6); scene.add(rim);
  const ground = new THREE.Mesh(new THREE.PlaneGeometry(40, 40), new THREE.ShadowMaterial({ opacity: .12 })); ground.rotation.x = -Math.PI / 2; ground.position.y = -2.6; ground.receiveShadow = true; scene.add(ground);

  const { root, parts } = buildLamp(); const matG = parts.__mat; delete parts.__mat; matG.userData.vis = 1;
  const spin = new THREE.Group(); scene.add(spin); spin.add(root);
  const keys = Object.keys(parts);
  keys.forEach(k => parts[k].userData.vis = 1);

  let sel = 'all', rotY = (window.L3_ROT ?? .75), tilt = .42, auto = !window.L3_ROT_FIXED, dragging = false, lastX = 0, lastY = 0, moved = 0, hover = null;
  const rootGoal = new THREE.Vector3(0, -1.9, 0); let dist = 13, distGoal = 13, groundGoal = -2, tiltGoal = .42;

  function frame(key) {
    const saved = keys.map(k => parts[k].scale.x); keys.forEach(k => parts[k].scale.setScalar(1));
    const rp = root.position.clone(), sr = spin.rotation.y; root.position.set(0, 0, 0); spin.rotation.y = 0; spin.updateMatrixWorld(true);
    const box = new THREE.Box3().setFromObject(key === 'all' ? root : parts[key]);
    keys.forEach((k, i) => parts[k].scale.setScalar(saved[i])); root.position.copy(rp); spin.rotation.y = sr;
    const c = box.getCenter(new THREE.Vector3()), s = box.getSize(new THREE.Vector3());
    rootGoal.set(-c.x, -c.y, -c.z); groundGoal = -c.y + box.min.y - .01; distGoal = Math.max(4.6, Math.max(s.x, s.y, s.z) * (key === 'all' ? 1.95 : key === 'head' ? 2.4 : 2.0));
    tiltGoal = key === 'head' ? -.32 : key === 'scent' ? .62 : .42;
  }
  function select(key) {
    sel = key; chips.forEach(c => c.setAttribute('aria-pressed', String(c.dataset.part === key)));
    const p = PARTS[key]; nameEl.textContent = p.name; dimEl.textContent = p.dims; dimEl.hidden = !p.dims; txtEl.textContent = p.text;
    requestAnimationFrame(() => frame(key));
  }
  chips.forEach(c => c.addEventListener('click', () => select(c.dataset.part)));

  const ray = new THREE.Raycaster(), ndc = new THREE.Vector2();
  function pick(e) {
    const r = canvas.getBoundingClientRect(); ndc.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
    ray.setFromCamera(ndc, cam);
    const hits = ray.intersectObjects(keys.filter(k => sel === 'all' || k === sel).map(k => parts[k]), true);
    for (const h of hits) { let o = h.object; while (o && !o.userData.part) o = o.parent; if (o) return o.userData.part; }
    return null;
  }
  const highlight = (k, on) => { if (!k) return; parts[k].traverse(o => { if (o.isMesh && o.material && !Array.isArray(o.material) && 'emissive' in o.material) { o.material.userData.e ??= o.material.emissive.getHex(); o.material.userData.ei ??= o.material.emissiveIntensity; o.material.emissive.setHex(on ? 0x3B6FD8 : o.material.userData.e); o.material.emissiveIntensity = on ? .22 : o.material.userData.ei; } }); };
  canvas.addEventListener('pointerdown', e => { dragging = true; moved = 0; lastX = e.clientX; lastY = e.clientY; canvas.setPointerCapture(e.pointerId); });
  canvas.addEventListener('pointermove', e => {
    if (dragging) { const dx = e.clientX - lastX, dy = e.clientY - lastY; moved += Math.abs(dx) + Math.abs(dy); rotY += dx * .008; tilt = Math.min(1.1, Math.max(-.6, tilt + dy * .005)); tiltGoal = tilt; lastX = e.clientX; lastY = e.clientY; if (moved > 4) auto = false; return; }
    const k = sel === 'all' ? pick(e) : null;
    if (k !== hover) { highlight(hover, false); hover = k; highlight(hover, true); }
    canvas.style.cursor = k ? 'pointer' : 'grab';
    if (k) { tip.textContent = PARTS[k].name; tip.style.left = (e.offsetX + 14) + 'px'; tip.style.top = (e.offsetY + 14) + 'px'; tip.hidden = false; } else tip.hidden = true;
  });
  canvas.addEventListener('pointerleave', () => { highlight(hover, false); hover = null; tip.hidden = true; });
  canvas.addEventListener('pointerup', e => {
    dragging = false; setTimeout(() => auto = true, 2500);
    if (moved < 6) { const k = pick(e); if (k && sel === 'all') { highlight(hover, false); hover = null; tip.hidden = true; select(k); } else if (!k && sel !== 'all') select('all'); }
  });

  function size() { const w = canvas.clientWidth, h = canvas.clientHeight; renderer.setSize(w, h, false); cam.aspect = w / h; cam.updateProjectionMatrix(); }
  new ResizeObserver(size).observe(canvas); size(); select('all');

  let visible = false, last = performance.now();
  new IntersectionObserver(es => es.forEach(en => visible = en.isIntersecting), { threshold: .05 }).observe(canvas);
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  (function loop(t) {
    requestAnimationFrame(loop);
    const dt = Math.min(.05, (t - last) / 1000); last = t;
    if (!visible) return;
    if (auto && !reduce) rotY += dt * (sel === 'all' ? .35 : .55);
    { const want = sel === 'all' ? 1 : 0; matG.userData.vis += (want - matG.userData.vis) * Math.min(1, dt * 7); matG.scale.setScalar(Math.max(.0001, matG.userData.vis)); matG.visible = matG.userData.vis > .01; }
    keys.forEach(k => { const g = parts[k], want = (sel === 'all' || sel === k) ? 1 : 0; g.userData.vis += (want - g.userData.vis) * Math.min(1, dt * 7); const v = g.userData.vis; g.scale.setScalar(Math.max(.0001, v)); g.visible = v > .01; });
    spin.rotation.y = rotY;
    dist += (distGoal - dist) * Math.min(1, dt * 4); root.position.lerp(rootGoal, Math.min(1, dt * 4));
    if (!dragging) tilt += (tiltGoal - tilt) * Math.min(1, dt * 3); ground.position.y += (groundGoal - ground.position.y) * Math.min(1, dt * 4);
    const d = dist * Math.max(1, 1.5 / cam.aspect); cam.position.set(0, Math.sin(tilt) * d, Math.cos(tilt) * d); cam.lookAt(0, 0, 0);
    renderer.render(scene, cam);
  })(last);
  host.classList.add('l3-ready');
}

const host = document.querySelector('.lamp3d');
if (host) {
  const go = () => { try { init(host); } catch (e) { host.classList.add('l3-fail'); console.error(e); } };
  if ('IntersectionObserver' in window) { const io = new IntersectionObserver(es => { if (es.some(e => e.isIntersecting)) { io.disconnect(); go(); } }, { rootMargin: '400px' }); io.observe(host); }
  else go();
}
