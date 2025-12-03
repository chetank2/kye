import { Sidebar } from '../components/sidebar/Sidebar';
import { FileDropzone } from '../components/file-dropzone/FileDropzone';
import { FileList } from '../components/file-table/FileList';
import { HeaderTable } from '../components/file-table/HeaderTable';
import { HeaderMapping } from '../components/header-mapping/HeaderMapping';
import { AliasEditor } from '../components/alias-editor/AliasEditor';
import { AnalysisLoader } from '../components/analysis-loader/AnalysisLoader';
import { ChatDrawer } from '../components/chat-drawer/ChatDrawer';
import { useWorkspaceStore } from '../store/useWorkspaceStore';
import { useEffect } from 'react';
import { cn } from '../libs/utils';

export function Workspace() {
    const { currentSessionId, createSession, isChatOpen } = useWorkspaceStore();

    useEffect(() => {
        // Create initial session if none exists
        if (!currentSessionId) {
            createSession('New Analysis Session');
        }
    }, [currentSessionId, createSession]);

    return (
        <div className="flex h-screen bg-background overflow-hidden">
            {/* Left Sidebar */}
            <Sidebar />

            {/* Main Content Area */}
            <div className={cn("flex-1 min-w-0 overflow-y-auto transition-all duration-300", isChatOpen && "mr-[500px]")}>
                <div className="container max-w-4xl mx-auto p-6 space-y-6">
                    {/* Header */}
                    <div className="space-y-2">
                        <h1 className="text-3xl font-bold tracking-tight">
                            Upload Excel Files for Analysis
                        </h1>
                        <p className="text-muted-foreground">
                            Upload multiple Excel files to find common headers and analyze your data with AI
                        </p>
                    </div>

                    {/* File Upload Section */}
                    <FileDropzone />

                    {/* Uploaded Files List */}
                    <FileList />

                    {/* Header Detection Table */}
                    <HeaderTable />

                    {/* Header Mapping (shown when needed) */}
                    <HeaderMapping />

                    {/* Alias Editor (shown when headers are mapped) */}
                    <AliasEditor />

                    {/* Analysis Trigger */}
                    <AnalysisLoader />
                </div>
            </div>

            {/* Right Chat Drawer */}
            <ChatDrawer />
        </div>
    );
}
