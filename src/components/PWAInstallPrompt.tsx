import { useState, useEffect } from 'react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function PWAInstallPrompt() {
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    // Check if the app is already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
      return;
    }

    const handleBeforeInstallPrompt = (e: Event) => {
      // Prevent Chrome 76+ from automatically showing the prompt
      e.preventDefault();
      // Store the event for later use
      setInstallPrompt(e as BeforeInstallPromptEvent);
      // Show our custom install prompt after a delay
      setTimeout(() => setShowPrompt(true), 3000);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Handle app installed event
    window.addEventListener('appinstalled', () => {
      setIsInstalled(true);
      setShowPrompt(false);
      console.log('PWA was installed');
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!installPrompt) return;
    
    // Show the install prompt
    await installPrompt.prompt();
    
    // Wait for the user to respond to the prompt
    const choiceResult = await installPrompt.userChoice;
    
    if (choiceResult.outcome === 'accepted') {
      console.log('User accepted the install prompt');
    } else {
      console.log('User dismissed the install prompt');
    }
    
    // Clear the saved prompt since it can't be used again
    setInstallPrompt(null);
    setShowPrompt(false);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    // Don't show again for this session
    localStorage.setItem('pwaPromptDismissed', 'true');
  };

  // Don't show anything if the app is installed or if the prompt isn't available
  if (isInstalled || !showPrompt || localStorage.getItem('pwaPromptDismissed') === 'true') {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-0 right-0 mx-auto w-full max-w-sm bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 flex flex-col items-center z-50 border border-gray-200 dark:border-gray-700 transition-colors">
      <div className="flex items-center mb-2">
        <span className="text-xl mr-2">📱</span>
        <h3 className="font-bold">Install App</h3>
      </div>
      <p className="text-sm text-center mb-3 dark:text-gray-300">
        Install this app on your device for offline use and a better experience!
      </p>
      <div className="flex space-x-2">
        <button 
          onClick={handleDismiss}
          className="px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded text-sm dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          Later
        </button>
        <button 
          onClick={handleInstallClick}
          className="px-3 py-1.5 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 transition-colors"
        >
          Install
        </button>
      </div>
    </div>
  );
}
