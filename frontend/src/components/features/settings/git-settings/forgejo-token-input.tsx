import { useTranslation } from "react-i18next";
import { I18nKey } from "#/i18n/declaration";
import { SettingsInput } from "../settings-input";
import { KeyStatusIcon } from "../key-status-icon";
import { cn } from "#/utils/utils";

interface ForgejoTokenInputProps {
  onChange: (value: string) => void;
  onForgejoHostChange: (value: string) => void;
  isForgejoTokenSet: boolean;
  name: string;
  forgejoHostSet: string | null | undefined;
  className?: string;
}

export function ForgejoTokenInput({
  onChange,
  onForgejoHostChange,
  isForgejoTokenSet,
  name,
  forgejoHostSet,
  className,
}: ForgejoTokenInputProps) {
  const { t } = useTranslation();

  return (
    <div
      className={cn(
        "bg-[#1A1A1A] border rounded-xl p-6 transition-all duration-200",
        isForgejoTokenSet
          ? "border-green-600/50 shadow-lg shadow-green-600/10"
          : "border-zinc-700 hover:border-violet-600/50 hover:shadow-lg hover:shadow-violet-600/10",
        className,
      )}
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-lg bg-zinc-800 flex items-center justify-center">
          <svg className="w-6 h-6" fill="#FB923C" viewBox="0 0 24 24">
            <path d="M12 0C5.37 0 0 5.37 0 12s5.37 12 12 12 12-5.37 12-12S18.63 0 12 0zm0 22C6.48 22 2 17.52 2 12S6.48 2 12 2s10 4.48 10 10-4.48 10-10 10zm-1-17v10l8.5-5L11 5z" />
          </svg>
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-white mb-1">
            {t(I18nKey.FORGEJO$TOKEN_LABEL)}
          </h3>
          <div className="flex items-center gap-2">
            <div
              className={cn(
                "w-2 h-2 rounded-full",
                isForgejoTokenSet
                  ? "bg-green-500 animate-pulse"
                  : "bg-zinc-600",
              )}
            />
            <span className="text-xs text-zinc-400">
              {isForgejoTokenSet
                ? t(I18nKey.STATUS$CONNECTED)
                : t(I18nKey.SETTINGS$GITLAB_NOT_CONNECTED)}
            </span>
          </div>
        </div>
      </div>

      {/* Inputs */}
      <div className="flex flex-col gap-4">
        <SettingsInput
          testId={name}
          name={name}
          onChange={onChange}
          label={t(I18nKey.FORGEJO$TOKEN_LABEL)}
          type="password"
          className="w-full"
          placeholder={isForgejoTokenSet ? "<hidden>" : ""}
          startContent={
            isForgejoTokenSet && (
              <KeyStatusIcon
                testId="forgejo-set-token-indicator"
                isSet={isForgejoTokenSet}
              />
            )
          }
        />

        <SettingsInput
          onChange={onForgejoHostChange || (() => {})}
          name="forgejo-host-input"
          testId="forgejo-host-input"
          label={t(I18nKey.FORGEJO$HOST_LABEL)}
          type="text"
          className="w-full"
          placeholder="codeberg.org"
          defaultValue={forgejoHostSet || undefined}
          startContent={
            forgejoHostSet &&
            forgejoHostSet.trim() !== "" && (
              <KeyStatusIcon testId="forgejo-set-host-indicator" isSet />
            )
          }
        />
      </div>
    </div>
  );
}
