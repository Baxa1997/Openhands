import React from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router";
import { ContextMenu } from "#/ui/context-menu";
import { ContextMenuListItem } from "./context-menu-list-item";
import { Divider } from "#/ui/divider";
import { useClickOutsideElement } from "#/hooks/use-click-outside-element";
import { I18nKey } from "#/i18n/declaration";
import { cn } from "#/utils/utils";
import LogOutIcon from "#/icons/log-out.svg?react";
import DocumentIcon from "#/icons/document.svg?react";
import ListIcon from "#/icons/list.svg?react";
import RobotIcon from "#/icons/robot.svg?react";

interface AccountSettingsContextMenuProps {
  onLogout: () => void;
  onClose: () => void;
  onOpenConversations?: () => void;
  conversationPanelIsOpen?: boolean;
  emailVerified?: boolean;
}

export function AccountSettingsContextMenu({
  onLogout,
  onClose,
  onOpenConversations,
  conversationPanelIsOpen,
  emailVerified,
}: AccountSettingsContextMenuProps) {
  const ref = useClickOutsideElement<HTMLUListElement>(onClose);
  const { t } = useTranslation();

  const handleNavigationClick = () => onClose();

  const handleConversationsClick = () => {
    if (emailVerified !== false && onOpenConversations) {
      onOpenConversations();
      onClose();
    }
  };

  return (
    <ContextMenu
      testId="account-settings-context-menu"
      ref={ref}
      alignment="right"
      className="mt-0 md:right-full md:left-full md:bottom-0 ml-0 w-fit z-[9999] bg-zinc-900 border border-zinc-700"
    >
      {/* Conversations */}
      <ContextMenuListItem
        onClick={handleConversationsClick}
        className={cn(
          "flex items-center gap-2 p-2 rounded h-[30px] transition-colors",
          emailVerified === false
            ? "opacity-50 cursor-not-allowed"
            : "hover:bg-zinc-800 cursor-pointer",
          conversationPanelIsOpen && "bg-zinc-800 text-blue-500",
        )}
      >
        <ListIcon width={16} height={16} />
        <span className="text-white text-sm">
          {t(I18nKey.SIDEBAR$CONVERSATIONS)}
        </span>
      </ContextMenuListItem>

      {/* Microagent Management */}
      <Link
        to="/microagent-management"
        className="text-decoration-none"
        onClick={(e) => {
          if (emailVerified === false) {
            e.preventDefault();
          } else {
            handleNavigationClick();
          }
        }}
      >
        <ContextMenuListItem
          onClick={handleNavigationClick}
          className={cn(
            "flex items-center gap-2 p-2 rounded h-[30px] transition-colors",
            emailVerified === false
              ? "opacity-50 cursor-not-allowed"
              : "hover:bg-zinc-800 cursor-pointer",
          )}
        >
          <RobotIcon width={16} height={16} />
          <span className="text-white text-sm">
            {t(I18nKey.MICROAGENT_MANAGEMENT$TITLE)}
          </span>
        </ContextMenuListItem>
      </Link>

      <Divider />

      {/* Documentation */}
      <a
        href="https://docs.openhands.dev"
        target="_blank"
        rel="noopener noreferrer"
        className="text-decoration-none"
      >
        <ContextMenuListItem
          onClick={onClose}
          className="flex items-center gap-2 p-2 hover:bg-zinc-800 rounded h-[30px] cursor-pointer transition-colors"
        >
          <DocumentIcon width={16} height={16} />
          <span className="text-white text-sm">{t(I18nKey.SIDEBAR$DOCS)}</span>
        </ContextMenuListItem>
      </a>

      {/* Logout */}
      <ContextMenuListItem
        onClick={onLogout}
        className="flex items-center gap-2 p-2 hover:bg-zinc-800 rounded h-[30px] cursor-pointer transition-colors"
      >
        <LogOutIcon width={16} height={16} />
        <span className="text-white text-sm">
          {t(I18nKey.ACCOUNT_SETTINGS$LOGOUT)}
        </span>
      </ContextMenuListItem>
    </ContextMenu>
  );
}
