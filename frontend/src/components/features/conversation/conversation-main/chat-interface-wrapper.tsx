import { cn } from "#/utils/utils";
import { ChatInterface } from "../../chat/chat-interface";

interface ChatInterfaceWrapperProps {
  isRightPanelShown: boolean;
}

export function ChatInterfaceWrapper({
  isRightPanelShown,
}: ChatInterfaceWrapperProps) {
  return (
    <div className="flex justify-center w-full h-full bg-[#0d0d10]">
      <div
        className={cn(
          "w-full h-full transition-all duration-300 ease-in-out",
          isRightPanelShown ? "max-w-4xl" : "max-w-5xl",
        )}
      >
        <ChatInterface />
      </div>
    </div>
  );
}
