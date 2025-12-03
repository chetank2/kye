import { create } from 'zustand';
import type { ParsedFile } from '../libs/excel-parser';
import type { HeaderAlias } from '../libs/alias-logic';

export interface Session {
    id: string;
    title: string;
    createdAt: Date;
    updatedAt: Date;
    fileCount: number;
}

export interface HeaderGroup {
    id: string;
    groupName: string;
    headerIds: string[];
    headers: Array<{
        fileId: string;
        fileName: string;
        header: string;
        normalizedHeader: string;
    }>;
}

export interface ChatMessage {
    id: string;
    role: 'user' | 'assistant';
    message: string;
    metadata?: {
        chart?: {
            type: 'bar' | 'line' | 'pie';
            data: any[];
        };
        downloadUrl?: string;
    };
    createdAt: Date;
}

interface WorkspaceStore {
    // Session management
    sessions: Session[];
    currentSessionId: string | null;

    // File management
    uploadedFiles: ParsedFile[];

    // Header management
    commonHeaders: string[];
    headerGroups: HeaderGroup[];
    headerAliases: HeaderAlias[];

    // Chat
    chatMessages: ChatMessage[];
    isChatOpen: boolean;

    // UI state
    isAnalyzing: boolean;

    // Actions
    createSession: (title: string) => void;
    setCurrentSession: (id: string) => void;
    addUploadedFile: (file: ParsedFile) => void;
    removeUploadedFile: (fileId: string) => void;
    setCommonHeaders: (headers: string[]) => void;
    addHeaderGroup: (group: HeaderGroup) => void;
    updateHeaderGroup: (id: string, group: Partial<HeaderGroup>) => void;
    removeHeaderGroup: (id: string) => void;
    addHeaderAlias: (alias: HeaderAlias) => void;
    updateHeaderAlias: (id: string, alias: string) => void;
    removeHeaderAlias: (id: string) => void;
    addChatMessage: (message: Omit<ChatMessage, 'id' | 'createdAt'>) => void;
    setChatOpen: (open: boolean) => void;
    setIsAnalyzing: (analyzing: boolean) => void;
    clearWorkspace: () => void;
}

export const useWorkspaceStore = create<WorkspaceStore>((set) => ({
    sessions: [],
    currentSessionId: null,
    uploadedFiles: [],
    commonHeaders: [],
    headerGroups: [],
    headerAliases: [],
    chatMessages: [],
    isChatOpen: false,
    isAnalyzing: false,

    createSession: (title) => {
        const newSession: Session = {
            id: crypto.randomUUID(),
            title,
            createdAt: new Date(),
            updatedAt: new Date(),
            fileCount: 0,
        };
        set((state) => ({
            sessions: [newSession, ...state.sessions],
            currentSessionId: newSession.id,
        }));
    },

    setCurrentSession: (id) => set({ currentSessionId: id }),

    addUploadedFile: (file) =>
        set((state) => ({
            uploadedFiles: [...state.uploadedFiles, file],
        })),

    removeUploadedFile: (fileId) =>
        set((state) => ({
            uploadedFiles: state.uploadedFiles.filter((f) => f.fileId !== fileId),
        })),

    setCommonHeaders: (headers) => set({ commonHeaders: headers }),

    addHeaderGroup: (group) =>
        set((state) => ({
            headerGroups: [...state.headerGroups, group],
        })),

    updateHeaderGroup: (id, updates) =>
        set((state) => ({
            headerGroups: state.headerGroups.map((g) =>
                g.id === id ? { ...g, ...updates } : g
            ),
        })),

    removeHeaderGroup: (id) =>
        set((state) => ({
            headerGroups: state.headerGroups.filter((g) => g.id !== id),
        })),

    addHeaderAlias: (alias) =>
        set((state) => ({
            headerAliases: [...state.headerAliases, alias],
        })),

    updateHeaderAlias: (id, alias) =>
        set((state) => ({
            headerAliases: state.headerAliases.map((a) =>
                a.id === id ? { ...a, alias } : a
            ),
        })),

    removeHeaderAlias: (id) =>
        set((state) => ({
            headerAliases: state.headerAliases.filter((a) => a.id !== id),
        })),

    addChatMessage: (message) =>
        set((state) => ({
            chatMessages: [
                ...state.chatMessages,
                {
                    ...message,
                    id: crypto.randomUUID(),
                    createdAt: new Date(),
                },
            ],
        })),

    setChatOpen: (open) => set({ isChatOpen: open }),

    setIsAnalyzing: (analyzing) => set({ isAnalyzing: analyzing }),

    clearWorkspace: () =>
        set({
            uploadedFiles: [],
            commonHeaders: [],
            headerGroups: [],
            headerAliases: [],
            chatMessages: [],
            isChatOpen: false,
            isAnalyzing: false,
        }),
}));
