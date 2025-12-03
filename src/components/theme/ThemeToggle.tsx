import { Moon, Sun } from 'lucide-react';
import { Button } from '../ui/button';
import { useThemeStore } from '../../store/useThemeStore';
import { cn } from '../../libs/utils';

export function ThemeToggle() {
    const { resolvedTheme, toggleTheme } = useThemeStore();

    return (
        <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className={cn("relative")}
            aria-label={`Switch to ${resolvedTheme === 'light' ? 'dark' : 'light'} mode`}
        >
            <Sun className={cn(
                "h-5 w-5 transition-all",
                resolvedTheme === 'dark' ? "rotate-90 scale-0" : "rotate-0 scale-100"
            )} />
            <Moon className={cn(
                "absolute h-5 w-5 transition-all",
                resolvedTheme === 'dark' ? "rotate-0 scale-100" : "rotate-90 scale-0"
            )} />
            <span className="sr-only">Toggle theme</span>
        </Button>
    );
}

