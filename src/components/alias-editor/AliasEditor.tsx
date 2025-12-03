import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Tag, ArrowRight, Sparkles } from 'lucide-react';
import { useWorkspaceStore } from '../../store/useWorkspaceStore';
import { createAlias } from '../../libs/alias-logic';
import { cn } from '../../libs/utils';

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
        <Card className="shadow-sm border-neutral-200 dark:border-neutral-800">
            <CardHeader className="pb-4">
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
                        <Tag className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                        <CardTitle className="text-lg font-semibold">Define Header Aliases</CardTitle>
                        <CardDescription className="mt-1">
                            Give meaningful names to your header groups for easier analysis
                        </CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="grid gap-4 sm:grid-cols-2">
                    {itemsToAlias.map((item) => (
                        <div
                            key={item.id}
                            className="p-5 rounded-xl border bg-card hover:shadow-md transition-all duration-200 group"
                        >
                            <div className="space-y-4">
                                <div>
                                    <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 block">
                                        Original Headers
                                    </Label>
                                    <div className="flex flex-wrap gap-1.5 min-h-[24px]">
                                        {item.headers.map((header, hIndex) => (
                                            <span
                                                key={hIndex}
                                                className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-medium bg-muted text-muted-foreground border border-transparent group-hover:border-neutral-200 dark:group-hover:border-neutral-700 transition-colors"
                                            >
                                                {header}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                        <ArrowRight className="h-4 w-4 text-muted-foreground/50" />
                                    </div>
                                    <Input
                                        id={`alias-${item.id}`}
                                        placeholder={item.name}
                                        value={localAliases[item.id] || ''}
                                        onChange={(e) => handleAliasChange(item.id, e.target.value)}
                                        className={cn(
                                            "pl-9 bg-muted/30 border-neutral-200 dark:border-neutral-800 focus:bg-background transition-all",
                                            localAliases[item.id] && "border-purple-500/50 ring-2 ring-purple-500/10"
                                        )}
                                    />
                                </div>

                                <div className="flex items-center gap-2">
                                    <Sparkles className="h-3 w-3 text-purple-500" />
                                    <p className="text-[10px] text-muted-foreground">
                                        {localAliases[item.id] ? (
                                            <>
                                                Mapped as <span className="font-medium text-foreground">{localAliases[item.id]}</span>
                                            </>
                                        ) : (
                                            "Enter a standardized name for analysis"
                                        )}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="pt-4 flex justify-end">
                    <Button onClick={handleSaveAliases} size="lg" className="px-8">
                        Save Aliases & Continue
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
