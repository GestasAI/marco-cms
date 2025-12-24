import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

/**
 * Renderizador de efectos Three.js para el editor (FSE)
 * Diseño Atómico y Modular: Separa la inicialización de la actualización en tiempo real.
 */
export const EffectRenderer = ({ element }) => {
    const containerRef = useRef(null);
    const sceneRef = useRef(null);
    const rendererRef = useRef(null);
    const pointsRef = useRef(null);
    const clockRef = useRef(new THREE.Clock());
    const requestRef = useRef();

    const liveSettings = useRef({
        intensity: 1.0,
        timeScale: 1.0,
        followCursor: true,
        mouse: { x: 0, y: 0 }
    });

    const settings = element.settings || {};
    const particleSettings = settings.particles || { count: 3000, size: 0.06, color: '#4285F4' };
    const animationSettings = settings.animation || { followCursor: true, intensity: 1.5, timeScale: 1.2 };

    useEffect(() => {
        liveSettings.current.intensity = animationSettings.intensity ?? 1.5;
        liveSettings.current.timeScale = animationSettings.timeScale ?? 1.2;
        liveSettings.current.followCursor = animationSettings.followCursor !== false;
    }, [animationSettings.intensity, animationSettings.timeScale, animationSettings.followCursor]);

    useEffect(() => {
        if (!containerRef.current) return;

        // 1. Limpieza total previa
        if (rendererRef.current) {
            cancelAnimationFrame(requestRef.current);
            if (containerRef.current.contains(rendererRef.current.domElement)) {
                containerRef.current.removeChild(rendererRef.current.domElement);
            }
            rendererRef.current.dispose();
        }

        // 2. Setup Escena
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

        // Robustez: Asegurar dimensiones mínimas si el contenedor aún no se ha renderizado
        const width = containerRef.current.clientWidth || 800;
        const height = containerRef.current.clientHeight || parseInt(settings.layout?.height) || 500;

        renderer.setSize(width, height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        // Estilo explícito para asegurar visibilidad
        renderer.domElement.style.position = 'absolute';
        renderer.domElement.style.top = '0';
        renderer.domElement.style.left = '0';
        renderer.domElement.style.zIndex = '1';

        containerRef.current.appendChild(renderer.domElement);
        rendererRef.current = renderer;

        // 3. Crear Partículas
        const count = particleSettings.count || 3000;
        const geometry = new THREE.BufferGeometry();
        const pos = new Float32Array(count * 3);
        const initialPos = new Float32Array(count * 3);

        for (let i = 0; i < count * 3; i++) {
            const val = (Math.random() - 0.5) * 10;
            pos[i] = initialPos[i] = val;
        }

        geometry.setAttribute('position', new THREE.BufferAttribute(pos, 3));

        const material = new THREE.PointsMaterial({
            size: particleSettings.size || 0.06,
            color: particleSettings.color || '#4285F4',
            transparent: true,
            opacity: 0.8,
            blending: THREE.AdditiveBlending,
            sizeAttenuation: true
        });

        const points = new THREE.Points(geometry, material);
        scene.add(points);
        pointsRef.current = points;

        // 4. Loop de Animación
        const animate = () => {
            const elapsedTime = clockRef.current.getElapsedTime();
            const { intensity, timeScale, followCursor, mouse } = liveSettings.current;

            if (pointsRef.current) {
                const posAttr = pointsRef.current.geometry.attributes.position;
                const array = posAttr.array;

                for (let i = 0; i < count; i++) {
                    const i3 = i * 3;
                    array[i3 + 1] = initialPos[i3 + 1] + Math.sin(elapsedTime * timeScale + initialPos[i3]) * 0.2;
                    array[i3] = initialPos[i3] + Math.cos(elapsedTime * timeScale * 0.5 + initialPos[i3 + 2]) * 0.1;

                    if (followCursor) {
                        const dx = array[i3] - mouse.x * 5;
                        const dy = array[i3 + 1] - mouse.y * 5;
                        const dist = Math.sqrt(dx * dx + dy * dy);
                        if (dist < 2) {
                            const force = (2 - dist) / 2;
                            array[i3] += dx * force * 0.05 * intensity;
                            array[i3 + 1] += dy * force * 0.05 * intensity;
                        }
                    }
                }
                posAttr.needsUpdate = true;
            }

            renderer.render(scene, camera);
            requestRef.current = requestAnimationFrame(animate);
        };
        animate();

        // 5. Eventos
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
            geometry.dispose();
            material.dispose();
        };
    }, [
        element.id,
        particleSettings.count,
        particleSettings.size,
        particleSettings.color,
        settings.camera?.fov,
        settings.layout?.height
    ]);

    return (
        <div
            ref={containerRef}
            className="mc-effect-container"
            style={{
                width: '100%',
                height: settings.layout?.height || '500px',
                background: '#000',
                position: 'relative',
                overflow: 'hidden'
            }}
        >
            <div className="mc-content-layer">
                {/* Contenido overlay */}
            </div>
        </div>
    );
};
