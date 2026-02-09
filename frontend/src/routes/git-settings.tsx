import React from "react";
import { useTranslation } from "react-i18next";
import { useConfig } from "#/hooks/query/use-config";
import { useSettings } from "#/hooks/query/use-settings";
import { BrandButton } from "#/components/features/settings/brand-button";
import { useLogout } from "#/hooks/mutation/use-logout";
import { GitHubTokenInput } from "#/components/features/settings/git-settings/github-token-input";
import { GitLabTokenInput } from "#/components/features/settings/git-settings/gitlab-token-input";
import { GitLabWebhookManager } from "#/components/features/settings/git-settings/gitlab-webhook-manager";
import { BitbucketTokenInput } from "#/components/features/settings/git-settings/bitbucket-token-input";
import { AzureDevOpsTokenInput } from "#/components/features/settings/git-settings/azure-devops-token-input";
import { ForgejoTokenInput } from "#/components/features/settings/git-settings/forgejo-token-input";
import { ConfigureGitHubRepositoriesAnchor } from "#/components/features/settings/git-settings/configure-github-repositories-anchor";
import { InstallSlackAppAnchor } from "#/components/features/settings/git-settings/install-slack-app-anchor";
import { I18nKey } from "#/i18n/declaration";
import {
  displayErrorToast,
  displaySuccessToast,
} from "#/utils/custom-toast-handlers";
import { retrieveAxiosErrorMessage } from "#/utils/retrieve-axios-error-message";
import { GitSettingInputsSkeleton } from "#/components/features/settings/git-settings/github-settings-inputs-skeleton";
import { useAddGitProviders } from "#/hooks/mutation/use-add-git-providers";
import { useUserProviders } from "#/hooks/use-user-providers";
import { ProjectManagementIntegration } from "#/components/features/settings/project-management/project-management-integration";

