# Interactive Educational Treasure Hunt

A complete, responsive, production-ready web game where players explore magical environments to find treasure boxes that gate progress behind educational questions.

## 🎮 Game Features

### Core Gameplay
- **Exploration**: Navigate through beautifully crafted levels (Jungle, City, Desert)
- **Educational Questions**: Answer Math, Science, and General Knowledge questions
- **Two Game Modes**:
  - **Knowledge Mode**: Get hints to find the next treasure
  - **Reward Mode**: Collect coins and gems plus hints
- **Progressive Difficulty**: 5 correct answers per level to advance
- **Smart Hint System**: Map pings, riddles, compass arrows, and glowing paths

### Technical Features
- **Responsive Design**: Works on desktop and mobile devices
- **Touch Controls**: On-screen joystick and buttons for mobile
- **Audio System**: Background music and sound effects
- **State Management**: Persistent game progress
- **Smooth Animations**: GSAP and Phaser tweens for polished experience

## 🛠️ Tech Stack

- **Framework**: React + Vite + TypeScript
- **Game Engine**: Phaser 3
- **Animation**: GSAP + Phaser Tweens
- **State Management**: Zustand
- **Styling**: Tailwind CSS
- **Audio**: WebAudio via Phaser
- **Build Tool**: Vite

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ 
- npm or yarn

### Installation & Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run tests
npm test
```

## 🎯 Game Controls

### Desktop
- **Movement**: Arrow Keys or WASD
- **Jump**: W or Up Arrow
- **Interact**: E key
- **Pause**: ESC

### Mobile
- **Virtual Joystick**: Left side of screen for movement
- **Jump Button**: Blue button (bottom right)
- **Interact Button**: Green button (bottom right)

## 📚 Educational Content

### Subjects Available
- **Mathematics**: Arithmetic, geometry, algebra
- **Science**: Biology, chemistry, physics, astronomy
- **General Knowledge**: Geography, history, arts, culture

### Question Types
- Multiple choice (4 options)
- Difficulty levels: Easy, Medium, Hard
- Detailed explanations for wrong answers
- 3 attempts per question with progressive hints

## 🎨 Game Modes

### Knowledge Treasure Mode
- Focus on learning and exploration
- Correct answers reveal hints to next treasure
- Emphasis on educational progression

### Reward Treasure Mode
- Gamified experience with collectibles
- Correct answers spawn coins and gems
- Visual rewards enhance motivation

## 🗺️ Hint System

### Map Hints
- Mini-map overlay with treasure location ping
- Visual indicator for 3 seconds

### Riddle Hints
- Text-based clues with creative descriptions
- Contextual hints about treasure location

### Compass Hints
- Directional arrow pointing to next treasure
- Persistent until treasure is found

### Glow Hints
- Illuminated path or treasure highlighting
- Subtle visual guidance system

## 🏗️ Project Structure

```
src/
├── game/
│   ├── scenes/           # Phaser game scenes
│   │   ├── BootScene.ts
│   │   ├── PreloadScene.ts
│   │   ├── MenuScene.ts
│   │   ├── WorldScene.ts
│   │   ├── QuestionScene.ts
│   │   ├── HUDScene.ts
│   │   └── ResultScene.ts
│   ├── objects/          # Game entities
│   │   ├── Player.ts
│   │   ├── TreasureBox.ts
│   │   ├── HintMarker.ts
│   │   └── Collectible.ts
│   ├── config/           # Game configuration
│   │   ├── phaserConfig.ts
│   │   ├── levels.ts
│   │   ├── questions.ts
│   │   └── constants.ts
│   ├── state/            # State management
│   │   └── store.ts
│   └── utils/            # Utility functions
│       ├── questionEngine.ts
│       ├── hintEngine.ts
│       └── sound.ts
├── ui/                   # React components
│   ├── App.tsx
│   ├── HUDOverlay.tsx
│   ├── PauseDialog.tsx
│   └── SettingsPanel.tsx
└── types/                # TypeScript definitions
    └── index.ts
```

## 🎵 Audio Assets

The game uses placeholder audio files for:
- Background music per level
- Sound effects (correct/wrong answers, collectibles, interactions)
- Ambient sounds for immersion

**Note**: All audio assets are placeholder implementations. For production, replace with licensed audio files.

## 🖼️ Visual Assets

All visual assets are procedurally generated using Phaser graphics:
- Character sprites (colored rectangles with animations)
- Environment backgrounds (gradient fills)
- UI elements (geometric shapes)
- Particle effects (circles and basic shapes)

**Asset Attribution**: All placeholder assets are generated programmatically. No external assets require attribution.

## 🧪 Testing

The project includes unit tests for core game logic:

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

### Test Coverage
- Question Engine: Answer validation, attempt tracking
- Hint Engine: Hint generation and display logic
- Game State: State transitions and persistence

## 🔧 Configuration

### Game Constants
Edit `src/game/config/constants.ts` to modify:
- Game dimensions and physics
- UI settings and timing
- Audio volume levels
- Control mappings

### Level Design
Modify `src/game/config/levels.ts` to:
- Add new levels
- Adjust platform layouts
- Change treasure box positions
- Set level requirements

### Question Bank
Update `src/game/config/questions.ts` to:
- Add new questions
- Modify difficulty distribution
- Update subject categories
- Change hint types

## 🚀 Deployment

### Build Optimization
```bash
# Create optimized production build
npm run build

# Analyze bundle size
npm run analyze
```

### Deployment Platforms
- **Netlify**: Drag and drop `dist` folder
- **Vercel**: Connect GitHub repository
- **GitHub Pages**: Use `gh-pages` branch
- **Firebase Hosting**: Use Firebase CLI

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow TypeScript strict mode
- Use ESLint and Prettier for code formatting
- Write tests for new game logic
- Update documentation for new features

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Phaser 3**: Excellent 2D game framework
- **React**: Powerful UI library
- **Tailwind CSS**: Utility-first CSS framework
- **Zustand**: Lightweight state management
- **Vite**: Fast build tool and dev server

## 🐛 Known Issues

- Mobile touch controls may need calibration on some devices
- Audio autoplay restrictions on some browsers
- Performance optimization needed for older devices

## 🔮 Future Enhancements

- [ ] Multiplayer support
- [ ] Level editor
- [ ] Custom question import
- [ ] Achievement system
- [ ] Leaderboards
- [ ] More subjects and question types
- [ ] Advanced hint system
- [ ] Character customization

---

**Happy Learning and Gaming! 🎮📚**