import React from "react";
import { useParams } from "react-router";
import { useAgentState } from "#/hooks/use-agent-state";
import { useTaskPolling } from "#/hooks/query/use-task-polling";
import { useActiveConversation } from "#/hooks/query/use-active-conversation";
import { useUnifiedPauseConversationSandbox } from "#/hooks/mutation/use-unified-stop-conversation";
import { useUnifiedResumeConversationSandbox } from "#/hooks/mutation/use-unified-start-conversation";
import { useUserProviders } from "#/hooks/use-user-providers";
import { getStatusColor } from "#/utils/utils";
import { AgentState } from "#/types/agent-state";
import DebugStackframeDot from "#/icons/debug-stackframe-dot.svg?react";
import { ServerStatusContextMenu } from "../controls/server-status-context-menu";
import { ConversationName } from "./conversation-name";

export function ConversationNameWithStatus() {
  const { conversationId } = useParams<{ conversationId: string }>();
  const { data: conversation } = useActiveConversation();
  const { curAgentState } = useAgentState();
  const { isTask, taskStatus } = useTaskPolling();
  const { mutate: pauseConversationSandbox } =
    useUnifiedPauseConversationSandbox();
  const { mutate: resumeConversationSandbox } =
    useUnifiedResumeConversationSandbox();
  const { providers } = useUserProviders();

  const isStartingStatus =
    curAgentState === AgentState.LOADING || curAgentState === AgentState.INIT;
  const isStopStatus = conversation?.status === "STOPPED";

  const statusColor = getStatusColor({
    isPausing: false,
    isTask,
    taskStatus,
    isStartingStatus,
    isStopStatus,
    curAgentState,
  });

  const handleStopServer = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    if (conversationId) {
      pauseConversationSandbox({ conversationId });
    }
  };

  const handleStartServer = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    if (conversationId) {
      resumeConversationSandbox({ conversationId, providers });
    }
  };

  return (
    <div className="flex items-center gap-2 px-2 py-1.5 bg-zinc-900/50 rounded-lg border border-zinc-800/50">
      <div className="group relative">
        <div className="flex items-center gap-2 cursor-pointer hover:bg-zinc-800/50 rounded-md px-2 py-1 transition-colors">
          <DebugStackframeDot className="w-5 h-5" color={statusColor} />
          <span className="text-xs text-zinc-500 hidden sm:block">
            {(() => {
              if (conversation?.status === "RUNNING") return "Running";
              if (conversation?.status === "STOPPED") return "Stopped";
              return "Loading";
            })()}
          </span>
        </div>
        <ServerStatusContextMenu
          onClose={() => {}}
          onStopServer={
            conversation?.status === "RUNNING" ? handleStopServer : undefined
          }
          onStartServer={
            conversation?.status === "STOPPED" ? handleStartServer : undefined
          }
          conversationStatus={conversation?.status ?? null}
          position="bottom"
          className="opacity-0 invisible pointer-events-none group-hover:opacity-100 group-hover:visible group-hover:pointer-events-auto bottom-full left-0 mt-0 min-h-fit"
          isPausing={false}
        />
      </div>
      <div className="w-px h-4 bg-zinc-700" />
      <ConversationName />
    </div>
  );
}
