import { useMutation, useQueryClient } from "@tanstack/react-query";
import NotionTaskService from "#/api/notion-service/notion-service.api";
import {
  displayErrorToast,
  displaySuccessToast,
} from "#/utils/custom-toast-handlers";

interface UpdateNotionStatusParams {
  pageId: string;
  status: string;
  statusPropertyName?: string;
}

/**
 * Hook to update the status of a Notion task
 */
export function useUpdateNotionStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      pageId,
      status,
      statusPropertyName,
    }: UpdateNotionStatusParams) => {
      return NotionTaskService.updateStatus(pageId, status, statusPropertyName);
    },
    onSuccess: (data) => {
      displaySuccessToast(data.message || "Task status updated");
      // Invalidate tasks query to refetch
      queryClient.invalidateQueries({ queryKey: ["notion-tasks"] });
    },
    onError: (error: Error) => {
      displayErrorToast(error.message || "Failed to update task status");
    },
  });
}
