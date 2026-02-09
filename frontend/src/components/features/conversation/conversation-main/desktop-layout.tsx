import { cn } from "#/utils/utils";
import { ChatInterfaceWrapper } from "./chat-interface-wrapper";
import { ConversationTabContent } from "../conversation-tabs/conversation-tab-content/conversation-tab-content";
import { ResizeHandle } from "../../../ui/resize-handle";
import { useResizablePanels } from "#/hooks/use-resizable-panels";

interface DesktopLayoutProps {
  isRightPanelShown: boolean;
}

export function DesktopLayout({ isRightPanelShown }: DesktopLayoutProps) {
  const { leftWidth, rightWidth, isDragging, containerRef, handleMouseDown } =
    useResizablePanels({
      defaultLeftWidth: 50,
      minLeftWidth: 30,
      maxLeftWidth: 80,
      storageKey: "desktop-layout-panel-width",
    });

  return (
    <div className="h-full flex flex-col overflow-hidden bg-[#09090b]">
      <div
        ref={containerRef}
        className="flex flex-1 overflow-hidden gap-0"
        style={{
          transitionProperty: isDragging ? "none" : "all",
          transitionDuration: "300ms",
          transitionTimingFunction: "ease-in-out",
        }}
      >
        {/* Left Panel (Chat) */}
        <div
          className="flex flex-col overflow-hidden bg-[#0d0d10] border-r border-zinc-800/30"
          style={{
            width: isRightPanelShown ? `${leftWidth}%` : "100%",
            transitionProperty: isDragging ? "none" : "all",
            transitionDuration: "300ms",
            transitionTimingFunction: "ease-in-out",
          }}
        >
          <ChatInterfaceWrapper isRightPanelShown={isRightPanelShown} />
        </div>

        {/* Resize Handle */}
        {isRightPanelShown && <ResizeHandle onMouseDown={handleMouseDown} />}

        {/* Right Panel */}
        <div
          className={cn(
            "overflow-hidden bg-[#111113]",
            isRightPanelShown
              ? "translate-x-0 opacity-100"
              : "w-0 translate-x-full opacity-0",
          )}
          style={{
            width: isRightPanelShown ? `${rightWidth}%` : "0%",
            transitionProperty: isDragging ? "opacity, transform" : "all",
            transitionDuration: "300ms",
            transitionTimingFunction: "ease-in-out",
          }}
        >
          <div className="flex flex-col flex-1 min-w-max h-full">
            <ConversationTabContent />
          </div>
        </div>
      </div>
    </div>
  );
}
