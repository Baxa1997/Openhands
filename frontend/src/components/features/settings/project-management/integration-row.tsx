import React from "react";
import { useTranslation } from "react-i18next";
import { cn } from "#/utils/utils";
import { useIntegrationStatus } from "#/hooks/query/use-integration-status";
import { useLinkIntegration } from "#/hooks/mutation/use-link-integration";
import { useUnlinkIntegration } from "#/hooks/mutation/use-unlink-integration";
import { useConfigureIntegration } from "#/hooks/mutation/use-configure-integration";
import { I18nKey } from "#/i18n/declaration";
import {
  ConfigureButton,
  ConfigureModal,
} from "#/components/features/settings/project-management/configure-modal";

interface IntegrationRowProps {
  platform: "jira" | "jira-dc" | "linear";
  platformName: string;
  "data-testid"?: string;
}

export function IntegrationRow({
  platform,
  platformName,
  "data-testid": dataTestId,
}: IntegrationRowProps) {
  const [isConfigureModalOpen, setConfigureModalOpen] = React.useState(false);
  const { t } = useTranslation();

  const { data: integrationData, isLoading: isStatusLoading } =
    useIntegrationStatus(platform);

  const linkMutation = useLinkIntegration(platform, {
    onSettled: () => {
      setConfigureModalOpen(false);
    },
  });

  const unlinkMutation = useUnlinkIntegration(platform, {
    onSettled: () => {
      setConfigureModalOpen(false);
    },
  });

  const configureMutation = useConfigureIntegration(platform, {
    onSettled: () => {
      setConfigureModalOpen(false);
    },
  });

  const handleConfigure = () => {
    setConfigureModalOpen(true);
  };

  const handleLink = (workspace: string) => {
    linkMutation.mutate(workspace);
  };

  const handleUnlink = () => {
    unlinkMutation.mutate();
  };

  const handleConfigureConfirm = (data: {
    workspace: string;
    webhookSecret: string;
    serviceAccountEmail: string;
    serviceAccountApiKey: string;
    isActive: boolean;
  }) => {
    configureMutation.mutate(data);
  };

  const isLoading =
    isStatusLoading ||
    linkMutation.isPending ||
    unlinkMutation.isPending ||
    configureMutation.isPending;

  // Determine if integration is active and workspace exists
  const isIntegrationActive = integrationData?.status === "active";
  const hasWorkspace = integrationData?.workspace;

  // Determine button text based on integration state
  const buttonText =
    isIntegrationActive && hasWorkspace
      ? t(I18nKey.PROJECT_MANAGEMENT$EDIT_BUTTON_LABEL)
      : t(I18nKey.PROJECT_MANAGEMENT$CONFIGURE_BUTTON_LABEL);

  const platformIcons = {
    jira: (
      <svg className="w-6 h-6" fill="#2684FF" viewBox="0 0 24 24">
        <path d="M11.571 11.513H0a5.218 5.218 0 0 0 5.232 5.215h2.13v2.057A5.215 5.215 0 0 0 12.575 24V12.518a1.005 1.005 0 0 0-1.005-1.005zm5.723-5.756H5.736a5.215 5.215 0 0 0 5.215 5.214h2.129v2.058a5.218 5.218 0 0 0 5.215 5.214V6.757a1 1 0 0 0-1-1zM23.013 0H11.455a5.215 5.215 0 0 0 5.215 5.215h2.129v2.057A5.215 5.215 0 0 0 24 12.483V1a1 1 0 0 0-.987-1z" />
      </svg>
    ),
    "jira-dc": (
      <svg className="w-6 h-6" fill="#2684FF" viewBox="0 0 24 24">
        <path d="M11.571 11.513H0a5.218 5.218 0 0 0 5.232 5.215h2.13v2.057A5.215 5.215 0 0 0 12.575 24V12.518a1.005 1.005 0 0 0-1.005-1.005zm5.723-5.756H5.736a5.215 5.215 0 0 0 5.215 5.214h2.129v2.058a5.218 5.218 0 0 0 5.215 5.214V6.757a1 1 0 0 0-1-1zM23.013 0H11.455a5.215 5.215 0 0 0 5.215 5.215h2.129v2.057A5.215 5.215 0 0 0 24 12.483V1a1 1 0 0 0-.987-1z" />
      </svg>
    ),
    linear: (
      <svg className="w-6 h-6" fill="#5E6AD2" viewBox="0 0 24 24">
        <path d="M2.025 21.975a11.96 11.96 0 0 0 8.484 3.514c3.313 0 6.302-1.34 8.485-3.515L2.025 21.975zM.511 10.49a11.96 11.96 0 0 0 3.514 8.484l9.464-9.464L.511 10.49zm10.49-10.49C4.698 0 0 4.698 0 11.001c0 1.044.14 2.055.403 3.016l10.598-1.98L11 .511zm1.98 10.51 9.503 9.504c2.21-2.183 3.516-5.198 3.516-8.515 0-6.627-5.373-12-12-12L12.98 10.51z" />
      </svg>
    ),
  };

  return (
    <div
      className={cn(
        "bg-[#1A1A1A] border rounded-xl p-6 transition-all duration-200",
        isIntegrationActive
          ? "border-green-600/50 shadow-lg shadow-green-600/10"
          : "border-zinc-700 hover:border-violet-600/50 hover:shadow-lg hover:shadow-violet-600/10",
      )}
      data-testid={dataTestId}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-zinc-800 flex items-center justify-center">
            {platformIcons[platform]}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">{platformName}</h3>
            <div className="flex items-center gap-2">
              <div
                className={cn(
                  "w-2 h-2 rounded-full",
                  isIntegrationActive
                    ? "bg-green-500 animate-pulse"
                    : "bg-zinc-600",
                )}
              />
              <span className="text-xs text-zinc-400">
                {isIntegrationActive
                  ? t(I18nKey.STATUS$CONNECTED)
                  : "Not Connected"}
              </span>
            </div>
          </div>
        </div>

        <ConfigureButton
          onClick={handleConfigure}
          isDisabled={isLoading}
          text={buttonText}
          data-testid={`${platform}-configure-button`}
        />
      </div>

      {/* Workspace info if connected */}
      {hasWorkspace && (
        <div className="mt-4 pt-4 border-t border-zinc-800">
          <div className="flex items-center gap-2">
            <span className="text-xs text-zinc-500">
              {t(I18nKey.WORKSPACE$TITLE)}:
            </span>
            <span className="text-xs text-zinc-300 font-mono bg-zinc-900 px-2 py-1 rounded">
              {integrationData?.workspace}
            </span>
          </div>
        </div>
      )}

      <ConfigureModal
        isOpen={isConfigureModalOpen}
        onClose={() => setConfigureModalOpen(false)}
        onConfirm={handleConfigureConfirm}
        onLink={handleLink}
        onUnlink={handleUnlink}
        platformName={platformName}
        platform={platform}
        integrationData={integrationData}
      />
    </div>
  );
}
