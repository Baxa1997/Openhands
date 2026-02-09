"""Notion service for bug tracking integration."""

from __future__ import annotations

import logging
from dataclasses import dataclass
from typing import Any

import httpx
from pydantic import SecretStr

logger = logging.getLogger(__name__)


@dataclass
class NotionBug:
    """Represents a bug/issue from a Notion database."""

    page_id: str
    title: str
    description: str | None
    status: str | None
    priority: str | None
    url: str
    properties: dict[str, Any]

    def to_dict(self) -> dict[str, Any]:
        """Convert to dictionary representation."""
        return {
            'page_id': self.page_id,
            'title': self.title,
            'description': self.description,
            'status': self.status,
            'priority': self.priority,
            'url': self.url,
        }


class NotionService:
    """Service for interacting with Notion API for bug tracking.

    This service provides methods to:
    - List bugs/issues from a Notion database
    - Update bug status (e.g., mark as Done)
    - Get bug details
    """

    BASE_URL = 'https://api.notion.com/v1'
    NOTION_VERSION = '2022-06-28'

    def __init__(
        self,
        api_key: SecretStr | str,
        database_id: str | None = None,
    ) -> None:
        """Initialize the Notion service.

        Args:
            api_key: Notion integration token (starts with 'secret_')
            database_id: Default Notion database ID for bug tracking
        """
        if isinstance(api_key, SecretStr):
            self._api_key = api_key.get_secret_value()
        else:
            self._api_key = api_key
        self.database_id = database_id
        self._client = httpx.Client(
            base_url=self.BASE_URL,
            headers={
                'Authorization': f'Bearer {self._api_key}',
                'Notion-Version': self.NOTION_VERSION,
                'Content-Type': 'application/json',
            },
            timeout=30.0,
        )

    def __del__(self) -> None:
        """Cleanup the HTTP client."""
        if hasattr(self, '_client'):
            self._client.close()

    def _extract_title(self, properties: dict[str, Any]) -> str:
        """Extract the title from page properties."""
        for prop_name, prop_value in properties.items():
            if prop_value.get('type') == 'title':
                title_items = prop_value.get('title', [])
                if title_items:
                    return ''.join(
                        item.get('plain_text', '') for item in title_items
                    )
        return 'Untitled'

    def _extract_rich_text(
        self, properties: dict[str, Any], property_name: str
    ) -> str | None:
        """Extract rich text content from a property."""
        prop = properties.get(property_name, {})
        if prop.get('type') == 'rich_text':
            rich_text = prop.get('rich_text', [])
            if rich_text:
                return ''.join(item.get('plain_text', '') for item in rich_text)
        return None

    def _extract_select(
        self, properties: dict[str, Any], property_name: str
    ) -> str | None:
        """Extract select value from a property."""
        prop = properties.get(property_name, {})
        if prop.get('type') == 'select':
            select = prop.get('select')
            if select:
                return select.get('name')
        return None

    def _extract_status(
        self, properties: dict[str, Any], property_name: str
    ) -> str | None:
        """Extract status value from a property."""
        prop = properties.get(property_name, {})
        if prop.get('type') == 'status':
            status = prop.get('status')
            if status:
                return status.get('name')
        return None

    def list_bugs(
        self,
        database_id: str | None = None,
        status_filter: str | None = None,
        limit: int = 100,
    ) -> list[NotionBug]:
        """List bugs/issues from a Notion database.

        Args:
            database_id: The Notion database ID. Uses default if not provided.
            status_filter: Filter by status (e.g., 'Todo', 'In Progress')
            limit: Maximum number of bugs to return

        Returns:
            List of NotionBug objects
        """
        db_id = database_id or self.database_id
        if not db_id:
            raise ValueError('Database ID is required')

        # Build the filter
        filter_body: dict[str, Any] = {}
        if status_filter:
            filter_body['filter'] = {
                'or': [
                    {'property': 'Status', 'status': {'equals': status_filter}},
                    {'property': 'status', 'status': {'equals': status_filter}},
                    {'property': 'State', 'select': {'equals': status_filter}},
                ]
            }

        filter_body['page_size'] = min(limit, 100)

        try:
            response = self._client.post(
                f'/databases/{db_id}/query',
                json=filter_body,
            )
            response.raise_for_status()
            data = response.json()
        except httpx.HTTPStatusError as e:
            logger.error(f'Failed to query Notion database: {e}')
            raise RuntimeError(f'Failed to query Notion database: {e}') from e

        bugs: list[NotionBug] = []
        for page in data.get('results', []):
            properties = page.get('properties', {})
            bug = NotionBug(
                page_id=page['id'],
                title=self._extract_title(properties),
                description=self._extract_rich_text(properties, 'Description')
                or self._extract_rich_text(properties, 'description'),
                status=self._extract_status(properties, 'Status')
                or self._extract_status(properties, 'status')
                or self._extract_select(properties, 'Status')
                or self._extract_select(properties, 'status'),
                priority=self._extract_select(properties, 'Priority')
                or self._extract_select(properties, 'priority'),
                url=page.get('url', ''),
                properties=properties,
            )
            bugs.append(bug)

        return bugs[:limit]

    def get_bug(self, page_id: str) -> NotionBug:
        """Get a specific bug/issue by page ID.

        Args:
            page_id: The Notion page ID

        Returns:
            NotionBug object
        """
        try:
            response = self._client.get(f'/pages/{page_id}')
            response.raise_for_status()
            page = response.json()
        except httpx.HTTPStatusError as e:
            logger.error(f'Failed to get Notion page: {e}')
            raise RuntimeError(f'Failed to get Notion page: {e}') from e

        properties = page.get('properties', {})
        return NotionBug(
            page_id=page['id'],
            title=self._extract_title(properties),
            description=self._extract_rich_text(properties, 'Description')
            or self._extract_rich_text(properties, 'description'),
            status=self._extract_status(properties, 'Status')
            or self._extract_status(properties, 'status')
            or self._extract_select(properties, 'Status')
            or self._extract_select(properties, 'status'),
            priority=self._extract_select(properties, 'Priority')
            or self._extract_select(properties, 'priority'),
            url=page.get('url', ''),
            properties=properties,
        )

    def update_bug_status(
        self,
        page_id: str,
        status: str,
        status_property_name: str = 'Status',
    ) -> bool:
        """Update the status of a bug/issue.

        Args:
            page_id: The Notion page ID
            status: The new status value (e.g., 'Done', 'In Progress')
            status_property_name: Name of the status property

        Returns:
            True if update was successful
        """
        # Try status type first, fall back to select
        update_payload = {
            'properties': {
                status_property_name: {
                    'status': {'name': status},
                }
            }
        }

        try:
            response = self._client.patch(
                f'/pages/{page_id}',
                json=update_payload,
            )
            response.raise_for_status()
            logger.info(f'Updated bug {page_id} status to {status}')
            return True
        except httpx.HTTPStatusError:
            # Try with select type if status type failed
            update_payload = {
                'properties': {
                    status_property_name: {
                        'select': {'name': status},
                    }
                }
            }
            try:
                response = self._client.patch(
                    f'/pages/{page_id}',
                    json=update_payload,
                )
                response.raise_for_status()
                logger.info(f'Updated bug {page_id} status to {status} (select)')
                return True
            except httpx.HTTPStatusError as e:
                logger.error(f'Failed to update Notion page status: {e}')
                raise RuntimeError(f'Failed to update Notion page status: {e}') from e

    def add_comment(self, page_id: str, comment: str) -> bool:
        """Add a comment to a bug/issue page.

        Args:
            page_id: The Notion page ID
            comment: The comment text to add

        Returns:
            True if comment was added successfully
        """
        comment_payload = {
            'parent': {'page_id': page_id},
            'rich_text': [
                {
                    'type': 'text',
                    'text': {'content': comment},
                }
            ],
        }

        try:
            response = self._client.post(
                '/comments',
                json=comment_payload,
            )
            response.raise_for_status()
            logger.info(f'Added comment to bug {page_id}')
            return True
        except httpx.HTTPStatusError as e:
            logger.error(f'Failed to add comment to Notion page: {e}')
            raise RuntimeError(f'Failed to add comment to Notion page: {e}') from e

    def test_connection(self) -> tuple[bool, str | None]:
        """Test the connection to Notion API.

        Returns:
            Tuple of (success: bool, error_message: str | None)
        """
        try:
            response = self._client.get('/users/me')
            response.raise_for_status()
            return True, None
        except httpx.HTTPStatusError as e:
            error_msg = f'{e.response.status_code}: {e.response.text[:200] if e.response.text else str(e)}'
            logger.error(f'Notion API test failed: {error_msg}')
            return False, error_msg
        except Exception as e:
            logger.error(f'Notion connection error: {e}')
            return False, str(e)
