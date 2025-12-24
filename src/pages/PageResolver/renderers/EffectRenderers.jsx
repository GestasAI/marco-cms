import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

/**
 * Renderizador de efectos Three.js para el frontend (PageResolver)
 * Sincronizado con el motor modular del editor para fidelidad total.
 */
export const renderEffectElement = ({ element, index }) => {
    const containerRef = useRef(null);
    const sceneRef = useRef(null);
    const rendererRef = useRef(null);
    const pointsRef = useRef(null);
    const clockRef = useRef(new THREE.Clock());
    const requestRef = useRef();

    const liveSettings = useRef({
        intensity: 1.5,
        timeScale: 1.2,
        mode: 'follow',
        mouse: { x: 0, y: 0 }
    });

    const settings = element.settings || {};
    const particleSettings = settings.particles || { count: 3000, size: 0.06, color: '#4285F4', shape: 'points' };
    const animationSettings = settings.animation || { mode: 'follow', intensity: 1.5, timeScale: 1.2 };

    useEffect(() => {
        liveSettings.current.intensity = animationSettings.intensity ?? 1.5;
        liveSettings.current.timeScale = animationSettings.timeScale ?? 1.2;
        liveSettings.current.mode = animationSettings.mode || 'follow';
    }, [animationSettings.intensity, animationSettings.timeScale, animationSettings.mode]);

    useEffect(() => {
        if (!containerRef.current) return;

        const scene = new THREE.Scene();
        sceneRef.current = scene;

        const camera = new THREE.PerspectiveCamera(
            settings.camera?.fov || 75,
            containerRef.current.clientWidth / containerRef.current.clientHeight || 1.6,
            0.1,
            1000
        );
        camera.position.set(...(settings.camera?.position || [0, 0, 5]));

        const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        const width = containerRef.current.clientWidth || 800;
        const height = containerRef.current.clientHeight || parseInt(settings.layout?.height) || 500;
        renderer.setSize(width, height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.domElement.style.position = 'absolute';
        renderer.domElement.style.top = '0';
        renderer.domElement.style.left = '0';
        renderer.domElement.style.zIndex = '1';
        containerRef.current.appendChild(renderer.domElement);
        rendererRef.current = renderer;

        const count = particleSettings.count || 3000;
        const shape = particleSettings.shape || 'points';

        let geometry;
        let material;
        let mesh;

        if (shape === 'points' || shape === 'lines' || shape === 'bubbles') {
            geometry = new THREE.BufferGeometry();
            const pos = new Float32Array(count * 3);
            const initialPos = new Float32Array(count * 3);
            for (let i = 0; i < count * 3; i++) {
                const val = (Math.random() - 0.5) * 10;
                pos[i] = initialPos[i] = val;
            }
            geometry.setAttribute('position', new THREE.BufferAttribute(pos, 3));

            if (shape === 'lines') {
                material = new THREE.LineBasicMaterial({ color: particleSettings.color || '#4285F4', transparent: true, opacity: 0.6 });
                mesh = new THREE.LineSegments(geometry, material);
            } else {
                material = new THREE.PointsMaterial({
                    size: particleSettings.size || 0.06,
                    color: particleSettings.color || '#4285F4',
                    transparent: true,
                    opacity: shape === 'bubbles' ? 0.4 : 0.8,
                    blending: THREE.AdditiveBlending,
                    sizeAttenuation: true
                });
                mesh = new THREE.Points(geometry, material);
            }
        } else if (shape === 'spheres' || shape === 'cubes') {
            const baseGeom = shape === 'spheres'
                ? new THREE.SphereGeometry(particleSettings.size || 0.06, 8, 8)
                : new THREE.BoxGeometry(particleSettings.size || 0.06, particleSettings.size || 0.06, particleSettings.size || 0.06);

            material = new THREE.MeshPhongMaterial({ color: particleSettings.color || '#4285F4', transparent: true, opacity: 0.8 });
            mesh = new THREE.InstancedMesh(baseGeom, material, count);

            const matrix = new THREE.Matrix4();
            const initialPos = new Float32Array(count * 3);
            for (let i = 0; i < count; i++) {
                const x = (Math.random() - 0.5) * 10;
                const y = (Math.random() - 0.5) * 10;
                const z = (Math.random() - 0.5) * 10;
                initialPos[i * 3] = x;
                initialPos[i * 3 + 1] = y;
                initialPos[i * 3 + 2] = z;
                matrix.setPosition(x, y, z);
                mesh.setMatrixAt(i, matrix);
            }
            mesh.userData.initialPos = initialPos;

            const light = new THREE.DirectionalLight(0xffffff, 1);
            light.position.set(1, 1, 2);
            scene.add(light);
            scene.add(new THREE.AmbientLight(0x404040));
        }

        scene.add(mesh);
        pointsRef.current = mesh;

        const animate = () => {
            const elapsedTime = clockRef.current.getElapsedTime();
            const { intensity, timeScale, mode, mouse } = liveSettings.current;

            if (pointsRef.current) {
                const initialPos = pointsRef.current.userData.initialPos || pointsRef.current.geometry.attributes.position.array;

                if (shape === 'points' || shape === 'lines' || shape === 'bubbles') {
                    const posAttr = pointsRef.current.geometry.attributes.position;
                    const array = posAttr.array;

                    for (let i = 0; i < count; i++) {
                        const i3 = i * 3;
                        if (mode === 'rain') {
                            array[i3 + 1] -= 0.02 * timeScale;
                            if (array[i3 + 1] < -5) array[i3 + 1] = 5;
                        } else if (mode === 'direction') {
                            array[i3] += 0.01 * timeScale;
                            if (array[i3] > 5) array[i3] = -5;
                        } else {
                            array[i3 + 1] = initialPos[i3 + 1] + Math.sin(elapsedTime * timeScale + initialPos[i3]) * 0.2;
                            array[i3] = initialPos[i3] + Math.cos(elapsedTime * timeScale * 0.5 + initialPos[i3 + 2]) * 0.1;
                        }

                        if (mode === 'follow' || mode === 'avoid') {
                            const dx = array[i3] - mouse.x * 5;
                            const dy = array[i3 + 1] - mouse.y * 5;
                            const dist = Math.sqrt(dx * dx + dy * dy);
                            if (dist < 2) {
                                const force = (2 - dist) / 2;
                                const factor = mode === 'follow' ? 1 : -1;
                                array[i3] += dx * force * 0.05 * intensity * factor;
                                array[i3 + 1] += dy * force * 0.05 * intensity * factor;
                            }
                        }
                    }
                    posAttr.needsUpdate = true;
                } else {
                    const matrix = new THREE.Matrix4();
                    for (let i = 0; i < count; i++) {
                        const i3 = i * 3;
                        let x = initialPos[i3];
                        let y = initialPos[i3 + 1];
                        let z = initialPos[i3 + 2];

                        if (mode === 'rain') {
                            y = (y - elapsedTime * 0.5 * timeScale) % 10;
                            if (y < -5) y += 10;
                        } else {
                            y += Math.sin(elapsedTime * timeScale + x) * 0.2;
                            x += Math.cos(elapsedTime * timeScale * 0.5 + z) * 0.1;
                        }

                        if (mode === 'follow' || mode === 'avoid') {
                            const dx = x - mouse.x * 5;
                            const dy = y - mouse.y * 5;
                            const dist = Math.sqrt(dx * dx + dy * dy);
                            if (dist < 2) {
                                const force = (2 - dist) / 2;
                                const factor = mode === 'follow' ? 1 : -1;
                                x += dx * force * 0.05 * intensity * factor;
                                y += dy * force * 0.05 * intensity * factor;
                            }
                        }

                        matrix.setPosition(x, y, z);
                        pointsRef.current.setMatrixAt(i, matrix);
                    }
                    pointsRef.current.instanceMatrix.needsUpdate = true;
                }
            }

            renderer.render(scene, camera);
            requestRef.current = requestAnimationFrame(animate);
        };
        animate();

        const handleMouseMove = (event) => {
            if (!containerRef.current) return;
            const rect = containerRef.current.getBoundingClientRect();
            liveSettings.current.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
            liveSettings.current.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
        };
        window.addEventListener('mousemove', handleMouseMove);

        const resizeObserver = new ResizeObserver(() => {
            if (!containerRef.current || !rendererRef.current) return;
            const w = containerRef.current.clientWidth;
            const h = containerRef.current.clientHeight;
            if (w > 0 && h > 0) {
                camera.aspect = w / h;
                camera.updateProjectionMatrix();
                rendererRef.current.setSize(w, h);
            }
        });
        resizeObserver.observe(containerRef.current);

        return () => {
            cancelAnimationFrame(requestRef.current);
            window.removeEventListener('mousemove', handleMouseMove);
            resizeObserver.disconnect();
            if (containerRef.current && renderer.domElement && containerRef.current.contains(renderer.domElement)) {
                containerRef.current.removeChild(renderer.domElement);
            }
            if (geometry) geometry.dispose();
            if (material) material.dispose();
        };
    }, [
        element.id,
        particleSettings.count,
        particleSettings.size,
        particleSettings.color,
        particleSettings.shape,
        settings.camera?.fov,
        settings.layout?.height
    ]);

    return (
        <div
            key={element.id || index}
            ref={containerRef}
            className={`mc-effect-container ${element.class || ''}`}
            style={{
                width: settings.layout?.width || '100%',
                height: settings.layout?.height || '500px',
                position: 'relative',
                overflow: 'hidden',
                background: settings.layout?.background || '#000'
            }}
        />
    );
};
