import { projects as fallback, type Project } from "~/data/projects";

export function useProjects() {
  const { data } = useAsyncData<Project[]>(
    "github-projects",
    () => $fetch<Project[]>("/api/projects"),
    { default: () => fallback },
  );

  return { projects: data };
}
