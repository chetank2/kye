import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';
import { Tag, ArrowRight } from 'lucide-react';
import { useWorkspaceStore } from '../../store/useWorkspaceStore';
import { createAlias } from '../../libs/alias-logic';

export function AliasEditor() {
    const { headerGroups, commonHeaders, uploadedFiles, addHeaderAlias } =
        useWorkspaceStore();

    const [localAliases, setLocalAliases] = useState<Record<string, string>>({});

    // Get all items to alias (either header groups or common headers)
    const itemsToAlias = headerGroups.length > 0
        ? headerGroups.map(group => ({
            id: group.id,
            name: group.groupName,
            headers: group.headers.map(h => h.header),
        }))
        : commonHeaders.length > 0
            ? commonHeaders.map(header => ({
                id: header,
                name: header,
                headers: uploadedFiles
                    .map(f => {
                        const index = f.normalizedHeaders.indexOf(header);
                        return index !== -1 ? f.headers[index] : null;
                    })
                    .filter(Boolean) as string[],
            }))
            : [];

    const handleAliasChange = (itemId: string, value: string) => {
        setLocalAliases((prev) => ({ ...prev, [itemId]: value }));
    };

    const handleSaveAliases = () => {
        Object.entries(localAliases).forEach(([itemId, aliasName]) => {
            if (aliasName.trim()) {
                const item = itemsToAlias.find((i) => i.id === itemId);
                if (item) {
                    const alias = createAlias(aliasName, item.headers);
                    addHeaderAlias(alias);
                }
            }
        });
    };

    if (itemsToAlias.length === 0) {
        return null;
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Tag className="h-5 w-5" />
                    Define Header Aliases (Optional)
                </CardTitle>
                <CardDescription>
                    Give meaningful names to your header groups for easier analysis
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                {itemsToAlias.map((item, index) => (
                    <div key={item.id}>
                        {index > 0 && <Separator className="my-6" />}
                        <div className="space-y-3">
                            <div className="flex items-start gap-3">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Label className="text-sm font-semibold">Original Headers</Label>
                                    </div>
                                    <div className="flex flex-wrap gap-1.5 mb-3">
                                        {item.headers.map((header, hIndex) => (
                                            <Badge key={hIndex} variant="secondary" className="font-mono text-xs">
                                                {header}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-2 text-muted-foreground">
                                <ArrowRight className="h-4 w-4" />
                                <span className="text-xs">Alias as</span>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor={`alias-${item.id}`} className="text-sm">
                                    Alias Name
                                </Label>
                                <Input
                                    id={`alias-${item.id}`}
                                    placeholder={`e.g., ${item.name === item.headers[0] ? 'Transaction Date' : item.name}`}
                                    value={localAliases[item.id] || ''}
                                    onChange={(e) => handleAliasChange(item.id, e.target.value)}
                                    className="max-w-md"
                                />
                                {localAliases[item.id] && (
                                    <p className="text-xs text-muted-foreground">
                                        All occurrences of {item.headers.join(', ')} will be referred to as{' '}
                                        <span className="font-semibold text-foreground">{localAliases[item.id]}</span>
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                ))}

                <div className="pt-4">
                    <Button onClick={handleSaveAliases} className="w-full" size="lg">
                        Save Aliases & Continue
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
