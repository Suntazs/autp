"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { RectAreaLightUniformsLib } from "three/examples/jsm/lights/RectAreaLightUniformsLib.js";

export default function MetalSlab({
  sectionHeight = 100,      // kept for backward-compat; not used in overlay mode
  stickyWindowVh = 100,     // scroll window for the effect when using anchor
  overshootPx = null,        // tiny bit past 100vh (progress only)
  spins = 0.7,              // cap at 1.5 turns total
  tiltDeg = { x: 16, z: 10 },// tilt kept gentle
  retreatUpUnits = 1.2,     // slide up more
  retreatBackUnits = 1.5,   // push back more
  retreatScaleTo = 0.95,    // shrink a touch more
  // Motion controls
  stopAtPx = null,          // optional absolute px distance to stop the motion
  stopAtProgress = 1,       // clamp 0..1; where along the progress to stop
  overshootWindowProgress = 0.2, // 0..1 of progress past the stop used to overshoot+return
  overshootYawDeg = 8,      // max extra yaw during overshoot (degrees)
  // New: external anchor that defines the scroll window; slab itself is overlay
  anchorRef = null,
  className = "",
  children, // accepted for backward-compat but not rendered in overlay mode
}) {
  const mountRef   = useRef(null);
  const rendererRef = useRef(null);
  const animationIdRef = useRef(null);

  useEffect(() => {
    if (!mountRef.current) return;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    const { w, h } = getMountSize();
    renderer.setSize(w, h);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 0.85;
    renderer.physicallyCorrectLights = true;

    // Ensure canvas never affects layout or input
    const canvas = renderer.domElement;
    canvas.style.position = "absolute";
    canvas.style.inset = "0";
    canvas.style.display = "block";          // avoid inline-canvas baseline gap
    canvas.style.pointerEvents = "none";     // never intercept scrolling/clicks

    rendererRef.current = renderer;
    mountRef.current.appendChild(canvas);

    // Scene + Camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, w / h, 0.1, 100);
    camera.position.set(0, 0.2, 3.1);
    camera.layers.enable(1);

    // Group for slab
    const slabGroup = new THREE.Group();
    scene.add(slabGroup);

    // Geometry helper
    function SharpEdgeRoundedCornersBox(W, H, D, edgeRadius = 0, cornerRadius = 0.18, segments = 16) {
      const maxCorner = Math.min(W, D) * 0.5 - 1e-4;
      const rCorner = Math.min(cornerRadius, maxCorner);
      const rEdge = Math.max(0, Math.min(edgeRadius, Math.min(W, D) * 0.25));
      const x0 = -W / 2, z0 = -D / 2;
      const shape = new THREE.Shape();
      shape.moveTo(x0 + rCorner, z0);
      shape.lineTo(x0 + W - rCorner, z0);
      shape.absarc(x0 + W - rCorner, z0 + rCorner, rCorner, -Math.PI / 2, 0, false);
      shape.lineTo(x0 + W, z0 + D - rCorner);
      shape.absarc(x0 + W - rCorner, z0 + D - rCorner, rCorner, 0, Math.PI / 2, false);
      shape.lineTo(x0 + rCorner, z0 + D);
      shape.absarc(x0 + rCorner, z0 + D - rCorner, rCorner, Math.PI / 2, Math.PI, false);
      shape.lineTo(x0, z0 + rCorner);
      shape.absarc(x0 + rCorner, z0 + rCorner, rCorner, Math.PI, 1.5 * Math.PI, false);
      const geo = new THREE.ExtrudeGeometry(shape, {
        depth: H, steps: 1, curveSegments: Math.max(8, segments),
        bevelEnabled: rEdge > 0, bevelThickness: rEdge, bevelSize: rEdge, bevelOffset: 0,
        bevelSegments: Math.max(1, Math.round(segments * 0.6)),
      });
      geo.rotateX(-Math.PI / 2);
      geo.center();
      if (!geo.attributes.uv2 && geo.attributes.uv) geo.setAttribute("uv2", geo.attributes.uv);
      return geo;
    }

    const geometry = SharpEdgeRoundedCornersBox(2.6, 0.4, 2.6, 0.02, 0.2, 24);

    // Materials
    const topMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xff6f2a, metalness: 0.3, roughness: 0.58, clearcoat: 0.08, clearcoatRoughness: 0.3,
    });
    const sideMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xff5a1f, metalness: 0.85, roughness: 0.38, clearcoat: 0.35, clearcoatRoughness: 0.18,
    });

    // Slab
    const slab = new THREE.Mesh(geometry, [sideMaterial, topMaterial, sideMaterial]);
    slab.layers.set(0);
    slabGroup.add(slab);
    slab.position.set(-2.3, 1.0, 0);
    slab.rotation.set(THREE.MathUtils.degToRad(50), THREE.MathUtils.degToRad(-50), 0);

    // Measurements / overlay
    RectAreaLightUniformsLib.init();
    const bbox = new THREE.Box3().setFromObject(slab);
    const center = bbox.getCenter(new THREE.Vector3());
    const objSize = bbox.getSize(new THREE.Vector3());
    const topOverlay = new THREE.Mesh(
      new THREE.PlaneGeometry(objSize.x * 0.985, objSize.z * 0.985),
      new THREE.MeshPhysicalMaterial({
        color: 0xff7a2f, metalness: 0.2, roughness: 0.7, clearcoat: 0.05, clearcoatRoughness: 0.4,
        transparent: true, opacity: 0.55,
      })
    );
    topOverlay.rotation.x = -Math.PI / 2;
    topOverlay.position.set(0, objSize.y / 2 + 0.001, 0);
    topOverlay.layers.set(1);
    slab.add(topOverlay);

    // Lights (unchanged)
    const sideLeft  = new THREE.RectAreaLight(0xffa15a, 28.0, 0.04, objSize.y * 2.0);
    sideLeft.position.set(bbox.min.x - 0.08, center.y, center.z + 0.05);
    sideLeft.rotation.set(0, THREE.MathUtils.degToRad(-78), 0);
    sideLeft.layers.set(0);
    scene.add(sideLeft);

    const sideRight = new THREE.RectAreaLight(0xff9966, 3.2, 0.02, objSize.y * 1.6);
    sideRight.position.set(bbox.max.x + 0.05, center.y, center.z);
    sideRight.rotation.set(0, THREE.MathUtils.degToRad(84), 0);
    sideRight.layers.set(0);
    scene.add(sideRight);

    const topKey = new THREE.RectAreaLight(0xff8a4a, 0.22, objSize.x * 1.35, objSize.z * 1.35);
    topKey.position.set(center.x, bbox.max.y + 0.26, center.z);
    topKey.rotation.set(THREE.MathUtils.degToRad(-90), 0, 0);
    topKey.layers.set(1);
    scene.add(topKey);

    const edgeGroup = new THREE.Object3D();
    slab.add(edgeGroup);
    const edgeTarget = new THREE.Object3D();
    edgeTarget.position.set(-objSize.x / 2 + 0.025, 0, 0);
    edgeGroup.add(edgeTarget);

    const leftEdgeRim = new THREE.RectAreaLight(0xffffff, 65.0, 0.024, objSize.y * 1.35);
    leftEdgeRim.position.set(-objSize.x / 2 - 0.028, 0, 0);
    leftEdgeRim.lookAt(edgeTarget.getWorldPosition(new THREE.Vector3()));
    leftEdgeRim.layers.set(0);
    edgeGroup.add(leftEdgeRim);

    const leftEdgeLine = new THREE.RectAreaLight(0xffffff, 35.0, 0.008, objSize.y * 1.1);
    leftEdgeLine.position.set(-objSize.x / 2 - 0.021, 0, 0);
    leftEdgeLine.lookAt(edgeTarget.getWorldPosition(new THREE.Vector3()));
    leftEdgeLine.layers.set(0);
    edgeGroup.add(leftEdgeLine);

    const cornerWash = new THREE.SpotLight(0xff9a5c, 3.5, 3.4, THREE.MathUtils.degToRad(55), 0.35, 2.2);
    cornerWash.castShadow = false;
    cornerWash.position.set(-objSize.x / 2 - 0.25, objSize.y / 2 + 0.08, +objSize.z * 0.18);
    const cornerTarget = new THREE.Object3D();
    cornerTarget.position.set(-objSize.x / 2 + 0.15, objSize.y / 2 - 0.04, +objSize.z * 0.08);
    slab.add(cornerWash, cornerTarget);
    cornerWash.target = cornerTarget;
    cornerWash.layers.set(0);

    const cornerFill = new THREE.RectAreaLight(0xff7a3a, 15.0, 0.22, 0.06);
    cornerFill.position.set(-objSize.x / 2 - 0.12, objSize.y / 2 - 0.01, +objSize.z * 0.12);
    cornerFill.rotation.set(THREE.MathUtils.degToRad(-8), THREE.MathUtils.degToRad(-85), 0);
    cornerFill.layers.set(0);
    slab.add(cornerFill);

    const rimStrip = new THREE.RectAreaLight(0xffffff, 0.0, objSize.x * 0.4, 0.01);
    rimStrip.position.set(center.x + objSize.x * 0.18, bbox.max.y - 0.005, center.z + objSize.z * 0.18);
    rimStrip.rotation.set(THREE.MathUtils.degToRad(-8), THREE.MathUtils.degToRad(-35), 0);
    rimStrip.layers.set(0);
    scene.add(rimStrip);

    // Motion
    const TWO_PI = Math.PI * 2;
    const baseGroupPos = slabGroup.position.clone();
    const baseGroupScale = slabGroup.scale.clone();
    const baseRot = slab.rotation.clone();
    const clock = new THREE.Clock();
    const floatAmp = 0.06;
    let spinSmoothed = 0;
    let progSmoothed = 0;

    const clamp01 = (v) => Math.max(0, Math.min(1, v));
    const easeInOut = (x) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);

    const getScrollMetrics = () => {
      const targetEl = (anchorRef && anchorRef.current) ? anchorRef.current : (mountRef.current ? mountRef.current.parentElement : null);
      const rect = targetEl ? targetEl.getBoundingClientRect() : null;
      const vh = window.innerHeight || 1;
      const stickyPx = (stickyWindowVh / 100) * vh;
      const sectionPx = rect ? rect.height : (targetEl ? targetEl.clientHeight || vh : vh);
      // If the section is shorter or equal to the sticky window, use the sticky window as progress length
      const baseWindow = sectionPx <= stickyPx ? stickyPx : (sectionPx - stickyPx);
      const totalProgressPx = Math.max(1, baseWindow + Math.max(0, overshootPx));
      const distanceInto = rect ? Math.max(0, -rect.top) : 0; // start when top hits viewport top
      return { rect: rect || { top: 0, bottom: 0, height: sectionPx }, vh, stickyPx, sectionPx, totalProgressPx, distanceInto };
    };

    const computeProgressRaw = () => {
      const { distanceInto, totalProgressPx } = getScrollMetrics();
      const stopDistancePx = typeof stopAtPx === "number" && stopAtPx >= 0 ? stopAtPx : totalProgressPx;
      return distanceInto / Math.max(1, stopDistancePx); // raw, can exceed 1
    };

    // Loop
    const loop = () => {
      animationIdRef.current = requestAnimationFrame(loop);

      const dt = clock.getDelta();
      const t  = clock.elapsedTime;

      const pRaw = computeProgressRaw();
      const pEase = easeInOut(clamp01(pRaw));
      const stopProgressCap = typeof stopAtProgress === "number" ? clamp01(stopAtProgress) : 1;
      const pClamped = Math.min(pEase, stopProgressCap);

      // Overshoot window beyond the stop: allow a small extra yaw then ease back
      const extraWindow = clamp01(overshootWindowProgress);
      const postStopProgress = clamp01((pEase - stopProgressCap) / Math.max(1e-6, extraWindow));
      // Shape: up-and-down bump: rises to 1 at middle of window, then back to 0
      const postStopBump = postStopProgress > 0 ? Math.sin(Math.PI * postStopProgress) : 0;
      const extraYawRad = THREE.MathUtils.degToRad(overshootYawDeg) * postStopBump;

      // Spin: finish at max 1.5 turns; never more, plus the overshoot yaw bump
      const maxTurns = 1.5;
      const spinTarget = pClamped * Math.min(spins, maxTurns) * TWO_PI + extraYawRad;

      // smoothing (always ease toward target; no snapping at stop)
      const aSpin = 1 - Math.pow(1 - 0.08, dt * 60);
      const aProg = 1 - Math.pow(1 - 0.15, dt * 60);
      spinSmoothed = THREE.MathUtils.lerp(spinSmoothed, spinTarget, aSpin);
      progSmoothed = THREE.MathUtils.lerp(progSmoothed, pClamped, aProg);

      // float (always keep the gentle hover animation, even after stop)
      const s = Math.sin(t * 1.2);
      const floatAmpCurrent = floatAmp;
      slab.position.y = 1.0 + s * floatAmpCurrent;

      // spin + tilt
      const addRx = THREE.MathUtils.degToRad(tiltDeg.x) * progSmoothed;
      const addRz = THREE.MathUtils.degToRad(tiltDeg.z) * progSmoothed;
      slab.rotation.set(baseRot.x + addRx, baseRot.y + spinSmoothed, baseRot.z + addRz);

      // retreat
      slabGroup.position.set(
        baseGroupPos.x,
        baseGroupPos.y + retreatUpUnits * progSmoothed,
        baseGroupPos.z - retreatBackUnits * progSmoothed
      );
      const sc = THREE.MathUtils.lerp(1, retreatScaleTo, progSmoothed);
      slabGroup.scale.set(baseGroupScale.x * sc, baseGroupScale.y * sc, baseGroupScale.z * sc);

      // lights
      const down = Math.max(0, -s);
      rimStrip.intensity = 0.55 * down;
      leftEdgeRim.intensity = 45.0 + 8.0 * down;
      leftEdgeLine.intensity = 25.0 + 4.0 * down;

      renderer.render(scene, camera);
    };
    loop();

    // Resize
    function getMountSize() {
      const el = mountRef.current;
      if (!el) {
        return { w: window.innerWidth || 1, h: window.innerHeight || 1 };
      }
      const w = el.clientWidth || el.getBoundingClientRect().width || window.innerWidth || 1;
      const h = el.clientHeight || el.getBoundingClientRect().height || window.innerHeight || 1;
      return { w, h };
    }
    const onResize = () => {
      if (!rendererRef.current || !mountRef.current) return;
      const { w, h } = getMountSize();
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      rendererRef.current.setSize(w, h);
    };
    window.addEventListener("resize", onResize, { passive: true });
    window.addEventListener("load", onResize, { once: true });
    const settleId = setTimeout(onResize, 50);
    // Ensure initial correct size immediately
    onResize();

    // Cleanup
    return () => {
      clearTimeout(settleId);
      window.removeEventListener("resize", onResize);
      if (animationIdRef.current) cancelAnimationFrame(animationIdRef.current);
      if (rendererRef.current && mountRef.current) {
        mountRef.current.removeChild(rendererRef.current.domElement);
        rendererRef.current.dispose();
      }
      geometry.dispose();
      topMaterial.dispose();
      sideMaterial.dispose();
      topOverlay.geometry.dispose();
      topOverlay.material.dispose();
    };
  }, [
    stickyWindowVh, overshootPx, spins,
    tiltDeg?.x, tiltDeg?.z, retreatUpUnits, retreatBackUnits, retreatScaleTo,
    stopAtPx, stopAtProgress, overshootWindowProgress, overshootYawDeg, anchorRef,
  ]);

  // Absolute container that overlays its parent section without affecting layout
  return (
    <div
      ref={mountRef}
      className={className}
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 50,
        background: "transparent",
        overflow: "hidden",
        pointerEvents: "none",
      }}
    />
  );
}