// API Type Definitions for KYE Backend

// =============================================
// REQUEST TYPES
// =============================================

export interface UploadFileRequest {
    sessionId: string;
    file: File;
}

export interface CompareHeadersRequest {
    sessionId: string;
}

export interface CreateHeaderGroupRequest {
    sessionId: string;
    groups: Array<{
        groupName: string;
        headerIds: string[];
    }>;
}

export interface SetHeaderAliasRequest {
    sessionId: string;
    headerGroupId: string;
    alias: string;
}

export interface AnalyzeDataRequest {
    sessionId: string;
    userQuery?: string;
    headerAliases: Record<string, string>;
}

export interface SendChatMessageRequest {
    sessionId: string;
    message: string;
}

export interface DownloadReportRequest {
    sessionId: string;
    chartData?: any;
}

// =============================================
// RESPONSE TYPES
// =============================================

export interface UploadFileResponse {
    fileId: string;
    headers: string[];
    normalizedHeaders: string[];
}

export interface CompareHeadersResponse {
    commonHeaders: string[];
    missingCommon: boolean;
    message?: string;
}

export interface CreateHeaderGroupResponse {
    success: boolean;
    groupIds: string[];
}

export interface SetHeaderAliasResponse {
    success: boolean;
}

export interface AnalyzeDataResponse {
    answer: string;
    chart?: {
        type: 'bar' | 'line' | 'pie';
        data: Array<Record<string, any>>;
    };
    downloadUrl?: string;
}

export interface SendChatMessageResponse {
    assistant: string;
    chart?: {
        type: 'bar' | 'line' | 'pie';
        data: Array<Record<string, any>>;
    };
    metadata?: Record<string, any>;
}

// =============================================
// ENTITY TYPES
// =============================================

export interface Session {
    id: string;
    title: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface FileEntity {
    id: string;
    sessionId: string;
    fileName: string;
    fileSize: number;
    filePath: string;
    uploadedAt: Date;
}

export interface FileHeader {
    id: string;
    fileId: string;
    originalHeader: string;
    normalizedHeader: string;
    createdAt: Date;
}

export interface HeaderGroup {
    id: string;
    sessionId: string;
    groupName: string;
    createdAt: Date;
}

export interface HeaderGroupItem {
    id: string;
    headerGroupId: string;
    headerId: string;
}

export interface HeaderAlias {
    id: string;
    sessionId: string;
    headerGroupId: string;
    aliasName: string;
    createdAt: Date;
}

export interface ChatMessage {
    id: string;
    sessionId: string;
    role: 'user' | 'assistant';
    message: string;
    metadata?: Record<string, any>;
    createdAt: Date;
}

// =============================================
// ERROR TYPES
// =============================================

export interface APIError {
    error: string;
    message: string;
    statusCode: number;
}
