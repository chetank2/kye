import { useState, useRef, useEffect } from 'react';
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerHeader,
    DrawerTitle,
} from '../ui/drawer';
import { ScrollArea } from '../ui/scroll-area';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { Badge } from '../ui/badge';
import { X, Send, Download, FileDown } from 'lucide-react';
import { useWorkspaceStore } from '../../store/useWorkspaceStore';
import { DataChart } from '../charts/DataChart';
import { cn } from '../../libs/utils';
import { downloadPDFReport } from '../../libs/chart-export';

export function ChatDrawer() {
    const { isChatOpen, setChatOpen, chatMessages, addChatMessage } = useWorkspaceStore();
    const [inputValue, setInputValue] = useState('');
    const [isSending, setIsSending] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [chatMessages]);

    // Prevent vaul from hiding the root element when using slider mode
    useEffect(() => {
        if (!isChatOpen) return;

        const rootElement = document.getElementById('root');
        if (!rootElement) return;

        // Remove aria-hidden that vaul sets
        const removeAriaHidden = () => {
            rootElement.removeAttribute('aria-hidden');
            rootElement.removeAttribute('data-aria-hidden');
        };

        // Remove immediately
        removeAriaHidden();

        // Set up MutationObserver to watch for aria-hidden being added
        const observer = new MutationObserver(() => {
            removeAriaHidden();
        });

        observer.observe(rootElement, {
            attributes: true,
            attributeFilter: ['aria-hidden', 'data-aria-hidden'],
        });

        // Also use interval as fallback
        const interval = setInterval(removeAriaHidden, 100);

        return () => {
            observer.disconnect();
            clearInterval(interval);
        };
    }, [isChatOpen]);

    const handleSend = async () => {
        if (!inputValue.trim() || isSending) return;

        const userMessage = inputValue;
        setInputValue('');
        setIsSending(true);

        // Add user message
        addChatMessage({
            role: 'user',
            message: userMessage,
        });

        // Simulate LLM response
        await new Promise((resolve) => setTimeout(resolve, 1500));

        // Add AI response
        addChatMessage({
            role: 'assistant',
            message: `Here's an analysis based on your question: "${userMessage}"\n\nI've generated a visualization below showing the key metrics from your data.`,
            metadata: {
                chart: {
                    type: 'line',
                    data: [
                        { name: 'Jan', value: 400 },
                        { name: 'Feb', value: 600 },
                        { name: 'Mar', value: 800 },
                        { name: 'Apr', value: 500 },
                        { name: 'May', value: 900 },
                    ],
                },
            },
        });

        setIsSending(false);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const handleDownloadReport = () => {
        downloadPDFReport(chatMessages, 'kye-analysis-report.pdf');
    };

    return (
        <Drawer open={isChatOpen} onOpenChange={setChatOpen} direction="right" shouldScaleBackground={false}>
            <DrawerContent noOverlay className="fixed top-0 bottom-0 right-0 w-[500px] h-full rounded-none">
                <DrawerHeader className="border-b">
                    <div className="flex items-center justify-between">
                        <div>
                            <DrawerTitle>Chat with AI</DrawerTitle>
                            <DrawerDescription>Ask questions about your data</DrawerDescription>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button variant="ghost" size="icon" onClick={handleDownloadReport}>
                                <FileDown className="h-4 w-4" />
                            </Button>
                            <DrawerClose asChild>
                                <Button variant="ghost" size="icon">
                                    <X className="h-4 w-4" />
                                </Button>
                            </DrawerClose>
                        </div>
                    </div>
                </DrawerHeader>

                <div className="flex flex-col flex-1 overflow-hidden">
                    <ScrollArea className="flex-1 p-4" ref={scrollRef}>
                        <div className="space-y-4">
                            {chatMessages.length === 0 && (
                                <div className="text-center py-12 text-muted-foreground">
                                    <p>No messages yet. Start chatting to analyze your data!</p>
                                </div>
                            )}

                            {chatMessages.map((msg) => (
                                <div
                                    key={msg.id}
                                    className={cn(
                                        'flex',
                                        msg.role === 'user' ? 'justify-end' : 'justify-start'
                                    )}
                                >
                                    <div
                                        className={cn(
                                            'max-w-[80%] space-y-2',
                                            msg.role === 'user' ? 'items-end' : 'items-start'
                                        )}
                                    >
                                        <div className="flex items-center gap-2">
                                            <Badge variant={msg.role === 'user' ? 'default' : 'secondary'} className="text-xs">
                                                {msg.role === 'user' ? 'You' : 'AI'}
                                            </Badge>
                                            <span className="text-xs text-muted-foreground">
                                                {new Date(msg.createdAt).toLocaleTimeString()}
                                            </span>
                                        </div>

                                        <div
                                            className={cn(
                                                'rounded-lg p-3 text-sm',
                                                msg.role === 'user'
                                                    ? 'bg-primary text-primary-foreground'
                                                    : 'bg-muted'
                                            )}
                                        >
                                            <p className="whitespace-pre-wrap">{msg.message}</p>
                                        </div>

                                        {msg.metadata?.chart && (
                                            <div className="mt-2 w-full">
                                                <DataChart chartData={msg.metadata.chart} />
                                            </div>
                                        )}

                                        {msg.metadata?.downloadUrl && (
                                            <Button variant="outline" size="sm" className="mt-2">
                                                <Download className="h-3 w-3 mr-2" />
                                                Download Report
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            ))}

                            {isSending && (
                                <div className="flex justify-start">
                                    <div className="bg-muted rounded-lg p-3">
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 bg-primary rounded-full animate-bounce" />
                                            <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                                            <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </ScrollArea>

                    <div className="border-t p-4">
                        <div className="flex items-end gap-2">
                            <Textarea
                                placeholder="Ask a question about your data..."
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                onKeyDown={handleKeyDown}
                                className="min-h-[60px] max-h-[120px]"
                                disabled={isSending}
                            />
                            <Button onClick={handleSend} disabled={isSending || !inputValue.trim()} size="icon" className="h-[60px]">
                                <Send className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </div>
            </DrawerContent>
        </Drawer>
    );
}
