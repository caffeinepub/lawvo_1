import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  Case,
  GuidanceHistory,
  Language,
  UploadedDocument,
} from "../backend.d";
import { useActor } from "./useActor";

export function useLawyerProfiles() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["lawyers"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getLawyerProfiles();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCases() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["cases"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getCases();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useDocuments() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["documents"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getDocuments();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGuidanceHistory() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["guidanceHistory"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getGuidanceHistory();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useUserLanguage() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["userLanguage"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getUserLanguage();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSetUserLanguage() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (lang: Language) => {
      if (!actor) return;
      return actor.setUserLanguage(lang);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["userLanguage"] }),
  });
}

export function useAddCase() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (c: Case) => {
      if (!actor) return;
      return actor.addCase(c);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["cases"] }),
  });
}

export function useAddDocument() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (d: UploadedDocument) => {
      if (!actor) return;
      return actor.addDocument(d);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["documents"] }),
  });
}

export function useAddGuidanceHistory() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (e: GuidanceHistory) => {
      if (!actor) return;
      return actor.addGuidanceHistory(e);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["guidanceHistory"] }),
  });
}
