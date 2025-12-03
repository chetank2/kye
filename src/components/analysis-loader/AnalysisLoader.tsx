import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Spinner } from '../ui/spinner';
import { Sparkles, FileText } from 'lucide-react';
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
        <Card className="p-8">
            <div className="flex flex-col items-center justify-center space-y-6">
                {isAnalyzing ? (
                    <>
                        <div className="relative">
                            <div className="absolute inset-0 animate-ping">
                                <Sparkles className="h-12 w-12 text-primary/50" />
                            </div>
                            <Sparkles className="h-12 w-12 text-primary relative" />
                        </div>
                        <div className="text-center space-y-2">
                            <h3 className="text-xl font-semibold">Analyzing Your Data...</h3>
                            <div className="flex items-center gap-2 justify-center text-muted-foreground">
                                <Spinner size="sm" />
                                <p className="text-sm">Processing {uploadedFiles.length} file(s)</p>
                            </div>
                        </div>
                    </>
                ) : (
                    <>
                        <div className="rounded-full p-4 bg-primary/10">
                            <Sparkles className="h-12 w-12 text-primary" />
                        </div>
                        <div className="text-center space-y-2">
                            <h3 className="text-xl font-semibold">Ready to Analyze</h3>
                            <p className="text-sm text-muted-foreground max-w-md">
                                Your files are prepared. Click below to start AI-powered analysis of your data.
                            </p>
                        </div>
                        <Button onClick={handleAnalyze} size="lg" className="min-w-[200px]">
                            <Sparkles className="h-5 w-5 mr-2" />
                            Analyze Data with AI
                        </Button>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <div className="flex items-center gap-1">
                                <FileText className="h-3 w-3" />
                                <span>{uploadedFiles.length} files</span>
                            </div>
                            {headerAliases.length > 0 && (
                                <div className="flex items-center gap-1">
                                    <span>•</span>
                                    <span>{headerAliases.length} aliases</span>
                                </div>
                            )}
                        </div>
                    </>
                )}
            </div>
        </Card>
    );
}
