import { useState, useEffect } from 'react';

export function OfflineNotification() {
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [showNotification, setShowNotification] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOffline(false);
      // Show "back online" notification briefly
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 3000);
    };

    const handleOffline = () => {
      setIsOffline(true);
      setShowNotification(true);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (!showNotification) return null;

  return (
    <div className={`fixed top-4 left-0 right-0 mx-auto w-full max-w-sm p-3 rounded-lg shadow-lg z-50 flex items-center justify-between transition-colors ${
      isOffline 
        ? 'bg-yellow-100 dark:bg-yellow-900 border border-yellow-200 dark:border-yellow-800' 
        : 'bg-green-100 dark:bg-green-900 border border-green-200 dark:border-green-800'
    }`}>
      <div className="flex items-center">
        <span className="mr-2 text-xl">
          {isOffline ? '📶' : '✅'}
        </span>
        <p className={`font-medium ${
          isOffline 
            ? 'text-yellow-800 dark:text-yellow-200' 
            : 'text-green-800 dark:text-green-200'
        }`}>
          {isOffline 
            ? 'You are offline. The app will continue to work.' 
            : 'You are back online.'}
        </p>
      </div>
      {isOffline ? null : (
        <button 
          onClick={() => setShowNotification(false)}
          className="text-green-800 dark:text-green-200 hover:text-green-900 dark:hover:text-green-100"
          aria-label="Dismiss notification"
        >
          ✕
        </button>
      )}
    </div>
  );
}
