import { useEffect } from 'react';
import { useThemeStore } from '../../store/useThemeStore';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const { theme, resolvedTheme, updateResolvedTheme } = useThemeStore();

    useEffect(() => {
        // Apply initial theme
        updateResolvedTheme();

        // Listen for system theme changes if theme is set to 'system'
        if (theme === 'system') {
            const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
            
            const handleChange = () => {
                updateResolvedTheme();
            };

            // Modern browsers
            if (mediaQuery.addEventListener) {
                mediaQuery.addEventListener('change', handleChange);
                return () => mediaQuery.removeEventListener('change', handleChange);
            } 
            // Fallback for older browsers
            else if (mediaQuery.addListener) {
                mediaQuery.addListener(handleChange);
                return () => mediaQuery.removeListener(handleChange);
            }
        }
        
        // No cleanup needed if theme is not 'system'
        return undefined;
    }, [theme, updateResolvedTheme]);

    useEffect(() => {
        // Apply resolved theme to document
        const root = document.documentElement;
        if (resolvedTheme === 'dark') {
            root.classList.add('dark');
        } else {
            root.classList.remove('dark');
        }
    }, [resolvedTheme]);

    return <>{children}</>;
}

