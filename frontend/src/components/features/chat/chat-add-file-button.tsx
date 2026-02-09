import PaperclipIcon from "#/icons/paper-clip.svg?react";
import { cn } from "#/utils/utils";

export interface ChatAddFileButtonProps {
  handleFileIconClick: () => void;
  disabled?: boolean;
}

export function ChatAddFileButton({
  handleFileIconClick,
  disabled = false,
}: ChatAddFileButtonProps) {
  return (
    <button
      type="button"
      className={cn(
        "flex items-center justify-center w-9 h-9 rounded-lg transition-all duration-200",
        disabled
          ? "cursor-not-allowed bg-zinc-800/50 text-zinc-600"
          : "cursor-pointer bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-zinc-200",
      )}
      data-name="Shape"
      data-testid="paperclip-icon"
      onClick={handleFileIconClick}
    >
      <PaperclipIcon
        className="block w-5 h-5"
        color={disabled ? "#52525b" : "currentColor"}
      />
    </button>
  );
}
