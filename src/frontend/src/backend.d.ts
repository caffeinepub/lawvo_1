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
export interface GuidanceHistory {
    id: bigint;
    queryText: string;
    timestamp: Time;
    resultSummary: string;
}
export interface Case {
    id: bigint;
    status: CaseStatus;
    issueType: string;
    title: string;
    createdDate: Time;
    description: string;
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
    addCase(newCase: Case): Promise<void>;
    addDocument(doc: UploadedDocument): Promise<void>;
    addGuidanceHistory(entry: GuidanceHistory): Promise<void>;
    getCases(): Promise<Array<Case>>;
    getDocuments(): Promise<Array<UploadedDocument>>;
    getGuidanceHistory(): Promise<Array<GuidanceHistory>>;
    getLawyerProfiles(): Promise<Array<Lawyer>>;
    getUserLanguage(): Promise<Language | null>;
    initialize(): Promise<void>;
    setUserLanguage(lang: Language): Promise<void>;
}
