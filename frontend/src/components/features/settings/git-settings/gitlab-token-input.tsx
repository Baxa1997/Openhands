import { useTranslation } from "react-i18next";
import { I18nKey } from "#/i18n/declaration";
import { SettingsInput } from "../settings-input";
import { GitLabTokenHelpAnchor } from "./gitlab-token-help-anchor";
import { KeyStatusIcon } from "../key-status-icon";
import { cn } from "#/utils/utils";

interface GitLabTokenInputProps {
  onChange: (value: string) => void;
  onGitLabHostChange: (value: string) => void;
  isGitLabTokenSet: boolean;
  name: string;
  gitlabHostSet: string | null | undefined;
  className?: string;
}

export function GitLabTokenInput({
  onChange,
  onGitLabHostChange,
  isGitLabTokenSet,
  name,
  gitlabHostSet,
  className,
}: GitLabTokenInputProps) {
  const { t } = useTranslation();

  return (
    <div
      className={cn(
        "bg-[#1A1A1A] border rounded-xl p-6 transition-all duration-200",
        isGitLabTokenSet
          ? "border-green-600/50 shadow-lg shadow-green-600/10"
          : "border-zinc-700 hover:border-orange-600/50 hover:shadow-lg hover:shadow-orange-600/10",
        className,
      )}
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-lg bg-zinc-800 flex items-center justify-center">
          <svg className="w-6 h-6" fill="#FC6D26" viewBox="0 0 24 24">
            <path d="m23.6004 9.5927-.0337-.0862L20.3.9814a.851.851 0 0 0-.3362-.405.8748.8748 0 0 0-.9997.0539.8748.8748 0 0 0-.29.4399l-2.2055 6.748H7.5375l-2.2057-6.748a.8573.8573 0 0 0-.29-.4412.8748.8748 0 0 0-.9997-.0537.8585.8585 0 0 0-.3362.4049L.4332 9.5015l-.0325.0862a6.0657 6.0657 0 0 0 2.0119 7.0105l.0113.0087.03.0213 4.976 3.7264 2.462 1.8633 1.4995 1.1321a1.0085 1.0085 0 0 0 1.2197 0l1.4995-1.1321 2.4619-1.8633 5.006-3.7489.0125-.01a6.0682 6.0682 0 0 0 2.0094-7.003z" />
          </svg>
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-white mb-1">
            {t(I18nKey.SETTINGS$GITLAB)}
          </h3>
          <div className="flex items-center gap-2">
            <div
              className={cn(
                "w-2 h-2 rounded-full",
                isGitLabTokenSet ? "bg-green-500 animate-pulse" : "bg-zinc-600",
              )}
            />
            <span className="text-xs text-zinc-400">
              {isGitLabTokenSet
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
          label={t(I18nKey.GITLAB$TOKEN_LABEL)}
          type="password"
          className="w-full"
          placeholder={isGitLabTokenSet ? "<hidden>" : ""}
          startContent={
            isGitLabTokenSet && (
              <KeyStatusIcon
                testId="gl-set-token-indicator"
                isSet={isGitLabTokenSet}
              />
            )
          }
        />

        <SettingsInput
          onChange={onGitLabHostChange || (() => {})}
          name="gitlab-host-input"
          testId="gitlab-host-input"
          label={t(I18nKey.GITLAB$HOST_LABEL)}
          type="text"
          className="w-full"
          placeholder="gitlab.com"
          defaultValue={gitlabHostSet || undefined}
          startContent={
            gitlabHostSet &&
            gitlabHostSet.trim() !== "" && (
              <KeyStatusIcon testId="gl-set-host-indicator" isSet />
            )
          }
        />

        <GitLabTokenHelpAnchor />
      </div>
    </div>
  );
}
