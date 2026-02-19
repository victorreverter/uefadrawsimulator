import { motion } from 'framer-motion';
import type { Team } from '../types';

interface PotDisplayProps {
    pot: 1 | 2 | 3 | 4;
    teams: Team[];
}

const potColors = {
    1: 'pot-gradient-1',
    2: 'pot-gradient-2',
    3: 'pot-gradient-3',
    4: 'pot-gradient-4',
};

const potNames = {
    1: 'Pot 1',
    2: 'Pot 2',
    3: 'Pot 3',
    4: 'Pot 4',
};

export const PotDisplay: React.FC<PotDisplayProps> = ({ pot, teams }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: pot * 0.1 }}
            className="glass-card p-6"
        >
            <div className={`${potColors[pot]} text-white font-bold text-xl px-4 py-2 rounded-lg mb-4 text-center shadow-lg`}>
                {potNames[pot]}
            </div>
            <div className="space-y-2">
                {teams.map((team, index) => (
                    <motion.div
                        key={team.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                        className="bg-white/5 hover:bg-white/10 rounded-lg px-4 py-3 transition-all duration-200 cursor-pointer"
                    >
                        <div className="flex items-center gap-3">
                            {team.logo && <img src={team.logo} alt={team.name} className="w-8 h-8 object-contain" />}
                            <div className="text-sm font-medium">
                                {team.name} <span className="text-gray-400">({team.countryCode})</span>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </motion.div>
    );
};
