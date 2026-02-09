import React from "react";
import { AxiosError } from "axios";
import { useTranslation } from "react-i18next";
import { FaGithub, FaGitlab } from "react-icons/fa6";
import { SiNotion } from "react-icons/si";
import { I18nKey } from "#/i18n/declaration";
import { Typography } from "#/ui/typography";
import { useUserProviders } from "#/hooks/use-user-providers";
import { useSettings } from "#/hooks/query/use-settings";
import { useConfig } from "#/hooks/query/use-config";
import { useAddGitProviders } from "#/hooks/mutation/use-add-git-providers";
import { useSaveSettings } from "#/hooks/mutation/use-save-settings";
import { SettingsInput } from "#/components/features/settings/settings-input";
import { BrandButton } from "#/components/features/settings/brand-button";
import { KeyStatusIcon } from "#/components/features/settings/key-status-icon";
import { GitHubTokenHelpAnchor } from "#/components/features/settings/git-settings/github-token-help-anchor";
import { GitLabTokenHelpAnchor } from "#/components/features/settings/git-settings/gitlab-token-help-anchor";
import { ConfigureGitHubRepositoriesAnchor } from "#/components/features/settings/git-settings/configure-github-repositories-anchor";
import { GitLabWebhookManager } from "#/components/features/settings/git-settings/gitlab-webhook-manager";
import { cn } from "#/utils/utils";
import {
  displayErrorToast,
  displaySuccessToast,
} from "#/utils/custom-toast-handlers";
import { retrieveAxiosErrorMessage } from "#/utils/retrieve-axios-error-message";
import NotionTaskService from "#/api/notion-service/notion-service.api";

type IntegrationType = "github" | "gitlab" | "notion";

interface IntegrationCardProps {
  title: string;
  icon: React.ReactNode;
  isConnected: boolean;
  isExpanded: boolean;
  onToggle: () => void;
  accentColor: string;
  children: React.ReactNode;
  comingSoon?: boolean;
  statusConnected: string;
  statusNotConnected: string;
  comingSoonLabel?: string;
}

