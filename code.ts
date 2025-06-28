// Figma Slide Animation Plugin

interface FramePosition {
  frame: FrameNode;
  x: number;
  y: number;
}

interface AnimationSettings {
  trigger: 'key' | 'gamepad';
  action: 'navigate';
  animation: 'smart_animate';
  curve: 'ease_in_and_out';
  duration: number;
}

const defaultSettings: AnimationSettings = {
  trigger: 'key',
  action: 'navigate',
  animation: 'smart_animate',
  curve: 'ease_in_and_out',
  duration: 0.3
};

// Show UI when plugin starts
figma.showUI(__html__, { width: 400, height: 648 });

figma.ui.on('message', async (msg) => {
  if (msg.type === 'create-animation') {
    await createSlideAnimation(msg.direction);
  } else if (msg.type === 'cancel') {
    figma.closePlugin();
  }
});

async function createSlideAnimation(direction: 'horizontal' | 'vertical') {
  figma.ui.postMessage({ type: 'progress', percent: 0 });

  const frames = figma.currentPage.selection.filter(
    (node): node is FrameNode => node.type === 'FRAME'
  );

  if (frames.length < 2) {
    figma.notify('Please select at least 2 frames to create slide animation.');
    return;
  }

  // Get frame positions
  const framePositions: FramePosition[] = frames.map(frame => ({
    frame,
    x: frame.x,
    y: frame.y
  }));

  // Sort frames based on direction priority
  const sortedFrames = sortFramesByDirection(framePositions, direction);

  // Clear existing transitions
  await clearAllTransitions(frames);
  // Create transitions between consecutive frames
  await createTransitions(sortedFrames);

  figma.notify(`Created slide animation for ${sortedFrames.length} frames!`);
  figma.ui.postMessage({ type: 'animation-complete' });
}

function sortFramesByDirection(framePositions: FramePosition[], direction: 'horizontal' | 'vertical'): FrameNode[] {
  // Sort frames from top-left to bottom-right with priority based on direction
  const sorted = framePositions.sort((a, b) => {
    if (direction === 'horizontal') {
      // Horizontal priority: left to right first, then top to bottom
      if (Math.abs(a.y - b.y) < 50) { // Same row (within 50px tolerance)
        return a.x - b.x;
      }
      return a.y - b.y;
    } else {
      // Vertical priority: top to bottom first, then left to right
      if (Math.abs(a.x - b.x) < 50) { // Same column (within 50px tolerance)
        return a.y - b.y;
      }
      return a.x - b.x;
    }
  });

  return sorted.map(fp => fp.frame);
}

async function createTransitions(frames: FrameNode[]) {
  const total = (frames.length - 1) * 2;
  let done = 0;

  for (let i = 0; i < frames.length - 1; i++) {
    const currentFrame = frames[i];
    const nextFrame = frames[i + 1];

    // Clear existing reactions to avoid conflicts
    await currentFrame.setReactionsAsync([]);

    // Create new reactions for multiple keys
    const reactions: Reaction[] = [
      {
        actions: [{
          type: 'NODE',
          destinationId: nextFrame.id,
          navigation: 'NAVIGATE',
          transition: {
            type: 'SMART_ANIMATE',
            easing: { type: 'EASE_IN_AND_OUT' },
            duration: defaultSettings.duration
          },
          preserveScrollPosition: false
        }],
        trigger: {
          type: 'ON_KEY_DOWN',
          device: 'KEYBOARD',
          keyCodes: [39] // Right arrow key code
        }
      },
      {
        actions: [{
          type: 'NODE',
          destinationId: nextFrame.id,
          navigation: 'NAVIGATE',
          transition: {
            type: 'SMART_ANIMATE',
            easing: { type: 'EASE_IN_AND_OUT' },
            duration: defaultSettings.duration
          },
          preserveScrollPosition: false
        }],
        trigger: {
          type: 'ON_KEY_DOWN',
          device: 'KEYBOARD',
          keyCodes: [40] // Down arrow key code
        }
      },
      {
        actions: [{
          type: 'NODE',
          destinationId: nextFrame.id,
          navigation: 'NAVIGATE',
          transition: {
            type: 'SMART_ANIMATE',
            easing: { type: 'EASE_IN_AND_OUT' },
            duration: defaultSettings.duration
          },
          preserveScrollPosition: false
        }],
        trigger: {
          type: 'ON_KEY_DOWN',
          device: 'KEYBOARD',
          keyCodes: [13] // Enter key code
        }
      }
    ];

    await currentFrame.setReactionsAsync(reactions);

    done++;
    if (done % 5 === 0) {
      await new Promise(resolve => setTimeout(resolve, 0));
      figma.ui.postMessage({ type: 'progress', percent: Math.round((done / total) * 100) });
    }
  }

  for (let i = frames.length - 1; i > 0; i--) {
    const currentFrame = frames[i];
    const previousFrame = frames[i - 1];

    // Add reactions for reverse navigation
    const reverseReactions: Reaction[] = [
      {
        actions: [{
          type: 'NODE',
          destinationId: previousFrame.id,
          navigation: 'NAVIGATE',
          transition: {
            type: 'SMART_ANIMATE',
            easing: { type: 'EASE_IN_AND_OUT' },
            duration: defaultSettings.duration
          },
          preserveScrollPosition: false
        }],
        trigger: {
          type: 'ON_KEY_DOWN',
          device: 'KEYBOARD',
          keyCodes: [37] // Left arrow key code
        }
      },
      {
        actions: [{
          type: 'NODE',
          destinationId: previousFrame.id,
          navigation: 'NAVIGATE',
          transition: {
            type: 'SMART_ANIMATE',
            easing: { type: 'EASE_IN_AND_OUT' },
            duration: defaultSettings.duration
          },
          preserveScrollPosition: false
        }],
        trigger: {
          type: 'ON_KEY_DOWN',
          device: 'KEYBOARD',
          keyCodes: [38] // Up arrow key code
        }
      }
    ];

    await currentFrame.setReactionsAsync([
      ...(currentFrame.reactions || []),
      ...reverseReactions
    ]);

    done++;
    if (done % 5 === 0) {
      await new Promise(resolve => setTimeout(resolve, 0));
      figma.ui.postMessage({ type: 'progress', percent: Math.round((done / total) * 100) });
    }
  }

  figma.ui.postMessage({ type: 'progress', percent: 100 });
}

async function clearAllTransitions(targetFrames: FrameNode[]) {
  await Promise.all(
    targetFrames.map(frame => frame.setReactionsAsync([]))
  );
}

// Handle plugin commands
figma.on('run', () => {
  // Plugin UI will handle the interaction
});
