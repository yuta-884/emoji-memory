// Sound types
export type SoundType = 'flip' | 'match' | 'win';

// Sound files
const SOUND_FILES: Record<SoundType, string> = {
  flip: 'sounds/flip.mp3',
  match: 'sounds/match.mp3',
  win: 'sounds/win.mp3'
};

// Sound instances
const sounds: Record<SoundType, HTMLAudioElement> = {} as Record<SoundType, HTMLAudioElement>;
let initialized = false;

/**
 * Initialize all sounds (preload)
 */
export function initSounds(baseUrl: string = ''): void {
  if (initialized) return;
  
  console.log('Initializing sounds with base URL:', baseUrl);
  
  // Create Audio elements for each sound
  Object.entries(SOUND_FILES).forEach(([key, file]) => {
    const soundType = key as SoundType;
    const fullPath = `${baseUrl}${file}`;
    
    console.log(`Creating Audio element for ${soundType}:`, fullPath);
    
    // Create audio element
    const audio = new Audio(fullPath);
    audio.preload = 'auto';
    audio.volume = 0.7;
    
    // Add event listeners for debugging
    audio.addEventListener('canplaythrough', () => {
      console.log(`Sound loaded successfully: ${soundType}`);
    });
    
    audio.addEventListener('error', (e) => {
      console.error(`Error loading sound ${soundType}:`, e);
    });
    
    // Store the audio element
    sounds[soundType] = audio;
    
    // Force preload
    audio.load();
  });
  
  initialized = true;
  
  // Test sound loading
  setTimeout(() => {
    console.log('Testing audio elements:');
    Object.entries(sounds).forEach(([type, audio]) => {
      console.log(`- ${type}: readyState=${audio.readyState}, error=${audio.error}`);
    });
  }, 1000);
}

/**
 * Play a sound if sound is enabled
 */
export function playSound(type: SoundType, enabled: boolean): void {
  if (!initialized) {
    console.warn('Sounds not initialized yet');
    return;
  }
  
  if (!enabled) {
    console.log('Sound disabled, not playing:', type);
    return;
  }
  
  console.log('Playing sound:', type);
  
  // Play the sound
  try {
    // Clone the audio element to allow overlapping sounds
    const audio = sounds[type].cloneNode() as HTMLAudioElement;
    audio.volume = 0.7;
    
    // Play with user interaction promise handling
    const playPromise = audio.play();
    
    if (playPromise !== undefined) {
      playPromise.catch(error => {
        console.error(`Failed to play sound ${type}:`, error);
        // Try playing again with user interaction
        document.addEventListener('click', () => {
          audio.play().catch(e => console.error('Still failed to play after user interaction:', e));
        }, { once: true });
      });
    }
  } catch (error) {
    console.error(`Failed to play sound ${type}:`, error);
  }
}

/**
 * Get sound enabled setting from localStorage
 */
export function getSoundEnabledSetting(): boolean {
  const setting = localStorage.getItem('soundEnabled');
  return setting === null ? true : setting === 'true';
}

/**
 * Save sound enabled setting to localStorage
 */
export function saveSoundEnabledSetting(enabled: boolean): void {
  localStorage.setItem('soundEnabled', enabled.toString());
}
