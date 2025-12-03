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
                    "border-2 border-dashed transition-all duration-200 cursor-pointer",
                    isDragging && "border-primary bg-primary/5 scale-[1.02]",
                    !isDragging && "border-border hover:border-primary/50"
                )}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
            >
                <label className="flex flex-col items-center justify-center p-12 cursor-pointer">
                    <input
                        type="file"
                        multiple
                        accept=".xlsx,.xls"
                        onChange={handleFileInput}
                        className="hidden"
                        disabled={isProcessing}
                    />

                    <div className="flex flex-col items-center gap-4 text-center">
                        <div
                            className={cn(
                                "rounded-full p-4 transition-colors",
                                isDragging ? "bg-primary/10" : "bg-muted"
                            )}
                        >
                            {isProcessing ? (
                                <FileSpreadsheet className="h-10 w-10 text-muted-foreground animate-pulse" />
                            ) : (
                                <Upload
                                    className={cn(
                                        "h-10 w-10 transition-colors",
                                        isDragging ? "text-primary" : "text-muted-foreground"
                                    )}
                                />
                            )}
                        </div>

                        <div className="space-y-2">
                            <h3 className="text-lg font-semibold">
                                {isProcessing
                                    ? "Processing files..."
                                    : isDragging
                                        ? "Drop files here"
                                        : "Upload Excel Files"}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                                Drag and drop .xlsx or .xls files here, or click to browse
                            </p>
                        </div>

                        <p className="text-xs text-muted-foreground">
                            Upload multiple files to analyze common headers
                        </p>
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
