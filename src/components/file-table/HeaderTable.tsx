import { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Badge } from '../ui/badge';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { useWorkspaceStore } from '../../store/useWorkspaceStore';
import { findCommonHeaders } from '../../libs/find-common-headers';

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
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle>Detected Headers</CardTitle>
                        <CardDescription className="mt-1">
                            Headers extracted from uploaded files
                        </CardDescription>
                    </div>
                    {uploadedFiles.length >= 2 && (
                        <div className="flex items-center gap-2">
                            {hasCommonHeaders ? (
                                <>
                                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                                    <span className="text-sm font-medium text-green-600">
                                        {commonHeaders.length} common {commonHeaders.length === 1 ? 'header' : 'headers'}
                                    </span>
                                </>
                            ) : (
                                <>
                                    <AlertCircle className="h-5 w-5 text-destructive" />
                                    <span className="text-sm font-medium text-destructive">
                                        No common headers
                                    </span>
                                </>
                            )}
                        </div>
                    )}
                </div>
            </CardHeader>
            <CardContent>
                {!hasCommonHeaders && uploadedFiles.length >= 2 && (
                    <div className="mb-4 p-4 rounded-lg border border-destructive bg-destructive/10">
                        <div className="flex items-start gap-3">
                            <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
                            <div>
                                <h4 className="font-semibold text-destructive">No Matching Headers Found</h4>
                                <p className="text-sm text-destructive/90 mt-1">
                                    There are no matching headers between the files. Please map headers manually below.
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[200px]">File Name</TableHead>
                                <TableHead>Headers</TableHead>
                                <TableHead className="w-[100px]">Count</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {uploadedFiles.map((file) => (
                                <TableRow key={file.fileId}>
                                    <TableCell className="font-medium">{file.fileName}</TableCell>
                                    <TableCell>
                                        <div className="flex flex-wrap gap-1">
                                            {file.headers.map((header, index) => {
                                                const isCommon = commonHeaders.includes(file.normalizedHeaders[index]);
                                                return (
                                                    <Badge
                                                        key={index}
                                                        variant={isCommon ? 'default' : 'secondary'}
                                                        className="text-xs"
                                                    >
                                                        {header}
                                                    </Badge>
                                                );
                                            })}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline">{file.headers.length}</Badge>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>

                {hasCommonHeaders && (
                    <div className="mt-4 p-4 rounded-lg border bg-green-50 dark:bg-green-950/20">
                        <h4 className="font-semibold text-sm mb-2 text-green-700 dark:text-green-400">
                            Common Headers ({commonHeaders.length})
                        </h4>
                        <div className="flex flex-wrap gap-1">
                            {commonHeaders.map((header, index) => (
                                <Badge key={index} className="bg-green-600 hover:bg-green-700">
                                    {header}
                                </Badge>
                            ))}
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
