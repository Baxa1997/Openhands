import React from "react";
import { DragOver } from "../drag-over";
import { UploadedFiles } from "../uploaded-files";
import { ChatInputRow } from "./chat-input-row";
import { ChatInputActions } from "./chat-input-actions";
import { useConversationStore } from "#/stores/conversation-store";
import { cn } from "#/utils/utils";

interface ChatInputContainerProps {
  chatContainerRef: React.RefObject<HTMLDivElement | null>;
  isDragOver: boolean;
  disabled: boolean;
  showButton: boolean;
  buttonClassName: string;
  chatInputRef: React.RefObject<HTMLDivElement | null>;
  handleFileIconClick: (isDisabled: boolean) => void;
  handleSubmit: () => void;
  handleResumeAgent: () => void;
  onDragOver: (e: React.DragEvent, isDisabled: boolean) => void;
  onDragLeave: (e: React.DragEvent, isDisabled: boolean) => void;
  onDrop: (e: React.DragEvent, isDisabled: boolean) => void;
  onInput: () => void;
  onPaste: (e: React.ClipboardEvent) => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
  onFocus?: () => void;
  onBlur?: () => void;
}

export function ChatInputContainer({
  chatContainerRef,
  isDragOver,
  disabled,
  showButton,
  buttonClassName,
  chatInputRef,
  handleFileIconClick,
  handleSubmit,
  handleResumeAgent,
  onDragOver,
  onDragLeave,
  onDrop,
  onInput,
  onPaste,
  onKeyDown,
  onFocus,
  onBlur,
}: ChatInputContainerProps) {
  const conversationMode = useConversationStore(
    (state) => state.conversationMode,
  );

  return (
    <div
      ref={chatContainerRef}
      className={cn(
        "bg-[#111113] box-border content-stretch flex flex-col items-start justify-center p-4 pt-3 relative rounded-2xl w-full",
        "border border-zinc-800/60 shadow-lg shadow-black/20",
        "transition-all duration-200",
        "hover:border-zinc-700/60",
        "focus-within:border-blue-600/40 focus-within:shadow-blue-600/5",
        conversationMode === "plan" && "border-blue-500/50 shadow-blue-500/10",
        disabled && "opacity-60",
      )}
      onDragOver={(e) => onDragOver(e, disabled)}
      onDragLeave={(e) => onDragLeave(e, disabled)}
      onDrop={(e) => onDrop(e, disabled)}
    >
      {/* Drag Over UI */}
      {isDragOver && <DragOver />}

      <UploadedFiles />

      <ChatInputRow
        chatInputRef={chatInputRef}
        disabled={disabled}
        showButton={showButton}
        buttonClassName={buttonClassName}
        handleFileIconClick={handleFileIconClick}
        handleSubmit={handleSubmit}
        onInput={onInput}
        onPaste={onPaste}
        onKeyDown={onKeyDown}
        onFocus={onFocus}
        onBlur={onBlur}
      />

      <ChatInputActions
        disabled={disabled}
        handleResumeAgent={handleResumeAgent}
      />
    </div>
  );
}