function IntegrationCard({
  title,
  icon,
  isConnected,
  isExpanded,
  onToggle,
  accentColor,
  children,
  comingSoon,
  statusConnected,
  statusNotConnected,
  comingSoonLabel,
}: IntegrationCardProps) {
  return (
    <div
      className={cn(
        "bg-[#111113] border rounded-2xl overflow-hidden",
        isConnected ? "border-green-600/40" : "border-zinc-800",
        isExpanded && !comingSoon && "ring-2 ring-blue-600/30",
      )}
    >
      {/* Card Header - Clickable */}
      <button
        type="button"
        onClick={onToggle}
        disabled={comingSoon}
        className={cn(
          "w-full p-5 flex items-center gap-4 text-left",
          !comingSoon && "hover:bg-zinc-900/50 cursor-pointer",
          comingSoon && "cursor-not-allowed opacity-70",
        )}
      >
        {/* Icon */}
        <div
          className={cn(
            "w-12 h-12 rounded-xl flex items-center justify-center text-white",
            accentColor,
          )}
        >
          {icon}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-semibold text-white">{title}</h3>
            {comingSoon && comingSoonLabel && (
              <span className="px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider bg-violet-600/20 text-violet-400 rounded-full">
                {comingSoonLabel}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 mt-1">
            <div
              className={cn(
                "w-2 h-2 rounded-full",
                isConnected ? "bg-green-500" : "bg-zinc-600",
              )}
            />
            <span
              className={cn(
                "text-sm",
                isConnected ? "text-green-400" : "text-zinc-500",
              )}
            >
              {isConnected ? statusConnected : statusNotConnected}
            </span>
          </div>
        </div>

        {/* Expand/Collapse Indicator */}
        {!comingSoon && (
          <div
            className={cn(
              "w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center transition-transform",
              isExpanded && "rotate-180",
            )}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              className="text-zinc-400"
            >
              <path
                d="M4 6L8 10L12 6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        )}
      </button>

      {/* Expandable Content */}
      {isExpanded && !comingSoon && (
        <div className="px-5 pb-5 pt-2 border-t border-zinc-800/50">
          {children}
        </div>
      )}
    </div>
  );
}

export default function IntegrationsScreen() {
  const { t } = useTranslation();
  const { providers } = useUserProviders();
  const { data: settings } = useSettings();
  const { data: config } = useConfig();
  const { mutate: saveGitProviders, isPending } = useAddGitProviders();
  const [expandedCard, setExpandedCard] =
    React.useState<IntegrationType | null>(null);

  // Form states
  const [githubToken, setGithubToken] = React.useState("");
  const [githubHost, setGithubHost] = React.useState("");
  const [gitlabToken, setGitlabToken] = React.useState("");
  const [gitlabHost, setGitlabHost] = React.useState("");

  // Notion form states
  const [notionApiKey, setNotionApiKey] = React.useState("");
  const [notionDatabaseId, setNotionDatabaseId] = React.useState("");

  // Disconnect states
  const [isDisconnectingGitHub, setIsDisconnectingGitHub] =
    React.useState(false);
  const [isDisconnectingGitLab, setIsDisconnectingGitLab] =
    React.useState(false);
  const [isDisconnectingNotion, setIsDisconnectingNotion] =
    React.useState(false);

  // Notion connection test state
  const [isTestingNotionConnection, setIsTestingNotionConnection] =
    React.useState(false);
  const [notionConnectionStatus, setNotionConnectionStatus] = React.useState<
    'idle' | 'success' | 'error'
  >('idle');

  // Notion save settings mutation
  const { mutate: saveSettings, isPending: isSavingSettings } =
    useSaveSettings();

  const isGitHubConnected = providers.includes("github");
  const isGitLabConnected = providers.includes("gitlab");
  const isNotionConnected = settings?.notion_api_key_set === true;
  const isSaas = config?.APP_MODE === "saas";

  const existingGithubHost = settings?.provider_tokens_set.github;
  const existingGitlabHost = settings?.provider_tokens_set.gitlab;
  const existingNotionDatabaseId = settings?.notion_database_id;

  const handleToggle = (id: IntegrationType) => {
    setExpandedCard(expandedCard === id ? null : id);
  };

  // Disconnect only GitHub by sending empty token AND empty host
  // The backend now recognizes empty token + empty host as intentional disconnection
  const handleDisconnectGitHub = () => {
    setIsDisconnectingGitHub(true);
    const providerTokens: Record<string, { token: string; host: string }> = {
      github: { token: "", host: "" },
      gitlab: { token: "", host: "" },
      bitbucket: { token: "", host: "" },
      azure_devops: { token: "", host: "" },
      forgejo: { token: "", host: "" },
    };

    saveGitProviders(
      { providers: providerTokens },
      {
        onSuccess: () => {
          displaySuccessToast(t(I18nKey.SETTINGS$SAVED));
          setIsDisconnectingGitHub(false);
        },
        onError: (error) => {
          const errorMessage = retrieveAxiosErrorMessage(error);
          displayErrorToast(errorMessage || t(I18nKey.ERROR$GENERIC));
          setIsDisconnectingGitHub(false);
        },
      },
    );
  };

  // Disconnect only GitLab by sending empty token AND empty host
  const handleDisconnectGitLab = () => {
    setIsDisconnectingGitLab(true);
    const providerTokens: Record<string, { token: string; host: string }> = {
      github: { token: "", host: "" },
      gitlab: { token: "", host: "" },
      bitbucket: { token: "", host: "" },
      azure_devops: { token: "", host: "" },
      forgejo: { token: "", host: "" },
    };

    saveGitProviders(
      { providers: providerTokens },
      {
        onSuccess: () => {
          displaySuccessToast(t(I18nKey.SETTINGS$SAVED));
          setIsDisconnectingGitLab(false);
        },
        onError: (error) => {
          const errorMessage = retrieveAxiosErrorMessage(error);
          displayErrorToast(errorMessage || t(I18nKey.ERROR$GENERIC));
          setIsDisconnectingGitLab(false);
        },
      },
    );
  };

  const handleSaveGitHub = () => {
    const providerTokens: Record<string, { token: string; host: string }> = {
      github: { token: githubToken.trim(), host: githubHost.trim() },
      gitlab: { token: "", host: "" },
      bitbucket: { token: "", host: "" },
      azure_devops: { token: "", host: "" },
      forgejo: { token: "", host: "" },
    };

    saveGitProviders(
      { providers: providerTokens },
      {
        onSuccess: () => {
          displaySuccessToast(t(I18nKey.SETTINGS$SAVED));
          setGithubToken("");
          setGithubHost("");
        },
        onError: (error) => {
          const errorMessage = retrieveAxiosErrorMessage(error);
          displayErrorToast(errorMessage || t(I18nKey.ERROR$GENERIC));
        },
      },
    );
  };

  const handleSaveGitLab = () => {
    const providerTokens: Record<string, { token: string; host: string }> = {
      github: { token: "", host: "" },
      gitlab: { token: gitlabToken.trim(), host: gitlabHost.trim() },
      bitbucket: { token: "", host: "" },
      azure_devops: { token: "", host: "" },
      forgejo: { token: "", host: "" },
    };

    saveGitProviders(
      { providers: providerTokens },
      {
        onSuccess: () => {
          displaySuccessToast(t(I18nKey.SETTINGS$SAVED));
          setGitlabToken("");
          setGitlabHost("");
        },
        onError: (error) => {
          const errorMessage = retrieveAxiosErrorMessage(error);
          displayErrorToast(errorMessage || t(I18nKey.ERROR$GENERIC));
        },
      },
    );
  };


  const handleSaveNotion = () => {
    const notionSettings: Record<string, string | null> = {};

    if (notionApiKey.trim()) {
      notionSettings.notion_api_key = notionApiKey.trim();
    }
    if (notionDatabaseId.trim()) {
      notionSettings.notion_database_id = notionDatabaseId.trim();
    }

    saveSettings(notionSettings, {
      onSuccess: () => {
        displaySuccessToast(t(I18nKey.SETTINGS$SAVED));
        setNotionApiKey("");
        setNotionDatabaseId("");
      },
      onError: (error) => {
        const errorMessage = retrieveAxiosErrorMessage(error);
        displayErrorToast(errorMessage || t(I18nKey.ERROR$GENERIC));
      },
    });
  };


  const handleDisconnectNotion = () => {
    setIsDisconnectingNotion(true);
    saveSettings(
      {
        // @ts-expect-error - notion_api_key is a custom field
        notion_api_key: "",
        notion_database_id: null,
      },
      {
        onSuccess: () => {
          displaySuccessToast(t(I18nKey.SETTINGS$SAVED));
          setIsDisconnectingNotion(false);
          setNotionConnectionStatus('idle');
        },
        onError: (error) => {
          const errorMessage = retrieveAxiosErrorMessage(error);
          displayErrorToast(errorMessage || t(I18nKey.ERROR$GENERIC));
          setIsDisconnectingNotion(false);
        },
      },
    );
  };

  // Test Notion connection
  const handleTestNotionConnection = async () => {
    setIsTestingNotionConnection(true);
    setNotionConnectionStatus('idle');

    try {
      const result = await NotionTaskService.testConnection();
      if (result.connected) {
        setNotionConnectionStatus('success');
        displaySuccessToast('Successfully connected to Notion!');
      } else {
        setNotionConnectionStatus('error');
        displayErrorToast(result.error || 'Failed to connect to Notion');
      }
    } catch (error) {
      setNotionConnectionStatus('error');
      const errorMessage = retrieveAxiosErrorMessage(error as AxiosError);
      displayErrorToast(errorMessage || 'Failed to test Notion connection');
    } finally {
      setIsTestingNotionConnection(false);
    }
  };

  return (
    <main className="h-full bg-[#09090b] overflow-y-auto">
      <div className="max-w-3xl mx-auto px-6 py-10">
        {/* Header */}
        <header className="mb-8">
          <Typography.H2 className="text-2xl font-bold text-white mb-2">
            {t(I18nKey.SETTINGS$NAV_INTEGRATIONS)}
          </Typography.H2>
          <Typography.Text className="text-zinc-400">
            {t(I18nKey.SETTINGS$GIT_SETTINGS_DESCRIPTION)}
          </Typography.Text>
        </header>

        {/* Integration Cards */}
        <div className="flex flex-col gap-4">
          {/* GitHub Card */}
          <IntegrationCard
            title={t(I18nKey.SETTINGS$GITHUB)}
            icon={<FaGithub size={24} />}
            isConnected={isGitHubConnected}
            isExpanded={expandedCard === "github"}
            onToggle={() => handleToggle("github")}
            accentColor="bg-gradient-to-br from-zinc-700 to-zinc-900"
            statusConnected={t(I18nKey.STATUS$CONNECTED)}
            statusNotConnected={t(I18nKey.SETTINGS$GITLAB_NOT_CONNECTED)}
          >
            <div className="flex flex-col gap-5">
              {/* SaaS Mode: Show Configure Repositories button */}
              {isSaas && config?.APP_SLUG && (
                <div className="flex flex-col gap-4">
                  <p className="text-sm text-zinc-400">
                    {t(I18nKey.SETTINGS$GIT_SETTINGS_DESCRIPTION)}
                  </p>
                  <ConfigureGitHubRepositoriesAnchor slug={config.APP_SLUG} />
                </div>
              )}

              {/* OSS Mode: Show Token Input */}
              {!isSaas && (
                <>
                  <SettingsInput
                    testId="github-token-input"
                    name="github-token-input"
                    onChange={setGithubToken}
                    label={t(I18nKey.GITHUB$TOKEN_LABEL)}
                    type="password"
                    className="w-full"
                    placeholder={
                      isGitHubConnected ? "<hidden>" : "ghp_xxxxx..."
                    }
                    startContent={
                      isGitHubConnected && (
                        <KeyStatusIcon
                          testId="gh-set-token-indicator"
                          isSet={isGitHubConnected}
                        />
                      )
                    }
                  />

                  <SettingsInput
                    testId="github-host-input"
                    name="github-host-input"
                    onChange={setGithubHost}
                    label={t(I18nKey.GITHUB$HOST_LABEL)}
                    type="text"
                    className="w-full"
                    placeholder="github.com"
                    defaultValue={existingGithubHost || undefined}
                    startContent={
                      existingGithubHost &&
                      existingGithubHost.trim() !== "" && (
                        <KeyStatusIcon testId="gh-set-host-indicator" isSet />
                      )
                    }
                  />

                  <GitHubTokenHelpAnchor />

                  {/* Actions: Save & Disconnect */}
                  <div className="flex justify-between items-center gap-3 pt-4 border-t border-zinc-800/50">
                    {isGitHubConnected && (
                      <BrandButton
                        testId="disconnect-github-button"
                        type="button"
                        variant="danger"
                        isDisabled={isDisconnectingGitHub}
                        onClick={handleDisconnectGitHub}
                      >
                        {isDisconnectingGitHub
                          ? t(I18nKey.SETTINGS$SAVING)
                          : t(I18nKey.BUTTON$DISCONNECT)}
                      </BrandButton>
                    )}
                    <div className={cn(!isGitHubConnected && "ml-auto")}>
                      <BrandButton
                        testId="save-github-button"
                        type="button"
                        variant="primary"
                        isDisabled={isPending || (!githubToken && !githubHost)}
                        onClick={handleSaveGitHub}
                      >
                        {isPending
                          ? t(I18nKey.SETTINGS$SAVING)
                          : t(I18nKey.SETTINGS$SAVE_CHANGES)}
                      </BrandButton>
                    </div>
                  </div>
                </>
              )}
            </div>
          </IntegrationCard>

          {/* GitLab Card */}
          <IntegrationCard
            title={t(I18nKey.SETTINGS$GITLAB)}
            icon={<FaGitlab size={24} />}
            isConnected={isGitLabConnected}
            isExpanded={expandedCard === "gitlab"}
            onToggle={() => handleToggle("gitlab")}
            accentColor="bg-gradient-to-br from-orange-600 to-red-700"
            statusConnected={t(I18nKey.STATUS$CONNECTED)}
            statusNotConnected={t(I18nKey.SETTINGS$GITLAB_NOT_CONNECTED)}
          >
            <div className="flex flex-col gap-5">
              {/* SaaS Mode: Show Webhook Manager if connected */}
              {isSaas && isGitLabConnected && <GitLabWebhookManager />}

              {/* OSS Mode: Show Token Input */}
              {!isSaas && (
                <>
                  <SettingsInput
                    testId="gitlab-token-input"
                    name="gitlab-token-input"
                    onChange={setGitlabToken}
                    label={t(I18nKey.GITLAB$TOKEN_LABEL)}
                    type="password"
                    className="w-full"
                    placeholder={
                      isGitLabConnected ? "<hidden>" : "glpat-xxxxx..."
                    }
                    startContent={
                      isGitLabConnected && (
                        <KeyStatusIcon
                          testId="gl-set-token-indicator"
                          isSet={isGitLabConnected}
                        />
                      )
                    }
                  />

                  <SettingsInput
                    testId="gitlab-host-input"
                    name="gitlab-host-input"
                    onChange={setGitlabHost}
                    label={t(I18nKey.GITLAB$HOST_LABEL)}
                    type="text"
                    className="w-full"
                    placeholder="gitlab.com"
                    defaultValue={existingGitlabHost || undefined}
                    startContent={
                      existingGitlabHost &&
                      existingGitlabHost.trim() !== "" && (
                        <KeyStatusIcon testId="gl-set-host-indicator" isSet />
                      )
                    }
                  />

                  <GitLabTokenHelpAnchor />

                  {/* Actions: Save & Disconnect */}
                  <div className="flex justify-between items-center gap-3 pt-4 border-t border-zinc-800/50">
                    {isGitLabConnected && (
                      <BrandButton
                        testId="disconnect-gitlab-button"
                        type="button"
                        variant="danger"
                        isDisabled={isDisconnectingGitLab}
                        onClick={handleDisconnectGitLab}
                      >
                        {isDisconnectingGitLab
                          ? t(I18nKey.SETTINGS$SAVING)
                          : t(I18nKey.BUTTON$DISCONNECT)}
                      </BrandButton>
                    )}
                    <div className={cn(!isGitLabConnected && "ml-auto")}>
                      <BrandButton
                        testId="save-gitlab-button"
                        type="button"
                        variant="primary"
                        isDisabled={isPending || (!gitlabToken && !gitlabHost)}
                        onClick={handleSaveGitLab}
                      >
                        {isPending
                          ? t(I18nKey.SETTINGS$SAVING)
                          : t(I18nKey.SETTINGS$SAVE_CHANGES)}
                      </BrandButton>
                    </div>
                  </div>
                </>
              )}

              {/* SaaS Mode but not connected */}
              {isSaas && !isGitLabConnected && (
                <p className="text-sm text-zinc-400">
                  {t(I18nKey.SETTINGS$GITLAB_NOT_CONNECTED)}
                </p>
              )}
            </div>
          </IntegrationCard>

          {/* Notion Card */}
          <IntegrationCard
            title={t(I18nKey.INTEGRATIONS$NOTION)}
            icon={<SiNotion size={24} />}
            isConnected={isNotionConnected}
            isExpanded={expandedCard === "notion"}
            onToggle={() => handleToggle("notion")}
            accentColor="bg-gradient-to-br from-zinc-600 to-zinc-800"
            statusConnected={t(I18nKey.STATUS$CONNECTED)}
            statusNotConnected={t(I18nKey.SETTINGS$GITLAB_NOT_CONNECTED)}
          >
            <div className="flex flex-col gap-5">
              {/* Description */}
              <p className="text-sm text-zinc-400">
                {t(I18nKey.INTEGRATIONS$NOTION_DESCRIPTION)}
              </p>

              {/* API Key Input */}
              <SettingsInput
                testId="notion-api-key-input"
                name="notion-api-key-input"
                onChange={setNotionApiKey}
                label={t(I18nKey.INTEGRATIONS$NOTION_API_KEY)}
                type="password"
                className="w-full"
                placeholder={isNotionConnected ? "<hidden>" : "secret_xxxxx..."}
                startContent={
                  isNotionConnected && (
                    <KeyStatusIcon
                      testId="notion-set-key-indicator"
                      isSet={isNotionConnected}
                    />
                  )
                }
              />

              {/* Database ID Input */}
              <SettingsInput
                testId="notion-database-id-input"
                name="notion-database-id-input"
                onChange={setNotionDatabaseId}
                label={t(I18nKey.INTEGRATIONS$NOTION_DATABASE_ID)}
                type="text"
                className="w-full"
                placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
                defaultValue={existingNotionDatabaseId || undefined}
                startContent={
                  existingNotionDatabaseId &&
                  existingNotionDatabaseId.trim() !== "" && (
                    <KeyStatusIcon testId="notion-set-db-indicator" isSet />
                  )
                }
              />

              {/* Help Text */}
              {/* Setup Instructions */}
              <div className="text-xs text-zinc-500 bg-zinc-900/50 p-3 rounded-lg border border-zinc-800/30">
                <p className="mb-2">
                  <strong className="text-zinc-300">
                    {t(I18nKey.INTEGRATIONS$NOTION_HELP_TITLE)}
                  </strong>
                </p>
                <ul className="space-y-1.5 list-none">
                  <li className="text-zinc-400">
                    {t(I18nKey.INTEGRATIONS$NOTION_HELP_STEP1)}
                  </li>
                  <li className="text-zinc-400">
                    {t(I18nKey.INTEGRATIONS$NOTION_HELP_STEP2)}
                  </li>
                  <li className="text-zinc-400">
                    {t(I18nKey.INTEGRATIONS$NOTION_HELP_STEP3)}
                  </li>
                </ul>
              </div>

              {/* Usage Instructions */}
              <div className="text-xs text-zinc-500 bg-blue-950/20 p-3 rounded-lg border border-blue-800/30">
                <p className="mb-2">
                  <strong className="text-blue-300">
                    {t(I18nKey.INTEGRATIONS$NOTION_USAGE_TITLE)}
                  </strong>
                </p>
                <ul className="space-y-1.5 list-none">
                  <li className="text-blue-200/80">
                    {t(I18nKey.INTEGRATIONS$NOTION_USAGE_STEP1)}
                  </li>
                  <li className="text-blue-200/80">
                    {t(I18nKey.INTEGRATIONS$NOTION_USAGE_STEP2)}
                  </li>
                  <li className="text-blue-200/80">
                    {t(I18nKey.INTEGRATIONS$NOTION_USAGE_STEP3)}
                  </li>
                </ul>
              </div>

              {/* Test Connection Button */}
              {isNotionConnected && (
                <div className="flex items-center gap-3 pt-3">
                  <BrandButton
                    testId="test-notion-connection-button"
                    type="button"
                    variant="secondary"
                    isDisabled={isTestingNotionConnection}
                    onClick={handleTestNotionConnection}
                  >
                    {isTestingNotionConnection ? (
                      <span className="flex items-center gap-2">
                        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        Testing...
                      </span>
                    ) : (
                      'Test Connection'
                    )}
                  </BrandButton>
                  {notionConnectionStatus === 'success' && (
                    <span className="flex items-center gap-1.5 text-sm text-green-400">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Connected
                    </span>
                  )}
                  {notionConnectionStatus === 'error' && (
                    <span className="flex items-center gap-1.5 text-sm text-red-400">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      Connection Failed
                    </span>
                  )}
                </div>
              )}

              {/* Actions: Save & Disconnect */}
              <div className="flex justify-between items-center gap-3 pt-4 border-t border-zinc-800/50">
                {isNotionConnected && (
                  <BrandButton
                    testId="disconnect-notion-button"
                    type="button"
                    variant="danger"
                    isDisabled={isDisconnectingNotion}
                    onClick={handleDisconnectNotion}
                  >
                    {isDisconnectingNotion
                      ? t(I18nKey.SETTINGS$SAVING)
                      : t(I18nKey.BUTTON$DISCONNECT)}
                  </BrandButton>
                )}
                <div className={cn(!isNotionConnected && "ml-auto")}>
                  <BrandButton
                    testId="save-notion-button"
                    type="button"
                    variant="primary"
                    isDisabled={
                      isSavingSettings || (!notionApiKey && !notionDatabaseId)
                    }
                    onClick={handleSaveNotion}
                  >
                    {isSavingSettings
                      ? t(I18nKey.SETTINGS$SAVING)
                      : t(I18nKey.SETTINGS$SAVE_CHANGES)}
                  </BrandButton>
                </div>
              </div>
            </div>
          </IntegrationCard>
        </div>

        {/* Help Section */}
        <div className="mt-10 p-6 bg-zinc-900/50 border border-zinc-800 rounded-xl">
          <h4 className="text-sm font-medium text-zinc-300 mb-2">
            {t(I18nKey.SETTINGS$GIT_SETTINGS)}
          </h4>
          <p className="text-sm text-zinc-500">
            {t(I18nKey.SETTINGS$GIT_SETTINGS_DESCRIPTION)}
          </p>
        </div>
      </div>
    </main>
  );
}
