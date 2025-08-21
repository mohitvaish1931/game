import React, { useState } from 'react';
import { Settings, X, Volume2, VolumeX, Monitor, Smartphone } from 'lucide-react';

const SettingsPanel: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [musicVolume, setMusicVolume] = useState(60);
  const [sfxVolume, setSfxVolume] = useState(80);
  const [showMobileControls, setShowMobileControls] = useState(false);

  const togglePanel = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Settings Button */}
      <button
        onClick={togglePanel}
        className="absolute top-4 right-4 z-40 p-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors"
      >
        <Settings className="w-5 h-5" />
      </button>

      {/* Settings Panel */}
      {isOpen && (
        <div className="absolute top-0 right-0 z-50 w-80 h-full bg-gray-900 border-l border-gray-700 p-6 overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white">Settings</h2>
            <button
              onClick={togglePanel}
              className="p-1 hover:bg-gray-700 rounded text-gray-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Audio Settings */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
              <Volume2 className="w-5 h-5 mr-2" />
              Audio
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Music Volume: {musicVolume}%
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={musicVolume}
                  onChange={(e) => setMusicVolume(Number(e.target.value))}
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Sound Effects: {sfxVolume}%
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={sfxVolume}
                  onChange={(e) => setSfxVolume(Number(e.target.value))}
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                />
              </div>
            </div>
          </div>

          {/* Controls Settings */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
              <Monitor className="w-5 h-5 mr-2" />
              Controls
            </h3>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Mobile Controls</span>
                <button
                  onClick={() => setShowMobileControls(!showMobileControls)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    showMobileControls ? 'bg-blue-600' : 'bg-gray-600'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      showMobileControls ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Game Info */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-white mb-4">Game Info</h3>
            <div className="space-y-2 text-sm text-gray-300">
              <p><strong>Version:</strong> 1.0.0</p>
              <p><strong>Engine:</strong> Phaser 3</p>
              <p><strong>Framework:</strong> React + TypeScript</p>
            </div>
          </div>

          {/* Controls Help */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-white mb-4">Controls</h3>
            <div className="space-y-2 text-sm text-gray-300">
              <div className="flex justify-between">
                <span>Move:</span>
                <span>Arrow Keys / WASD</span>
              </div>
              <div className="flex justify-between">
                <span>Jump:</span>
                <span>W / Up Arrow</span>
              </div>
              <div className="flex justify-between">
                <span>Interact:</span>
                <span>E</span>
              </div>
              <div className="flex justify-between">
                <span>Pause:</span>
                <span>ESC</span>
              </div>
            </div>
          </div>

          {/* Reset Button */}
          <button className="w-full bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg transition-colors">
            Reset All Settings
          </button>
        </div>
      )}
    </>
  );
};

export default SettingsPanel;