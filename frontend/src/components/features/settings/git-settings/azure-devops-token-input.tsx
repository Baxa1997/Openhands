import { useTranslation } from "react-i18next";
import { I18nKey } from "#/i18n/declaration";
import { SettingsInput } from "../settings-input";
import { AzureDevOpsTokenHelpAnchor } from "./azure-devops-token-help-anchor";
import { KeyStatusIcon } from "../key-status-icon";
import { cn } from "#/utils/utils";
import AzureDevOpsLogo from "#/assets/branding/azure-devops-logo.svg?react";

interface AzureDevOpsTokenInputProps {
  onChange: (value: string) => void;
  onAzureDevOpsHostChange: (value: string) => void;
  isAzureDevOpsTokenSet: boolean;
  name: string;
  azureDevOpsHostSet: string | null | undefined;
}

export function AzureDevOpsTokenInput({
  onChange,
  onAzureDevOpsHostChange,
  isAzureDevOpsTokenSet,
  name,
  azureDevOpsHostSet,
}: AzureDevOpsTokenInputProps) {
  const { t } = useTranslation();

  return (
    <div
      className={cn(
        "bg-[#1A1A1A] border rounded-xl p-6 transition-all duration-200",
        isAzureDevOpsTokenSet
          ? "border-green-600/50 shadow-lg shadow-green-600/10"
          : "border-zinc-700 hover:border-blue-600/50 hover:shadow-lg hover:shadow-blue-600/10",
      )}
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-lg bg-zinc-800 flex items-center justify-center">
          <AzureDevOpsLogo width={24} height={24} />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-white mb-1">
            {t(I18nKey.SETTINGS$AZURE_DEVOPS)}
          </h3>
          <div className="flex items-center gap-2">
            <div
              className={cn(
                "w-2 h-2 rounded-full",
                isAzureDevOpsTokenSet
                  ? "bg-green-500 animate-pulse"
                  : "bg-zinc-600",
              )}
            />
            <span className="text-xs text-zinc-400">
              {isAzureDevOpsTokenSet
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
          label={t(I18nKey.GIT$AZURE_DEVOPS_TOKEN)}
          type="password"
          className="w-full"
          placeholder={isAzureDevOpsTokenSet ? "<hidden>" : ""}
          startContent={
            isAzureDevOpsTokenSet && (
              <KeyStatusIcon
                testId="azure-devops-set-token-indicator"
                isSet={isAzureDevOpsTokenSet}
              />
            )
          }
        />

        <SettingsInput
          onChange={onAzureDevOpsHostChange || (() => {})}
          name="azure-devops-host-input"
          testId="azure-devops-host-input"
          label={t(I18nKey.GIT$AZURE_DEVOPS_HOST)}
          type="text"
          className="w-full"
          placeholder={t(I18nKey.GIT$AZURE_DEVOPS_HOST_PLACEHOLDER)}
          defaultValue={azureDevOpsHostSet || undefined}
          startContent={
            azureDevOpsHostSet &&
            azureDevOpsHostSet.trim() !== "" && (
              <KeyStatusIcon testId="azure-devops-set-host-indicator" isSet />
            )
          }
        />

        <AzureDevOpsTokenHelpAnchor />
      </div>
    </div>
  );
}
