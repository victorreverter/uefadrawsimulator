import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PotDisplay } from './components/PotDisplay';
import { TeamList } from './components/TeamList';
import { DrawAnimation } from './components/DrawAnimation';
import { getTeamsByPot } from './data/teams';
import { simulateDraw, validateDraw } from './utils/drawAlgorithm';
import { FixtureList } from './components/FixtureList';
import { generateFixtures } from './utils/scheduler';
import type { TeamDrawResult, Fixture } from './types';
import './index.css';

type AppState = 'initial' | 'drawing' | 'results';

function App() {
  const [appState, setAppState] = useState<AppState>('initial');
  const [drawResults, setDrawResults] = useState<TeamDrawResult[]>([]);
  const [fixtures, setFixtures] = useState<Fixture[]>([]);
  const [activeTab, setActiveTab] = useState<'teams' | 'fixtures'>('teams');
  const [selectedMatchday, setSelectedMatchday] = useState<number | null>(null);

  const handleStartDraw = () => {
    setAppState('drawing');
  };

  const handleDrawComplete = () => {
    try {
      console.log('Starting draw...');
      const results = simulateDraw();
      console.log('Draw complete, validating...');
      const isValid = validateDraw(results);

      if (!isValid) {
        console.error('Draw validation failed!');
        alert('Draw validation failed. Please try again.');
        setAppState('initial');
        return;
      }

      console.log('Draw completed successfully!');
      setDrawResults(results);

      // Generate fixtures
      const generatedFixtures = generateFixtures(results);
      setFixtures(generatedFixtures);

      setAppState('results');
      setActiveTab('teams');
    } catch (error) {
      console.error('Draw failed:', error);
      alert('Draw failed: ' + (error as Error).message);
      setAppState('initial');
    }
  };

  const handleReset = () => {
    setAppState('initial');
    setDrawResults([]);
    setFixtures([]);
    setSelectedMatchday(null);
  };

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
            UEFA Champions League
          </h1>
          <h2 className="text-3xl md:text-4xl font-semibold text-white mb-2">
            Draw Simulator 2025-2026
          </h2>
          <p className="text-gray-400 text-lg">
            Swiss Model (League Phase) - 36 Teams
          </p>
        </motion.div>

        {/* Initial State: Pot Display */}
        <AnimatePresence mode="wait">
          {appState === 'initial' && (
            <motion.div
              key="initial"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <PotDisplay pot={1} teams={getTeamsByPot(1)} />
                <PotDisplay pot={2} teams={getTeamsByPot(2)} />
                <PotDisplay pot={3} teams={getTeamsByPot(3)} />
                <PotDisplay pot={4} teams={getTeamsByPot(4)} />
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="text-center"
              >
                <button
                  onClick={handleStartDraw}
                  className="btn-primary"
                >
                  🏆 Start Draw
                </button>
                <p className="text-gray-400 text-sm mt-4">
                  Each team will play 8 matches (4 home, 4 away) against 2 teams from each pot
                </p>
              </motion.div>
            </motion.div>
          )}

          {/* Drawing State: Animation */}
          {appState === 'drawing' && (
            <motion.div
              key="drawing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <DrawAnimation onComplete={handleDrawComplete} />
            </motion.div>
          )}

          {/* Results State: Team List */}
          {appState === 'results' && (
            <motion.div
              key="results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="mb-8 text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="inline-block"
                >
                  <div className="glass-card px-8 py-4 inline-block mb-4">
                    <h3 className="text-2xl font-bold text-green-400">
                      ✅ Draw Complete!
                    </h3>
                    <p className="text-gray-400 text-sm mt-1">
                      All 36 teams have been assigned their 8 opponents
                    </p>
                  </div>
                </motion.div>

                <div className="mt-4 flex flex-col items-center gap-4">
                  <div className="flex bg-white/5 rounded-lg p-1 border border-white/10">
                    <button
                      onClick={() => setActiveTab('teams')}
                      className={`px-6 py-2 rounded-md font-semibold transition-all duration-300 ${activeTab === 'teams'
                        ? 'bg-blue-600 text-white shadow-lg'
                        : 'text-gray-400 hover:text-white hover:bg-white/10'
                        }`}
                    >
                      All Teams
                    </button>
                    <button
                      onClick={() => setActiveTab('fixtures')}
                      className={`px-6 py-2 rounded-md font-semibold transition-all duration-300 ${activeTab === 'fixtures'
                        ? 'bg-blue-600 text-white shadow-lg'
                        : 'text-gray-400 hover:text-white hover:bg-white/10'
                        }`}
                    >
                      Match Schedule
                    </button>
                  </div>

                  {activeTab === 'fixtures' && (
                    <div className="flex flex-wrap justify-center gap-2 max-w-2xl px-4 py-2 bg-white/5 rounded-lg border border-white/10 animate-fade-in mt-2">
                      <button
                        onClick={() => setSelectedMatchday(null)}
                        className={`px-3 py-1 rounded text-sm font-medium transition-colors ${selectedMatchday === null ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white hover:bg-white/10'
                          }`}
                      >
                        All
                      </button>
                      {[1, 2, 3, 4, 5, 6, 7, 8].map(day => (
                        <button
                          key={day}
                          onClick={() => setSelectedMatchday(day)}
                          className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all ${selectedMatchday === day
                              ? 'bg-blue-600 text-white shadow-lg scale-110'
                              : 'text-gray-400 hover:text-white hover:bg-white/10'
                            }`}
                        >
                          {day}
                        </button>
                      ))}
                    </div>
                  )}

                  <button
                    onClick={handleReset}
                    className="px-6 py-3 bg-white/10 hover:bg-white/20 rounded-lg font-semibold transition-all duration-300 text-sm"
                  >
                    🔄 New Draw
                  </button>
                </div>
              </div>

              {activeTab === 'teams' ? (
                <TeamList results={drawResults} />
              ) : (
                <FixtureList fixtures={fixtures} selectedMatchday={selectedMatchday} />
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-center mt-16 text-gray-500 text-sm"
        >
          <p>UEFA Champions League Draw Simulator - Swiss Model Format</p>
          <p className="mt-1">Built with React, TypeScript, Tailwind CSS & Framer Motion</p>
        </motion.div>
      </div>
    </div>
  );
}

export default App;
