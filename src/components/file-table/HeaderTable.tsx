import { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Badge } from '../ui/badge';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { useWorkspaceStore } from '../../store/useWorkspaceStore';
import { findCommonHeaders } from '../../libs/find-common-headers';
import { cn } from '../../libs/utils';

export function HeaderTable() {
    const { uploadedFiles, setCommonHeaders, commonHeaders } = useWorkspaceStore();

    useEffect(() => {
        if (uploadedFiles.length >= 2) {
            const result = findCommonHeaders(
                uploadedFiles.map((f) => ({
                    fileId: f.fileId,
                    normalizedHeaders: f.normalizedHeaders,
                }))
            );
            setCommonHeaders(result.commonHeaders);
        }
    }, [uploadedFiles, setCommonHeaders]);

    if (uploadedFiles.length === 0) {
        return null;
    }

    const hasCommonHeaders = commonHeaders.length > 0;

    return (
        <Card className="shadow-sm border-neutral-200 dark:border-neutral-800">
            <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="text-lg font-semibold">Detected Headers</CardTitle>
                        <CardDescription className="mt-1">
                            Headers extracted from uploaded files
                        </CardDescription>
                    </div>
                    {uploadedFiles.length >= 2 && (
                        <div className="flex items-center gap-2">
                            {hasCommonHeaders ? (
                                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 text-green-600 dark:text-green-400">
                                    <CheckCircle2 className="h-4 w-4" />
                                    <span className="text-xs font-medium">
                                        {commonHeaders.length} common {commonHeaders.length === 1 ? 'header' : 'headers'}
                                    </span>
                                </div>
                            ) : (
                                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-destructive/10 text-destructive">
                                    <AlertCircle className="h-4 w-4" />
                                    <span className="text-xs font-medium">
                                        No common headers
                                    </span>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </CardHeader>
            <CardContent>
                {!hasCommonHeaders && uploadedFiles.length >= 2 && (
                    <div className="mb-6 p-4 rounded-xl border border-destructive/20 bg-destructive/5">
                        <div className="flex items-start gap-3">
                            <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
                            <div>
                                <h4 className="font-medium text-destructive text-sm">No Matching Headers Found</h4>
                                <p className="text-xs text-destructive/80 mt-1">
                                    There are no matching headers between the files. Please map headers manually below.
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                <div className="rounded-xl border overflow-hidden">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-muted/50 hover:bg-muted/50">
                                <TableHead className="w-[200px] font-medium">File Name</TableHead>
                                <TableHead className="font-medium">Headers</TableHead>
                                <TableHead className="w-[100px] font-medium text-right">Count</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {uploadedFiles.map((file, i) => (
                                <TableRow key={file.fileId} className="odd:bg-muted/30 border-b-0 hover:bg-muted/50">
                                    <TableCell className="font-medium text-sm">{file.fileName}</TableCell>
                                    <TableCell>
                                        <div className="flex flex-wrap gap-1.5">
                                            {file.headers.map((header, index) => {
                                                const isCommon = commonHeaders.includes(file.normalizedHeaders[index]);
                                                return (
                                                    <span
                                                        key={index}
                                                        className={cn(
                                                            "inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium ring-1 ring-inset transition-colors",
                                                            isCommon
                                                                ? "bg-primary/10 text-primary ring-primary/20"
                                                                : "bg-muted text-muted-foreground ring-neutral-200 dark:ring-neutral-800"
                                                        )}
                                                    >
                                                        {header}
                                                    </span>
                                                );
                                            })}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <span className="text-xs text-muted-foreground font-medium">{file.headers.length}</span>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>

                {hasCommonHeaders && (
                    <div className="mt-6 p-4 rounded-xl border bg-green-500/5 border-green-500/10">
                        <h4 className="font-medium text-xs uppercase tracking-wider mb-3 text-green-600 dark:text-green-400">
                            Common Headers ({commonHeaders.length})
                        </h4>
                        <div className="flex flex-wrap gap-2">
                            {commonHeaders.map((header, index) => (
                                <span
                                    key={index}
                                    className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-green-500/10 text-green-700 dark:text-green-300 ring-1 ring-inset ring-green-500/20"
                                >
                                    {header}
                                </span>
                            ))}
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
