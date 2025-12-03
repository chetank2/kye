import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Button } from '../ui/button';
import { Link2, Plus, X, ArrowRight } from 'lucide-react';
import { useWorkspaceStore, type HeaderGroup } from '../../store/useWorkspaceStore';
import { suggestHeaderMappings } from '../../libs/find-common-headers';
import { cn } from '../../libs/utils';

export function HeaderMapping() {
    const { uploadedFiles, commonHeaders, headerGroups, addHeaderGroup, removeHeaderGroup } =
        useWorkspaceStore();

    const [suggestions, setSuggestions] = useState<
        Array<{
            groupName: string;
            headers: Array<{
                fileId: string;
                fileName: string;
                header: string;
                normalizedHeader: string;
            }>;
            similarity: number;
        }>
    >([]);

    useEffect(() => {
        if (uploadedFiles.length >= 2 && commonHeaders.length === 0) {
            // Get suggestions for manual mapping
            const mappingSuggestions = suggestHeaderMappings(uploadedFiles, 0.5);
            setSuggestions(mappingSuggestions);
        }
    }, [uploadedFiles, commonHeaders]);

    const handleAcceptSuggestion = (suggestion: typeof suggestions[0]) => {
        const newGroup: HeaderGroup = {
            id: crypto.randomUUID(),
            groupName: suggestion.groupName,
            headerIds: suggestion.headers.map((h) => h.normalizedHeader),
            headers: suggestion.headers,
        };
        addHeaderGroup(newGroup);

        // Remove this suggestion
        setSuggestions((prev) => prev.filter((s) => s.groupName !== suggestion.groupName));
    };

    if (uploadedFiles.length < 2 || (commonHeaders.length > 0 && suggestions.length === 0)) {
        return null;
    }

    return (
        <Card className="shadow-sm border-neutral-200 dark:border-neutral-800">
            <CardHeader className="pb-4">
                <CardTitle className="text-lg font-semibold">Manual Header Mapping</CardTitle>
                <CardDescription>
                    Map similar headers across files to create common field groups
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
                {/* Current mappings */}
                {headerGroups.length > 0 && (
                    <div className="space-y-4">
                        <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Mapped Header Groups</h4>
                        <div className="grid gap-3 sm:grid-cols-2">
                            {headerGroups.map((group) => (
                                <div
                                    key={group.id}
                                    className="p-4 rounded-xl border border-blue-100 bg-blue-50/50 dark:bg-blue-900/10 dark:border-blue-800/30 transition-all hover:shadow-sm group"
                                >
                                    <div className="flex items-start justify-between gap-2">
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-3">
                                                <div className="h-6 w-6 rounded-md bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center text-blue-600 dark:text-blue-400">
                                                    <Link2 className="h-3.5 w-3.5" />
                                                </div>
                                                <span className="font-medium text-sm text-blue-900 dark:text-blue-100">{group.groupName}</span>
                                            </div>
                                            <div className="space-y-2">
                                                {group.headers.map((h, index) => (
                                                    <div key={index} className="flex items-center gap-2 text-xs">
                                                        <span className="px-1.5 py-0.5 rounded-md bg-background/80 border text-muted-foreground font-medium text-[10px] truncate max-w-[80px]">
                                                            {h.fileName}
                                                        </span>
                                                        <ArrowRight className="h-3 w-3 text-blue-300 dark:text-blue-700 flex-shrink-0" />
                                                        <span className="font-medium text-foreground truncate">{h.header}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => removeHeaderGroup(group.id)}
                                            className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity text-blue-400 hover:text-blue-600 hover:bg-blue-100/50 dark:hover:bg-blue-900/30"
                                        >
                                            <X className="h-3.5 w-3.5" />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Suggestions */}
                {suggestions.length > 0 && (
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Suggested Mappings</h4>
                            <span className="text-[10px] text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                                {suggestions.length} suggestions found
                            </span>
                        </div>

                        <div className="grid gap-3">
                            {suggestions.map((suggestion, index) => (
                                <div
                                    key={index}
                                    className="p-4 rounded-xl border border-dashed border-neutral-200 dark:border-neutral-800 hover:border-primary/30 hover:bg-muted/30 transition-all duration-200"
                                >
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-3 mb-3">
                                                <span className="font-medium text-sm">{suggestion.groupName}</span>
                                                <span className={cn(
                                                    "text-[10px] px-1.5 py-0.5 rounded-full font-medium",
                                                    suggestion.similarity > 0.8
                                                        ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                                                        : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                                                )}>
                                                    {Math.round(suggestion.similarity * 100)}% match
                                                </span>
                                            </div>
                                            <div className="flex flex-wrap gap-x-4 gap-y-2">
                                                {suggestion.headers.map((h, hIndex) => (
                                                    <div key={hIndex} className="flex items-center gap-1.5 text-xs">
                                                        <span className="text-muted-foreground text-[10px]">{h.fileName}</span>
                                                        <span className="text-neutral-300 dark:text-neutral-700">/</span>
                                                        <span className="font-medium">{h.header}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleAcceptSuggestion(suggestion)}
                                            className="h-8 text-xs hover:border-primary hover:text-primary"
                                        >
                                            <Plus className="h-3 w-3 mr-1.5" />
                                            Accept
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {suggestions.length === 0 && headerGroups.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-12 text-center border-2 border-dashed rounded-xl border-muted">
                        <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center mb-3">
                            <Link2 className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <p className="text-sm font-medium text-foreground">No similar headers found</p>
                        <p className="text-xs text-muted-foreground mt-1 max-w-xs">
                            You can manually create header groups by selecting from the headers above.
                        </p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
