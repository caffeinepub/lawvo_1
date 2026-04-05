import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface UploadedDocument {
    id: bigint;
    analysisSummary: string;
    filename: string;
    uploadDate: Time;
}
export interface Lawyer {
    id: bigint;
    bio: string;
    reviewsCount: bigint;
    name: string;
    available: boolean;
    specialization: string;
    rating: number;
    location: string;
}
export interface WaitlistEntry {
    name: string;
    email: string;
    timestamp: Time;
    phone: string;
}
export type Time = bigint;
export interface Feedback {
    comment: string;
    timestamp: Time;
    rating: bigint;
    principalId: Principal;
}
export interface LoginRecord {
    name: string;
    role: string;
    timestamp: Time;
    phone: string;
    principalId: Principal;
}
export interface LawyerProfile {
    name: string;
    specialization: string;
    phone: string;
    barNumber: string;
    location: string;
    principalId: Principal;
}
export interface GuidanceHistory {
    id: bigint;
    queryText: string;
    timestamp: Time;
    resultSummary: string;
}
export interface ChatbotEntry {
    id: bigint;
    tip: string;
    title: string;
    documents: Array<string>;
    cost: string;
    icon: string;
    whatToDo: string;
    successRate: string;
    timeRequired: string;
    topicKey: string;
    keywords: Array<string>;
    lawyerType: string;
    intro: string;
}
export interface UserProfile {
    name: string;
    phone: string;
    principalId: Principal;
}
export interface Case {
    id: bigint;
    status: CaseStatus;
    issueType: string;
    title: string;
    lastUpdated: Time;
    createdDate: Time;
    description: string;
    assignedLawyer?: Principal;
}
export enum CaseStatus {
    Active = "Active",
    Resolved = "Resolved",
    Pending = "Pending"
}
export enum Language {
    Telugu = "Telugu",
    Kannada = "Kannada",
    Tamil = "Tamil",
    Bengali = "Bengali",
    Hindi = "Hindi",
    English = "English"
}
export interface backendInterface {
    addCase(newCase: Case): Promise<{
        id: bigint;
    }>;
    addDocument(doc: UploadedDocument): Promise<{
        id: bigint;
    }>;
    addGuidanceHistory(entry: GuidanceHistory): Promise<{
        id: bigint;
    }>;
    addWaitlistEntry(name: string, email: string, phone: string): Promise<boolean>;
    assignCaseToLawyer(arg0: {
        lawyerPrincipal: Principal;
        caseId: bigint;
    }): Promise<boolean>;
    deleteLawyer(principalId: Principal): Promise<boolean>;
    deleteUser(principalId: Principal): Promise<boolean>;
    getAllFeedback(): Promise<Array<Feedback>>;
    getAllLoginRecords(): Promise<Array<LoginRecord>>;
    getAllWaitlistEntries(): Promise<Array<WaitlistEntry>>;
    getCases(): Promise<Array<Case>>;
    getChatbotEntries(): Promise<Array<ChatbotEntry>>;
    getDocuments(): Promise<Array<UploadedDocument>>;
    getGuidanceHistory(): Promise<Array<GuidanceHistory>>;
    getLawyerCases(): Promise<Array<Case>>;
    getLawyerProfile(): Promise<LawyerProfile | null>;
    getLawyerProfiles(): Promise<Array<Lawyer>>;
    getMyProfile(): Promise<UserProfile | null>;
    getMyWaitlistEntry(email: string): Promise<WaitlistEntry | null>;
    getUserFeedback(): Promise<Feedback | null>;
    getUserLanguage(): Promise<Language | null>;
    initialize(): Promise<void>;
    listAllLawyers(): Promise<Array<LawyerProfile>>;
    listAllUsersAdmin(): Promise<Array<UserProfile>>;
    registerLawyer(name: string, phone: string, barNumber: string, specialization: string, location: string): Promise<boolean>;
    registerLawyerLogin(name: string, phone: string): Promise<boolean>;
    registerOrUpdateUser(name: string, phone: string): Promise<boolean>;
    resetChatbotEntries(): Promise<boolean>;
    setUserLanguage(lang: Language): Promise<void>;
    submitFeedback(rating: bigint, comment: string): Promise<boolean>;
    updateCaseStatus(arg0: {
        caseId: bigint;
        newStatus: CaseStatus;
    }): Promise<boolean>;
    updateChatbotEntry(id: bigint, intro: string, whatToDo: string, documents: Array<string>, lawyerType: string, cost: string, timeRequired: string, successRate: string, tip: string): Promise<boolean>;
}
