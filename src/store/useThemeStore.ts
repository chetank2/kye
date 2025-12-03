import { create } from 'zustand';

export type Theme = 'light' | 'dark' | 'system';

interface ThemeStore {
    theme: Theme;
    resolvedTheme: 'light' | 'dark';
    setTheme: (theme: Theme) => void;
    toggleTheme: () => void;
    getSystemTheme: () => 'light' | 'dark';
    updateResolvedTheme: () => void;
}

const STORAGE_KEY = 'kye-theme';

const getSystemTheme = (): 'light' | 'dark' => {
    if (typeof window === 'undefined') return 'light';
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

const getInitialTheme = (): Theme => {
    if (typeof window === 'undefined') return 'system';
    try {
        const stored = localStorage.getItem(STORAGE_KEY) as Theme | null;
        return stored || 'system';
    } catch {
        return 'system';
    }
};

const resolveTheme = (theme: Theme): 'light' | 'dark' => {
    if (theme === 'system') {
        return getSystemTheme();
    }
    return theme;
};

export const useThemeStore = create<ThemeStore>((set, get) => {
    const initialTheme = getInitialTheme();
    const initialResolved = resolveTheme(initialTheme);

    // Apply initial theme immediately
    if (typeof document !== 'undefined') {
        const root = document.documentElement;
        if (initialResolved === 'dark') {
            root.classList.add('dark');
        } else {
            root.classList.remove('dark');
        }
    }

    return {
        theme: initialTheme,
        resolvedTheme: initialResolved,

        setTheme: (theme) => {
            const resolved = resolveTheme(theme);
            
            // Persist to localStorage
            try {
                localStorage.setItem(STORAGE_KEY, theme);
            } catch (error) {
                console.warn('Failed to save theme preference:', error);
            }

            set({ theme, resolvedTheme: resolved });
            
            // Apply theme class immediately
            if (typeof document !== 'undefined') {
                const root = document.documentElement;
                if (resolved === 'dark') {
                    root.classList.add('dark');
                } else {
                    root.classList.remove('dark');
                }
            }
        },

        toggleTheme: () => {
            const currentResolved = get().resolvedTheme;
            // Toggle based on current resolved theme (works even if theme is 'system')
            const nextTheme: Theme = currentResolved === 'light' ? 'dark' : 'light';
            get().setTheme(nextTheme);
        },

        getSystemTheme,

        updateResolvedTheme: () => {
            const theme = get().theme;
            const resolved = resolveTheme(theme);
            set({ resolvedTheme: resolved });
            
            // Apply theme class
            if (typeof document !== 'undefined') {
                const root = document.documentElement;
                if (resolved === 'dark') {
                    root.classList.add('dark');
                } else {
                    root.classList.remove('dark');
                }
            }
        },
    };
});

