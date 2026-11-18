// Target practice, the game: a first-person shooter in about 200 lines of plain three.js, with no game engine.
// three.js only draws; everything a game engine would give you is written out here: the game loop, walking and
// looking, aiming, scoring, and the clock. The numbers it uses are in rules.js.
import * as THREE from "three";
import { rules } from "./rules.js";

const EYE_HEIGHT = 1.7; // metres
const FLASH = 0.12; // seconds a hit target shows white before it reappears elsewhere

// Builds the game on a <canvas>. `report` is called whenever the score, the clock, or the state changes:
// report({ state: "ready" | "playing" | "paused" | "over", score, timeLeft }).
export function createGame(canvas, report) {
  // The three.js basics: a renderer that draws to the canvas, a scene to put things in, and a camera to see them.
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(rules.colours.sky);
  scene.fog = new THREE.Fog(rules.colours.sky, rules.roomSize * 0.6, rules.roomSize * 1.6); // far things fade into the sky
  const camera = new THREE.PerspectiveCamera(75, 16 / 9, 0.1, 200);
  camera.rotation.order = "YXZ"; // turn left and right first, then up and down, the way a head does

  scene.add(new THREE.HemisphereLight("#ffffff", rules.colours.floor, 1.6));
  const sun = new THREE.DirectionalLight("#ffffff", 1.4);
  sun.position.set(10, 20, 5);
  scene.add(sun);

  // The room: a floor with a grid on it, so you can feel yourself moving.
  const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(rules.roomSize, rules.roomSize),
    new THREE.MeshLambertMaterial({ color: rules.colours.floor }),
  );
  floor.rotation.x = -Math.PI / 2;
  scene.add(floor);
  scene.add(new THREE.GridHelper(rules.roomSize, rules.roomSize / 2, rules.colours.grid, rules.colours.grid));

  // The targets: plain spheres. Each one remembers where it floats from and which way it drifts.
  const half = rules.roomSize / 2 - 2;
  const sphere = new THREE.SphereGeometry(rules.targetSize, 24, 16);
  const targets = [];
  for (let i = 0; i < rules.targets; i++) {
    const mesh = new THREE.Mesh(sphere, new THREE.MeshLambertMaterial({ color: rules.colours.target }));
    scene.add(mesh);
    targets.push({ mesh, baseY: 0, phase: 0, drift: new THREE.Vector3(), hitAt: null });
  }

  // Puts a target somewhere random, at least 6 metres from you if the room is big enough (20 tries).
  function place(target) {
    const you = new THREE.Vector3(camera.position.x, 0, camera.position.z);
    for (let tries = 0; tries < 20; tries++) {
      target.mesh.position.set(THREE.MathUtils.randFloat(-half, half), 0, THREE.MathUtils.randFloat(-half, half));
      if (target.mesh.position.distanceTo(you) >= 6) break;
    }
    target.baseY = THREE.MathUtils.randFloat(1, 3);
    target.phase = Math.random() * Math.PI * 2;
    const angle = Math.random() * Math.PI * 2;
    target.drift.set(Math.cos(angle), 0, Math.sin(angle)).multiplyScalar(rules.targetDrift);
    target.mesh.material.color.set(rules.colours.target);
    target.hitAt = null;
  }

  // The state of a round.
  let state = "ready";
  let score = 0;
  let timeLeft = rules.timeLimit;
  let yaw = 0; // which way you face, left and right
  let pitch = 0; // how far you look up or down
  let rise = 0; // how fast you are going up (or, below zero, falling), in metres per second
  const keys = new Set(); // the keys being held down right now

  function tell() {
    report({ state, score, timeLeft: Math.ceil(timeLeft) });
  }

  function reset() {
    score = 0;
    timeLeft = rules.timeLimit;
    yaw = 0;
    pitch = 0;
    rise = 0;
    camera.position.set(0, EYE_HEIGHT, rules.roomSize / 4);
    targets.forEach(place);
  }

  // Input. The mouse only turns your head while the pointer is locked to the canvas (click to lock, Esc to let go).
  function onMouseMove(event) {
    if (state !== "playing") return;
    yaw -= event.movementX * rules.lookSpeed;
    pitch -= event.movementY * rules.lookSpeed;
    pitch = THREE.MathUtils.clamp(pitch, -1.4, 1.4); // don't let the head flip over
  }
  function onKeyDown(event) {
    keys.add(event.code);
    if (state === "playing" && (event.code.startsWith("Arrow") || event.code === "Space")) event.preventDefault(); // don't scroll the page
    if (state === "playing" && event.code === "Space" && camera.position.y <= EYE_HEIGHT) rise = rules.jumpSpeed; // jump, only from the floor
  }
  function onKeyUp(event) { keys.delete(event.code); }

  // Shooting: draw an invisible line from the middle of the screen straight out, and see which target it touches first.
  const raycaster = new THREE.Raycaster();
  const centre = new THREE.Vector2(0, 0);
  function onMouseDown() {
    if (state !== "playing") return;
    raycaster.setFromCamera(centre, camera);
    const hit = raycaster.intersectObjects(targets.filter((t) => t.hitAt === null).map((t) => t.mesh))[0];
    if (!hit) return;
    const target = targets.find((t) => t.mesh === hit.object);
    target.hitAt = 0;
    target.mesh.material.color.set(rules.colours.hit);
    score += rules.pointsPerHit;
    tell();
  }

  function onLockChange() {
    const locked = document.pointerLockElement === canvas;
    if (locked && state !== "playing") {
      if (state !== "paused") reset();
      state = "playing";
      tell();
    } else if (!locked && state === "playing") {
      state = "paused";
      keys.clear();
      tell();
    }
  }

  // Walking: W and S move along the way you face, A and D sideways. Arrow keys work too.
  const forward = new THREE.Vector3();
  const right = new THREE.Vector3();
  function walk(seconds) {
    const ahead = (keys.has("KeyW") || keys.has("ArrowUp") ? 1 : 0) - (keys.has("KeyS") || keys.has("ArrowDown") ? 1 : 0);
    const side = (keys.has("KeyD") || keys.has("ArrowRight") ? 1 : 0) - (keys.has("KeyA") || keys.has("ArrowLeft") ? 1 : 0);
    if (!ahead && !side) return;
    forward.set(-Math.sin(yaw), 0, -Math.cos(yaw));
    right.set(Math.cos(yaw), 0, -Math.sin(yaw));
    const step = forward.multiplyScalar(ahead).add(right.multiplyScalar(side)).normalize().multiplyScalar(rules.moveSpeed * seconds);
    camera.position.add(step);
    camera.position.x = THREE.MathUtils.clamp(camera.position.x, -half, half);
    camera.position.z = THREE.MathUtils.clamp(camera.position.z, -half, half);
  }

  // Jumping: Space sends you up at rules.jumpSpeed, gravity slows you, and the floor stops you.
  function fall(seconds) {
    rise -= rules.gravity * seconds;
    camera.position.y += rise * seconds;
    if (camera.position.y <= EYE_HEIGHT) {
      camera.position.y = EYE_HEIGHT;
      rise = 0;
    }
  }

  // The game loop: about sixty times a second, work out how much time has passed, update everything, and draw.
  let last = performance.now();
  let elapsed = 0;
  function frame(now) {
    const seconds = Math.min((now - last) / 1000, 0.1); // cap it, so a slow frame can't teleport anything
    last = now;
    elapsed += seconds;

    if (state === "playing") {
      walk(seconds);
      fall(seconds);
      const shown = Math.ceil(timeLeft);
      timeLeft -= seconds;
      if (timeLeft <= 0) {
        timeLeft = 0;
        state = "over";
        document.exitPointerLock();
        tell();
      } else if (Math.ceil(timeLeft) !== shown) {
        tell();
      }
    }

    for (const target of targets) {
      if (target.hitAt !== null) {
        target.hitAt += seconds;
        if (target.hitAt > FLASH) place(target);
        continue;
      }
      const p = target.mesh.position;
      p.addScaledVector(target.drift, seconds);
      if (Math.abs(p.x) > half) target.drift.x *= -1; // bounce off the walls
      if (Math.abs(p.z) > half) target.drift.z *= -1;
      p.y = target.baseY + Math.sin(elapsed * 2 + target.phase) * rules.targetBob;
    }

    camera.rotation.set(pitch, yaw, 0);
    renderer.render(scene, camera);
  }

  // Keep the drawing the size of the canvas on the page.
  function resize() {
    const { clientWidth: width, clientHeight: height } = canvas;
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  }
  const observer = new ResizeObserver(resize);
  observer.observe(canvas);

  canvas.addEventListener("mousedown", onMouseDown);
  document.addEventListener("mousemove", onMouseMove);
  document.addEventListener("keydown", onKeyDown);
  document.addEventListener("keyup", onKeyUp);
  document.addEventListener("pointerlockchange", onLockChange);
  reset();
  resize();
  renderer.setAnimationLoop(frame);
  tell();

  return {
    // Starting (or carrying on) is just asking the browser to lock the pointer; onLockChange does the rest.
    // (Browsers refuse a new lock for about a second after one ends; if that happens, clicking again works.)
    start() { Promise.resolve(canvas.requestPointerLock()).catch(() => {}); },
    dispose() {
      renderer.setAnimationLoop(null);
      observer.disconnect();
      canvas.removeEventListener("mousedown", onMouseDown);
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("keyup", onKeyUp);
      document.removeEventListener("pointerlockchange", onLockChange);
      if (document.pointerLockElement === canvas) document.exitPointerLock();
      sphere.dispose();
      targets.forEach((t) => t.mesh.material.dispose());
      renderer.dispose();
    },
  };
}
