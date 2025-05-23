// components/theme-provider.js
import React, { useEffect, useState } from 'react';
import { ThemeProvider as NextThemesProvider } from 'next-themes';

export function ThemeProvider({ children, ...props }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <NextThemesProvider attribute="class" defaultTheme="dark" enableSystem {...props}>
      {children}
    </NextThemesProvider>
  );
}
