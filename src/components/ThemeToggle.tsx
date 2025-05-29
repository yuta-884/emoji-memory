// ThemeToggle component
import { useTheme } from '../hooks/useTheme';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  
  const handleToggle = () => {
    if (theme === 'dark') {
      setTheme('light');
    } else if (theme === 'light') {
      setTheme('system');
    } else {
      setTheme('dark');
    }
  };
  
  return (
    <button 
      onClick={handleToggle}
      className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
      aria-label="Toggle theme"
      title={`Current theme: ${theme}. Click to change.`}
    >
      {theme === 'dark' ? (
        <span className="text-xl">🌙</span>
      ) : theme === 'light' ? (
        <span className="text-xl">☀️</span>
      ) : (
        <span className="text-xl">⚙️</span>
      )}
    </button>
  );
}
