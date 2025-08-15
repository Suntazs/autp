"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { RectAreaLightUniformsLib } from "three/examples/jsm/lights/RectAreaLightUniformsLib.js";

export default function MetalSlab({
  spins = 0.7,
  tiltDeg = { x: 16, z: 10 },
  retreatUpUnits = 1.2,
  retreatBackUnits = 1.5,
  retreatScaleTo = 0.95,
  followDistance = 800,
  anchorRef = null,
}) {
  const mountRef = useRef(null);
  const containerRef = useRef(null);
  const [isMounted, setIsMounted] = useState(false);

  // Ensure client-side only rendering
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // 3D Scene Setup - Client-side only
  useEffect(() => {
    if (!isMounted || typeof window === 'undefined' || !mountRef.current || !anchorRef?.current) return;

    // Get hero position once
    const heroEl = anchorRef.current;
    const heroRect = heroEl.getBoundingClientRect();
    const heroTop = window.scrollY + heroRect.top;
    const finishScrollY = heroTop + followDistance;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 0.85;

    const canvas = renderer.domElement;
    canvas.style.position = "absolute";
    canvas.style.inset = "0";
    canvas.style.pointerEvents = "none";
    mountRef.current.appendChild(canvas);

    // Scene + Camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.set(0, 0.2, 3.1);

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
    slabGroup.add(slab);
    slab.position.set(-2.3, 1.0, 0);
    slab.rotation.set(THREE.MathUtils.degToRad(50), THREE.MathUtils.degToRad(-50), 0);

    // Lights
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
    slab.add(topOverlay);

    const sideLeft = new THREE.RectAreaLight(0xffa15a, 28.0, 0.04, objSize.y * 2.0);
    sideLeft.position.set(bbox.min.x - 0.08, center.y, center.z + 0.05);
    sideLeft.rotation.set(0, THREE.MathUtils.degToRad(-78), 0);
    scene.add(sideLeft);

    const sideRight = new THREE.RectAreaLight(0xff9966, 3.2, 0.02, objSize.y * 1.6);
    sideRight.position.set(bbox.max.x + 0.05, center.y, center.z);
    sideRight.rotation.set(0, THREE.MathUtils.degToRad(84), 0);
    scene.add(sideRight);

    const topKey = new THREE.RectAreaLight(0xff8a4a, 0.22, objSize.x * 1.35, objSize.z * 1.35);
    topKey.position.set(center.x, bbox.max.y + 0.26, center.z);
    topKey.rotation.set(THREE.MathUtils.degToRad(-90), 0, 0);
    scene.add(topKey);

    // Store initial transforms
    const baseGroupPos = slabGroup.position.clone();
    const baseRot = slab.rotation.clone();
    const clock = new THREE.Clock();

    // Ultra-simple animation loop - everything calculated directly from scroll
    let hasTransitioned = false;
    
    const loop = () => {
      requestAnimationFrame(loop);

      const t = clock.elapsedTime;
      const scrollY = window.scrollY;

      // Calculate progress directly from scroll
      let progress = 0;
      let isVisible = false;
      
      if (scrollY >= heroTop) {
        progress = Math.min((scrollY - heroTop) / followDistance, 1);
        isVisible = true;
        
        // Smooth transition to absolute positioning
        if (progress >= 1) {
          // Only transition once to prevent glitching
          if (!hasTransitioned) {
            containerRef.current.style.position = 'absolute';
            containerRef.current.style.top = `${scrollY}px`; // Use current scroll position
            containerRef.current.style.left = '0px';
            hasTransitioned = true;
          }
        } else {
          // Following viewport
          if (hasTransitioned) hasTransitioned = false; // Reset for next time
          containerRef.current.style.position = 'fixed';
          containerRef.current.style.top = '0px';
          containerRef.current.style.left = '0px';
        }
        containerRef.current.style.opacity = '1';
      } else {
        containerRef.current.style.opacity = '0';
        isVisible = false;
        hasTransitioned = false; // Reset when going back up
      }

      // Always animate - floating should always be visible
      // Enhanced floating animation with much more pronounced movement
      const floatY = Math.sin(t * 1.2) * 0.25; // Much bigger primary float
      const floatBob = Math.sin(t * 0.8) * 0.15; // Bigger secondary bob
      const hoverTiltX = Math.sin(t * 1.5) * 0.08; // More visible tilt X
      const hoverTiltZ = Math.cos(t * 1.1) * 0.06; // More visible tilt Z
      
      // Always apply floating - this should always work
      slab.position.y = 1.0 + floatY + floatBob;

      // Direct rotation - buttery smooth with hover tilting
      const spinAmount = isVisible ? progress * spins * Math.PI * 2 : 0;
      const scrollTiltX = isVisible ? progress * THREE.MathUtils.degToRad(tiltDeg.x) : 0;
      const scrollTiltZ = isVisible ? progress * THREE.MathUtils.degToRad(tiltDeg.z) : 0;
      
      slab.rotation.set(
        baseRot.x + scrollTiltX + hoverTiltX,
        baseRot.y + spinAmount,
        baseRot.z + scrollTiltZ + hoverTiltZ
      );

      if (isVisible) {
        // Group transforms with more pronounced hover movement
        const hoverFloat = Math.sin(t * 0.9) * 0.12; // Much bigger group float
        slabGroup.position.set(
          baseGroupPos.x,
          baseGroupPos.y + retreatUpUnits * progress + hoverFloat,
          baseGroupPos.z - retreatBackUnits * progress
        );
        
        const scale = 1 - ((1 - retreatScaleTo) * progress);
        slabGroup.scale.set(scale, scale, scale);
      } else {
        // Keep group at base position when not visible
        const hoverFloat = Math.sin(t * 0.9) * 0.12; // Still add hover float
        slabGroup.position.set(
          baseGroupPos.x,
          baseGroupPos.y + hoverFloat,
          baseGroupPos.z
        );
        slabGroup.scale.set(1, 1, 1);
      }

      // Always render - even when not visible for debugging
      renderer.render(scene, camera);
    };
    loop();

    // Resize handler
    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", onResize);

    // Cleanup
    return () => {
      window.removeEventListener("resize", onResize);
      if (renderer.domElement.parentNode) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
      geometry.dispose();
      topMaterial.dispose();
      sideMaterial.dispose();
      topOverlay.geometry.dispose();
      topOverlay.material.dispose();
    };
  }, [isMounted, anchorRef, spins, tiltDeg.x, tiltDeg.z, retreatUpUnits, retreatBackUnits, retreatScaleTo, followDistance]);

  // Don't render anything until mounted on client
  if (!isMounted) {
    return null;
  }

  return (
    <div
      ref={containerRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        zIndex: 50,
        opacity: 0,
        pointerEvents: "none",
        overflow: "visible",
      }}
    >
      <div
        ref={mountRef}
        style={{
          width: "100%",
          height: "100%",
          overflow: "visible",
        }}
      />
    </div>
  );
}