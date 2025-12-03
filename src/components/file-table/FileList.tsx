import { Trash2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { ScrollArea } from '../ui/scroll-area';
import { useWorkspaceStore } from '../../store/useWorkspaceStore';

export function FileList() {
    const { uploadedFiles, removeUploadedFile } = useWorkspaceStore();

    if (uploadedFiles.length === 0) {
        return null;
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-lg">Uploaded Files ({uploadedFiles.length})</CardTitle>
            </CardHeader>
            <CardContent>
                <ScrollArea className="max-h-[300px]">
                    <div className="space-y-2">
                        {uploadedFiles.map((file) => (
                            <div
                                key={file.fileId}
                                className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-accent transition-colors"
                            >
                                <div className="flex-1 min-w-0">
                                    <p className="font-medium text-sm truncate">{file.fileName}</p>
                                    <div className="flex items-center gap-3 mt-1">
                                        <span className="text-xs text-muted-foreground">
                                            {file.rows.length} rows
                                        </span>
                                        <Badge variant="secondary" className="text-xs">
                                            {file.headers.length} columns
                                        </Badge>
                                    </div>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => removeUploadedFile(file.fileId)}
                                    className="ml-2 flex-shrink-0"
                                >
                                    <Trash2 className="h-4 w-4 text-destructive" />
                                </Button>
                            </div>
                        ))}
                    </div>
                </ScrollArea>
            </CardContent>
        </Card>
    );
}
