import { useCallback, useState } from 'react';
import { Upload, FileSpreadsheet, AlertCircle } from 'lucide-react';
import { Card } from '../ui/card';
import { cn } from '../../libs/utils';
import { parseExcelFile } from '../../libs/excel-parser';
import { useWorkspaceStore } from '../../store/useWorkspaceStore';

interface FileDropzoneProps {
    onFilesProcessed?: () => void;
}

export function FileDropzone({ onFilesProcessed }: FileDropzoneProps) {
    const [isDragging, setIsDragging] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const { addUploadedFile } = useWorkspaceStore();

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    }, []);

    const processFiles = async (files: FileList) => {
        setError(null);
        setIsProcessing(true);

        const excelFiles: File[] = [];
        const invalidFiles: string[] = [];

        // Validate file types
        Array.from(files).forEach((file) => {
            if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
                excelFiles.push(file);
            } else {
                invalidFiles.push(file.name);
            }
        });

        if (invalidFiles.length > 0) {
            setError(`Only Excel files are accepted. Invalid files: ${invalidFiles.join(', ')}`);
            setIsProcessing(false);
            return;
        }

        if (excelFiles.length === 0) {
            setError('Please upload at least one Excel file.');
            setIsProcessing(false);
            return;
        }

        // Parse files
        try {
            for (const file of excelFiles) {
                const parsedFile = await parseExcelFile(file);
                addUploadedFile(parsedFile);
            }

            if (onFilesProcessed) {
                onFilesProcessed();
            }
        } catch (err) {
            setError(`Error parsing files: ${err instanceof Error ? err.message : 'Unknown error'}`);
        } finally {
            setIsProcessing(false);
        }
    };

    const handleDrop = useCallback(
        async (e: React.DragEvent) => {
            e.preventDefault();
            setIsDragging(false);

            const files = e.dataTransfer.files;
            if (files.length > 0) {
                await processFiles(files);
            }
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        []
    );

    const handleFileInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            await processFiles(files);
        }
    };

    return (
        <div className="space-y-4">
            <Card
                className={cn(
                    "border border-dashed border-neutral-300 dark:border-neutral-700 shadow-none bg-transparent transition-all duration-200 cursor-pointer group",
                    isDragging && "border-primary bg-primary/5 scale-[1.01]",
                    !isDragging && "hover:border-neutral-400 dark:hover:border-neutral-600 hover:bg-muted/20"
                )}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
            >
                <label className="flex flex-col items-center justify-center py-20 px-8 cursor-pointer">
                    <input
                        type="file"
                        multiple
                        accept=".xlsx,.xls"
                        onChange={handleFileInput}
                        className="hidden"
                        disabled={isProcessing}
                    />

                    <div className="flex flex-col items-center gap-6 text-center">
                        <div
                            className={cn(
                                "rounded-2xl p-4 transition-colors ring-1 ring-inset",
                                isDragging
                                    ? "bg-primary/10 ring-primary/20 text-primary"
                                    : "bg-background ring-neutral-200 dark:ring-neutral-800 text-muted-foreground group-hover:text-foreground group-hover:ring-neutral-300 dark:group-hover:ring-neutral-700"
                            )}
                        >
                            {isProcessing ? (
                                <FileSpreadsheet className="h-8 w-8 animate-pulse" />
                            ) : (
                                <Upload className="h-8 w-8" />
                            )}
                        </div>

                        <div className="space-y-2">
                            <h3 className="text-xl font-semibold tracking-tight">
                                {isProcessing
                                    ? "Processing files..."
                                    : isDragging
                                        ? "Drop files here"
                                        : "Drop your Excel files"}
                            </h3>
                            <p className="text-sm text-muted-foreground max-w-xs mx-auto">
                                We will detect headers and validate automatically.
                            </p>
                            {!isProcessing && !isDragging && (
                                <div className="pt-2">
                                    <button
                                        onClick={(e) => { e.preventDefault(); /* TODO: Load sample files */ }}
                                        className="text-xs text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-1"
                                    >
                                        <span>No data?</span>
                                        <span className="underline decoration-muted-foreground/50 hover:decoration-primary">Try our sample files</span>
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </label>
            </Card>

            {error && (
                <Card className="border-destructive bg-destructive/10 p-4">
                    <div className="flex items-start gap-3">
                        <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
                        <div className="flex-1">
                            <h4 className="font-semibold text-destructive">Error</h4>
                            <p className="text-sm text-destructive/90 mt-1">{error}</p>
                        </div>
                    </div>
                </Card>
            )}
        </div>
    );
}
