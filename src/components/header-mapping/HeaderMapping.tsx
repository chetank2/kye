import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Link2, Plus, X } from 'lucide-react';
import { useWorkspaceStore, type HeaderGroup } from '../../store/useWorkspaceStore';
import { suggestHeaderMappings } from '../../libs/find-common-headers';

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
        <Card>
            <CardHeader>
                <CardTitle>Manual Header Mapping</CardTitle>
                <CardDescription>
                    Map similar headers across files to create common field groups
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                {/* Current mappings */}
                {headerGroups.length > 0 && (
                    <div className="space-y-3">
                        <h4 className="text-sm font-semibold">Mapped Header Groups</h4>
                        {headerGroups.map((group) => (
                            <div key={group.id} className="p-3 rounded-lg border bg-card">
                                <div className="flex items-start justify-between gap-2">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-2">
                                            <Link2 className="h-4 w-4 text-primary" />
                                            <span className="font-medium text-sm">{group.groupName}</span>
                                        </div>
                                        <div className="space-y-1">
                                            {group.headers.map((h, index) => (
                                                <div key={index} className="flex items-center gap-2 text-xs">
                                                    <Badge variant="outline" className="font-mono">
                                                        {h.fileName}
                                                    </Badge>
                                                    <span className="text-muted-foreground">→</span>
                                                    <span>{h.header}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => removeHeaderGroup(group.id)}
                                        className="flex-shrink-0"
                                    >
                                        <X className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Suggestions */}
                {suggestions.length > 0 && (
                    <div className="space-y-3">
                        <h4 className="text-sm font-semibold">Suggested Mappings</h4>
                        <p className="text-xs text-muted-foreground">
                            These headers appear similar and can be grouped together
                        </p>
                        {suggestions.map((suggestion, index) => (
                            <div key={index} className="p-3 rounded-lg border bg-muted/50">
                                <div className="flex items-start justify-between gap-2">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className="font-medium text-sm">{suggestion.groupName}</span>
                                            <Badge variant="secondary" className="text-xs">
                                                {Math.round(suggestion.similarity * 100)}% match
                                            </Badge>
                                        </div>
                                        <div className="space-y-1">
                                            {suggestion.headers.map((h, hIndex) => (
                                                <div key={hIndex} className="flex items-center gap-2 text-xs">
                                                    <Badge variant="outline" className="font-mono">
                                                        {h.fileName}
                                                    </Badge>
                                                    <span className="text-muted-foreground">→</span>
                                                    <span>{h.header}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleAcceptSuggestion(suggestion)}
                                    >
                                        <Plus className="h-3 w-3 mr-1" />
                                        Accept
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {suggestions.length === 0 && headerGroups.length === 0 && (
                    <p className="text-sm text-muted-foreground text-center py-8">
                        No similar headers found. You can manually create header groups by selecting from the
                        headers above.
                    </p>
                )}
            </CardContent>
        </Card>
    );
}
