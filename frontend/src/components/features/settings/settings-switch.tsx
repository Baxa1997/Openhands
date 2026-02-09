import React from "react";
import { useTranslation } from "react-i18next";
import { I18nKey } from "#/i18n/declaration";
import { cn } from "#/utils/utils";
import { StyledSwitchComponent } from "./styled-switch-component";

interface SettingsSwitchProps {
  testId?: string;
  name?: string;
  onToggle?: (value: boolean) => void;
  defaultIsToggled?: boolean;
  isToggled?: boolean;
  isBeta?: boolean;
  isDisabled?: boolean;
}

export function SettingsSwitch({
  children,
  testId,
  name,
  onToggle,
  defaultIsToggled,
  isToggled: controlledIsToggled,
  isBeta,
  isDisabled,
}: React.PropsWithChildren<SettingsSwitchProps>) {
  const { t } = useTranslation();
  const [isToggled, setIsToggled] = React.useState(defaultIsToggled ?? false);

  const handleToggle = (value: boolean) => {
    if (isDisabled) return;
    setIsToggled(value);
    onToggle?.(value);
  };

  return (
    <label
      className={cn(
        "flex items-center gap-2 w-fit",
        isDisabled ? "cursor-not-allowed opacity-50" : "cursor-pointer",
      )}
    >
      <input
        hidden
        data-testid={testId}
        name={name}
        type="checkbox"
        onChange={(e) => handleToggle(e.target.checked)}
        checked={controlledIsToggled ?? isToggled}
        disabled={isDisabled}
      />

      <StyledSwitchComponent isToggled={controlledIsToggled ?? isToggled} />

      <div className="flex items-center gap-1">
        <span className="text-sm font-medium text-zinc-200">{children}</span>
        {isBeta && (
          <span className="text-[11px] leading-4 text-white font-[500] tracking-tighter bg-blue-600 px-2 py-0.5 rounded-full">
            {t(I18nKey.BADGE$BETA)}
          </span>
        )}
      </div>
    </label>
  );
}
