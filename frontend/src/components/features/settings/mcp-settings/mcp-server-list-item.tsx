import { FaPencil, FaTrash } from "react-icons/fa6";
import { useTranslation } from "react-i18next";
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

export function MCPServerListItem({
  server,
  onEdit,
  onDelete,
}: {
  server: MCPServerConfig;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const { t } = useTranslation();

  const getServerTypeLabel = (type: string) => {
    switch (type) {
      case "sse":
        return t(I18nKey.SETTINGS$MCP_SERVER_TYPE_SSE);
      case "stdio":
        return t(I18nKey.SETTINGS$MCP_SERVER_TYPE_STDIO);
      case "shttp":
        return t(I18nKey.SETTINGS$MCP_SERVER_TYPE_SHTTP);
      default:
        return type.toUpperCase();
    }
  };

  const getServerDescription = (serverConfig: MCPServerConfig) => {
    if (serverConfig.type === "stdio") {
      if (serverConfig.command) {
        const args =
          serverConfig.args && serverConfig.args.length > 0
            ? ` ${serverConfig.args.join(" ")}`
            : "";
        return `${serverConfig.command}${args}`;
      }
      return serverConfig.name || "";
    }
    if (
      (serverConfig.type === "sse" || serverConfig.type === "shttp") &&
      serverConfig.url
    ) {
      return serverConfig.url;
    }
    return "";
  };

  const serverName = server.type === "stdio" ? server.name : server.url;
  const serverDescription = getServerDescription(server);

  return (
    <tr
      data-testid="mcp-server-item"
      className="grid grid-cols-[minmax(0,0.25fr)_120px_minmax(0,1fr)_120px] gap-4 items-start border-t border-zinc-800 hover:bg-zinc-900/30 transition-colors"
    >
      <td
        className="p-3 text-sm text-zinc-100 truncate min-w-0 font-medium"
        title={serverName}
      >
        {serverName}
      </td>

      <td className="p-3 text-sm whitespace-nowrap">
        <span className="bg-blue-600/20 text-blue-400 px-2 py-1 rounded-md text-xs font-medium">
          {getServerTypeLabel(server.type)}
        </span>
      </td>

      <td
        className="p-3 text-sm text-zinc-400 min-w-0 truncate"
        title={serverDescription}
      >
        <span className="inline-block max-w-full align-bottom font-mono text-xs">
          {serverDescription}
        </span>
      </td>

      <td className="p-3 flex items-start justify-end gap-3 whitespace-nowrap">
        <button
          data-testid="edit-mcp-server-button"
          type="button"
          onClick={onEdit}
          aria-label={`Edit ${serverName}`}
          className="cursor-pointer text-zinc-400 hover:text-blue-500 transition-colors p-1.5 hover:bg-blue-600/10 rounded-lg"
        >
          <FaPencil size={14} />
        </button>
        <button
          data-testid="delete-mcp-server-button"
          type="button"
          onClick={onDelete}
          aria-label={`Delete ${serverName}`}
          className="cursor-pointer text-zinc-400 hover:text-red-500 transition-colors p-1.5 hover:bg-red-600/10 rounded-lg"
        >
          <FaTrash size={14} />
        </button>
      </td>
    </tr>
  );
}
