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
export type Time = bigint;
export interface Feedback {
    comment: string;
    timestamp: Time;
    rating: bigint;
    principalId: Principal;
}
export interface GuidanceHistory {
    id: bigint;
    queryText: string;
    timestamp: Time;
    resultSummary: string;
}
export interface LawyerProfile {
    name: string;
    specialization: string;
    phone: string;
    barNumber: string;
    location: string;
    principalId: Principal;
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
    assignCaseToLawyer(arg0: {
        lawyerPrincipal: Principal;
        caseId: bigint;
    }): Promise<boolean>;
    getAllFeedback(): Promise<Array<Feedback>>;
    getCases(): Promise<Array<Case>>;
    getDocuments(): Promise<Array<UploadedDocument>>;
    getGuidanceHistory(): Promise<Array<GuidanceHistory>>;
    getLawyerCases(): Promise<Array<Case>>;
    getLawyerProfile(): Promise<LawyerProfile | null>;
    getLawyerProfiles(): Promise<Array<Lawyer>>;
    getMyProfile(): Promise<UserProfile | null>;
    getUserFeedback(): Promise<Feedback | null>;
    getUserLanguage(): Promise<Language | null>;
    initialize(): Promise<void>;
    listAllLawyers(): Promise<Array<LawyerProfile>>;
    listAllUsersAdmin(): Promise<Array<UserProfile>>;
    registerLawyer(name: string, phone: string, barNumber: string, specialization: string, location: string): Promise<boolean>;
    registerOrUpdateUser(name: string, phone: string): Promise<boolean>;
    setUserLanguage(lang: Language): Promise<void>;
    submitFeedback(rating: bigint, comment: string): Promise<boolean>;
    updateCaseStatus(arg0: {
        caseId: bigint;
        newStatus: CaseStatus;
    }): Promise<boolean>;
}
