# Figma Slide Animation Plugin

A Figma plugin that creates continuous animation transitions between selected frames.

## Features

- Creates one continuous animation transition between selected frames
- Generates an acyclic connected path (graph theory)
- Overwrites existing transitions between frames
- Ignores non-frame objects (Groups, etc.)

## Transition Direction & Priority

- **Default**: Top-left to bottom-right
- **Grid Layout**: Choose between vertical-first or horizontal-first priority

## Animation Settings

- **Trigger**: Key/Gamepad (→)
- **Action**: Navigate to
- **Destination**: Next slide
- **Animation**: Smart Animate
- **Curve**: Ease In and Out
- **Duration**: 300ms

## Development Setup

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

## Usage in Figma

1. Select 2 or more frames in Figma
2. Choose "Create Slide Animation" from the plugin menu
3. Select direction priority (Horizontal First or Vertical First)
4. Click "Create Animation" button

## File Structure

- `manifest.json` - Plugin configuration file
- `code.ts` - Main logic (TypeScript)
- `code.js` - Compiled JavaScript (auto-generated)
- `ui.html` - Plugin user interface
- `package.json` - Dependencies configuration
- `tsconfig.json` - TypeScript configuration 
