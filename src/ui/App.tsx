import React, { useEffect, useRef } from 'react';
import Phaser from 'phaser';
import { phaserConfig } from '../game/config/phaserConfig';
import HUDOverlay from './HUDOverlay';
import PauseDialog from './PauseDialog';
import SettingsPanel from './SettingsPanel';
import { useGameStore } from '../game/state/store';

function App() {
  const gameRef = useRef<Phaser.Game | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const gameStarted = useGameStore(state => state.gameStarted);
  const gamePaused = useGameStore(state => state.gamePaused);

  useEffect(() => {
    if (containerRef.current && !gameRef.current) {
      // Create Phaser game
      gameRef.current = new Phaser.Game({
        ...phaserConfig,
        parent: containerRef.current
      });
    }

    return () => {
      if (gameRef.current) {
        gameRef.current.destroy(true);
        gameRef.current = null;
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center">
      <div className="relative">
        {/* Game Container */}
        <div 
          ref={containerRef} 
          id="phaser-game"
          className="border-2 border-gray-700 rounded-lg overflow-hidden shadow-2xl"
        />
        
        {/* React UI Overlays */}
        {gameStarted && <HUDOverlay />}
        {gamePaused && <PauseDialog />}
        <SettingsPanel />
      </div>
      
      {/* Game Info */}
      <div className="mt-4 text-center text-gray-400 max-w-2xl">
        <h1 className="text-2xl font-bold text-white mb-2">
          Interactive Educational Treasure Hunt
        </h1>
        <p className="text-sm">
          Explore magical worlds, solve educational questions, and discover hidden treasures!
        </p>
        <div className="mt-2 text-xs">
          <span className="inline-block bg-blue-600 text-white px-2 py-1 rounded mr-2">Math</span>
          <span className="inline-block bg-green-600 text-white px-2 py-1 rounded mr-2">Science</span>
          <span className="inline-block bg-purple-600 text-white px-2 py-1 rounded">General Knowledge</span>
        </div>
      </div>
    </div>
  );
}

export default App;