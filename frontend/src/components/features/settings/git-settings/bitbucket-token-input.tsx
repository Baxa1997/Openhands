import { useTranslation } from "react-i18next";
import { I18nKey } from "#/i18n/declaration";
import { SettingsInput } from "../settings-input";
import { BitbucketTokenHelpAnchor } from "./bitbucket-token-help-anchor";
import { KeyStatusIcon } from "../key-status-icon";
import { cn } from "#/utils/utils";

interface BitbucketTokenInputProps {
  onChange: (value: string) => void;
  onBitbucketHostChange: (value: string) => void;
  isBitbucketTokenSet: boolean;
  name: string;
  bitbucketHostSet: string | null | undefined;
  className?: string;
}

export function BitbucketTokenInput({
  onChange,
  onBitbucketHostChange,
  isBitbucketTokenSet,
  name,
  bitbucketHostSet,
  className,
}: BitbucketTokenInputProps) {
  const { t } = useTranslation();

  return (
    <div
      className={cn(
        "bg-[#1A1A1A] border rounded-xl p-6 transition-all duration-200",
        isBitbucketTokenSet
          ? "border-green-600/50 shadow-lg shadow-green-600/10"
          : "border-zinc-700 hover:border-blue-600/50 hover:shadow-lg hover:shadow-blue-600/10",
        className,
      )}
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-lg bg-zinc-800 flex items-center justify-center">
          <svg className="w-6 h-6" fill="#2684FF" viewBox="0 0 24 24">
            <path d="M.778 1.213a.768.768 0 00-.768.892l3.263 19.81c.084.5.515.868 1.022.873H19.95a.772.772 0 00.77-.646l3.27-20.03a.768.768 0 00-.768-.891zM14.52 15.528H9.522L8.17 8.464h7.561z" />
          </svg>
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-white mb-1">
            {t(I18nKey.BITBUCKET$CONNECT_TO_BITBUCKET)}
          </h3>
          <div className="flex items-center gap-2">
            <div
              className={cn(
                "w-2 h-2 rounded-full",
                isBitbucketTokenSet
                  ? "bg-green-500 animate-pulse"
                  : "bg-zinc-600",
              )}
            />
            <span className="text-xs text-zinc-400">
              {isBitbucketTokenSet
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
          label={t(I18nKey.BITBUCKET$TOKEN_LABEL)}
          type="password"
          className="w-full"
          placeholder={
            isBitbucketTokenSet ? "<hidden>" : "username:app_password"
          }
          startContent={
            isBitbucketTokenSet && (
              <KeyStatusIcon
                testId="bb-set-token-indicator"
                isSet={isBitbucketTokenSet}
              />
            )
          }
        />

        <SettingsInput
          onChange={onBitbucketHostChange || (() => {})}
          name="bitbucket-host-input"
          testId="bitbucket-host-input"
          label={t(I18nKey.BITBUCKET$HOST_LABEL)}
          type="text"
          className="w-full"
          placeholder="bitbucket.org"
          defaultValue={bitbucketHostSet || undefined}
          startContent={
            bitbucketHostSet &&
            bitbucketHostSet.trim() !== "" && (
              <KeyStatusIcon testId="bb-set-host-indicator" isSet />
            )
          }
        />

        <BitbucketTokenHelpAnchor />
      </div>
    </div>
  );
}
