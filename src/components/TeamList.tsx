import { motion, AnimatePresence } from 'framer-motion';
import type { TeamDrawResult } from '../types';
import { useState } from 'react';
import { TeamCard } from './TeamCard';

interface TeamListProps {
    results: TeamDrawResult[];
}

export const TeamList: React.FC<TeamListProps> = ({ results }) => {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredResults = results.filter(result =>
        result.team.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        result.team.countryCode.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="w-full">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6"
            >
                <input
                    type="text"
                    placeholder="Search teams..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-6 py-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                />
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <AnimatePresence>
                    {filteredResults.map((result, index) => (
                        <motion.div
                            key={result.team.id}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            transition={{ delay: index * 0.02 }}
                        >
                            <TeamCard result={result} />
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {filteredResults.length === 0 && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center text-gray-400 mt-10"
                >
                    No teams found matching "{searchTerm}"
                </motion.div>
            )}
        </div>
    );
};
