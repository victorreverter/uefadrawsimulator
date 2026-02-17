import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PotDisplay } from './components/PotDisplay';
import { TeamList } from './components/TeamList';
import { DrawAnimation } from './components/DrawAnimation';
import { getTeamsByPot } from './data/teams';
import { simulateDraw, validateDraw } from './utils/drawAlgorithm';
import type { TeamDrawResult } from './types';
import './index.css';

type AppState = 'initial' | 'drawing' | 'results';

function App() {
  const [appState, setAppState] = useState<AppState>('initial');
  const [drawResults, setDrawResults] = useState<TeamDrawResult[]>([]);

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
      setAppState('results');
    } catch (error) {
      console.error('Draw failed:', error);
      alert('Draw failed: ' + (error as Error).message);
      setAppState('initial');
    }
  };

  const handleReset = () => {
    setAppState('initial');
    setDrawResults([]);
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

                <div className="mt-4">
                  <button
                    onClick={handleReset}
                    className="px-6 py-3 bg-white/10 hover:bg-white/20 rounded-lg font-semibold transition-all duration-300"
                  >
                    🔄 New Draw
                  </button>
                </div>
              </div>

              <TeamList results={drawResults} />
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
