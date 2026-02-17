import { motion } from 'framer-motion';
import type { TeamDrawResult } from '../types';
import { useState } from 'react';

interface TeamCardProps {
    result: TeamDrawResult;
}

const potColors = {
    1: 'from-yellow-400 to-yellow-600',
    2: 'from-gray-300 to-gray-500',
    3: 'from-orange-400 to-orange-600',
    4: 'from-blue-400 to-blue-600',
};

export const TeamCard: React.FC<TeamCardProps> = ({ result }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const { team, opponents } = result;

    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card p-5 cursor-pointer hover:scale-105 transition-transform duration-200"
            onClick={() => setIsExpanded(!isExpanded)}
        >
            <div className="flex items-center justify-between mb-3">
                <div>
                    <h3 className="font-bold text-lg">
                        {team.name} <span className="text-gray-400 text-sm">({team.countryCode})</span>
                    </h3>
                </div>
                <div className={`px-3 py-1 rounded-full bg-gradient-to-r ${potColors[team.pot]} text-white text-xs font-bold`}>
                    Pot {team.pot}
                </div>
            </div>

            {isExpanded && (
                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-4 space-y-2"
                >
                    <h4 className="font-semibold text-sm text-gray-300 mb-3">Fixtures (8 Matches)</h4>
                    {opponents.map((matchup, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="flex items-center justify-between bg-white/5 rounded-lg px-4 py-2"
                        >
                            <div className="flex items-center gap-3">
                                <span className={`text-xs font-bold px-2 py-1 rounded ${matchup.isHome ? 'bg-green-600' : 'bg-blue-600'}`}>
                                    {matchup.isHome ? 'H' : 'A'}
                                </span>
                                <span className="text-sm">
                                    {matchup.opponent.name} <span className="text-gray-400">({matchup.opponent.countryCode})</span>
                                </span>
                            </div>
                            <div className={`text-xs px-2 py-1 rounded bg-gradient-to-r ${potColors[matchup.opponent.pot]} text-white`}>
                                Pot {matchup.opponent.pot}
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            )}

            {!isExpanded && (
                <div className="text-xs text-gray-400 mt-2">
                    Click to view fixtures
                </div>
            )}
        </motion.div>
    );
};
