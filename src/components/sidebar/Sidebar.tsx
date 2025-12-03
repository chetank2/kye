import { FileSpreadsheet, Search, Plus } from 'lucide-react';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { ScrollArea } from '../ui/scroll-area';
import { Separator } from '../ui/separator';
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
        <div className="flex h-full w-[280px] flex-col bg-muted/40 border-r">
            {/* Header */}
            <div className="p-4 space-y-4">
                <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                        <FileSpreadsheet className="h-6 w-6 text-primary" />
                        <span className="text-lg font-semibold">KYE Analytics</span>
                    </div>
                    <ThemeToggle />
                </div>

                {/* Search */}
                <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search sessions..."
                        className="pl-8"
                    />
                </div>

                {/* New Session Button */}
                <Button onClick={handleNewSession} className="w-full" size="sm">
                    <Plus className="h-4 w-4" />
                    New Session
                </Button>
            </div>

            <Separator />

            {/* Session List */}
            <ScrollArea className="flex-1 px-2">
                <div className="space-y-2 py-2">
                    {sessions.length === 0 ? (
                        <div className="p-4 text-center text-sm text-muted-foreground">
                            No sessions yet. Create one to get started!
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
                "w-full text-left p-3 rounded-lg transition-colors",
                "hover:bg-accent",
                isActive && "bg-accent border border-border"
            )}
        >
            <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{session.title}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                        {formatDate(session.updatedAt)}
                    </p>
                </div>
                {session.fileCount > 0 && (
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <FileSpreadsheet className="h-3 w-3" />
                        <span>{session.fileCount}</span>
                    </div>
                )}
            </div>
        </button>
    );
}
