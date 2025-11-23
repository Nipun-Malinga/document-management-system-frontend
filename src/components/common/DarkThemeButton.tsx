import { useEffect, useState } from 'react';
import { FaMoon, FaSun } from 'react-icons/fa6';
import Button from './Button';

const DarkThemeButton = () => {
  const [isDark, setIsDark] = useState(() => {
    if (localStorage.theme === 'dark') return true;
    if (!('theme' in localStorage))
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    return false;
  });

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
      localStorage.theme = 'dark';
    } else {
      root.classList.remove('dark');
      localStorage.theme = 'light';
    }
  }, [isDark]);

  return (
    <Button
      onClick={() => setIsDark((prev) => !prev)}
      icon={isDark ? FaMoon : FaSun}
    />
  );
};

export default DarkThemeButton;
