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
import { X, Send, Download, FileDown, Sparkles, BarChart3, FileDiff } from 'lucide-react';
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

    const handleSend = async (message?: string) => {
        const textToSend = message || inputValue;
        if (!textToSend.trim() || isSending) return;

        setInputValue('');
        setIsSending(true);

        // Add user message
        addChatMessage({
            role: 'user',
            message: textToSend,
        });

        // Simulate LLM response
        await new Promise((resolve) => setTimeout(resolve, 1500));

        // Add AI response
        addChatMessage({
            role: 'assistant',
            message: `Here's an analysis based on your question: "${textToSend}"\n\nI've generated a visualization below showing the key metrics from your data.`,
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
            <DrawerContent
                noOverlay
                className="fixed top-0 bottom-0 right-0 w-[450px] h-full rounded-l-2xl border-l border-neutral-200/50 dark:border-neutral-800/50 backdrop-blur-xl bg-background/80 shadow-2xl"
            >
                <DrawerHeader className="border-b border-neutral-200/50 dark:border-neutral-800/50 px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                                <Sparkles className="h-4 w-4 text-primary" />
                            </div>
                            <div>
                                <DrawerTitle className="text-base font-semibold">AI Assistant</DrawerTitle>
                                <DrawerDescription className="text-xs">Analyze your data with AI</DrawerDescription>
                            </div>
                        </div>
                        <div className="flex items-center gap-1">
                            <Button variant="ghost" size="icon" onClick={handleDownloadReport} className="h-8 w-8 text-muted-foreground hover:text-foreground">
                                <FileDown className="h-4 w-4" />
                            </Button>
                            <DrawerClose asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                                    <X className="h-4 w-4" />
                                </Button>
                            </DrawerClose>
                        </div>
                    </div>
                </DrawerHeader>

                <div className="flex flex-col flex-1 overflow-hidden">
                    <ScrollArea className="flex-1 px-6 py-6" ref={scrollRef}>
                        <div className="space-y-6">
                            {chatMessages.length === 0 && (
                                <div className="flex flex-col items-center justify-center py-12 text-center space-y-4">
                                    <div className="h-12 w-12 rounded-2xl bg-muted flex items-center justify-center">
                                        <Sparkles className="h-6 w-6 text-muted-foreground" />
                                    </div>
                                    <div className="space-y-1">
                                        <p className="font-medium">Ask the AI anything</p>
                                        <p className="text-sm text-muted-foreground">About your files—profit, trends, anomalies.</p>
                                    </div>
                                </div>
                            )}

                            {chatMessages.map((msg) => (
                                <div
                                    key={msg.id}
                                    className={cn(
                                        'flex flex-col gap-1',
                                        msg.role === 'user' ? 'items-end' : 'items-start'
                                    )}
                                >
                                    <div className="flex items-center gap-2 px-1">
                                        <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
                                            {msg.role === 'user' ? 'You' : 'AI Assistant'}
                                        </span>
                                    </div>

                                    <div
                                        className={cn(
                                            'rounded-2xl p-4 text-sm max-w-[85%] shadow-sm',
                                            msg.role === 'user'
                                                ? 'bg-primary/10 text-foreground rounded-tr-sm'
                                                : 'bg-muted/50 border border-neutral-200/50 dark:border-neutral-800/50 rounded-tl-sm'
                                        )}
                                    >
                                        <p className="whitespace-pre-wrap leading-relaxed">{msg.message}</p>
                                    </div>

                                    {msg.metadata?.chart && (
                                        <div className="mt-2 w-full max-w-[90%] self-start">
                                            <div className="rounded-2xl border-none shadow-sm bg-card p-4">
                                                <div className="flex items-center justify-between mb-4">
                                                    <div>
                                                        <h4 className="text-sm font-semibold">Data Visualization</h4>
                                                        <p className="text-xs text-muted-foreground">Generated from your query</p>
                                                    </div>
                                                    <Button variant="ghost" size="icon" className="h-6 w-6">
                                                        <Download className="h-3 w-3" />
                                                    </Button>
                                                </div>
                                                <DataChart chartData={msg.metadata.chart} />
                                            </div>
                                        </div>
                                    )}

                                    {msg.metadata?.downloadUrl && (
                                        <Button variant="outline" size="sm" className="mt-2">
                                            <Download className="h-3 w-3 mr-2" />
                                            Download Report
                                        </Button>
                                    )}
                                </div>
                            ))}

                            {isSending && (
                                <div className="flex justify-start">
                                    <div className="bg-muted/50 rounded-2xl rounded-tl-sm p-4 border border-neutral-200/50 dark:border-neutral-800/50">
                                        <div className="flex items-center gap-1.5">
                                            <div className="w-1.5 h-1.5 bg-primary/50 rounded-full animate-bounce" />
                                            <div className="w-1.5 h-1.5 bg-primary/50 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                                            <div className="w-1.5 h-1.5 bg-primary/50 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </ScrollArea>

                    <div className="p-4 bg-background/50 backdrop-blur-sm border-t border-neutral-200/50 dark:border-neutral-800/50 space-y-3">
                        {chatMessages.length === 0 && (
                            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                                <Button variant="outline" size="sm" className="rounded-full text-xs h-7 bg-background/50" onClick={() => handleSend("Summarize the uploaded files")}>
                                    <Sparkles className="h-3 w-3 mr-1.5 text-purple-500" />
                                    Summaries
                                </Button>
                                <Button variant="outline" size="sm" className="rounded-full text-xs h-7 bg-background/50" onClick={() => handleSend("Visualize the data trends")}>
                                    <BarChart3 className="h-3 w-3 mr-1.5 text-blue-500" />
                                    Visualise
                                </Button>
                                <Button variant="outline" size="sm" className="rounded-full text-xs h-7 bg-background/50" onClick={() => handleSend("Compare the files")}>
                                    <FileDiff className="h-3 w-3 mr-1.5 text-orange-500" />
                                    Compare Files
                                </Button>
                            </div>
                        )}

                        <div className="relative flex items-end gap-2 bg-muted/40 rounded-xl p-2 border border-transparent focus-within:border-primary/20 focus-within:bg-background transition-all">
                            <Textarea
                                placeholder="Ask a question about your data..."
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                onKeyDown={handleKeyDown}
                                className="min-h-[44px] max-h-[120px] border-none shadow-none bg-transparent resize-none py-2.5 px-3 focus-visible:ring-0 text-sm"
                                disabled={isSending}
                            />
                            <Button
                                onClick={() => handleSend()}
                                disabled={isSending || !inputValue.trim()}
                                size="icon"
                                className="h-8 w-8 mb-1 rounded-lg shrink-0"
                            >
                                <Send className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </div>
            </DrawerContent>
        </Drawer>
    );
}
