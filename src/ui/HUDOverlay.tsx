import React from 'react';
import { useGameStore } from '../game/state/store';
import { Coins, Star, Trophy, Brain, Target, Settings } from 'lucide-react';

const HUDOverlay: React.FC = () => {
  const {
    totalCoins,
    score,
    levelIndex,
    correctThisLevel,
    subject,
    mode,
    attempts,
    currentQuestionId
  } = useGameStore();

  return (
    <div className="absolute top-0 left-0 right-0 z-10 pointer-events-none">
      {/* Top HUD Bar */}
      <div className="bg-black bg-opacity-70 text-white p-4 flex justify-between items-center">
        {/* Left Side - Resources */}
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2">
            <Coins className="w-5 h-5 text-yellow-400" />
            <span className="font-bold text-yellow-400">{totalCoins}</span>
          </div>
          
          <div className="flex items-center space-x-2">
            <Star className="w-5 h-5 text-blue-400" />
            <span className="font-bold text-white">{score}</span>
          </div>
          
          <div className="flex items-center space-x-2">
            <Trophy className="w-5 h-5 text-green-400" />
            <span className="font-bold text-green-400">Level {levelIndex + 1}</span>
          </div>
        </div>

        {/* Center - Progress */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Target className="w-4 h-4 text-white" />
            <span className="text-sm">Progress: {correctThisLevel}/5</span>
          </div>
          
          <div className="flex items-center space-x-2">
            <Brain className="w-4 h-4 text-blue-400" />
            <span className="text-sm font-semibold text-blue-400">{subject}</span>
          </div>
          
          <div className="px-2 py-1 bg-green-600 rounded text-xs font-semibold">
            {mode === 'knowledge' ? 'Knowledge' : 'Reward'} Mode
          </div>
        </div>

        {/* Right Side - Settings */}
        <div className="flex items-center space-x-2">
          {currentQuestionId && (
            <div className="flex items-center space-x-2 bg-red-600 px-2 py-1 rounded">
              <span className="text-xs font-bold">Attempts: {attempts}/3</span>
            </div>
          )}
          
          <button className="p-2 hover:bg-gray-700 rounded pointer-events-auto">
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-black bg-opacity-50 px-4 py-2">
        <div className="w-full bg-gray-700 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(correctThisLevel / 5) * 100}%` }}
          />
        </div>
        <div className="text-xs text-gray-300 mt-1 text-center">
          {correctThisLevel === 5 ? 'Level Complete!' : `${5 - correctThisLevel} treasures remaining`}
        </div>
      </div>
    </div>
  );
};

export default HUDOverlay;