"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { RectAreaLightUniformsLib } from "three/examples/jsm/lights/RectAreaLightUniformsLib.js";

export default function MetalSlab({
  sectionHeight = 160,      // total block height (vh)
  stickyWindowVh = 100,     // scroll window for the effect
  overshootPx = 400,        // tiny bit past 100vh (progress only, not layout)
  spins = 1.5,              // cap at 1.5 turns total
  tiltDeg = { x: 10, z: 6 },// tilt kept gentle
  retreatUpUnits = 1.2,     // slide up more
  retreatBackUnits = 1.5,   // push back more
  retreatScaleTo = 0.95,    // shrink a touch more
  overscanPct = 10,
  className = "",
  children,
}) {
  const sectionRef = useRef(null);
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

    const computeProgress = () => {
      if (!sectionRef.current) return 0;
      const rect = sectionRef.current.getBoundingClientRect();
      const vh = window.innerHeight;
      const windowPx = (stickyWindowVh / 100) * vh + overshootPx; // progress only
      const distanceInto = Math.max(0, -rect.top);
      return clamp01(distanceInto / Math.max(1, windowPx));
    };

    // Loop
    const loop = () => {
      animationIdRef.current = requestAnimationFrame(loop);

      const dt = clock.getDelta();
      const t  = clock.elapsedTime;

      const p = computeProgress();
      const pEase = easeInOut(p);

      // Spin: finish at max 1.5 turns; never more
      const maxTurns = 1.5;
      const spinTarget = pEase * Math.min(spins, maxTurns) * TWO_PI;

      // smoothing
      const aSpin = 1 - Math.pow(1 - 0.08, dt * 60);
      const aProg = 1 - Math.pow(1 - 0.15, dt * 60);
      spinSmoothed = THREE.MathUtils.lerp(spinSmoothed, spinTarget, aSpin);
      progSmoothed = THREE.MathUtils.lerp(progSmoothed, pEase, aProg);

      // float
      const s = Math.sin(t * 1.2);
      slab.position.y = 1.0 + s * floatAmp;

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
      return { w: el.clientWidth, h: el.clientHeight };
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
    sectionHeight, stickyWindowVh, overshootPx, spins,
    tiltDeg?.x, tiltDeg?.z, retreatUpUnits, retreatBackUnits, retreatScaleTo
  ]);

  // overscan box to avoid any side seams — clipped by overflow:hidden on mount
  const overscanInset = {
    top: `-${overscanPct}vh`,
    right: `-${overscanPct}vw`,
    bottom: `-${overscanPct}vh`,
    left: `-${overscanPct}vw`,
  };

  return (
    <section
      ref={sectionRef}
      className={`relative w-full ${className}`}
      style={{ height: `${sectionHeight}vh` }}
    >
      {/* Sticky overlay ABOVE content; exact 100vh, won’t push layout */}
      <div className="sticky top-0 w-full h-screen pointer-events-none" style={{ zIndex: 30 }}>
        <div
          ref={mountRef}
          style={{
            position: "absolute",
            top: overscanInset.top,
            right: overscanInset.right,
            bottom: overscanInset.bottom,
            left: overscanInset.left,
            background: "transparent",
            overflow: "hidden", // prevents overscan from creating scrollbars
          }}
        />
      </div>

      {/* Normal-flow content under the slab */}
      <div className="relative z-0">
        {children}
      </div>
    </section>
  );
}