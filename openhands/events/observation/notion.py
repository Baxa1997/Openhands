"""Notion observation for bug tracking integration."""

from dataclasses import dataclass, field
from typing import Any

from openhands.core.schema import ObservationType
from openhands.events.observation.observation import Observation


@dataclass
class NotionObservation(Observation):
    """This data class represents the result of a Notion operation."""

    observation: str = ObservationType.NOTION
    name: str = ''  # The name of the Notion tool that was called
    arguments: dict[str, Any] = field(
        default_factory=dict
    )  # The arguments passed to the Notion tool
    success: bool = True  # Whether the operation was successful

    @property
    def message(self) -> str:
        return self.content
