import { Sparkles } from 'lucide-react';

export const effectBlocks = [
    {
        id: 'antigravity-hero',
        label: 'Antigravity Hero',
        icon: Sparkles,
        category: 'effects',
        template: {
            element: 'effect',
            id: '',
            class: 'mc-effect mc-antigravity-hero',
            type: 'antigravity-particles',
            settings: {
                particles: {
                    count: 3000,
                    size: 0.06,
                    color: '#4285F4',
                    speed: 1.0,
                    type: 'points'
                },
                camera: {
                    fov: 75,
                    position: [0, 0, 5]
                },
                animation: {
                    followCursor: true,
                    intensity: 1.5,
                    timeScale: 1.2
                },
                layout: {
                    height: '500px',
                    width: '100%'
                }
            },
            content: []
        }
    }
];
