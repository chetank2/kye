import { FileSpreadsheet, Plus, Clock, FileText } from 'lucide-react';
import { Button } from '../ui/button';
import { ScrollArea } from '../ui/scroll-area';
import { ThemeToggle } from '../theme/ThemeToggle';
import { useWorkspaceStore, type Session } from '../../store/useWorkspaceStore';
import { cn } from '../../libs/utils';

export function Sidebar() {
    const { sessions, currentSessionId, createSession, setCurrentSession } = useWorkspaceStore();

    const handleNewSession = () => {
        const title = `Session ${sessions.length + 1}`;
        createSession(title);
    };

    return (
        <div className="flex h-full w-[20%] min-w-[250px] flex-col bg-muted/40 border-r border-neutral-200/30 dark:border-neutral-800/30">
            {/* Top App Bar */}
            <div className="px-4 py-6 space-y-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="h-8 w-8 bg-primary/10 rounded-lg flex items-center justify-center">
                            <FileSpreadsheet className="h-5 w-5 text-primary" />
                        </div>
                        <span className="text-lg font-semibold tracking-tight">KYE</span>
                    </div>
                    <ThemeToggle />
                </div>

                {/* New Session Button */}
                <Button
                    onClick={handleNewSession}
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start text-muted-foreground hover:text-foreground group"
                >
                    <Plus className="h-4 w-4 mr-2 group-hover:text-primary transition-colors" />
                    New Session
                </Button>
            </div>

            {/* Session List */}
            <div className="px-4 pb-2">
                <p className="text-[10px] uppercase tracking-wider text-neutral-400 font-medium mb-2 pl-2">
                    Recent Sessions
                </p>
            </div>

            <ScrollArea className="flex-1 px-4">
                <div className="space-y-1.5 pb-6">
                    {sessions.length === 0 ? (
                        <div className="p-4 text-center space-y-2">
                            <p className="text-sm text-muted-foreground">
                                Create your first data session → Start analysing Excel files with AI.
                            </p>
                        </div>
                    ) : (
                        sessions.map((session) => (
                            <SessionCard
                                key={session.id}
                                session={session}
                                isActive={session.id === currentSessionId}
                                onClick={() => setCurrentSession(session.id)}
                            />
                        ))
                    )}
                </div>
            </ScrollArea>
        </div>
    );
}

interface SessionCardProps {
    session: Session;
    isActive: boolean;
    onClick: () => void;
}

function SessionCard({ session, isActive, onClick }: SessionCardProps) {
    const formatDate = (date: Date) => {
        const now = new Date();
        const diff = now.getTime() - new Date(date).getTime();
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);

        if (minutes < 1) return 'Just now';
        if (minutes < 60) return `${minutes}m ago`;
        if (hours < 24) return `${hours}h ago`;
        if (days < 7) return `${days}d ago`;
        return new Date(date).toLocaleDateString();
    };

    return (
        <button
            onClick={onClick}
            className={cn(
                "w-full text-left p-3 rounded-lg transition-all duration-200 group relative overflow-hidden",
                "hover:bg-muted/40 border border-transparent",
                isActive
                    ? "bg-background shadow-sm border-neutral-200/50 dark:border-neutral-800"
                    : "hover:border-neutral-200/30 dark:hover:border-neutral-800/30"
            )}
        >
            <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                    <span className={cn(
                        "font-medium text-sm truncate transition-colors",
                        isActive ? "text-foreground" : "text-muted-foreground group-hover:text-foreground"
                    )}>
                        {session.title}
                    </span>
                </div>

                <div className="flex items-center gap-3 text-xs text-muted-foreground/60">
                    <div className="flex items-center gap-1">
                        <FileText className="h-3 w-3" />
                        <span>{session.fileCount}</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>{formatDate(session.updatedAt)}</span>
                    </div>
                </div>
            </div>
        </button>
    );
}
