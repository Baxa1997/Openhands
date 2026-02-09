import { useTranslation } from "react-i18next";
import { I18nKey } from "#/i18n/declaration";
import { SettingsInput } from "../settings-input";
import { GitHubTokenHelpAnchor } from "./github-token-help-anchor";
import { KeyStatusIcon } from "../key-status-icon";
import { cn } from "#/utils/utils";

interface GitHubTokenInputProps {
  onChange: (value: string) => void;
  onGitHubHostChange: (value: string) => void;
  isGitHubTokenSet: boolean;
  name: string;
  githubHostSet: string | null | undefined;
  className?: string;
}

export function GitHubTokenInput({
  onChange,
  onGitHubHostChange,
  isGitHubTokenSet,
  name,
  githubHostSet,
  className,
}: GitHubTokenInputProps) {
  const { t } = useTranslation();

  return (
    <div
      className={cn(
        "bg-[#1A1A1A] border rounded-xl p-6 transition-all duration-200",
        isGitHubTokenSet
          ? "border-green-600/50 shadow-lg shadow-green-600/10"
          : "border-zinc-700 hover:border-blue-600/50 hover:shadow-lg hover:shadow-blue-600/10",
        className,
      )}
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-lg bg-zinc-800 flex items-center justify-center">
          <svg className="w-6 h-6" fill="white" viewBox="0 0 24 24">
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
          </svg>
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-white mb-1">
            {t(I18nKey.SETTINGS$GITHUB)}
          </h3>
          <div className="flex items-center gap-2">
            <div
              className={cn(
                "w-2 h-2 rounded-full",
                isGitHubTokenSet ? "bg-green-500 animate-pulse" : "bg-zinc-600",
              )}
            />
            <span className="text-xs text-zinc-400">
              {isGitHubTokenSet
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
          label={t(I18nKey.GITHUB$TOKEN_LABEL)}
          type="password"
          className="w-full"
          placeholder={isGitHubTokenSet ? "<hidden>" : ""}
          startContent={
            isGitHubTokenSet && (
              <KeyStatusIcon
                testId="gh-set-token-indicator"
                isSet={isGitHubTokenSet}
              />
            )
          }
        />

        <SettingsInput
          onChange={onGitHubHostChange || (() => {})}
          name="github-host-input"
          testId="github-host-input"
          label={t(I18nKey.GITHUB$HOST_LABEL)}
          type="text"
          className="w-full"
          placeholder="github.com"
          defaultValue={githubHostSet || undefined}
          startContent={
            githubHostSet &&
            githubHostSet.trim() !== "" && (
              <KeyStatusIcon testId="gh-set-host-indicator" isSet />
            )
          }
        />

        <GitHubTokenHelpAnchor />
      </div>
    </div>
  );
}
