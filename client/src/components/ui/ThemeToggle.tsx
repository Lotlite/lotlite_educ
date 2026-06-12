import { useEffect } from 'react';

export default function ThemeToggle() {
  useEffect(() => {
    document.documentElement.classList.remove('dark');
    localStorage.removeItem('theme');
  }, []);

  return null;
}
