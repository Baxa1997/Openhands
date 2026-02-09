"""Notion action for bug tracking integration."""

from dataclasses import dataclass, field
from typing import Any, ClassVar

from openhands.core.schema import ActionType
from openhands.events.action.action import Action, ActionSecurityRisk


@dataclass
class NotionAction(Action):
    """Action for interacting with Notion bug tracking.

    Attributes:
        name: The Notion tool name (e.g., 'notion_list_bugs', 'notion_update_bug_status')
        arguments: Arguments to pass to the tool
        thought: Optional reasoning for the action
    """

    name: str
    arguments: dict[str, Any] = field(default_factory=dict)
    thought: str = ''
    action: str = ActionType.NOTION
    runnable: ClassVar[bool] = True
    security_risk: ActionSecurityRisk = ActionSecurityRisk.LOW

    @property
    def message(self) -> str:
        return (
            f'I am interacting with Notion using tool:\n'
            f'```\n{self.name}\n```\n'
            f'with arguments:\n'
            f'```\n{self.arguments}\n```'
        )

    def __str__(self) -> str:
        ret = '**NotionAction**\n'
        if self.thought:
            ret += f'THOUGHT: {self.thought}\n'
        ret += f'NAME: {self.name}\n'
        ret += f'ARGUMENTS: {self.arguments}'
        return ret
