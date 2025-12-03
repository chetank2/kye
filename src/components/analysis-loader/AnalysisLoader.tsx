import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Spinner } from '../ui/spinner';
import { Sparkles, FileText, ArrowRight } from 'lucide-react';
import { useWorkspaceStore } from '../../store/useWorkspaceStore';

export function AnalysisLoader() {
    const { isAnalyzing, setIsAnalyzing, setChatOpen, addChatMessage, headerAliases, uploadedFiles } =
        useWorkspaceStore();

    const handleAnalyze = async () => {
        setIsAnalyzing(true);

        // Simulate LLM analysis
        await new Promise((resolve) => setTimeout(resolve, 2000));

        // Add initial assistant message
        addChatMessage({
            role: 'assistant',
            message: `I've analyzed your Excel files. I found ${uploadedFiles.length} file(s) with ${headerAliases.length} aliased columns. How can I help you analyze this data?`,
            metadata: {
                chart: {
                    type: 'bar',
                    data: [
                        { name: 'Sales', value: 4000 },
                        { name: 'Revenue', value: 3000 },
                        { name: 'Profit', value: 2000 },
                    ],
                },
            },
        });

        setIsAnalyzing(false);
        setChatOpen(true);
    };

    if (uploadedFiles.length === 0) {
        return null;
    }

    return (
        <Card className="p-8 shadow-sm border-neutral-200 dark:border-neutral-800">
            <div className="flex flex-col items-center justify-center space-y-8">
                {isAnalyzing ? (
                    <>
                        <div className="relative">
                            <div className="absolute inset-0 animate-ping rounded-full bg-primary/20" />
                            <div className="relative h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                                <Sparkles className="h-8 w-8 text-primary animate-pulse" />
                            </div>
                        </div>
                        <div className="text-center space-y-3">
                            <h3 className="text-xl font-semibold">Analyzing Your Data...</h3>
                            <div className="flex items-center gap-2 justify-center text-muted-foreground bg-muted/50 px-4 py-2 rounded-full">
                                <Spinner size="sm" />
                                <p className="text-sm font-medium">Processing {uploadedFiles.length} file(s)</p>
                            </div>
                        </div>
                    </>
                ) : (
                    <>
                        <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-primary/20 to-purple-500/20 flex items-center justify-center ring-1 ring-inset ring-primary/10">
                            <Sparkles className="h-8 w-8 text-primary" />
                        </div>
                        <div className="text-center space-y-2">
                            <h3 className="text-xl font-semibold">Ready to Analyze</h3>
                            <p className="text-sm text-muted-foreground max-w-md mx-auto">
                                Your files are prepared. Start AI-powered analysis to uncover insights, trends, and anomalies.
                            </p>
                        </div>

                        <div className="flex flex-col items-center gap-4 w-full max-w-xs">
                            <Button onClick={handleAnalyze} size="lg" className="w-full h-12 text-base shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all">
                                <Sparkles className="h-5 w-5 mr-2" />
                                Analyze Data with AI
                                <ArrowRight className="h-4 w-4 ml-2 opacity-50" />
                            </Button>

                            <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
                                <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-muted/50">
                                    <FileText className="h-3.5 w-3.5" />
                                    <span className="font-medium">{uploadedFiles.length} files</span>
                                </div>
                                {headerAliases.length > 0 && (
                                    <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-muted/50">
                                        <span className="font-medium">{headerAliases.length} aliases</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </>
                )}
            </div>
        </Card>
    );
}
