import { useTranslation } from "react-i18next";
import { MCPServerListItem } from "./mcp-server-list-item";
import { I18nKey } from "#/i18n/declaration";

interface MCPServerConfig {
  id: string;
  type: "sse" | "stdio" | "shttp";
  name?: string;
  url?: string;
  api_key?: string;
  timeout?: number;
  command?: string;
  args?: string[];
  env?: Record<string, string>;
}

interface MCPServerListProps {
  servers: MCPServerConfig[];
  onEdit: (server: MCPServerConfig) => void;
  onDelete: (serverId: string) => void;
}

export function MCPServerList({
  servers,
  onEdit,
  onDelete,
}: MCPServerListProps) {
  const { t } = useTranslation();

  if (servers.length === 0) {
    return (
      <div className="border border-zinc-700 rounded-xl p-8 text-center bg-[#1A1A1A]">
        <p className="text-zinc-400 text-sm">
          {t(I18nKey.SETTINGS$MCP_NO_SERVERS)}
        </p>
      </div>
    );
  }

  return (
    <div className="border border-zinc-700 rounded-xl overflow-hidden bg-[#1A1A1A]">
      <table className="w-full">
        <thead className="bg-zinc-900/50 border-b border-zinc-800">
          <tr className="grid grid-cols-[minmax(0,0.25fr)_120px_minmax(0,1fr)_120px] gap-4 items-start">
            <th className="text-left p-3 text-sm font-semibold text-zinc-200">
              {t(I18nKey.SETTINGS$NAME)}
            </th>
            <th className="text-left p-3 text-sm font-semibold text-zinc-200">
              {t(I18nKey.SETTINGS$MCP_SERVER_TYPE)}
            </th>
            <th className="text-left p-3 text-sm font-semibold text-zinc-200">
              {t(I18nKey.SETTINGS$MCP_SERVER_DETAILS)}
            </th>
            <th className="text-right p-3 text-sm font-semibold text-zinc-200">
              {t(I18nKey.SETTINGS$ACTIONS)}
            </th>
          </tr>
        </thead>
        <tbody>
          {servers.map((server) => (
            <MCPServerListItem
              key={server.id}
              server={server}
              onEdit={() => onEdit(server)}
              onDelete={() => onDelete(server.id)}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}
