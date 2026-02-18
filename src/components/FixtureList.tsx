import { motion } from 'framer-motion';
import type { Fixture } from '../types';

interface FixtureListProps {
    fixtures: Fixture[];
    selectedMatchday: number | null;
}

export const FixtureList = ({ fixtures, selectedMatchday }: FixtureListProps) => {
    const filteredFixtures = selectedMatchday
        ? fixtures.filter(f => f.matchday === selectedMatchday)
        : fixtures;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="w-full max-w-7xl mx-auto"
        >
            <div className={`grid gap-6 ${selectedMatchday ? 'grid-cols-1 max-w-2xl mx-auto' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-2'}`}>
                {filteredFixtures.map((fixture) => (
                    <div key={fixture.matchday} className="glass-card p-6 flex flex-col h-full">
                        <div className="border-b border-white/10 pb-4 mb-4">
                            <h3 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                                Matchday {fixture.matchday}
                            </h3>
                            <p className="text-gray-400 text-xs mt-1">
                                {fixture.matches.length} Matches
                            </p>
                        </div>

                        <div className="flex-1 overflow-y-auto max-h-[1030px] space-y-3 custom-scrollbar pr-2">
                            {fixture.matches.map((match) => (
                                <div
                                    key={match.id}
                                    className="flex items-center justify-between bg-white/5 p-3 rounded-lg hover:bg-white/10 transition-colors border border-white/5"
                                >
                                    {/* Home Team */}
                                    <div className="flex items-center gap-2 flex-1 min-w-0">
                                        <span className={`w-2 h-2 rounded-full ${getPotColor(match.homeTeam.pot)}`}></span>
                                        <span className="text-sm font-semibold text-white truncate" title={match.homeTeam.name}>
                                            {match.homeTeam.name}
                                        </span>
                                        <span className="text-xs text-gray-400 font-mono hidden sm:inline">({match.homeTeam.countryCode})</span>
                                    </div>

                                    <div className="px-2 text-gray-500 text-xs font-bold">vs</div>

                                    {/* Away Team */}
                                    <div className="flex items-center gap-2 flex-1 justify-end min-w-0">
                                        <span className="text-xs text-gray-400 font-mono hidden sm:inline">({match.awayTeam.countryCode})</span>
                                        <span className="text-sm font-semibold text-white truncate text-right" title={match.awayTeam.name}>
                                            {match.awayTeam.name}
                                        </span>
                                        <span className={`w-2 h-2 rounded-full ${getPotColor(match.awayTeam.pot)}`}></span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </motion.div>
    );
};

// Helper for pot colors dot
const getPotColor = (pot: number) => {
    switch (pot) {
        case 1: return 'bg-yellow-400 shadow-[0_0_8px_rgba(250,204,21,0.6)]';
        case 2: return 'bg-slate-300 shadow-[0_0_8px_rgba(203,213,225,0.6)]';
        case 3: return 'bg-amber-600 shadow-[0_0_8px_rgba(217,119,6,0.6)]';
        case 4: return 'bg-blue-400 shadow-[0_0_8px_rgba(96,165,250,0.6)]';
        default: return 'bg-gray-400';
    }
};
