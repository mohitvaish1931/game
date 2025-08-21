import React from 'react';
import { useGameStore } from '../game/state/store';
import { Play, Home, RotateCcw, Settings, Volume2, VolumeX } from 'lucide-react';

const PauseDialog: React.FC = () => {
  const { resumeGame, resetLevel, resetGame } = useGameStore();
  const [soundEnabled, setSoundEnabled] = React.useState(true);

  const handleResume = () => {
    resumeGame();
  };

  const handleRestart = () => {
    resetLevel();
    resumeGame();
  };

  const handleMainMenu = () => {
    resetGame();
  };

  const toggleSound = () => {
    setSoundEnabled(!soundEnabled);
    // TODO: Implement sound toggle in game
  };

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
      <div className="bg-gray-800 rounded-lg p-8 max-w-md w-full mx-4 border border-gray-600">
        <h2 className="text-2xl font-bold text-white text-center mb-6">Game Paused</h2>
        
        <div className="space-y-4">
          {/* Resume Button */}
          <button
            onClick={handleResume}
            className="w-full flex items-center justify-center space-x-3 bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-lg transition-colors"
          >
            <Play className="w-5 h-5" />
            <span className="font-semibold">Resume Game</span>
          </button>

          {/* Restart Level */}
          <button
            onClick={handleRestart}
            className="w-full flex items-center justify-center space-x-3 bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg transition-colors"
          >
            <RotateCcw className="w-5 h-5" />
            <span className="font-semibold">Restart Level</span>
          </button>

          {/* Sound Toggle */}
          <button
            onClick={toggleSound}
            className="w-full flex items-center justify-center space-x-3 bg-purple-600 hover:bg-purple-700 text-white py-3 px-4 rounded-lg transition-colors"
          >
            {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
            <span className="font-semibold">
              {soundEnabled ? 'Mute Sound' : 'Enable Sound'}
            </span>
          </button>

          {/* Settings */}
          <button className="w-full flex items-center justify-center space-x-3 bg-gray-600 hover:bg-gray-700 text-white py-3 px-4 rounded-lg transition-colors">
            <Settings className="w-5 h-5" />
            <span className="font-semibold">Settings</span>
          </button>

          {/* Main Menu */}
          <button
            onClick={handleMainMenu}
            className="w-full flex items-center justify-center space-x-3 bg-red-600 hover:bg-red-700 text-white py-3 px-4 rounded-lg transition-colors"
          >
            <Home className="w-5 h-5" />
            <span className="font-semibold">Main Menu</span>
          </button>
        </div>

        <div className="mt-6 text-center text-gray-400 text-sm">
          <p>Press ESC to resume</p>
        </div>
      </div>
    </div>
  );
};

export default PauseDialog;