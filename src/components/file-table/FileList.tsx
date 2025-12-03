import { Trash2, FileSpreadsheet } from 'lucide-react';
import { Button } from '../ui/button';
import { useWorkspaceStore } from '../../store/useWorkspaceStore';

export function FileList() {
    const { uploadedFiles, removeUploadedFile } = useWorkspaceStore();

    if (uploadedFiles.length === 0) {
        return null;
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between px-1">
                <h3 className="text-sm font-medium text-muted-foreground">Uploaded Files ({uploadedFiles.length})</h3>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {uploadedFiles.map((file) => (
                    <div
                        key={file.fileId}
                        className="group relative flex items-center gap-3 p-3 rounded-xl border bg-card shadow-sm hover:shadow-md transition-all duration-200"
                    >
                        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                            <FileSpreadsheet className="h-5 w-5 text-primary" />
                        </div>

                        <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm truncate pr-6">{file.fileName}</p>
                            <div className="flex items-center gap-2 mt-0.5">
                                <span className="text-xs text-muted-foreground">
                                    {file.rows.length} rows
                                </span>
                                <span className="text-[10px] text-neutral-300 dark:text-neutral-700">•</span>
                                <span className="text-xs text-muted-foreground">
                                    {file.headers.length} cols
                                </span>
                            </div>
                        </div>

                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeUploadedFile(file.fileId)}
                            className="absolute right-2 top-2 h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
                        >
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>
                ))}
            </div>
        </div>
    );
}
