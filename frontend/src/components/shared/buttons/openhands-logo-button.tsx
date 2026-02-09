import { NavLink } from "react-router";
import { StyledTooltip } from "#/components/shared/buttons/styled-tooltip";

export function OpenHandsLogoButton() {
  const tooltipText = "Ucode AI";
  const ariaLabel = "Ucode AI Logo";

  return (
    <StyledTooltip content={tooltipText}>
      <NavLink to="/" aria-label={ariaLabel} className="block w-full">
        <div className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 transition-all duration-200 shadow-lg shadow-blue-600/20">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
            <span className="text-white font-bold text-sm tracking-wide">
              UCODE
            </span>
            <span className="text-blue-200 font-light text-xs">AI</span>
          </div>
        </div>
      </NavLink>
    </StyledTooltip>
  );
}