function GitSettingsScreen() {
  const { t } = useTranslation();

  const { mutate: saveGitProviders, isPending } = useAddGitProviders();
  const { mutate: disconnectGitTokens } = useLogout();

  const { data: settings, isLoading } = useSettings();
  const { providers } = useUserProviders();

  const { data: config } = useConfig();

  const [githubTokenInputHasValue, setGithubTokenInputHasValue] =
    React.useState(false);
  const [gitlabTokenInputHasValue, setGitlabTokenInputHasValue] =
    React.useState(false);
  const [bitbucketTokenInputHasValue, setBitbucketTokenInputHasValue] =
    React.useState(false);
  const [azureDevOpsTokenInputHasValue, setAzureDevOpsTokenInputHasValue] =
    React.useState(false);
  const [forgejoTokenInputHasValue, setForgejoTokenInputHasValue] =
    React.useState(false);

  const [githubHostInputHasValue, setGithubHostInputHasValue] =
    React.useState(false);
  const [gitlabHostInputHasValue, setGitlabHostInputHasValue] =
    React.useState(false);
  const [bitbucketHostInputHasValue, setBitbucketHostInputHasValue] =
    React.useState(false);
  const [azureDevOpsHostInputHasValue, setAzureDevOpsHostInputHasValue] =
    React.useState(false);
  const [forgejoHostInputHasValue, setForgejoHostInputHasValue] =
    React.useState(false);

  const existingGithubHost = settings?.provider_tokens_set.github;
  const existingGitlabHost = settings?.provider_tokens_set.gitlab;
  const existingBitbucketHost = settings?.provider_tokens_set.bitbucket;
  const existingAzureDevOpsHost = settings?.provider_tokens_set.azure_devops;
  const existingForgejoHost = settings?.provider_tokens_set.forgejo;

  const isSaas = config?.APP_MODE === "saas";
  const isGitHubTokenSet = providers.includes("github");
  const isGitLabTokenSet = providers.includes("gitlab");
  const isBitbucketTokenSet = providers.includes("bitbucket");
  const isAzureDevOpsTokenSet = providers.includes("azure_devops");
  const isForgejoTokenSet = providers.includes("forgejo");

  const formAction = async (formData: FormData) => {
    const disconnectButtonClicked =
      formData.get("disconnect-tokens-button") !== null;

    if (disconnectButtonClicked) {
      disconnectGitTokens();
      return;
    }

    const githubToken = (
      formData.get("github-token-input")?.toString() || ""
    ).trim();
    const gitlabToken = (
      formData.get("gitlab-token-input")?.toString() || ""
    ).trim();
    const bitbucketToken = (
      formData.get("bitbucket-token-input")?.toString() || ""
    ).trim();
    const azureDevOpsToken = (
      formData.get("azure-devops-token-input")?.toString() || ""
    ).trim();
    const forgejoToken = (
      formData.get("forgejo-token-input")?.toString() || ""
    ).trim();
    const githubHost = (
      formData.get("github-host-input")?.toString() || ""
    ).trim();
    const gitlabHost = (
      formData.get("gitlab-host-input")?.toString() || ""
    ).trim();
    const bitbucketHost = (
      formData.get("bitbucket-host-input")?.toString() || ""
    ).trim();
    const azureDevOpsHost = (
      formData.get("azure-devops-host-input")?.toString() || ""
    ).trim();
    const forgejoHost = (
      formData.get("forgejo-host-input")?.toString() || ""
    ).trim();

    // Create providers object with all tokens
    const providerTokens: Record<string, { token: string; host: string }> = {
      github: { token: githubToken, host: githubHost },
      gitlab: { token: gitlabToken, host: gitlabHost },
      bitbucket: { token: bitbucketToken, host: bitbucketHost },
      azure_devops: { token: azureDevOpsToken, host: azureDevOpsHost },
      forgejo: { token: forgejoToken, host: forgejoHost },
    };

    saveGitProviders(
      {
        providers: providerTokens,
      },
      {
        onSuccess: () => {
          displaySuccessToast(t(I18nKey.SETTINGS$SAVED));
        },
        onError: (error) => {
          const errorMessage = retrieveAxiosErrorMessage(error);
          displayErrorToast(errorMessage || t(I18nKey.ERROR$GENERIC));
        },
        onSettled: () => {
          setGithubTokenInputHasValue(false);
          setGitlabTokenInputHasValue(false);
          setBitbucketTokenInputHasValue(false);
          setAzureDevOpsTokenInputHasValue(false);
          setForgejoTokenInputHasValue(false);
          setGithubHostInputHasValue(false);
          setGitlabHostInputHasValue(false);
          setBitbucketHostInputHasValue(false);
          setAzureDevOpsHostInputHasValue(false);
          setForgejoHostInputHasValue(false);
        },
      },
    );
  };

  const formIsClean =
    !githubTokenInputHasValue &&
    !gitlabTokenInputHasValue &&
    !bitbucketTokenInputHasValue &&
    !azureDevOpsTokenInputHasValue &&
    !forgejoTokenInputHasValue &&
    !githubHostInputHasValue &&
    !gitlabHostInputHasValue &&
    !bitbucketHostInputHasValue &&
    !azureDevOpsHostInputHasValue &&
    !forgejoHostInputHasValue;
  const shouldRenderExternalConfigureButtons = isSaas && config.APP_SLUG;
  const shouldRenderProjectManagementIntegrations =
    config?.FEATURE_FLAGS?.ENABLE_JIRA ||
    config?.FEATURE_FLAGS?.ENABLE_JIRA_DC ||
    config?.FEATURE_FLAGS?.ENABLE_LINEAR;

  return (
    <form
      data-testid="git-settings-screen"
      action={formAction}
      className="flex flex-col h-full justify-between"
    >
      {!isLoading && (
        <div className="flex flex-col gap-6 pb-6">
          {/* SaaS Integrations - Card Grid */}
          {shouldRenderExternalConfigureButtons && !isLoading && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* GitHub Card */}
              <div className="bg-[#1A1A1A] border border-zinc-700 rounded-xl p-6 hover:border-blue-600/50 transition-all duration-200 hover:shadow-lg hover:shadow-blue-600/10">
                <div className="flex items-center gap-3 mb-4">
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
                          isGitHubTokenSet
                            ? "bg-green-500 animate-pulse"
                            : "bg-zinc-600",
                        )}
                      />
                      <span className="text-xs text-zinc-400">
                        {isGitHubTokenSet
                          ? t(I18nKey.STATUS$CONNECTED)
                          : "Not Connected"}
                      </span>
                    </div>
                  </div>
                </div>
                <ConfigureGitHubRepositoriesAnchor slug={config.APP_SLUG!} />
              </div>

              {/* GitLab Card */}
              <div className="bg-[#1A1A1A] border border-zinc-700 rounded-xl p-6 hover:border-orange-600/50 transition-all duration-200 hover:shadow-lg hover:shadow-orange-600/10">
                <div className="flex items-center gap-3 mb-4">
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
                          isGitLabTokenSet
                            ? "bg-green-500 animate-pulse"
                            : "bg-zinc-600",
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
                {isGitLabTokenSet && <GitLabWebhookManager />}
              </div>

              {/* Slack Card */}
              <div className="bg-[#1A1A1A] border border-zinc-700 rounded-xl p-6 hover:border-purple-600/50 transition-all duration-200 hover:shadow-lg hover:shadow-purple-600/10">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-zinc-800 flex items-center justify-center">
                    <svg className="w-6 h-6" viewBox="0 0 24 24">
                      <path
                        fill="#E01E5A"
                        d="M6 15a2 2 0 0 1-2 2a2 2 0 0 1-2-2a2 2 0 0 1 2-2h2v2zm1 0a2 2 0 0 1 2-2a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2a2 2 0 0 1-2-2v-5z"
                      />
                      <path
                        fill="#36C5F0"
                        d="M9 6a2 2 0 0 1-2-2a2 2 0 0 1 2-2a2 2 0 0 1 2 2v2H9zm0 1a2 2 0 0 1 2 2a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2a2 2 0 0 1 2-2h5z"
                      />
                      <path
                        fill="#2EB67D"
                        d="M18 9a2 2 0 0 1 2-2a2 2 0 0 1 2 2a2 2 0 0 1-2 2h-2V9zm-1 0a2 2 0 0 1-2 2a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2a2 2 0 0 1 2 2v5z"
                      />
                      <path
                        fill="#ECB22E"
                        d="M15 18a2 2 0 0 1 2 2a2 2 0 0 1-2 2a2 2 0 0 1-2-2v-2h2zm0-1a2 2 0 0 1-2-2a2 2 0 0 1 2-2h5a2 2 0 0 1 2 2a2 2 0 0 1-2 2h-5z"
                      />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-white mb-1">
                      {t(I18nKey.SETTINGS$SLACK)}
                    </h3>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-zinc-600" />
                      <span className="text-xs text-zinc-400">
                        {t(I18nKey.SETTINGS$GITLAB_NOT_CONNECTED)}
                      </span>
                    </div>
                  </div>
                </div>
                <InstallSlackAppAnchor />
              </div>
            </div>
          )}

          {/* Project Management Integrations */}
          {shouldRenderProjectManagementIntegrations && !isLoading && (
            <div className="mt-2">
              <ProjectManagementIntegration />
            </div>
          )}

          {/* OSS Git Provider Cards */}
          {!isSaas && (
            <div className="grid grid-cols-1 gap-4 mt-4">
              <GitHubTokenInput
                name="github-token-input"
                isGitHubTokenSet={isGitHubTokenSet}
                onChange={(value) => {
                  setGithubTokenInputHasValue(!!value);
                }}
                onGitHubHostChange={(value) => {
                  setGithubHostInputHasValue(!!value);
                }}
                githubHostSet={existingGithubHost}
              />

              <GitLabTokenInput
                name="gitlab-token-input"
                isGitLabTokenSet={isGitLabTokenSet}
                onChange={(value) => {
                  setGitlabTokenInputHasValue(!!value);
                }}
                onGitLabHostChange={(value) => {
                  setGitlabHostInputHasValue(!!value);
                }}
                gitlabHostSet={existingGitlabHost}
              />

              <BitbucketTokenInput
                name="bitbucket-token-input"
                isBitbucketTokenSet={isBitbucketTokenSet}
                onChange={(value) => {
                  setBitbucketTokenInputHasValue(!!value);
                }}
                onBitbucketHostChange={(value) => {
                  setBitbucketHostInputHasValue(!!value);
                }}
                bitbucketHostSet={existingBitbucketHost}
              />

              <AzureDevOpsTokenInput
                name="azure-devops-token-input"
                isAzureDevOpsTokenSet={isAzureDevOpsTokenSet}
                onChange={(value) => {
                  setAzureDevOpsTokenInputHasValue(!!value);
                }}
                onAzureDevOpsHostChange={(value) => {
                  setAzureDevOpsHostInputHasValue(!!value);
                }}
                azureDevOpsHostSet={existingAzureDevOpsHost}
              />

              <ForgejoTokenInput
                name="forgejo-token-input"
                isForgejoTokenSet={isForgejoTokenSet}
                onChange={(value) => {
                  setForgejoTokenInputHasValue(!!value);
                }}
                onForgejoHostChange={(value) => {
                  setForgejoHostInputHasValue(!!value);
                }}
                forgejoHostSet={existingForgejoHost}
              />
            </div>
          )}
        </div>
      )}

      {isLoading && <GitSettingInputsSkeleton />}

      <div className="flex gap-4 pt-6 border-t border-zinc-800 justify-end sticky bottom-0 bg-[#18181b]">
        {!shouldRenderExternalConfigureButtons && (
          <>
            <BrandButton
              testId="disconnect-tokens-button"
              name="disconnect-tokens-button"
              type="submit"
              variant="secondary"
              isDisabled={
                !isGitHubTokenSet &&
                !isGitLabTokenSet &&
                !isBitbucketTokenSet &&
                !isAzureDevOpsTokenSet &&
                !isForgejoTokenSet
              }
            >
              {t(I18nKey.GIT$DISCONNECT_TOKENS)}
            </BrandButton>
            <BrandButton
              testId="submit-button"
              type="submit"
              variant="primary"
              isDisabled={isPending || formIsClean}
            >
              {!isPending && t("SETTINGS$SAVE_CHANGES")}
              {isPending && t("SETTINGS$SAVING")}
            </BrandButton>
          </>
        )}
      </div>
    </form>
  );
}

export default GitSettingsScreen;
