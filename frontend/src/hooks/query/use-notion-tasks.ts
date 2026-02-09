import { useQuery } from "@tanstack/react-query";
import NotionTaskService, {
  NotionTask,
} from "#/api/notion-service/notion-service.api";
import { useSettings } from "./use-settings";

/**
 * Hook to fetch Notion tasks from the configured database
 * @param statusFilter - Optional filter by status (e.g., 'To Do', 'Bug')
 * @param enabled - Whether the query should be enabled (default: based on Notion configuration)
 */
export function useNotionTasks(statusFilter?: string, enabled?: boolean) {
  const { data: settings } = useSettings();

  // Only enable if Notion is configured
  const isNotionConfigured = settings?.notion_api_key_set === true;
  const shouldFetch = enabled !== undefined ? enabled : isNotionConfigured;

  return useQuery<NotionTask[], Error>({
    queryKey: ["notion-tasks", statusFilter],
    queryFn: () => NotionTaskService.getTasks(statusFilter),
    enabled: shouldFetch,
    staleTime: 30000, // Consider data fresh for 30 seconds
    refetchOnWindowFocus: false,
  });
}
