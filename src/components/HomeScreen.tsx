import React from 'react';
import { motion } from 'framer-motion';
import type { Tournament, TournamentConfig } from '../types';

const tournaments: TournamentConfig[] = [
    {
        id: 'champions',
        name: 'UEFA Champions League',
        shortName: 'Champions League',
        logo: '/uefadrawsimulator/champions_league.svg',
        accentColor: '#3B82F6',
        tagline: '36 teams · 4 pots · 8 matches each',
    },
    {
        id: 'europa',
        name: 'UEFA Europa League',
        shortName: 'Europa League',
        logo: '/uefadrawsimulator/europe_league.svg',
        accentColor: '#F97316',
        tagline: '36 teams · 4 pots · 8 matches each',
    },
    {
        id: 'conference',
        name: 'UEFA Conference League',
        shortName: 'Conference League',
        logo: '/uefadrawsimulator/conference_league.svg',
        accentColor: '#10B981',
        tagline: '36 teams · 4 pots · 8 matches each',
    },
];

interface HomeScreenProps {
    onSelect: (tournament: Tournament) => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ onSelect }) => {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-8">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-center mb-14"
            >
                <div className="flex items-center justify-center gap-4 mb-4">
                    <img
                        src="/uefadrawsimulator/uefa.svg"
                        alt="UEFA"
                        className="w-16 h-16 object-contain opacity-80"
                    />
                </div>
                <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-white mb-3">
                    Draw Simulator
                </h1>
                <p className="text-gray-400 text-lg">
                    Select a competition to simulate the Swiss model draw
                </p>
            </motion.div>

            {/* Tournament Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl">
                {tournaments.map((tournament, index) => (
                    <motion.div
                        key={tournament.id}
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.12 }}
                        whileHover={{ scale: 1.04, y: -6 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => onSelect(tournament.id)}
                        className="glass-card p-8 cursor-pointer group relative overflow-hidden flex flex-col items-center text-center"
                        style={{ '--accent': tournament.accentColor } as React.CSSProperties}
                    >
                        {/* Glow background */}
                        <div
                            className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-500 rounded-2xl blur-2xl"
                            style={{ background: tournament.accentColor }}
                        />

                        {/* Top accent bar */}
                        <div
                            className="absolute top-0 left-0 right-0 h-1 rounded-t-2xl transition-all duration-300"
                            style={{ background: `linear-gradient(90deg, transparent, ${tournament.accentColor}, transparent)` }}
                        />

                        {/* Logo */}
                        <motion.div
                            className="relative mb-6"
                            whileHover={{ rotate: [0, -5, 5, 0] }}
                            transition={{ duration: 0.4 }}
                        >
                            <div
                                className="w-28 h-28 rounded-full flex items-center justify-center mb-1"
                                style={{ background: `radial-gradient(circle, ${tournament.accentColor}22, transparent 70%)` }}
                            >
                                <img
                                    src={tournament.logo}
                                    alt={tournament.name}
                                    className="w-20 h-20 object-contain drop-shadow-xl"
                                />
                            </div>
                        </motion.div>

                        {/* Text */}
                        <h2 className="text-xl font-bold text-white mb-2 leading-tight">
                            {tournament.name}
                        </h2>
                        <p className="text-sm text-gray-400 mb-8">
                            {tournament.tagline}
                        </p>

                        {/* CTA Button */}
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="mt-auto px-7 py-2.5 rounded-full text-sm font-semibold text-white transition-all duration-300 shadow-lg"
                            style={{
                                background: `linear-gradient(135deg, ${tournament.accentColor}cc, ${tournament.accentColor}88)`,
                                boxShadow: `0 0 20px ${tournament.accentColor}44`,
                            }}
                        >
                            Simulate Draw →
                        </motion.button>
                    </motion.div>
                ))}
            </div>

            {/* Footer note */}
            <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="text-gray-600 text-sm mt-14"
            >
                UEFA Draw Simulator · Swiss Model Format · 2025–2026
            </motion.p>
        </div>
    );
};
