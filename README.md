# Figma Slide Animation Plugin

A Figma plugin that creates continuous animation transitions between selected frames.

## Features

- Creates one continuous animation transition between selected frames
  - Overwrites existing transitions between frames
- Ignores non-frame objects (Groups, etc.)
- Supports both vertical-first and horizontal-first transition priorities
- Dark mode and light mode support

### Animation Settings

- **Trigger**: Next Page (→, ↓, Enter), Previous Page (←, ↑)
- **Action**: Navigate to
- **Animation**: Smart Animate
- **Curve**: Ease In and Out
- **Duration**: 300ms


## Usage in Figma

1. Select 2 or more frames in Figma
2. Select direction priority (Vertical or Horizontal)
3. Click "Create Animation" button


## For Developers

### File Structure

- `code.ts` - Main logic (TypeScript)
- `code.js` - Compiled JavaScript (auto-generated)
- `manifest.json` - Plugin configuration file
- `package.json` - Dependencies configuration
- `tsconfig.json` - TypeScript configuration
- `ui.html` - Plugin user interface

### Development Setup

1. Install dependencies:
```bash
npm install
```

2. Compile TypeScript:
```bash
npm run build
```

Or for development with auto-compilation:
```bash
npm run watch
```
