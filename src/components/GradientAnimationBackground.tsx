import React, { useEffect } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import type { Tournament } from '../types';

interface BackgroundProps {
    children: React.ReactNode;
    tournament?: Tournament;
}

export const GradientAnimationBackground: React.FC<BackgroundProps> = ({ children, tournament }) => {
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const springConfig = { damping: 20, stiffness: 100, mass: 0.5 };
    const smoothMouseX = useSpring(mouseX, springConfig);
    const smoothMouseY = useSpring(mouseY, springConfig);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            // Move orb towards mouse position, relative to screen center
            const x = e.clientX - window.innerWidth / 2;
            const y = e.clientY - window.innerHeight / 2;
            // We apply a fraction so it softly follows the mouse
            mouseX.set(x * 0.15);
            mouseY.set(y * 0.15);
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, [mouseX, mouseY]);

    // Define color palettes based on the selected tournament
    const getColors = () => {
        switch (tournament) {
            case 'champions':
                // Classic deep blues, purples, and pinks
                return {
                    orb1: 'bg-indigo-600/40',
                    orb2: 'bg-blue-600/30',
                    orb3: 'bg-purple-600/30',
                    orb4: 'bg-pink-500/40',
                };
            case 'europa':
                // Warm oranges, reds, and yellows
                return {
                    orb1: 'bg-orange-600/40',
                    orb2: 'bg-red-600/30',
                    orb3: 'bg-yellow-600/30',
                    orb4: 'bg-rose-500/40',
                };
            case 'conference':
                // Vibrant greens, teals, and cyans
                return {
                    orb1: 'bg-emerald-600/40',
                    orb2: 'bg-teal-600/30',
                    orb3: 'bg-cyan-600/30',
                    orb4: 'bg-green-500/40',
                };
            default:
                // Universal / Home palette
                return {
                    orb1: 'bg-purple-600/40',
                    orb2: 'bg-blue-600/30',
                    orb3: 'bg-pink-600/30',
                    orb4: 'bg-indigo-500/40',
                };
        }
    };

    const colors = getColors();

    return (
        <div className="relative min-h-screen w-full overflow-hidden bg-[#030712] font-sans selection:bg-white/10 transition-colors duration-1000">
            {/* Background Gradient Mesh Orbs */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {/* Orb 1 */}
                <motion.div
                    animate={{
                        x: ['0%', '20%', '0%', '-20%', '0%'],
                        y: ['0%', '-20%', '20%', '10%', '0%'],
                        scale: [1, 1.2, 0.8, 1.1, 1],
                    }}
                    transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                    className={`absolute -top-[10%] -left-[10%] w-[50vw] h-[50vw] max-w-[600px] max-h-[600px] rounded-full mix-blend-screen blur-[100px] transition-colors duration-1000 ${colors.orb1}`}
                />

                {/* Orb 2 */}
                <motion.div
                    animate={{
                        x: ['0%', '-30%', '10%', '-10%', '0%'],
                        y: ['0%', '10%', '-30%', '20%', '0%'],
                        scale: [1, 1.3, 0.9, 1.2, 1],
                    }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className={`absolute top-[20%] -right-[10%] w-[60vw] h-[60vw] max-w-[800px] max-h-[800px] rounded-full mix-blend-screen blur-[120px] transition-colors duration-1000 ${colors.orb2}`}
                />

                {/* Orb 3 */}
                <motion.div
                    animate={{
                        x: ['0%', '20%', '-20%', '10%', '0%'],
                        y: ['0%', '20%', '-10%', '-20%', '0%'],
                        scale: [1, 1.5, 0.8, 1.3, 1],
                    }}
                    transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
                    className={`absolute -bottom-[10%] left-[20%] w-[55vw] h-[55vw] max-w-[700px] max-h-[700px] rounded-full mix-blend-screen blur-[100px] transition-colors duration-1000 ${colors.orb3}`}
                />

                {/* Orb 4: Interactive Mouse Follower */}
                <motion.div
                    className={`absolute top-1/2 left-1/2 w-[40vw] h-[40vw] max-w-[500px] max-h-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full mix-blend-screen blur-[90px] transition-colors duration-200 ${colors.orb4}`}
                    style={{
                        x: smoothMouseX,
                        y: smoothMouseY,
                    }}
                />
            </div>

            {/* Grid Overlay for texture */}
            <div
                className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCI+PHBhdGggZD0iTTAgMGg0MHY0MEgweiIgZmlsbD0ibm9uZSIvPjxwYXRoIGQ9Ik0wIDEwaDQwTTEwIDB2NDAiIHN0cm9rZT0icmdiYSgyNTUsIDI1NSwgMjU1LCAwLjA1KSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9zdmc+')] 
        [mask-image:radial-gradient(ellipse_at_center,white,transparent_80%)] 
        opacity-30 pointer-events-none"
            />

            {/* Noise Overlay */}
            <div
                className="absolute inset-0 opacity-[0.04] pointer-events-none mix-blend-overlay"
                style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}
            />

            {/* Content wrapper */}
            <div className="relative z-10 w-full">
                {children}
            </div>
        </div>
    );
};
