import { ComponentType } from "react";
import { cn } from "#/utils/utils";

type ConversationTabNavProps = {
  tabValue: string;
  icon: ComponentType<{ className: string }>;
  onClick(): void;
  isActive?: boolean;
  label?: string;
  className?: string;
};

export function ConversationTabNav({
  tabValue,
  icon: Icon,
  onClick,
  isActive,
  label,
  className,
}: ConversationTabNavProps) {
  return (
    <button
      type="button"
      onClick={() => {
        onClick();
      }}
      data-testid={`conversation-tab-${tabValue}`}
      className={cn(
        "flex items-center gap-2 rounded-md cursor-pointer transition-all duration-150",
        "px-2.5 py-1.5",
        isActive
          ? "bg-blue-600/20 text-blue-400 border border-blue-600/30"
          : "text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800/50 border border-transparent",
        className,
      )}
    >
      <Icon className={cn("w-4 h-4 text-inherit flex-shrink-0")} />
      {isActive && label && (
        <span className="text-xs font-medium whitespace-nowrap">{label}</span>
      )}
    </button>
  );
}
