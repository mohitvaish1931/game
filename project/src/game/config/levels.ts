import { Level } from '../../types';

export const LEVELS: Level[] = [
  {
    id: 'jungle',
    name: 'Mystic Jungle',
    background: 'jungle-bg',
    music: 'jungle-music',
    platforms: [
      { x: 0, y: 500, width: 200, height: 32 },
      { x: 300, y: 450, width: 150, height: 32 },
      { x: 500, y: 400, width: 200, height: 32 },
      { x: 750, y: 350, width: 150, height: 32 },
      { x: 200, y: 300, width: 180, height: 32 },
      { x: 450, y: 250, width: 120, height: 32 },
      { x: 650, y: 200, width: 200, height: 32 },
      { x: 100, y: 150, width: 150, height: 32 },
    ],
    treasureBoxes: [
      { x: 100, y: 450, id: 'jungle_box_1' },
      { x: 375, y: 400, id: 'jungle_box_2' },
      { x: 600, y: 350, id: 'jungle_box_3' },
      { x: 280, y: 250, id: 'jungle_box_4' },
      { x: 720, y: 150, id: 'jungle_box_5' },
    ],
    playerSpawn: { x: 50, y: 450 },
    requiredAnswers: 5,
    ambientSounds: ['birds', 'leaves', 'water']
  },
  {
    id: 'city',
    name: 'Cyber City',
    background: 'city-bg',
    music: 'city-music',
    platforms: [
      { x: 0, y: 500, width: 180, height: 32 },
      { x: 250, y: 480, width: 120, height: 32 },
      { x: 450, y: 420, width: 160, height: 32 },
      { x: 700, y: 380, width: 140, height: 32 },
      { x: 150, y: 320, width: 200, height: 32 },
      { x: 500, y: 280, width: 150, height: 32 },
      { x: 750, y: 220, width: 180, height: 32 },
      { x: 300, y: 160, width: 120, height: 32 },
    ],
    treasureBoxes: [
      { x: 90, y: 450, id: 'city_box_1' },
      { x: 320, y: 430, id: 'city_box_2' },
      { x: 530, y: 370, id: 'city_box_3' },
      { x: 220, y: 270, id: 'city_box_4' },
      { x: 830, y: 170, id: 'city_box_5' },
    ],
    playerSpawn: { x: 50, y: 450 },
    requiredAnswers: 5,
    ambientSounds: ['traffic', 'wind', 'electricity']
  },
  {
    id: 'desert',
    name: 'Ancient Desert',
    background: 'desert-bg',
    music: 'desert-music',
    platforms: [
      { x: 0, y: 520, width: 220, height: 32 },
      { x: 280, y: 460, width: 140, height: 32 },
      { x: 500, y: 400, width: 180, height: 32 },
      { x: 750, y: 360, width: 160, height: 32 },
      { x: 200, y: 300, width: 150, height: 32 },
      { x: 450, y: 240, width: 200, height: 32 },
      { x: 700, y: 180, width: 120, height: 32 },
      { x: 100, y: 120, width: 180, height: 32 },
    ],
    treasureBoxes: [
      { x: 110, y: 470, id: 'desert_box_1' },
      { x: 350, y: 410, id: 'desert_box_2' },
      { x: 580, y: 350, id: 'desert_box_3' },
      { x: 275, y: 250, id: 'desert_box_4' },
      { x: 760, y: 130, id: 'desert_box_5' },
    ],
    playerSpawn: { x: 50, y: 470 },
    requiredAnswers: 5,
    ambientSounds: ['wind', 'sand', 'mystery']
  }
];

export function getCurrentLevel(levelIndex: number): Level {
  return LEVELS[levelIndex] || LEVELS[0];
}

export function getNextLevel(currentIndex: number): Level | null {
  return LEVELS[currentIndex + 1] || null;
}